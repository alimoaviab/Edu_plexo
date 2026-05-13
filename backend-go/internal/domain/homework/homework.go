// Package homework implements /api/homework endpoints. Mirrors
// old-app/shared/services/homework.service.ts.
package homework

import (
	"encoding/json"
	"net/http"
	"sort"
	"time"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/audit"
	"github.com/eduplexo/backend-go/internal/auth"
	"github.com/eduplexo/backend-go/internal/domain/tenant"
	"github.com/eduplexo/backend-go/internal/store"
	"github.com/go-chi/chi/v5"
)

type Handler struct{ Store *store.MemStore }

func New(s *store.MemStore) *Handler { return &Handler{Store: s} }

func (h *Handler) hydrate(rows []*store.Homework) []map[string]any {
	classByID := map[string]*store.Class{}
	teacherByID := map[string]*store.Teacher{}
	subjectByID := map[string]*store.Subject{}
	for _, c := range h.Store.Classes {
		classByID[c.ID] = c
	}
	for _, t := range h.Store.Teachers {
		teacherByID[t.ID] = t
	}
	for _, s := range h.Store.Subjects {
		subjectByID[s.ID] = s
	}
	out := make([]map[string]any, 0, len(rows))
	for _, hw := range rows {
		cls := classByID[hw.ClassID]
		tch := teacherByID[hw.TeacherID]
		sub := subjectByID[hw.SubjectID]
		className, teacherName, employeeNo := "", "Teacher", ""
		if cls != nil {
			className = cls.Name
		}
		if tch != nil {
			teacherName = tch.FirstName + " " + tch.LastName
			employeeNo = tch.EmployeeNo
		}
		subjectID, subjectName := hw.SubjectID, hw.Subject
		if sub != nil {
			subjectID = sub.ID
			subjectName = sub.Name
		}
		out = append(out, map[string]any{
			"_id":                  hw.ID,
			"school_id":            hw.SchoolID,
			"academic_year_id":     hw.AcademicYearID,
			"class_id":             hw.ClassID,
			"class_name":           className,
			"teacher_id":           hw.TeacherID,
			"teacher_name":         teacherName,
			"teacher_employee_no":  employeeNo,
			"subject_id":           subjectID,
			"subject_name":         subjectName,
			"subject":              subjectName,
			"title":                hw.Title,
			"instructions":         hw.Instructions,
			"due_at":               api.FormatDate(hw.DueAt),
			"status":               hw.Status,
			"submissions":          hw.Submissions,
			"created_at":           hw.CreatedAt,
			"updated_at":           hw.UpdatedAt,
		})
	}
	return out
}

// List implements GET /api/homework.
func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	q := r.URL.Query()
	api.WriteResult(w, api.ServiceTry(func() (any, error) {
		if err := auth.AssertPermission(ctx, "homework", auth.ActionView); err != nil {
			return nil, err
		}
		yearID := tenant.ResolveAcademicYearID(h.Store, ctx, q.Get("academic_year_id"))
		classID := q.Get("class_id")
		statusQ := q.Get("status")

		// Student scoping: only show their class's "assigned" homework.
		if ctx.Role == "student" {
			h.Store.RLock()
			var self *store.Student
			for _, s := range h.Store.Students {
				if s.SchoolID == ctx.SchoolID && s.UserID == ctx.UserID {
					self = s
					break
				}
			}
			h.Store.RUnlock()
			if self == nil {
				return []any{}, nil
			}
			classID = self.ClassID
			if statusQ == "" {
				statusQ = "assigned"
			}
		}

		h.Store.RLock()
		rows := make([]*store.Homework, 0)
		for _, hw := range h.Store.Homework {
			if hw.SchoolID != ctx.SchoolID {
				continue
			}
			if yearID != "" && hw.AcademicYearID != "" && hw.AcademicYearID != yearID {
				continue
			}
			if classID != "" && hw.ClassID != classID {
				continue
			}
			if statusQ != "" && hw.Status != statusQ {
				continue
			}
			rows = append(rows, hw)
		}
		h.Store.RUnlock()
		sort.SliceStable(rows, func(i, j int) bool {
			return rows[i].DueAt.Before(rows[j].DueAt)
		})

		hydrated := h.hydrate(rows)
		page := api.ParsePagination(q)
		if !page.Enabled {
			return hydrated, nil
		}
		return api.BuildPaginated(api.SafeSlice(hydrated, page.Skip, page.Skip+page.Limit), len(hydrated), page), nil
	}))
}

// Get implements GET /api/homework/:id.
func (h *Handler) Get(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	id := chi.URLParam(r, "id")
	api.WriteResult(w, api.ServiceTry(func() (any, error) {
		if err := auth.AssertPermission(ctx, "homework", auth.ActionView); err != nil {
			return nil, err
		}
		h.Store.RLock()
		defer h.Store.RUnlock()
		for _, hw := range h.Store.Homework {
			if hw.ID == id && hw.SchoolID == ctx.SchoolID {
				row := h.hydrate([]*store.Homework{hw})[0]
				// Student privacy: collapse `submissions` to my_submission only.
				if ctx.Role == "student" {
					var self *store.Student
					for _, s := range h.Store.Students {
						if s.SchoolID == ctx.SchoolID && s.UserID == ctx.UserID {
							self = s
							break
						}
					}
					if self != nil {
						var mine *store.HomeworkSubmission
						for i := range hw.Submissions {
							if hw.Submissions[i].StudentID == self.ID {
								mine = &hw.Submissions[i]
								break
							}
						}
						row["my_submission"] = mine
						delete(row, "submissions")
					}
				}
				return row, nil
			}
		}
		return nil, api.NewControlledError("NOT_FOUND", "Homework not found.", 404, nil)
	}))
}

type createInput struct {
	ClassID      string `json:"class_id"`
	TeacherID    string `json:"teacher_id"`
	SubjectID    string `json:"subject_id"`
	Title        string `json:"title"`
	Instructions string `json:"instructions"`
	DueAt        string `json:"due_at"`
	Status       string `json:"status"`
}

// Create implements POST /api/homework.
func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	var body createInput
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "Invalid JSON body.", 400, nil))
		return
	}
	api.WriteResult(w, api.ServiceTry(func() (any, error) {
		if err := auth.AssertPermission(ctx, "homework", auth.ActionCreate); err != nil {
			return nil, err
		}
		if body.ClassID == "" || body.TeacherID == "" || body.Title == "" {
			return nil, api.NewControlledError("VALIDATION_ERROR", "class_id, teacher_id and title are required.", 400, nil)
		}
		dueAt, ok := api.ParseDate(body.DueAt)
		if !ok {
			return nil, api.NewControlledError("VALIDATION_ERROR", "Invalid due_at date.", 400, nil)
		}
		// 23:59 same day, mirroring `dueAt.setHours(23,59,0,0)`.
		dueAt = time.Date(dueAt.Year(), dueAt.Month(), dueAt.Day(), 23, 59, 0, 0, time.UTC)

		h.Store.Lock()
		defer h.Store.Unlock()
		// Validate class + teacher exist.
		var class *store.Class
		for _, c := range h.Store.Classes {
			if c.ID == body.ClassID && c.SchoolID == ctx.SchoolID {
				class = c
				break
			}
		}
		if class == nil {
			return nil, api.NewControlledError("NOT_FOUND", "Selected class was not found.", 404, nil)
		}
		var teacher *store.Teacher
		for _, t := range h.Store.Teachers {
			if t.ID == body.TeacherID && t.SchoolID == ctx.SchoolID {
				teacher = t
				break
			}
		}
		if teacher == nil {
			return nil, api.NewControlledError("NOT_FOUND", "Selected teacher was not found.", 404, nil)
		}

		// Resolve subject (by ID, or by name fallback / auto-create).
		var subject *store.Subject
		if body.SubjectID != "" {
			for _, s := range h.Store.Subjects {
				if s.ID == body.SubjectID && s.SchoolID == ctx.SchoolID {
					subject = s
					break
				}
			}
			if subject == nil {
				for _, s := range h.Store.Subjects {
					if s.SchoolID == ctx.SchoolID && s.Name == body.SubjectID {
						subject = s
						break
					}
				}
			}
			if subject == nil && len(body.SubjectID) >= 2 {
				newSub := &store.Subject{
					ID: store.NewID("sub"), SchoolID: ctx.SchoolID,
					Name: body.SubjectID, Status: "active", CreatedAt: time.Now(),
				}
				h.Store.Subjects = append(h.Store.Subjects, newSub)
				subject = newSub
			}
		}

		yearID := class.AcademicYearID
		if yearID == "" {
			yearID = ctx.ActiveAcademicYearID
		}

		// Initialize a `pending` submission row per active student in the class.
		submissions := make([]store.HomeworkSubmission, 0)
		for _, s := range h.Store.Students {
			if s.SchoolID == ctx.SchoolID && s.ClassID == body.ClassID && s.Status == "active" {
				submissions = append(submissions, store.HomeworkSubmission{
					StudentID:      s.ID,
					Status:         "pending",
					AttachmentURLs: []string{},
				})
			}
		}

		now := time.Now()
		newRow := &store.Homework{
			ID:             store.NewID("hwk"),
			SchoolID:       ctx.SchoolID,
			AcademicYearID: yearID,
			ClassID:        body.ClassID,
			TeacherID:      body.TeacherID,
			Title:          body.Title,
			Instructions:   body.Instructions,
			DueAt:          dueAt,
			Status:         orDefault(body.Status, "assigned"),
			Submissions:    submissions,
			CreatedAt:      now,
			UpdatedAt:      now,
		}
		if subject != nil {
			newRow.SubjectID = subject.ID
			newRow.Subject = subject.Name
		}
		h.Store.Homework = append(h.Store.Homework, newRow)

		audit.Write(h.Store, ctx, audit.Input{
			Action: "create", EntityType: "homework", EntityID: newRow.ID, After: newRow,
		})
		return h.hydrate([]*store.Homework{newRow})[0], nil
	}))
}

// Update implements PATCH /api/homework/:id.
func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	id := chi.URLParam(r, "id")
	body := map[string]json.RawMessage{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "Invalid JSON body.", 400, nil))
		return
	}
	api.WriteResult(w, api.ServiceTry(func() (any, error) {
		if err := auth.AssertPermission(ctx, "homework", auth.ActionUpdate); err != nil {
			return nil, err
		}
		h.Store.Lock()
		defer h.Store.Unlock()
		for _, hw := range h.Store.Homework {
			if hw.ID == id && hw.SchoolID == ctx.SchoolID {
				before := *hw
				if v, ok := body["title"]; ok {
					_ = json.Unmarshal(v, &hw.Title)
				}
				if v, ok := body["instructions"]; ok {
					_ = json.Unmarshal(v, &hw.Instructions)
				}
				if v, ok := body["status"]; ok {
					_ = json.Unmarshal(v, &hw.Status)
				}
				if v, ok := body["class_id"]; ok {
					_ = json.Unmarshal(v, &hw.ClassID)
				}
				if v, ok := body["teacher_id"]; ok {
					_ = json.Unmarshal(v, &hw.TeacherID)
				}
				if v, ok := body["due_at"]; ok {
					var s string
					_ = json.Unmarshal(v, &s)
					if d, ok := api.ParseDate(s); ok {
						hw.DueAt = time.Date(d.Year(), d.Month(), d.Day(), 23, 59, 0, 0, time.UTC)
					}
				}
				hw.UpdatedAt = time.Now()
				audit.Write(h.Store, ctx, audit.Input{
					Action: "update", EntityType: "homework", EntityID: id, Before: before, After: *hw,
				})
				return h.hydrate([]*store.Homework{hw})[0], nil
			}
		}
		return nil, api.NewControlledError("NOT_FOUND", "Homework not found.", 404, nil)
	}))
}

// Delete implements DELETE /api/homework/:id.
func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	id := chi.URLParam(r, "id")
	api.WriteResult(w, api.ServiceTry(func() (any, error) {
		if err := auth.AssertPermission(ctx, "homework", auth.ActionDelete); err != nil {
			return nil, err
		}
		h.Store.Lock()
		defer h.Store.Unlock()
		for i, hw := range h.Store.Homework {
			if hw.ID == id && hw.SchoolID == ctx.SchoolID {
				before := *hw
				h.Store.Homework = append(h.Store.Homework[:i], h.Store.Homework[i+1:]...)
				audit.Write(h.Store, ctx, audit.Input{
					Action: "delete", EntityType: "homework", EntityID: id, Before: before,
				})
				return map[string]any{"success": true, "id": id}, nil
			}
		}
		return nil, api.NewControlledError("NOT_FOUND", "Homework not found.", 404, nil)
	}))
}

func orDefault(v, d string) string {
	if v == "" {
		return d
	}
	return v
}
