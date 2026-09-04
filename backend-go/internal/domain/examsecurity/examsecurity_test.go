package examsecurity

import (
	"bytes"
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/store"
	"github.com/go-chi/chi/v5"
)

func examStore() *store.MemStore {
	now := time.Now()
	return &store.MemStore{
		Exams: []*store.Exam{
			{ID: "exam_1", SchoolID: "school_1", ClassID: "cl_1", Title: "Term 1", Type: "exam", Status: "scheduled", CreatedAt: now, UpdatedAt: now},
			{ID: "exam_2", SchoolID: "school_2", ClassID: "cl_9", Title: "Other school", Type: "exam", Status: "scheduled", CreatedAt: now, UpdatedAt: now},
		},
	}
}

func secRequest(role, schoolID, examID, path, body string) *http.Request {
	req := httptest.NewRequest("POST", "/api/exams/"+examID+path, bytes.NewReader([]byte(body)))
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("id", examID)
	req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))
	req = req.WithContext(api.WithContext(req.Context(), &api.RequestContext{
		UserID:   "user_" + role + "_" + schoolID,
		SchoolID: schoolID,
		Role:     role,
	}))
	return req
}

// secGet builds an authenticated GET against an exam sub-resource.
func secGet(role, schoolID, examID, path string) *http.Request {
	req := httptest.NewRequest("GET", "/api/exams/"+examID+path, nil)
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("id", examID)
	req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))
	req = req.WithContext(api.WithContext(req.Context(), &api.RequestContext{
		UserID:   "user_" + role + "_" + schoolID,
		SchoolID: schoolID,
		Role:     role,
	}))
	return req
}

func TestSaveSettings_StudentForbidden(t *testing.T) {
	h := New(examStore(), func(string, any) {})
	rec := httptest.NewRecorder()
	h.SaveSettings(rec, secRequest("student", "school_1", "exam_1", "/security-settings", `{"shuffle_questions":false,"max_tab_switches":99}`))
	if rec.Result().StatusCode != http.StatusForbidden {
		t.Fatalf("expected 403 for student SaveSettings, got %d", rec.Result().StatusCode)
	}
}

func TestSaveSettings_CrossSchoolExamNotFound(t *testing.T) {
	// Admin of school_1 tries to reconfigure an exam belonging to school_2.
	h := New(examStore(), func(string, any) {})
	rec := httptest.NewRecorder()
	h.SaveSettings(rec, secRequest("admin", "school_1", "exam_2", "/security-settings", `{"shuffle_questions":false}`))
	if rec.Result().StatusCode != http.StatusNotFound {
		t.Fatalf("expected 404 for cross-school exam, got %d", rec.Result().StatusCode)
	}
}

func TestSaveSettings_AdminAllowed(t *testing.T) {
	h := New(examStore(), func(string, any) {})
	rec := httptest.NewRecorder()
	h.SaveSettings(rec, secRequest("admin", "school_1", "exam_1", "/security-settings", `{"shuffle_questions":false,"max_tab_switches":99}`))
	if rec.Result().StatusCode != http.StatusOK {
		t.Fatalf("expected 200 for admin SaveSettings, got %d", rec.Result().StatusCode)
	}
	// Persisted under the exam id.
	h.Store.RLock()
	defer h.Store.RUnlock()
	if len(h.Store.ExamSecuritySettings) != 1 || h.Store.ExamSecuritySettings[0].ExamID != "exam_1" {
		t.Fatal("settings not persisted for own-school exam")
	}
	if h.Store.ExamSecuritySettings[0].MaxTabSwitches != 99 {
		t.Fatal("settings payload not applied")
	}
}

func TestGetSettings_CrossSchoolHidden(t *testing.T) {
	h := New(examStore(), func(string, any) {})
	rec := httptest.NewRecorder()
	h.GetSettings(rec, secGet("admin", "school_1", "exam_2", "/security-settings"))
	if rec.Result().StatusCode != http.StatusNotFound {
		t.Fatalf("expected 404 for cross-school settings read, got %d", rec.Result().StatusCode)
	}
}

func TestGetSettings_OwnSchoolAllowed(t *testing.T) {
	h := New(examStore(), func(string, any) {})
	rec := httptest.NewRecorder()
	h.GetSettings(rec, secGet("student", "school_1", "exam_1", "/security-settings"))
	if rec.Result().StatusCode != http.StatusOK {
		t.Fatalf("expected 200 for own-school settings read, got %d", rec.Result().StatusCode)
	}
}

func TestGetLogs_RoleAndSchoolEnforced(t *testing.T) {
	h := New(examStore(), func(string, any) {})

	// Student forbidden.
	rec := httptest.NewRecorder()
	h.GetLogs(rec, secGet("student", "school_1", "exam_1", "/security-log"))
	if rec.Result().StatusCode != http.StatusForbidden {
		t.Fatalf("expected 403 for student GetLogs, got %d", rec.Result().StatusCode)
	}

	// Staff own-school allowed.
	recOK := httptest.NewRecorder()
	h.GetLogs(recOK, secGet("admin", "school_1", "exam_1", "/security-log"))
	if recOK.Result().StatusCode != http.StatusOK {
		t.Fatalf("expected 200 for admin GetLogs on own exam, got %d", recOK.Result().StatusCode)
	}

	// Staff cross-school forbidden.
	rec2 := httptest.NewRecorder()
	h.GetLogs(rec2, secGet("admin", "school_1", "exam_2", "/security-log"))
	if rec2.Result().StatusCode != http.StatusNotFound {
		t.Fatalf("expected 404 for cross-school logs, got %d", rec2.Result().StatusCode)
	}
}

func TestLogEvent_SchoolScopedAndLengthCapped(t *testing.T) {
	h := New(examStore(), func(string, any) {})

	// Own-school exam: allowed.
	rec := httptest.NewRecorder()
	h.LogEvent(rec, secRequest("student", "school_1", "exam_1", "", `{"exam_id":"exam_1","event_type":"tab_switch","event_data":"switched"}`))
	if rec.Result().StatusCode != http.StatusOK {
		t.Fatalf("expected 200 for own-school event, got %d", rec.Result().StatusCode)
	}

	// Cross-school exam id: rejected.
	rec2 := httptest.NewRecorder()
	h.LogEvent(rec2, secRequest("student", "school_1", "exam_2", "", `{"exam_id":"exam_2","event_type":"tab_switch"}`))
	if rec2.Result().StatusCode != http.StatusNotFound {
		t.Fatalf("expected 404 for cross-school event, got %d", rec2.Result().StatusCode)
	}

	// Oversized event data is truncated (no unbounded log growth).
	rec3 := httptest.NewRecorder()
	h.LogEvent(rec3, secRequest("student", "school_1", "exam_1", "", `{"exam_id":"exam_1","event_type":"paste","event_data":"`+strings.Repeat("A", maxEventDataLen+100)+`"}`))
	if rec3.Result().StatusCode != http.StatusOK {
		t.Fatalf("expected 200 for capped event, got %d", rec3.Result().StatusCode)
	}
	h.Store.RLock()
	defer h.Store.RUnlock()
	var last *store.ExamSecurityLog
	for _, l := range h.Store.ExamSecurityLogs {
		last = l
	}
	if last == nil || len(last.EventData) != maxEventDataLen {
		t.Fatalf("expected event data truncated to %d, got %d", maxEventDataLen, len(last.EventData))
	}
}
