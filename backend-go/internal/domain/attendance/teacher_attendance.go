package attendance

import (
	"encoding/json"
	"math"
	"net/http"
	"strings"
	"time"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/cache"
	"github.com/eduplexo/backend-go/internal/store"
	"github.com/jackc/pgx/v5/pgxpool"
)

type TeacherAttendanceHandler struct {
	store  *store.MemStore
	saveFn func(table string, doc any)
	rdb    *cache.Client
	pool   *pgxpool.Pool
}

func NewTeacherAttendanceHandler(s *store.MemStore, saveFn func(string, any), pool *pgxpool.Pool, rdb *cache.Client) *TeacherAttendanceHandler {
	return &TeacherAttendanceHandler{
		store:  s,
		saveFn: saveFn,
		rdb:    rdb,
		pool:   pool,
	}
}

type CheckInRequest struct {
	Date time.Time `json:"date"`
}

type CheckOutRequest struct {
	Date time.Time `json:"date"`
}

func (h *TeacherAttendanceHandler) CheckIn(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	if ctx.Role != "teacher" {
		api.WriteResult(w, api.Fail("FORBIDDEN", "Only teachers can mark their own attendance", 403, nil))
		return
	}

	var req CheckInRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "Invalid JSON payload", 400, nil))
		return
	}

	todayStr := req.Date.Format("2006-01-02")
	if req.Date.IsZero() {
		todayStr = time.Now().Format("2006-01-02")
	}

	var teacherID string
	h.store.RLock()
	for _, t := range h.store.Teachers {
		if t.UserID == ctx.UserID && t.SchoolID == ctx.SchoolID {
			teacherID = t.ID
			break
		}
	}
	h.store.RUnlock()

	if teacherID == "" {
		api.WriteResult(w, api.Fail("NOT_FOUND", "Teacher profile not found", 404, nil))
		return
	}

	h.store.RLock()
	var existing *store.TeacherAttendance
	for _, a := range h.store.TeacherAttendance {
		if a.SchoolID == ctx.SchoolID && a.TeacherID == teacherID && a.Date.Format("2006-01-02") == todayStr {
			existing = a
			break
		}
	}
	h.store.RUnlock()

	nowTime := time.Now().Format("15:04:05")

	var rec *store.TeacherAttendance
	if existing != nil {
		rec = existing
		if rec.CheckInTime == "" {
			rec.CheckInTime = nowTime
		}
	} else {
		rec = &store.TeacherAttendance{
			ID:             store.NewID("ta"),
			SchoolID:       ctx.SchoolID,
			AcademicYearID: "", // Will let the system infer or keep empty for now
			TeacherID:      teacherID,
			Date:           time.Now(),
			Status:         "present",
			CheckInTime:    nowTime,
			MarkedBy:       ctx.UserID,
			CreatedAt:      time.Now(),
			UpdatedAt:      time.Now(),
		}

		h.store.Lock()
		h.store.TeacherAttendance = append(h.store.TeacherAttendance, rec)
		h.store.Unlock()
	}

	h.saveFn("teacher_attendance", rec)
	api.WriteJSON(w, http.StatusOK, rec)
}

func (h *TeacherAttendanceHandler) CheckOut(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	if ctx.Role != "teacher" {
		api.WriteResult(w, api.Fail("FORBIDDEN", "Only teachers can mark their own checkout", 403, nil))
		return
	}

	var req CheckOutRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "Invalid JSON payload", 400, nil))
		return
	}

	todayStr := req.Date.Format("2006-01-02")
	if req.Date.IsZero() {
		todayStr = time.Now().Format("2006-01-02")
	}

	var teacherID string
	h.store.RLock()
	for _, t := range h.store.Teachers {
		if t.UserID == ctx.UserID && t.SchoolID == ctx.SchoolID {
			teacherID = t.ID
			break
		}
	}
	h.store.RUnlock()

	if teacherID == "" {
		api.WriteResult(w, api.Fail("NOT_FOUND", "Teacher profile not found", 404, nil))
		return
	}

	h.store.Lock()
	var rec *store.TeacherAttendance
	for _, a := range h.store.TeacherAttendance {
		if a.SchoolID == ctx.SchoolID && a.TeacherID == teacherID && a.Date.Format("2006-01-02") == todayStr {
			rec = a
			break
		}
	}

	if rec == nil {
		h.store.Unlock()
		api.WriteResult(w, api.Fail("NOT_FOUND", "No check-in record found for today", 404, nil))
		return
	}

	nowTime := time.Now().Format("15:04:05")
	rec.CheckOutTime = nowTime
	rec.UpdatedAt = time.Now()

	if rec.CheckInTime != "" && rec.CheckOutTime != "" {
		inTime, errIn := time.Parse("15:04:05", rec.CheckInTime)
		outTime, errOut := time.Parse("15:04:05", rec.CheckOutTime)
		if errIn == nil && errOut == nil {
			dur := outTime.Sub(inTime).Hours()
			if dur > 0 {
				rec.WorkingHours = math.Round(dur*100) / 100
			}
		}
	}
	h.store.Unlock()

	h.saveFn("teacher_attendance", rec)
	api.WriteJSON(w, http.StatusOK, rec)
}

func (h *TeacherAttendanceHandler) History(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	
	var teacherID string
	if ctx.Role == "teacher" {
		h.store.RLock()
		for _, t := range h.store.Teachers {
			if t.UserID == ctx.UserID && t.SchoolID == ctx.SchoolID {
				teacherID = t.ID
				break
			}
		}
		h.store.RUnlock()
	}

	if ctx.Role == "admin" || ctx.Role == "super_admin" {
		tid := r.URL.Query().Get("teacher_id")
		if tid != "" {
			teacherID = tid
		}
	}

	statusFilter := r.URL.Query().Get("status")
	startFilter := r.URL.Query().Get("start_date")
	endFilter := r.URL.Query().Get("end_date")

	var result []*store.TeacherAttendance

	h.store.RLock()
	for _, a := range h.store.TeacherAttendance {
		if a.SchoolID != ctx.SchoolID {
			continue
		}
		if teacherID != "" && a.TeacherID != teacherID {
			continue
		}
		if statusFilter != "" && a.Status != statusFilter {
			continue
		}
		if startFilter != "" {
			dStr := a.Date.Format("2006-01-02")
			if dStr < startFilter {
				continue
			}
		}
		if endFilter != "" {
			dStr := a.Date.Format("2006-01-02")
			if dStr > endFilter {
				continue
			}
		}
		result = append(result, a)
	}
	h.store.RUnlock()

	type enrichedRecord struct {
		*store.TeacherAttendance
		TeacherName string `json:"teacher_name"`
	}

	if ctx.Role == "admin" || ctx.Role == "super_admin" {
		var enrichedResult []enrichedRecord
		h.store.RLock()
		for _, a := range result {
			tName := ""
			for _, t := range h.store.Teachers {
				if t.ID == a.TeacherID {
					tName = strings.TrimSpace(t.FirstName + " " + t.LastName)
					break
				}
			}
			enrichedResult = append(enrichedResult, enrichedRecord{
				TeacherAttendance: a,
				TeacherName:       tName,
			})
		}
		h.store.RUnlock()
		api.WriteJSON(w, http.StatusOK, enrichedResult)
		return
	}

	api.WriteJSON(w, http.StatusOK, result)
}

func (h *TeacherAttendanceHandler) AdminList(w http.ResponseWriter, r *http.Request) {
	h.History(w, r)
}

func (h *TeacherAttendanceHandler) Analytics(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	if ctx.Role != "admin" && ctx.Role != "super_admin" {
		api.WriteResult(w, api.Fail("FORBIDDEN", "Unauthorized", 403, nil))
		return
	}

	type teacherStat struct {
		TeacherID   string  `json:"teacher_id"`
		TeacherName string  `json:"teacher_name"`
		TotalDays   int     `json:"total_days"`
		PresentDays int     `json:"present_days"`
		Percentage  float64 `json:"percentage"`
	}

	statsMap := make(map[string]*teacherStat)

	h.store.RLock()
	for _, a := range h.store.TeacherAttendance {
		if a.SchoolID != ctx.SchoolID {
			continue
		}
		if _, ok := statsMap[a.TeacherID]; !ok {
			tName := ""
			for _, t := range h.store.Teachers {
				if t.ID == a.TeacherID {
					tName = strings.TrimSpace(t.FirstName + " " + t.LastName)
					break
				}
			}
			statsMap[a.TeacherID] = &teacherStat{
				TeacherID:   a.TeacherID,
				TeacherName: tName,
			}
		}

		statsMap[a.TeacherID].TotalDays++
		if a.Status == "present" || a.Status == "late" {
			statsMap[a.TeacherID].PresentDays++
		}
	}
	h.store.RUnlock()

	var allStats []teacherStat
	for _, s := range statsMap {
		if s.TotalDays > 0 {
			s.Percentage = math.Round((float64(s.PresentDays)/float64(s.TotalDays))*10000) / 100
		}
		allStats = append(allStats, *s)
	}

	api.WriteJSON(w, http.StatusOK, map[string]any{
		"teacher_stats": allStats,
	})
}
