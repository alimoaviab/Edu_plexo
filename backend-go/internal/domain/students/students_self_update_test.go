package students

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/store"
	"github.com/go-chi/chi/v5"
)

func selfUpdateStore() *store.MemStore {
	now := time.Now()
	return &store.MemStore{
		Users: []*store.User{
			{ID: "user_stu", SchoolID: "school_1", Email: "stu@test.school", Role: "student", Status: "active"},
		},
		Students: []*store.Student{
			{
				ID: "stu_1", SchoolID: "school_1", UserID: "user_stu",
				FirstName: "Jane", LastName: "Doe", ClassID: "cl_9",
				Guardian: store.Guardian{Name: "Parent", Email: "parent@test.school", Phone: "111"},
				Status:   "active", RollNo: "42", CreatedAt: now, UpdatedAt: now,
			},
			{
				ID: "stu_2", SchoolID: "school_1", UserID: "user_other",
				FirstName: "Bob", LastName: "Other", ClassID: "cl_9", Status: "active", CreatedAt: now, UpdatedAt: now,
			},
		},
	}
}

func updateRequest(role, userID, targetID, body string) *http.Request {
	req := httptest.NewRequest("PATCH", "/api/students/"+targetID, bytes.NewReader([]byte(body)))
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("id", targetID)
	req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))
	req = req.WithContext(api.WithContext(req.Context(), &api.RequestContext{
		UserID:   userID,
		SchoolID: "school_1",
		Role:     role,
	}))
	return req
}

func decodeStudentUpdate(t *testing.T, rec *httptest.ResponseRecorder) map[string]any {
	t.Helper()
	var res struct {
		Data map[string]any `json:"data"`
	}
	_ = json.NewDecoder(rec.Result().Body).Decode(&res)
	return res.Data
}

func TestStudentSelfUpdate_RejectsClassMigration(t *testing.T) {
	h := &Handler{Store: selfUpdateStore(), Persist: func(string, any) {}}

	body := `{"first_name":"Jane-Updated","class_id":"cl_1","section":"A","status":"graduated","roll_no":"999","guardian":{"name":"Hacker","email":"evil@test.school"}}`
	rec := httptest.NewRecorder()
	h.Update(rec, updateRequest("student", "user_stu", "stu_1", body))

	if rec.Result().StatusCode != http.StatusOK {
		t.Fatalf("self profile update should succeed, got %d", rec.Result().StatusCode)
	}

	h.Store.RLock()
	defer h.Store.RUnlock()
	stu := h.Store.Students[0]
	if stu.FirstName != "Jane-Updated" {
		t.Fatalf("allowed profile field not applied: %q", stu.FirstName)
	}
	if stu.ClassID != "cl_9" {
		t.Fatalf("student moved class via self-update: %q", stu.ClassID)
	}
	if stu.Section != "" {
		t.Fatalf("student changed section via self-update: %q", stu.Section)
	}
	if stu.Status != "active" {
		t.Fatalf("student changed own status via self-update: %q", stu.Status)
	}
	if stu.RollNo != "42" {
		t.Fatalf("student changed own roll number via self-update: %q", stu.RollNo)
	}
	if stu.Guardian.Email != "parent@test.school" {
		t.Fatalf("student rewrote guardian relationship via self-update: %+v", stu.Guardian)
	}
}

func TestStudentSelfUpdate_CannotEditAnotherStudent(t *testing.T) {
	h := &Handler{Store: selfUpdateStore(), Persist: func(string, any) {}}

	rec := httptest.NewRecorder()
	h.Update(rec, updateRequest("student", "user_stu", "stu_2", `{"first_name":"Hacked"}`))

	if rec.Result().StatusCode != http.StatusForbidden && rec.Result().StatusCode != http.StatusNotFound {
		t.Fatalf("expected 403/404 updating another student, got %d", rec.Result().StatusCode)
	}
	h.Store.RLock()
	defer h.Store.RUnlock()
	if h.Store.Students[1].FirstName != "Bob" {
		t.Fatal("other student's record was modified")
	}
}

func TestAdminCanStillMoveStudent(t *testing.T) {
	h := &Handler{Store: selfUpdateStore(), Persist: func(string, any) {}}

	rec := httptest.NewRecorder()
	h.Update(rec, updateRequest("admin", "user_admin", "stu_1", `{"class_id":"cl_2"}`))

	if rec.Result().StatusCode != http.StatusOK {
		t.Fatalf("admin class change should succeed, got %d", rec.Result().StatusCode)
	}
	h.Store.RLock()
	defer h.Store.RUnlock()
	if h.Store.Students[0].ClassID != "cl_2" {
		t.Fatalf("admin class move not applied: %q", h.Store.Students[0].ClassID)
	}
}
