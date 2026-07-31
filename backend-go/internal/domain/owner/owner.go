// Package owner implements the Owner ERP endpoints.
// The owner is the central authority who creates and manages schools,
// campuses, school admins, subscriptions, and views aggregated analytics.
package owner

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/eduplexo/backend-go/internal/api"
	authpkg "github.com/eduplexo/backend-go/internal/auth"
	"github.com/eduplexo/backend-go/internal/config"
	"github.com/eduplexo/backend-go/internal/store"
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Handler struct {
	Cfg     config.Config
	Store   *store.MemStore
	Pool    *pgxpool.Pool
	Persist func(table string, doc any)
}

func New(cfg config.Config, s *store.MemStore, persist func(table string, doc any)) *Handler {
	return &Handler{Cfg: cfg, Store: s, Persist: persist}
}

func NewPG(cfg config.Config, s *store.MemStore, persist func(table string, doc any), pool *pgxpool.Pool) *Handler {
	return &Handler{Cfg: cfg, Store: s, Pool: pool, Persist: persist}
}

// ownerOnly is a guard helper. Returns the auth context or writes 403.
func ownerOnly(w http.ResponseWriter, r *http.Request) *api.RequestContext {
	ctx := api.FromRequest(r)
	if ctx == nil || ctx.Role != "owner" {
		api.WriteJSON(w, http.StatusForbidden, map[string]any{
			"ok": false, "message": "Access denied. Owners only.",
		})
		return nil
	}
	return ctx
}

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

// DashboardStats — GET /api/owner/dashboard
func (h *Handler) DashboardStats(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}

	h.Store.RLock()
	defer h.Store.RUnlock()

	ownerSchoolIDs := h.ownerSchoolIDs(ctx.ActorEmail, ctx.UserID)

	var totalStudents, totalTeachers, totalStaff int
	var activeSubscriptions, expiringSubscriptions int

	for _, st := range h.Store.Students {
		if containsStr(ownerSchoolIDs, st.SchoolID) && st.Status == "active" {
			totalStudents++
		}
	}
	for _, tc := range h.Store.Teachers {
		if containsStr(ownerSchoolIDs, tc.SchoolID) && tc.Status == "active" {
			totalTeachers++
		}
	}
	for _, u := range h.Store.Users {
		if containsStr(ownerSchoolIDs, u.SchoolID) {
			totalStaff++
		}
	}
	for _, sub := range h.Store.Subscriptions {
		if containsStr(ownerSchoolIDs, sub.SchoolID) {
			if sub.Status == "active" || sub.Status == "trial" {
				activeSubscriptions++
				if !sub.NextRenewal.IsZero() && time.Until(sub.NextRenewal) < 15*24*time.Hour {
					expiringSubscriptions++
				}
			}
		}
	}

	var schools []*store.School
	var campuses []*store.Campus
	for _, s := range h.Store.Schools {
		if containsStr(ownerSchoolIDs, s.SchoolID) {
			schools = append(schools, s)
		}
	}
	for _, c := range h.Store.Campuses {
		if containsStr(ownerSchoolIDs, c.SchoolID) {
			campuses = append(campuses, c)
		}
	}

	api.WriteJSON(w, http.StatusOK, map[string]any{
		"ok": true,
		"data": map[string]any{
			"total_schools":           len(schools),
			"total_campuses":          len(campuses),
			"total_students":          totalStudents,
			"total_teachers":          totalTeachers,
			"total_staff":             totalStaff,
			"active_subscriptions":    activeSubscriptions,
			"expiring_subscriptions":  expiringSubscriptions,
			"schools":                 schools,
		},
	})
}

// ═══════════════════════════════════════════════════════════════════════════
// SCHOOL MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

// GetSchools — GET /api/owner/schools
func (h *Handler) GetSchools(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}

	h.Store.RLock()
	defer h.Store.RUnlock()

	ownerSchoolIDs := h.ownerSchoolIDs(ctx.ActorEmail, ctx.UserID)

	type schoolWithStats struct {
		*store.School
		StudentCount int    `json:"student_count"`
		TeacherCount int    `json:"teacher_count"`
		SubStatus    string `json:"subscription_status"`
	}

	result := make([]schoolWithStats, 0)
	for _, s := range h.Store.Schools {
		if !containsStr(ownerSchoolIDs, s.SchoolID) {
			continue
		}
		if s.SchoolID == "system" || s.SchoolID == "__global__" {
			continue
		}

		sc := 0
		for _, st := range h.Store.Students {
			if st.SchoolID == s.SchoolID && st.Status == "active" {
				sc++
			}
		}
		tc := 0
		for _, t := range h.Store.Teachers {
			if t.SchoolID == s.SchoolID && t.Status == "active" {
				tc++
			}
		}
		subStatus := "inactive"
		for _, sub := range h.Store.Subscriptions {
			if sub.SchoolID == s.SchoolID && (sub.Status == "active" || sub.Status == "trial") {
				subStatus = sub.Status
				break
			}
		}

		result = append(result, schoolWithStats{
			School:       s,
			StudentCount: sc,
			TeacherCount: tc,
			SubStatus:    subStatus,
		})
	}

	api.WriteJSON(w, http.StatusOK, map[string]any{
		"ok":   true,
		"data": result,
	})
}

// CreateSchool — POST /api/owner/schools
func (h *Handler) CreateSchool(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}

	var body struct {
		Name          string `json:"name"`
		Code          string `json:"code"`
		City          string `json:"city"`
		Address       string `json:"address"`
		Phone         string `json:"phone"`
		Email         string `json:"email"`
		PrincipalName string `json:"principal_name"`
		Website       string `json:"website"`
		LogoURL       string `json:"logo_url"`
		Password      string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		api.WriteJSON(w, http.StatusBadRequest, map[string]any{"ok": false, "message": "Invalid request body."})
		return
	}
	if body.Name == "" {
		api.WriteJSON(w, http.StatusBadRequest, map[string]any{"ok": false, "message": "School name is required."})
		return
	}

	code := strings.ToUpper(strings.TrimSpace(body.Code))
	if code == "" {
		code = strings.ToUpper(strings.ReplaceAll(body.Name, " ", ""))
		if len(code) > 6 {
			code = code[:6]
		}
	}

	h.Store.Lock()

	// Check code uniqueness
	for _, s := range h.Store.Schools {
		if strings.EqualFold(s.Code, code) {
			h.Store.Unlock()
			api.WriteJSON(w, http.StatusConflict, map[string]any{"ok": false, "message": "A school with this code already exists."})
			return
		}
	}

	now := time.Now()
	schoolID := fmt.Sprintf("SCH-%s", strings.ToUpper(store.NewID(""))[4:12])

	newSchool := &store.School{
		ID:            store.NewID("sch"),
		SchoolID:      schoolID,
		OwnerEmail:    ctx.ActorEmail,
		OwnerUserID:   ctx.UserID,
		CampusType:    "main",
		Name:          body.Name,
		Code:          code,
		Email:         body.Email,
		Phone:         body.Phone,
		Address:       body.Address,
		City:          body.City,
		PrincipalName: body.PrincipalName,
		Website:       body.Website,
		LogoURL:       body.LogoURL,
		Status:        "active",
		ApprovalStatus: "approved",
		ApprovedAt:    &now,
		ApprovedBy:    "owner",
		CreatedAt:     now,
		UpdatedAt:     now,
	}

	// Create default academic year
	startYear := now.Year()
	if now.Month() < time.April {
		startYear--
	}
	newYear := &store.AcademicYear{
		ID:          store.NewID("ay"),
		SchoolID:    schoolID,
		Year:        fmt.Sprintf("%d-%d", startYear, startYear+1),
		StartDate:   time.Date(startYear, 4, 1, 0, 0, 0, 0, time.UTC),
		EndDate:     time.Date(startYear+1, 3, 31, 0, 0, 0, 0, time.UTC),
		IsActive:    true,
		Status:      "active",
		Description: "Default academic year",
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	// Create owner-school link
	ownerSchool := &store.OwnerSchool{
		ID:          store.NewID("os"),
		OwnerUserID: ctx.UserID,
		SchoolID:    schoolID,
		Role:        "owner",
		CreatedAt:   now,
	}

	// Create subscription (default 14-day free trial for onboarded campus)
	trialExpiry := now.AddDate(0, 0, 14)
	newSub := &store.Subscription{
		ID:           store.NewID("sub"),
		SchoolID:     schoolID,
		PackageID:    "growth",
		StudentLimit: 500,
		Status:       "trial",
		NextRenewal:  trialExpiry,
		CreatedAt:    now,
		UpdatedAt:    now,
	}

	h.Store.Schools = append(h.Store.Schools, newSchool)
	h.Store.AcademicYears = append(h.Store.AcademicYears, newYear)
	h.Store.OwnerSchools = append(h.Store.OwnerSchools, ownerSchool)
	h.Store.Subscriptions = append(h.Store.Subscriptions, newSub)

	// Create principal/admin user if credentials provided
	var adminUser *store.User
	if body.Email != "" && body.Password != "" {
		hash, _ := authpkg.HashPassword(body.Password)
		
		nameParts := strings.SplitN(strings.TrimSpace(body.PrincipalName), " ", 2)
		firstName := "School"
		lastName := "Admin"
		if len(nameParts) > 0 && nameParts[0] != "" {
			firstName = nameParts[0]
			lastName = ""
		}
		if len(nameParts) > 1 {
			lastName = nameParts[1]
		}

		adminUser = &store.User{
			ID:           store.NewID("usr"),
			Email:        strings.ToLower(strings.TrimSpace(body.Email)),
			PasswordHash: hash,
			Role:         "admin",
			Permissions:  []string{},
			Status:       "active",
			Profile: store.UserProfile{
				FirstName: firstName,
				LastName:  lastName,
			},
			SchoolID:     schoolID,
			CreatedAt:    now,
			UpdatedAt:    now,
		}
		h.Store.Users = append(h.Store.Users, adminUser)
	}

	h.Store.Unlock()

	// Persist
	if h.Persist != nil {
		h.Persist("schools", newSchool)
		h.Persist("academic_years", newYear)
		h.Persist("owner_schools", ownerSchool)
		h.Persist("subscriptions", newSub)
		if adminUser != nil {
			h.Persist("users", adminUser)
		}
	}

	api.WriteJSON(w, http.StatusCreated, map[string]any{
		"ok":      true,
		"message": "School created successfully.",
		"data":    newSchool,
	})
}

// UpdateSchool — PATCH /api/owner/schools/{id}
func (h *Handler) UpdateSchool(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}
	sid := chi.URLParam(r, "id")

	var body map[string]any
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		api.WriteJSON(w, http.StatusBadRequest, map[string]any{"ok": false, "message": "Invalid JSON."})
		return
	}

	h.Store.Lock()
	defer h.Store.Unlock()

	var school *store.School
	for _, s := range h.Store.Schools {
		if (s.ID == sid || s.SchoolID == sid) && h.schoolOwnedBy(s, ctx) {
			school = s
			break
		}
	}
	if school == nil {
		api.WriteJSON(w, http.StatusNotFound, map[string]any{"ok": false, "message": "School not found."})
		return
	}

	now := time.Now()
	if v, ok := body["name"].(string); ok && v != "" {
		school.Name = v
	}
	if v, ok := body["address"].(string); ok {
		school.Address = v
	}
	if v, ok := body["city"].(string); ok {
		school.City = v
	}
	if v, ok := body["phone"].(string); ok {
		school.Phone = v
	}
	if v, ok := body["email"].(string); ok {
		school.Email = v
	}
	if v, ok := body["principal_name"].(string); ok {
		school.PrincipalName = v
	}
	if v, ok := body["website"].(string); ok {
		school.Website = v
	}
	if v, ok := body["logo_url"].(string); ok {
		school.LogoURL = v
	}
	school.UpdatedAt = now

	if h.Persist != nil {
		h.Persist("schools", school)
	}

	api.WriteJSON(w, http.StatusOK, map[string]any{
		"ok":      true,
		"message": "School updated.",
		"data":    school,
	})
}

// SchoolAction — POST /api/owner/schools/{id}/{action}
// Actions: activate, suspend, archive, restore
func (h *Handler) SchoolAction(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}
	sid := chi.URLParam(r, "id")
	action := chi.URLParam(r, "action")

	h.Store.Lock()
	defer h.Store.Unlock()

	var school *store.School
	for _, s := range h.Store.Schools {
		if (s.ID == sid || s.SchoolID == sid) && h.schoolOwnedBy(s, ctx) {
			school = s
			break
		}
	}
	if school == nil {
		api.WriteJSON(w, http.StatusNotFound, map[string]any{"ok": false, "message": "School not found."})
		return
	}

	switch action {
	case "activate":
		school.Status = "active"
	case "suspend":
		school.Status = "suspended"
	case "archive":
		school.Status = "archived"
	case "restore":
		school.Status = "active"
	default:
		api.WriteJSON(w, http.StatusBadRequest, map[string]any{"ok": false, "message": "Invalid action."})
		return
	}
	school.UpdatedAt = time.Now()

	if h.Persist != nil {
		h.Persist("schools", school)
	}

	api.WriteJSON(w, http.StatusOK, map[string]any{
		"ok":      true,
		"message": fmt.Sprintf("School %sd successfully.", action),
		"data":    school,
	})
}

// DeleteSchool — DELETE /api/owner/schools/{id}
func (h *Handler) DeleteSchool(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}
	sid := chi.URLParam(r, "id")

	h.Store.Lock()
	defer h.Store.Unlock()

	idx := -1
	for i, s := range h.Store.Schools {
		if (s.ID == sid || s.SchoolID == sid) && h.schoolOwnedBy(s, ctx) {
			idx = i
			break
		}
	}
	if idx < 0 {
		api.WriteJSON(w, http.StatusNotFound, map[string]any{"ok": false, "message": "School not found."})
		return
	}

	deleted := h.Store.Schools[idx]
	h.Store.Schools = append(h.Store.Schools[:idx], h.Store.Schools[idx+1:]...)

	if h.Persist != nil {
		h.Persist("schools:delete", deleted.ID)
	}

	api.WriteJSON(w, http.StatusOK, map[string]any{
		"ok":      true,
		"message": "School deleted.",
	})
}

// ═══════════════════════════════════════════════════════════════════════════
// CAMPUS MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

// ListCampuses — GET /api/owner/campuses
func (h *Handler) ListCampuses(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}

	schoolFilter := r.URL.Query().Get("school_id")

	h.Store.RLock()
	defer h.Store.RUnlock()

	ownerSchoolIDs := h.ownerSchoolIDs(ctx.ActorEmail, ctx.UserID)

	var campuses []*store.Campus
	for _, c := range h.Store.Campuses {
		if !containsStr(ownerSchoolIDs, c.SchoolID) {
			continue
		}
		if schoolFilter != "" && c.SchoolID != schoolFilter {
			continue
		}
		campuses = append(campuses, c)
	}

	api.WriteJSON(w, http.StatusOK, map[string]any{
		"ok":   true,
		"data": campuses,
	})
}

// CreateCampus — POST /api/owner/campuses
func (h *Handler) CreateCampus(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}

	var body struct {
		SchoolID       string `json:"school_id"`
		Name           string `json:"name"`
		Code           string `json:"code"`
		Address        string `json:"address"`
		City           string `json:"city"`
		Phone          string `json:"phone"`
		Email          string `json:"email"`
		Website        string `json:"website"`
		PrincipalName  string `json:"principal_name"`
		PrincipalPhone string `json:"principal_phone"`
		Timezone       string `json:"timezone"`
		Currency       string `json:"currency"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		api.WriteJSON(w, http.StatusBadRequest, map[string]any{"ok": false, "message": "Invalid JSON."})
		return
	}
	if body.SchoolID == "" || body.Name == "" {
		api.WriteJSON(w, http.StatusBadRequest, map[string]any{"ok": false, "message": "school_id and name are required."})
		return
	}

	// Verify owner owns the school
	h.Store.Lock()
	if !h.ownsSchool(ctx, body.SchoolID) {
		h.Store.Unlock()
		api.WriteJSON(w, http.StatusForbidden, map[string]any{"ok": false, "message": "You don't own this school."})
		return
	}

	tz := body.Timezone
	if tz == "" {
		tz = "Asia/Karachi"
	}
	cur := body.Currency
	if cur == "" {
		cur = "PKR"
	}

	now := time.Now()
	campus := &store.Campus{
		ID:             store.NewID("campus"),
		SchoolID:       body.SchoolID,
		OwnerUserID:    ctx.UserID,
		Name:           body.Name,
		Code:           body.Code,
		Address:        body.Address,
		City:           body.City,
		Phone:          body.Phone,
		Email:          body.Email,
		Website:        body.Website,
		PrincipalName:  body.PrincipalName,
		PrincipalPhone: body.PrincipalPhone,
		Timezone:       tz,
		Currency:       cur,
		Status:         "active",
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	h.Store.Campuses = append(h.Store.Campuses, campus)
	h.Store.Unlock()

	if h.Persist != nil {
		h.Persist("campuses", campus)
	}

	api.WriteJSON(w, http.StatusCreated, map[string]any{
		"ok":      true,
		"message": "Campus created successfully.",
		"data":    campus,
	})
}

// UpdateCampus — PATCH /api/owner/campuses/{id}
func (h *Handler) UpdateCampus(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}
	cid := chi.URLParam(r, "id")

	var body map[string]any
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		api.WriteJSON(w, http.StatusBadRequest, map[string]any{"ok": false, "message": "Invalid JSON."})
		return
	}

	h.Store.Lock()
	defer h.Store.Unlock()

	var campus *store.Campus
	for _, c := range h.Store.Campuses {
		if c.ID == cid && h.ownsSchool(ctx, c.SchoolID) {
			campus = c
			break
		}
	}
	if campus == nil {
		api.WriteJSON(w, http.StatusNotFound, map[string]any{"ok": false, "message": "Campus not found."})
		return
	}

	if v, ok := body["name"].(string); ok && v != "" {
		campus.Name = v
	}
	if v, ok := body["address"].(string); ok {
		campus.Address = v
	}
	if v, ok := body["city"].(string); ok {
		campus.City = v
	}
	if v, ok := body["phone"].(string); ok {
		campus.Phone = v
	}
	if v, ok := body["email"].(string); ok {
		campus.Email = v
	}
	if v, ok := body["principal_name"].(string); ok {
		campus.PrincipalName = v
	}
	if v, ok := body["principal_phone"].(string); ok {
		campus.PrincipalPhone = v
	}
	if v, ok := body["status"].(string); ok {
		campus.Status = v
	}
	campus.UpdatedAt = time.Now()

	if h.Persist != nil {
		h.Persist("campuses", campus)
	}

	api.WriteJSON(w, http.StatusOK, map[string]any{
		"ok":      true,
		"message": "Campus updated.",
		"data":    campus,
	})
}

// DeleteCampus — DELETE /api/owner/campuses/{id}
func (h *Handler) DeleteCampus(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}
	cid := chi.URLParam(r, "id")

	h.Store.Lock()
	defer h.Store.Unlock()

	idx := -1
	for i, c := range h.Store.Campuses {
		if c.ID == cid && h.ownsSchool(ctx, c.SchoolID) {
			idx = i
			break
		}
	}
	if idx < 0 {
		api.WriteJSON(w, http.StatusNotFound, map[string]any{"ok": false, "message": "Campus not found."})
		return
	}

	deleted := h.Store.Campuses[idx]
	h.Store.Campuses = append(h.Store.Campuses[:idx], h.Store.Campuses[idx+1:]...)

	if h.Persist != nil {
		h.Persist("campuses:delete", deleted.ID)
	}

	api.WriteJSON(w, http.StatusOK, map[string]any{
		"ok":      true,
		"message": "Campus deleted.",
	})
}

// ═══════════════════════════════════════════════════════════════════════════
// SCHOOL ADMIN MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

// ListAdmins — GET /api/owner/admins
func (h *Handler) ListAdmins(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}

	h.Store.RLock()
	defer h.Store.RUnlock()

	ownerSchoolIDs := h.ownerSchoolIDs(ctx.ActorEmail, ctx.UserID)

	type adminView struct {
		ID         string    `json:"_id"`
		SchoolID   string    `json:"school_id"`
		SchoolName string    `json:"school_name"`
		Email      string    `json:"email"`
		FirstName  string    `json:"first_name"`
		LastName   string    `json:"last_name"`
		Status     string    `json:"status"`
		CreatedAt  time.Time `json:"created_at"`
	}

	var admins []adminView
	for _, u := range h.Store.Users {
		if u.Role != "admin" {
			continue
		}
		if !containsStr(ownerSchoolIDs, u.SchoolID) {
			continue
		}
		schoolName := ""
		for _, s := range h.Store.Schools {
			if s.SchoolID == u.SchoolID {
				schoolName = s.Name
				break
			}
		}
		admins = append(admins, adminView{
			ID:         u.ID,
			SchoolID:   u.SchoolID,
			SchoolName: schoolName,
			Email:      u.Email,
			FirstName:  u.Profile.FirstName,
			LastName:   u.Profile.LastName,
			Status:     u.Status,
			CreatedAt:  u.CreatedAt,
		})
	}

	api.WriteJSON(w, http.StatusOK, map[string]any{
		"ok":   true,
		"data": admins,
	})
}

// CreateAdmin — POST /api/owner/admins
func (h *Handler) CreateAdmin(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}

	var body struct {
		SchoolID  string `json:"school_id"`
		Email     string `json:"email"`
		Password  string `json:"password"`
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Phone     string `json:"phone"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		api.WriteJSON(w, http.StatusBadRequest, map[string]any{"ok": false, "message": "Invalid JSON."})
		return
	}

	body.Email = strings.ToLower(strings.TrimSpace(body.Email))
	if body.SchoolID == "" || body.Email == "" || body.Password == "" {
		api.WriteJSON(w, http.StatusBadRequest, map[string]any{"ok": false, "message": "school_id, email, and password are required."})
		return
	}

	h.Store.Lock()

	// Verify owner owns the school
	if !h.ownsSchool(ctx, body.SchoolID) {
		h.Store.Unlock()
		api.WriteJSON(w, http.StatusForbidden, map[string]any{"ok": false, "message": "You don't own this school."})
		return
	}

	// Check email uniqueness within school
	for _, u := range h.Store.Users {
		if u.Email == body.Email && u.SchoolID == body.SchoolID {
			h.Store.Unlock()
			api.WriteJSON(w, http.StatusConflict, map[string]any{"ok": false, "message": "An admin with this email already exists in this school."})
			return
		}
	}

	hash, err := authpkg.HashPassword(body.Password)
	if err != nil {
		h.Store.Unlock()
		api.WriteJSON(w, http.StatusInternalServerError, map[string]any{"ok": false, "message": "Failed to hash password."})
		return
	}

	now := time.Now()
	newUser := &store.User{
		ID:           store.NewID("usr"),
		SchoolID:     body.SchoolID,
		Email:        body.Email,
		PasswordHash: hash,
		Role:         "admin",
		Permissions:  []string{"*"},
		Profile: store.UserProfile{
			FirstName: body.FirstName,
			LastName:  body.LastName,
			Phone:     body.Phone,
		},
		Status:    "active",
		CreatedAt: now,
		UpdatedAt: now,
	}

	h.Store.Users = append(h.Store.Users, newUser)
	h.Store.Unlock()

	if h.Persist != nil {
		h.Persist("users", newUser)
	}

	api.WriteJSON(w, http.StatusCreated, map[string]any{
		"ok":      true,
		"message": "School Admin created successfully.",
		"data": map[string]any{
			"_id":        newUser.ID,
			"school_id":  newUser.SchoolID,
			"email":      newUser.Email,
			"first_name": newUser.Profile.FirstName,
			"last_name":  newUser.Profile.LastName,
			"status":     newUser.Status,
		},
	})
}

// UpdateAdmin — PATCH /api/owner/admins/{id}
func (h *Handler) UpdateAdmin(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}
	uid := chi.URLParam(r, "id")

	var body map[string]any
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		api.WriteJSON(w, http.StatusBadRequest, map[string]any{"ok": false, "message": "Invalid JSON."})
		return
	}

	h.Store.Lock()
	defer h.Store.Unlock()

	var user *store.User
	for _, u := range h.Store.Users {
		if u.ID == uid && u.Role == "admin" && h.ownsSchool(ctx, u.SchoolID) {
			user = u
			break
		}
	}
	if user == nil {
		api.WriteJSON(w, http.StatusNotFound, map[string]any{"ok": false, "message": "Admin not found."})
		return
	}

	if v, ok := body["status"].(string); ok {
		user.Status = v
	}
	if v, ok := body["first_name"].(string); ok {
		user.Profile.FirstName = v
	}
	if v, ok := body["last_name"].(string); ok {
		user.Profile.LastName = v
	}
	user.UpdatedAt = time.Now()

	if h.Persist != nil {
		h.Persist("users", user)
	}

	api.WriteJSON(w, http.StatusOK, map[string]any{
		"ok":      true,
		"message": "Admin updated.",
	})
}

// DeleteAdmin — DELETE /api/owner/admins/{id}
func (h *Handler) DeleteAdmin(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}
	uid := chi.URLParam(r, "id")

	h.Store.Lock()
	defer h.Store.Unlock()

	idx := -1
	for i, u := range h.Store.Users {
		if u.ID == uid && u.Role == "admin" && h.ownsSchool(ctx, u.SchoolID) {
			idx = i
			break
		}
	}
	if idx < 0 {
		api.WriteJSON(w, http.StatusNotFound, map[string]any{"ok": false, "message": "Admin not found."})
		return
	}

	deleted := h.Store.Users[idx]
	h.Store.Users = append(h.Store.Users[:idx], h.Store.Users[idx+1:]...)

	if h.Persist != nil {
		h.Persist("users:delete", deleted.ID)
	}

	api.WriteJSON(w, http.StatusOK, map[string]any{
		"ok":      true,
		"message": "Admin removed.",
	})
}

// ═══════════════════════════════════════════════════════════════════════════
// SUBSCRIPTION MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

// ListSubscriptions — GET /api/owner/subscriptions
func (h *Handler) ListSubscriptions(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}

	h.Store.RLock()
	defer h.Store.RUnlock()

	ownerSchoolIDs := h.ownerSchoolIDs(ctx.ActorEmail, ctx.UserID)

	type subView struct {
		*store.Subscription
		SchoolName string `json:"school_name"`
	}

	var result []subView
	for _, sub := range h.Store.Subscriptions {
		if !containsStr(ownerSchoolIDs, sub.SchoolID) {
			continue
		}
		schoolName := ""
		for _, s := range h.Store.Schools {
			if s.SchoolID == sub.SchoolID {
				schoolName = s.Name
				break
			}
		}
		result = append(result, subView{
			Subscription: sub,
			SchoolName:   schoolName,
		})
	}

	api.WriteJSON(w, http.StatusOK, map[string]any{
		"ok":   true,
		"data": result,
	})
}

// ═══════════════════════════════════════════════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════════════════════════════════════════════

// Analytics — GET /api/owner/analytics
func (h *Handler) Analytics(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}

	h.Store.RLock()
	defer h.Store.RUnlock()

	ownerSchoolIDs := h.ownerSchoolIDs(ctx.ActorEmail, ctx.UserID)

	// Gender distribution
	male, female, other := 0, 0, 0
	for _, st := range h.Store.Students {
		if !containsStr(ownerSchoolIDs, st.SchoolID) || st.Status != "active" {
			continue
		}
		switch strings.ToLower(st.Gender) {
		case "male":
			male++
		case "female":
			female++
		default:
			other++
		}
	}

	// Per-school student count
	type schoolStat struct {
		SchoolID   string `json:"school_id"`
		SchoolName string `json:"school_name"`
		Students   int    `json:"students"`
		Teachers   int    `json:"teachers"`
	}
	var perSchool []schoolStat
	for _, sid := range ownerSchoolIDs {
		sc, tc := 0, 0
		name := sid
		for _, s := range h.Store.Schools {
			if s.SchoolID == sid {
				name = s.Name
				break
			}
		}
		for _, st := range h.Store.Students {
			if st.SchoolID == sid && st.Status == "active" {
				sc++
			}
		}
		for _, t := range h.Store.Teachers {
			if t.SchoolID == sid && t.Status == "active" {
				tc++
			}
		}
		perSchool = append(perSchool, schoolStat{
			SchoolID:   sid,
			SchoolName: name,
			Students:   sc,
			Teachers:   tc,
		})
	}

	api.WriteJSON(w, http.StatusOK, map[string]any{
		"ok": true,
		"data": map[string]any{
			"gender_distribution": map[string]int{
				"male":   male,
				"female": female,
				"other":  other,
			},
			"per_school": perSchool,
		},
	})
}

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════

// Notifications — GET /api/owner/notifications
func (h *Handler) Notifications(w http.ResponseWriter, r *http.Request) {
	ctx := ownerOnly(w, r)
	if ctx == nil {
		return
	}

	h.Store.RLock()
	defer h.Store.RUnlock()

	ownerSchoolIDs := h.ownerSchoolIDs(ctx.ActorEmail, ctx.UserID)

	var notifs []*store.Notification
	for _, n := range h.Store.Notifications {
		if containsStr(ownerSchoolIDs, n.SchoolID) {
			notifs = append(notifs, n)
		}
	}

	api.WriteJSON(w, http.StatusOK, map[string]any{
		"ok":   true,
		"data": notifs,
	})
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

// ownerSchoolIDs returns all school_ids that belong to this owner.
// Must be called while holding at least an RLock on the Store.
func (h *Handler) ownerSchoolIDs(ownerEmail, ownerUserID string) []string {
	var ids []string

	// Check OwnerSchools junction
	for _, os := range h.Store.OwnerSchools {
		if os.OwnerUserID == ownerUserID {
			ids = append(ids, os.SchoolID)
		}
	}

	// Also include schools linked by owner_email (backward compat)
	for _, s := range h.Store.Schools {
		if s.OwnerEmail == ownerEmail || s.OwnerUserID == ownerUserID {
			if !containsStr(ids, s.SchoolID) && s.SchoolID != "system" && s.SchoolID != "__global__" {
				ids = append(ids, s.SchoolID)
			}
		}
	}

	return ids
}

// schoolOwnedBy checks if the school belongs to the owner (no lock).
func (h *Handler) schoolOwnedBy(s *store.School, ctx *api.RequestContext) bool {
	return s.OwnerEmail == ctx.ActorEmail || s.OwnerUserID == ctx.UserID
}

// ownsSchool checks if the owner owns the given school_id (must hold lock).
func (h *Handler) ownsSchool(ctx *api.RequestContext, schoolID string) bool {
	for _, os := range h.Store.OwnerSchools {
		if os.OwnerUserID == ctx.UserID && os.SchoolID == schoolID {
			return true
		}
	}
	for _, s := range h.Store.Schools {
		if s.SchoolID == schoolID && (s.OwnerEmail == ctx.ActorEmail || s.OwnerUserID == ctx.UserID) {
			return true
		}
	}
	return false
}

func containsStr(slice []string, s string) bool {
	for _, v := range slice {
		if v == s {
			return true
		}
	}
	return false
}
