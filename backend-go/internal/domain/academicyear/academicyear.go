// Package academicyear implements the /api/academic-years endpoints.
// Mirrors old-app/shared/services/academic-year.service.ts and
// old-app/school-app/app/api/academic-years/[*]/route.ts.
package academicyear

import (
	"encoding/json"
	"net/http"
	"sort"
	"strings"
	"time"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/audit"
	"github.com/eduplexo/backend-go/internal/auth"
	"github.com/eduplexo/backend-go/internal/store"
	"github.com/go-chi/chi/v5"
)

type Handler struct {
	Store *store.MemStore
}

func New(s *store.MemStore) *Handler { return &Handler{Store: s} }

// AcademicYearResponse mirrors the `toAcademicYearResponse` shape the original
// service returns. The frontend reads `_id` and `id` interchangeably.
type AcademicYearResponse struct {
	ID          string    `json:"_id"`
	IDAlias     string    `json:"id"`
	Year        string    `json:"year"`
	Name        string    `json:"name"`
	StartDate   time.Time `json:"start_date"`
	EndDate     time.Time `json:"end_date"`
	IsActive    bool      `json:"is_active"`
	Status      string    `json:"status"`
	Description string    `json:"description,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func toResponse(y *store.AcademicYear) AcademicYearResponse {
	return AcademicYearResponse{
		ID:          y.ID,
		IDAlias:     y.ID,
		Year:        y.Year,
		Name:        y.Year,
		StartDate:   y.StartDate,
		EndDate:     y.EndDate,
		IsActive:    y.IsActive,
		Status:      y.Status,
		Description: y.Description,
		CreatedAt:   y.CreatedAt,
		UpdatedAt:   y.UpdatedAt,
	}
}

// List implements GET /api/academic-years. Returns all academic years for
// the caller's tenant, sorted by start_date desc.
func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	api.WriteResult(w, api.ServiceTry(func() ([]AcademicYearResponse, error) {
		if err := auth.AssertPermission(ctx, "settings", auth.ActionView); err != nil {
			return nil, err
		}

		h.Store.RLock()
		rows := make([]*store.AcademicYear, 0)
		for _, y := range h.Store.AcademicYears {
			if y.SchoolID == ctx.SchoolID {
				rows = append(rows, y)
			}
		}
		h.Store.RUnlock()

		sort.SliceStable(rows, func(i, j int) bool {
			return rows[i].StartDate.After(rows[j].StartDate)
		})

		items := make([]AcademicYearResponse, 0, len(rows))
		for _, y := range rows {
			items = append(items, toResponse(y))
		}
		return items, nil
	}))
}

// Get implements GET /api/academic-years/:id.
func (h *Handler) Get(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	id := chi.URLParam(r, "id")
	api.WriteResult(w, api.ServiceTry(func() (any, error) {
		if err := auth.AssertPermission(ctx, "settings", auth.ActionView); err != nil {
			return nil, err
		}
		h.Store.RLock()
		defer h.Store.RUnlock()
		for _, y := range h.Store.AcademicYears {
			if y.ID == id && y.SchoolID == ctx.SchoolID {
				return toResponse(y), nil
			}
		}
		return nil, api.NewControlledError("NOT_FOUND", "Academic year not found.", 404, nil)
	}))
}

type createInput struct {
	Year        string    `json:"year"`
	Name        string    `json:"name"`
	StartDate   time.Time `json:"start_date"`
	EndDate     time.Time `json:"end_date"`
	IsActive    bool      `json:"is_active"`
	Description string    `json:"description,omitempty"`
}

// Create implements POST /api/academic-years.
func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	var body createInput
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "Invalid JSON body.", 400, nil))
		return
	}

	api.WriteResult(w, api.ServiceTry(func() (AcademicYearResponse, error) {
		if err := auth.AssertPermission(ctx, "settings", auth.ActionCreate); err != nil {
			return AcademicYearResponse{}, err
		}

		year := strings.TrimSpace(body.Year)
		if year == "" {
			year = strings.TrimSpace(body.Name)
		}
		if year == "" {
			return AcademicYearResponse{}, api.NewControlledError("VALIDATION_ERROR", "Year is required.", 400, nil)
		}
		if body.StartDate.IsZero() || body.EndDate.IsZero() {
			return AcademicYearResponse{}, api.NewControlledError("VALIDATION_ERROR", "start_date and end_date are required.", 400, nil)
		}
		if !body.EndDate.After(body.StartDate) {
			return AcademicYearResponse{}, api.NewControlledError("VALIDATION_ERROR", "end_date must be after start_date.", 400, nil)
		}

		now := time.Now()
		newYear := &store.AcademicYear{
			ID:          store.NewID("ay"),
			SchoolID:    ctx.SchoolID,
			Year:        year,
			StartDate:   body.StartDate,
			EndDate:     body.EndDate,
			IsActive:    body.IsActive,
			Status:      deriveStatus(body.StartDate, body.EndDate, body.IsActive),
			Description: body.Description,
			CreatedAt:   now,
			UpdatedAt:   now,
		}

		h.Store.Lock()
		if newYear.IsActive {
			for _, y := range h.Store.AcademicYears {
				if y.SchoolID == ctx.SchoolID {
					y.IsActive = false
				}
			}
		}
		h.Store.AcademicYears = append(h.Store.AcademicYears, newYear)
		h.Store.Unlock()

		audit.Write(h.Store, ctx, audit.Input{
			Action: "create", EntityType: "school", EntityID: newYear.ID,
			After:    newYear,
			Metadata: map[string]any{"scope": "academic_year"},
		})

		return toResponse(newYear), nil
	}))
}

type updateInput struct {
	Year        *string    `json:"year,omitempty"`
	Name        *string    `json:"name,omitempty"`
	StartDate   *time.Time `json:"start_date,omitempty"`
	EndDate     *time.Time `json:"end_date,omitempty"`
	IsActive    *bool      `json:"is_active,omitempty"`
	Description *string    `json:"description,omitempty"`
}

// Update implements PATCH /api/academic-years/:id.
func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	id := chi.URLParam(r, "id")
	var body updateInput
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "Invalid JSON body.", 400, nil))
		return
	}

	api.WriteResult(w, api.ServiceTry(func() (AcademicYearResponse, error) {
		if err := auth.AssertPermission(ctx, "settings", auth.ActionUpdate); err != nil {
			return AcademicYearResponse{}, err
		}

		h.Store.Lock()
		defer h.Store.Unlock()

		var target *store.AcademicYear
		for _, y := range h.Store.AcademicYears {
			if y.ID == id && y.SchoolID == ctx.SchoolID {
				target = y
				break
			}
		}
		if target == nil {
			return AcademicYearResponse{}, api.NewControlledError("NOT_FOUND", "Academic year not found.", 404, nil)
		}

		nextActive := target.IsActive
		if body.IsActive != nil {
			nextActive = *body.IsActive
		}

		// Constraint check: at least one academic year must remain active.
		if !nextActive && target.IsActive {
			activeCount := 0
			for _, y := range h.Store.AcademicYears {
				if y.SchoolID == ctx.SchoolID && y.IsActive {
					activeCount++
				}
			}
			if activeCount <= 1 {
				return AcademicYearResponse{}, api.NewControlledError(
					"CONSTRAINT_ERROR",
					"At least one academic year must remain active for system operations.",
					400, nil,
				)
			}
		}

		if nextActive {
			for _, y := range h.Store.AcademicYears {
				if y.SchoolID == ctx.SchoolID {
					y.IsActive = false
				}
			}
		}

		before := *target
		if body.Year != nil {
			target.Year = strings.TrimSpace(*body.Year)
		} else if body.Name != nil {
			target.Year = strings.TrimSpace(*body.Name)
		}
		if body.StartDate != nil {
			target.StartDate = *body.StartDate
		}
		if body.EndDate != nil {
			target.EndDate = *body.EndDate
		}
		if body.Description != nil {
			target.Description = *body.Description
		}
		target.IsActive = nextActive
		target.Status = deriveStatus(target.StartDate, target.EndDate, target.IsActive)
		target.UpdatedAt = time.Now()

		audit.Write(h.Store, ctx, audit.Input{
			Action: "update", EntityType: "school", EntityID: id,
			Before: before, After: *target,
			Metadata: map[string]any{"scope": "academic_year"},
		})

		return toResponse(target), nil
	}))
}

// Delete implements DELETE /api/academic-years/:id.
func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	id := chi.URLParam(r, "id")
	api.WriteResult(w, api.ServiceTry(func() (any, error) {
		if err := auth.AssertPermission(ctx, "settings", auth.ActionDelete); err != nil {
			return nil, err
		}

		h.Store.Lock()
		defer h.Store.Unlock()

		idx := -1
		for i, y := range h.Store.AcademicYears {
			if y.ID == id && y.SchoolID == ctx.SchoolID {
				idx = i
				break
			}
		}
		if idx == -1 {
			return nil, api.NewControlledError("NOT_FOUND", "Academic year not found.", 404, nil)
		}

		target := h.Store.AcademicYears[idx]
		if target.IsActive {
			activeCount := 0
			for _, y := range h.Store.AcademicYears {
				if y.SchoolID == ctx.SchoolID && y.IsActive {
					activeCount++
				}
			}
			if activeCount <= 1 {
				return nil, api.NewControlledError(
					"CONSTRAINT_ERROR",
					"At least one academic year must remain active. You cannot delete the only active session.",
					400, nil,
				)
			}
		}

		h.Store.AcademicYears = append(h.Store.AcademicYears[:idx], h.Store.AcademicYears[idx+1:]...)

		audit.Write(h.Store, ctx, audit.Input{
			Action: "delete", EntityType: "school", EntityID: id,
			Before:   target,
			Metadata: map[string]any{"scope": "academic_year"},
		})

		return map[string]any{"success": true, "id": id}, nil
	}))
}

func deriveStatus(start, end time.Time, isActive bool) string {
	if isActive {
		return "active"
	}
	now := time.Now()
	if end.Before(now) {
		return "completed"
	}
	if start.After(now) {
		return "draft"
	}
	return "cancelled"
}
