package superadmin

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/auth"
	"github.com/eduplexo/backend-go/internal/store"
	"github.com/go-chi/chi/v5"
)

func superAdminTestStore() *store.MemStore {
	now := time.Now()
	return &store.MemStore{
		Schools: []*store.School{
			{
				ID:        "sch_1",
				SchoolID:  "school_1",
				Name:      "Test School",
				Code:      "TS",
				Status:    "active",
				CreatedAt: now,
				UpdatedAt: now,
			},
		},
		Users: []*store.User{
			{
				ID:           "user_admin",
				SchoolID:     "school_1",
				Email:        "admin@test.school",
				PasswordHash: "old-hash",
				Password:     "visible-password",
				Role:         "admin",
				Status:       "active",
				CreatedAt:    now,
				UpdatedAt:    now,
			},
		},
	}
}

func superAdminRequest(method, path, body, role string) *http.Request {
	req := httptest.NewRequest(method, path, strings.NewReader(body))
	req = req.WithContext(api.WithContext(req.Context(), &api.RequestContext{
		UserID:   "actor_1",
		SchoolID: "school_1",
		Role:     role,
	}))
	return req
}

func decodeServiceResult(t *testing.T, rec *httptest.ResponseRecorder) api.ServiceResult {
	t.Helper()
	var result api.ServiceResult
	if err := json.NewDecoder(rec.Body).Decode(&result); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	return result
}

func TestSuperAdminEndpointsRejectSchoolAdmin(t *testing.T) {
	h := New(superAdminTestStore())
	rec := httptest.NewRecorder()

	h.ListSchools(rec, superAdminRequest(http.MethodGet, "/api/super-admin/schools", "", "admin"))

	if rec.Code != http.StatusForbidden {
		t.Fatalf("expected 403, got %d", rec.Code)
	}
	result := decodeServiceResult(t, rec)
	if result.Ok || result.ErrorCode != "FORBIDDEN" {
		t.Fatalf("expected forbidden result, got %#v", result)
	}
}

func TestSuperAdminSchoolResponsesDoNotExposePasswords(t *testing.T) {
	h := New(superAdminTestStore())
	rec := httptest.NewRecorder()

	h.ListSchools(rec, superAdminRequest(http.MethodGet, "/api/super-admin/schools", "", "super_admin"))

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
	body := rec.Body.String()
	for _, forbidden := range []string{"owner_password", "admin_password", "visible-password", "old-hash"} {
		if strings.Contains(body, forbidden) {
			t.Fatalf("response exposed forbidden password material %q in %s", forbidden, body)
		}
	}
}

func TestAIUsageDoesNotExposeAdminPassword(t *testing.T) {
	h := New(superAdminTestStore())
	rec := httptest.NewRecorder()

	h.AIUsage(rec, superAdminRequest(http.MethodGet, "/api/super-admin/ai-usage", "", "super_admin"))

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
	body := rec.Body.String()
	for _, forbidden := range []string{"admin_password", "visible-password", "old-hash"} {
		if strings.Contains(body, forbidden) {
			t.Fatalf("response exposed forbidden password material %q in %s", forbidden, body)
		}
	}
}

func TestUpdateAdminPasswordHashesAndPersists(t *testing.T) {
	s := superAdminTestStore()
	var persistedTable string
	var persistedUser *store.User
	h := NewWithPersist(s, func(table string, doc any) {
		persistedTable = table
		persistedUser, _ = doc.(*store.User)
	})

	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("id", "school_1")
	body := `{"password":"StrongPass12345"}`
	req := superAdminRequest(http.MethodPatch, "/api/super-admin/schools/school_1/password", body, "super_admin")
	req = req.WithContext(contextWithRoute(req, rctx))
	rec := httptest.NewRecorder()

	h.UpdateAdminPassword(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d body=%s", rec.Code, rec.Body.String())
	}
	user := s.Users[0]
	if user.PasswordHash == "StrongPass12345" || user.PasswordHash == "old-hash" {
		t.Fatalf("expected bcrypt hash, got %q", user.PasswordHash)
	}
	if user.Password != "" {
		t.Fatalf("expected plaintext password to be cleared, got %q", user.Password)
	}
	if !auth.VerifyPassword("StrongPass12345", user.PasswordHash) {
		t.Fatal("new hash does not verify")
	}
	if persistedTable != "users" || persistedUser != user {
		t.Fatalf("expected persisted user update, got table=%q user=%p", persistedTable, persistedUser)
	}
}

func TestUpdateAdminPasswordRejectsWeakPassword(t *testing.T) {
	h := New(superAdminTestStore())
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("id", "school_1")
	req := superAdminRequest(http.MethodPatch, "/api/super-admin/schools/school_1/password", `{"password":"short"}`, "super_admin")
	req = req.WithContext(contextWithRoute(req, rctx))
	rec := httptest.NewRecorder()

	h.UpdateAdminPassword(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", rec.Code)
	}
}

func contextWithRoute(req *http.Request, routeContext *chi.Context) context.Context {
	ctx := context.WithValue(req.Context(), chi.RouteCtxKey, routeContext)
	return ctx
}
