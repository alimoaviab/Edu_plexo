// Package studentportal serves the /api/student/* tree consumed by the
// student portal pages (dashboard, attendance, results, homework,
// announcements, profile).
//
// History: these endpoints were previously mounted under /api/parent/* and
// were powered by the obsolete Parent role (Student pages called them, which
// made Parent secretly power Student). With the Parent role removed, the
// handlers are re-homed under /api/student/* and re-scoped: a student can
// ONLY ever resolve their OWN student record (store.Student.UserID ==
// authenticated user). Any ?student_id that is not the caller's own id is
// treated as not-found, so ID tampering cannot leak another student's data.
//
// Caching: optional Redis read-through, scoped per (school, student) so
// cross-tenant cache leaks are impossible by construction.
package studentportal

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"time"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/cache"
	"github.com/eduplexo/backend-go/internal/domain/access"
	"github.com/eduplexo/backend-go/internal/store"
)

const (
	portalDashTTL       = 60 * time.Second
	portalResultsTTL    = 60 * time.Second
	portalAttendanceTTL = 60 * time.Second
	portalHomeworkTTL   = 5 * time.Minute
)

type Handler struct {
	Store *store.MemStore
	Cache *cache.Client
}

func New(s *store.MemStore) *Handler { return &Handler{Store: s} }

func NewWithCache(s *store.MemStore, c *cache.Client) *Handler {
	return &Handler{Store: s, Cache: c}
}

// serveCached turns a "build the ServiceResult" function into a cached HTTP
// handler. Hits Redis first; on miss it runs the build, marshals the
// envelope once, ships the bytes, and stores the same bytes for next time.
// On Redis failure or nil cache it falls through with no behaviour change.
func (h *Handler) serveCached(
	w http.ResponseWriter,
	r *http.Request,
	cacheKey string,
	ttl time.Duration,
	build func() api.ServiceResult,
) {
	if h.Cache != nil && h.Cache.Available() && cacheKey != "" {
		if b, err := h.Cache.Get(r.Context(), cacheKey); err == nil && b != nil {
			w.Header().Set("Content-Type", "application/json")
			w.Header().Set("X-Cache", "HIT")
			_, _ = w.Write(b)
			return
		}
	}

	result := build()
	bytes, err := json.Marshal(result)
	if err != nil {
		api.WriteResult(w, api.Fail("INTERNAL", "Failed to encode response.", 500, nil))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if h.Cache != nil && h.Cache.Available() && cacheKey != "" {
		w.Header().Set("X-Cache", "MISS")
	}
	if !result.Ok {
		status := http.StatusBadRequest
		if result.Error != nil && result.Error.Status != 0 {
			status = result.Error.Status
		}
		w.WriteHeader(status)
		_, _ = w.Write(bytes)
		return
	}
	_, _ = w.Write(bytes)

	if h.Cache != nil && h.Cache.Available() && cacheKey != "" {
		_ = h.Cache.Set(r.Context(), cacheKey, bytes, ttl)
	}
}

func portalCacheKey(scope, schoolID, studentID string) string {
	return fmt.Sprintf("student:%s:%s:%s", scope, schoolID, studentID)
}

// studentOnly is the authorization gate for the whole portal: unauthenticated
// → 401, any non-student role → 403. A student may only ever reach their own
// data.
func studentOnly(w http.ResponseWriter, r *http.Request) *api.RequestContext {
	ctx := api.FromRequest(r)
	if ctx == nil {
		api.WriteResult(w, api.Fail("UNAUTHENTICATED", "Authentication required.", 401, nil))
		return nil
	}
	if ctx.Role != "student" {
		api.WriteResult(w, api.Fail("FORBIDDEN", "You do not have permission to access the student portal.", 403, nil))
		return nil
	}
	return ctx
}

// resolveStudent returns the authenticated student's OWN record. A
// `requested` id that differs from the caller's own record resolves to nil —
// IDOR protection: a student can never view another student's data.
func (h *Handler) resolveStudent(ctx *api.RequestContext, requested string) *store.Student {
	h.Store.RLock()
	defer h.Store.RUnlock()
	self := access.StudentProfileLocked(h.Store, ctx)
	if self == nil {
		return nil
	}
	if requested != "" && requested != self.ID {
		return nil
	}
	return self
}

func (h *Handler) studentSummary(s *store.Student) map[string]any {
	if s == nil {
		return nil
	}
	className, section := "", s.Section
	yearName := ""
	h.Store.RLock()
	for _, c := range h.Store.Classes {
		if c.ID == s.ClassID {
			className = c.Name
			break
		}
	}
	for _, y := range h.Store.AcademicYears {
		if y.ID == s.AcademicYearID {
			yearName = y.Year
			break
		}
	}
	h.Store.RUnlock()
	return map[string]any{
		"id":            s.ID,
		"name":          s.FirstName + " " + s.LastName,
		"roll_no":       s.AdmissionNo,
		"class_id":      s.ClassID,
		"class":         className,
		"section":       section,
		"academic_year": yearName,
		"status":        s.Status,
	}
}

// Info implements GET /api/student/info. Without ?student_id it returns the
// caller's own student record list ({students:[...]}); with ?student_id it
// returns the detailed record — only when the id is the caller's own.
func (h *Handler) Info(w http.ResponseWriter, r *http.Request) {
	ctx := studentOnly(w, r)
	if ctx == nil {
		return
	}
	studentID := r.URL.Query().Get("student_id")

	api.WriteResult(w, api.ServiceTry(func() (any, error) {
		s := h.resolveStudent(ctx, studentID)
		if s == nil {
			if studentID != "" {
				return nil, api.NewControlledError("NOT_FOUND", "Student not found.", 404, nil)
			}
			return map[string]any{"students": []map[string]any{}}, nil
		}
		if studentID == "" {
			return map[string]any{"students": []map[string]any{h.studentSummary(s)}}, nil
		}

		// Detailed profile shape consumed by the student profile/dashboard
		// pages (normalizeStudentInfo): student + guardian + subjects.
		return map[string]any{
			"student": h.studentSummary(s),
			"guardian": map[string]any{
				"name":  s.Guardian.Name,
				"phone": s.Guardian.Phone,
				"email": s.Guardian.Email,
			},
			"enrolled_subjects": h.enrolledSubjects(ctx, s),
		}, nil
	}))
}

func (h *Handler) enrolledSubjects(ctx *api.RequestContext, s *store.Student) []map[string]any {
	if s == nil {
		return []map[string]any{}
	}
	h.Store.RLock()
	defer h.Store.RUnlock()
	out := make([]map[string]any, 0)
	for _, sub := range h.Store.Subjects {
		if sub.SchoolID != ctx.SchoolID || sub.ClassID == "" || (sub.ClassID != s.ClassID) {
			continue
		}
		out = append(out, map[string]any{
			"id":   sub.ID,
			"name": sub.Name,
			"code": sub.Code,
		})
	}
	return out
}

// DashboardStats implements GET /api/student/dashboard/stats.
// Response shape matches the student dashboard page: children_overview for
// the caller's own record plus legacy flat fields.
func (h *Handler) DashboardStats(w http.ResponseWriter, r *http.Request) {
	ctx := studentOnly(w, r)
	if ctx == nil {
		return
	}
	studentID := r.URL.Query().Get("student_id")
	resolved := h.resolveStudent(ctx, studentID)
	cacheStudent := studentID
	if cacheStudent == "" && resolved != nil {
		cacheStudent = resolved.ID
	}
	key := ""
	if cacheStudent != "" {
		key = portalCacheKey("dash", ctx.SchoolID, cacheStudent)
	}

	h.serveCached(w, r, key, portalDashTTL, func() api.ServiceResult {
		return api.ServiceTry(func() (any, error) {
			s := resolved
			attendance := map[string]any{"present": 0, "total": 0, "percentage": 0}
			exams := []map[string]any{}
			results := []map[string]any{}
			feeDue := map[string]any{"amount": 0, "due_date": nil}
			overview := map[string]any{
				"student_id":            "",
				"name":                  "",
				"class":                 "",
				"current_grade":         "—",
				"attendance_percentage": 0,
				"pending_fees":          0,
				"pending_assignments":   0,
			}
			if s == nil {
				return map[string]any{
					"dashboard": map[string]any{
						"total_children":    0,
						"children_overview": []map[string]any{overview},
						"summary": map[string]any{
							"total_pending_fees":        0,
							"total_assignments_pending": 0,
							"alerts_count":              0,
						},
					},
					"attendance":    attendance,
					"upcomingExams": exams,
					"recentResults": results,
					"feeDue":        feeDue,
				}, nil
			}

			h.Store.RLock()
			var present, total int
			for _, a := range h.Store.Attendance {
				if a.SchoolID == ctx.SchoolID && a.StudentID == s.ID {
					total++
					if a.Status == "present" {
						present++
					}
				}
			}
			exRows := make([]*store.Exam, 0)
			for _, e := range h.Store.Exams {
				if e.SchoolID == ctx.SchoolID && e.ClassID == s.ClassID {
					exRows = append(exRows, e)
				}
			}
			resRows := make([]*store.Result, 0)
			for _, r := range h.Store.Results {
				if r.SchoolID == ctx.SchoolID && r.StudentID == s.ID {
					resRows = append(resRows, r)
				}
			}
			var pendingFees float64
			for _, f := range h.Store.Fees {
				if f.SchoolID != ctx.SchoolID || f.StudentID != s.ID {
					continue
				}
				eff := f.Amount + f.AdjustmentAmount
				out := eff - f.PaidAmount
				if out > 0 {
					pendingFees += out
				}
			}
			pendingHomework := 0
			for _, hw := range h.Store.Homework {
				if hw.SchoolID != ctx.SchoolID || hw.ClassID != s.ClassID {
					continue
				}
				if hw.Section != "" && hw.Section != s.Section {
					continue
				}
				if hw.Status == "draft" {
					continue
				}
				submitted := false
				for _, sub := range hw.Submissions {
					if sub.StudentID == s.ID && (sub.Status == "submitted" || sub.Status == "graded") {
						submitted = true
						break
					}
				}
				if !submitted {
					pendingHomework++
				}
			}
			className := ""
			for _, c := range h.Store.Classes {
				if c.ID == s.ClassID {
					className = c.Name
					if s.Section != "" {
						className += " - " + s.Section
					}
					break
				}
			}
			h.Store.RUnlock()

			sort.SliceStable(exRows, func(i, j int) bool { return exRows[i].StartsAt.Before(exRows[j].StartsAt) })
			if len(exRows) > 5 {
				exRows = exRows[:5]
			}
			for _, e := range exRows {
				exams = append(exams, map[string]any{
					"_id": e.ID, "title": e.Title, "subject": e.Subject,
					"starts_at": api.FormatDate(e.StartsAt), "max_marks": e.MaxMarks,
				})
			}
			sort.SliceStable(resRows, func(i, j int) bool { return resRows[i].GradedAt.After(resRows[j].GradedAt) })
			if len(resRows) > 5 {
				resRows = resRows[:5]
			}
			currentGrade := "—"
			if len(resRows) > 0 {
				latest := resRows[0]
				max := 0
				for _, e := range h.Store.Exams {
					if e.ID == latest.ExamID {
						if len(e.Subjects) > 0 {
							for _, sub := range e.Subjects {
								max += sub.MaxMarks
							}
						} else {
							max = e.MaxMarks
						}
						break
					}
				}
				if max > 0 {
					pct := (latest.ObtainedMarks / float64(max)) * 100
					switch {
					case pct >= 90:
						currentGrade = "A+"
					case pct >= 80:
						currentGrade = "A"
					case pct >= 70:
						currentGrade = "B"
					case pct >= 60:
						currentGrade = "C"
					case pct >= 50:
						currentGrade = "D"
					default:
						currentGrade = "F"
					}
				}
			}
			for _, r := range resRows {
				results = append(results, map[string]any{
					"_id": r.ID, "exam_id": r.ExamID, "obtained_marks": r.ObtainedMarks,
					"graded_at": r.GradedAt, "remarks": r.Remarks,
				})
			}
			percentage := 0
			if total > 0 {
				percentage = (present * 100) / total
			}
			attendance = map[string]any{"present": present, "total": total, "percentage": percentage}
			feeDue = map[string]any{"amount": pendingFees, "due_date": nil}

			overview = map[string]any{
				"student_id":            s.ID,
				"name":                  s.FirstName + " " + s.LastName,
				"class":                 className,
				"current_grade":         currentGrade,
				"attendance_percentage": percentage,
				"pending_fees":          pendingFees,
				"pending_assignments":   pendingHomework,
				"academic_year":         s.AcademicYearID,
			}

			return map[string]any{
				"dashboard": map[string]any{
					"total_children":    1,
					"children_overview": []map[string]any{overview},
					"summary": map[string]any{
						"total_pending_fees":        pendingFees,
						"total_assignments_pending": pendingHomework,
						"alerts_count":              0,
					},
				},
				"attendance":    attendance,
				"upcomingExams": exams,
				"recentResults": results,
				"feeDue":        feeDue,
			}, nil
		})
	})
}

// Results implements GET /api/student/results — only the caller's own graded
// results, with per-subject breakdowns.
func (h *Handler) Results(w http.ResponseWriter, r *http.Request) {
	ctx := studentOnly(w, r)
	if ctx == nil {
		return
	}
	studentID := r.URL.Query().Get("student_id")
	resolved := h.resolveStudent(ctx, studentID)
	cacheStudent := studentID
	if cacheStudent == "" && resolved != nil {
		cacheStudent = resolved.ID
	}
	key := ""
	if cacheStudent != "" {
		key = portalCacheKey("results", ctx.SchoolID, cacheStudent)
	}

	h.serveCached(w, r, key, portalResultsTTL, func() api.ServiceResult {
		return api.ServiceTry(func() (any, error) {
			s := resolved
			if s == nil {
				return []map[string]any{}, nil
			}
			h.Store.RLock()
			defer h.Store.RUnlock()
			examByID := map[string]*store.Exam{}
			for _, e := range h.Store.Exams {
				examByID[e.ID] = e
			}
			out := make([]map[string]any, 0)
			for _, r := range h.Store.Results {
				if r.SchoolID != ctx.SchoolID || r.StudentID != s.ID {
					continue
				}
				ex := examByID[r.ExamID]
				max := 0
				title, subject := "", ""
				subjectsOut := make([]map[string]any, 0)
				if ex != nil {
					title = ex.Title
					if len(ex.Subjects) > 0 {
						for _, s := range ex.Subjects {
							max += s.MaxMarks
						}
						for i, s := range ex.Subjects {
							if i > 0 {
								subject += ", "
							}
							subject += s.SubjectName
						}
					} else {
						max = ex.MaxMarks
						subject = ex.Subject
					}
				}
				examSubByID := map[string]store.ExamSubject{}
				if ex != nil {
					for _, es := range ex.Subjects {
						examSubByID[es.SubjectID] = es
					}
				}
				for _, rs := range r.Subjects {
					meta := examSubByID[rs.SubjectID]
					name := rs.SubjectName
					if name == "" {
						name = meta.SubjectName
					}
					subjectsOut = append(subjectsOut, map[string]any{
						"subject_id":     rs.SubjectID,
						"subject_name":   name,
						"obtained_marks": rs.ObtainedMarks,
						"max_marks":      meta.MaxMarks,
					})
				}
				out = append(out, map[string]any{
					"_id":            r.ID,
					"exam_id":        r.ExamID,
					"exam_title":     title,
					"exam_subject":   subject,
					"subjects":       subjectsOut,
					"obtained_marks": r.ObtainedMarks,
					"max_marks":      max,
					"graded_at":      r.GradedAt,
					"remarks":        r.Remarks,
					"grade":          calculateGrade(r.ObtainedMarks, float64(max)),
				})
			}
			return out, nil
		})
	})
}

// Attendance implements GET /api/student/attendance — the caller's own
// attendance record grouped by day.
func (h *Handler) Attendance(w http.ResponseWriter, r *http.Request) {
	ctx := studentOnly(w, r)
	if ctx == nil {
		return
	}
	studentID := r.URL.Query().Get("student_id")
	resolved := h.resolveStudent(ctx, studentID)
	cacheStudent := studentID
	if cacheStudent == "" && resolved != nil {
		cacheStudent = resolved.ID
	}
	key := ""
	if cacheStudent != "" {
		key = portalCacheKey("attendance", ctx.SchoolID, cacheStudent)
	}

	h.serveCached(w, r, key, portalAttendanceTTL, func() api.ServiceResult {
		return api.ServiceTry(func() (any, error) {
			s := resolved
			empty := map[string]any{
				"student": "",
				"class":   "",
				"attendance_summary": map[string]any{
					"present_days":          0,
					"absent_days":           0,
					"late_days":             0,
					"leave_days":            0,
					"total_days":            0,
					"attendance_percentage": 0,
				},
				"recent_records": []map[string]any{},
			}
			if s == nil {
				return empty, nil
			}
			h.Store.RLock()
			defer h.Store.RUnlock()

			records := make([]map[string]any, 0)
			var present, absent, late, leave int
			byDate := map[string][]*store.Attendance{}
			for _, a := range h.Store.Attendance {
				if a.SchoolID != ctx.SchoolID || a.StudentID != s.ID {
					continue
				}
				date := api.FormatDate(a.Date)
				byDate[date] = append(byDate[date], a)
			}
			for date, arr := range byDate {
				status := "absent"
				period := 0
				note := ""
				for _, a := range arr {
					if a.Status == "present" {
						status = "present"
					} else if a.Status == "late" && status != "present" {
						status = "late"
					} else if a.Status == "leave" && status != "present" && status != "late" {
						status = "leave"
					}
					if a.Period > period {
						period = a.Period
					}
					if a.Note != "" {
						note = a.Note
					}
				}
				switch status {
				case "present":
					present++
				case "absent":
					absent++
				case "late":
					late++
				case "leave":
					leave++
				}
				records = append(records, map[string]any{
					"date":   date,
					"status": status,
					"period": period,
					"note":   note,
				})
			}
			sort.SliceStable(records, func(i, j int) bool {
				return records[i]["date"].(string) > records[j]["date"].(string)
			})
			recent := records
			if len(recent) > 30 {
				recent = recent[:30]
			}

			total := present + absent + late + leave
			percentage := 0
			if total > 0 {
				percentage = ((present*2 + late) * 50) / total
			}

			className := ""
			for _, c := range h.Store.Classes {
				if c.ID == s.ClassID {
					className = c.Name
					if s.Section != "" {
						className += " - " + s.Section
					}
					break
				}
			}

			return map[string]any{
				"student": s.FirstName + " " + s.LastName,
				"class":   className,
				"attendance_summary": map[string]any{
					"present_days":          present,
					"absent_days":           absent,
					"late_days":             late,
					"leave_days":            leave,
					"total_days":            total,
					"attendance_percentage": percentage,
				},
				"recent_records": recent,
			}, nil
		})
	})
}

// Homework implements GET /api/student/homework — assignments published to the
// caller's own class/section.
func (h *Handler) Homework(w http.ResponseWriter, r *http.Request) {
	ctx := studentOnly(w, r)
	if ctx == nil {
		return
	}
	studentID := r.URL.Query().Get("student_id")
	resolved := h.resolveStudent(ctx, studentID)
	cacheStudent := studentID
	if cacheStudent == "" && resolved != nil {
		cacheStudent = resolved.ID
	}
	key := ""
	if cacheStudent != "" {
		key = portalCacheKey("homework", ctx.SchoolID, cacheStudent)
	}

	h.serveCached(w, r, key, portalHomeworkTTL, func() api.ServiceResult {
		return api.ServiceTry(func() (any, error) {
			s := resolved
			if s == nil {
				return []map[string]any{}, nil
			}
			h.Store.RLock()
			defer h.Store.RUnlock()

			teacherByID := map[string]*store.Teacher{}
			for _, t := range h.Store.Teachers {
				teacherByID[t.ID] = t
			}

			out := make([]map[string]any, 0)
			for _, hw := range h.Store.Homework {
				if hw.SchoolID != ctx.SchoolID || hw.ClassID != s.ClassID {
					continue
				}
				if hw.Section != "" && hw.Section != s.Section {
					continue
				}
				if hw.Status == "draft" {
					continue
				}

				teacherName := "Teacher"
				if t := teacherByID[hw.TeacherID]; t != nil {
					teacherName = t.FirstName + " " + t.LastName
				}

				out = append(out, map[string]any{
					"_id":          hw.ID,
					"id":           hw.ID,
					"title":        hw.Title,
					"subject":      hw.Subject,
					"subject_name": hw.Subject,
					"due_at":       api.FormatDate(hw.DueAt),
					"status":       hw.Status,
					"teacher_name": teacherName,
				})
			}
			sort.SliceStable(out, func(i, j int) bool {
				return out[i]["due_at"].(string) < out[j]["due_at"].(string)
			})
			return out, nil
		})
	})
}

// Announcements implements GET /api/student/announcements — announcements
// targeted at the caller's school (all/parents/students audience).
func (h *Handler) Announcements(w http.ResponseWriter, r *http.Request) {
	ctx := studentOnly(w, r)
	if ctx == nil {
		return
	}
	api.WriteResult(w, api.ServiceTry(func() (any, error) {
		h.Store.RLock()
		defer h.Store.RUnlock()
		out := make([]*store.Announcement, 0)
		for _, a := range h.Store.Announcements {
			if a.SchoolID == ctx.SchoolID && (a.Audience == "" || a.Audience == "all" || a.Audience == "students") {
				out = append(out, a)
			}
		}
		sort.SliceStable(out, func(i, j int) bool {
			return out[i].CreatedAt.After(out[j].CreatedAt)
		})
		return out, nil
	}))
}

func calculateGrade(obtained, max float64) string {
	if max == 0 {
		return "F"
	}
	p := (obtained / max) * 100
	switch {
	case p >= 90:
		return "A+"
	case p >= 80:
		return "A"
	case p >= 70:
		return "B"
	case p >= 60:
		return "C"
	case p >= 50:
		return "D"
	default:
		return "F"
	}
}
