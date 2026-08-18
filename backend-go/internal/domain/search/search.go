package search

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/store"
)

type Handler struct {
	Store *store.MemStore
}

func New(s *store.MemStore) *Handler {
	return &Handler{Store: s}
}

func (h *Handler) GlobalSearch(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	q := strings.ToLower(strings.TrimSpace(r.URL.Query().Get("q")))

	if q == "" {
		api.WriteResult(w, api.Ok(map[string]any{
			"students": []any{},
			"teachers": []any{},
			"classes":  []any{},
			"results":  []any{},
		}))
		return
	}

	h.Store.RLock()
	defer h.Store.RUnlock()

	var students []map[string]any
	var teachers []map[string]any
	var classes []map[string]any
	var results []map[string]any

	for _, s := range h.Store.Students {
		if s.SchoolID != ctx.SchoolID {
			continue
		}
		if strings.Contains(strings.ToLower(s.FirstName), q) ||
			strings.Contains(strings.ToLower(s.LastName), q) ||
			strings.Contains(strings.ToLower(s.AdmissionNo), q) ||
			strings.Contains(strings.ToLower(s.RollNo), q) {
			students = append(students, map[string]any{
				"_id":         s.ID,
				"name":        s.FirstName + " " + s.LastName,
				"type":        "student",
				"description": "Admission No: " + s.AdmissionNo,
				"url":         "/admin/students/" + s.ID,
			})
		}
	}

	for _, t := range h.Store.Teachers {
		if t.SchoolID != ctx.SchoolID {
			continue
		}
		if strings.Contains(strings.ToLower(t.FirstName), q) ||
			strings.Contains(strings.ToLower(t.LastName), q) ||
			strings.Contains(strings.ToLower(t.Email), q) ||
			strings.Contains(strings.ToLower(t.EmployeeNo), q) {
			teachers = append(teachers, map[string]any{
				"_id":         t.ID,
				"name":        t.FirstName + " " + t.LastName,
				"type":        "teacher",
				"description": "Employee No: " + t.EmployeeNo,
				"url":         "/admin/teachers/" + t.ID,
			})
		}
	}

	for _, c := range h.Store.Classes {
		if c.SchoolID != ctx.SchoolID {
			continue
		}
		if strings.Contains(strings.ToLower(c.Name), q) {
			classes = append(classes, map[string]any{
				"_id":         c.ID,
				"name":        c.Name,
				"type":        "class",
				"description": "Capacity: " + strconv.Itoa(c.Capacity),
				"url":         "/admin/classes",
			})
		}
	}

	for _, res := range h.Store.Results {
		if res.SchoolID != ctx.SchoolID {
			continue
		}
		var studentName string
		for _, s := range h.Store.Students {
			if s.ID == res.StudentID {
				studentName = s.FirstName + " " + s.LastName
				break
			}
		}
		if strings.Contains(strings.ToLower(res.Remarks), q) ||
			strings.Contains(strings.ToLower(studentName), q) {
			results = append(results, map[string]any{
				"_id":         res.ID,
				"name":        "Result for " + studentName,
				"type":        "result",
				"description": res.Remarks,
				"url":         "/admin/results",
			})
		}
	}

	api.WriteResult(w, api.Ok(map[string]any{
		"students": students,
		"teachers": teachers,
		"classes":  classes,
		"results":  results,
	}))
}
