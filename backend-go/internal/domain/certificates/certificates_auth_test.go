package certificates

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

func certTestStore() *store.MemStore {
	now := time.Now()
	return &store.MemStore{
		CertificateTemplates: []*store.CertificateTemplate{
			{ID: "ctpl_1", SchoolID: "school_1", Name: "Achievement", Type: "character", Status: "active", CreatedAt: now, UpdatedAt: now},
		},
		Students: []*store.Student{
			{ID: "stu_self", SchoolID: "school_1", UserID: "user_stu", FirstName: "Self", LastName: "Student", ClassID: "cl_1", Status: "active"},
			{ID: "stu_other", SchoolID: "school_1", UserID: "user_other", FirstName: "Other", LastName: "Student", ClassID: "cl_2", Status: "active"},
		},
		GeneratedCertificates: []*store.GeneratedCertificate{
			{ID: "cert_1", SchoolID: "school_1", StudentID: "stu_self", StudentName: "Self Student", VerificationCode: "AAAA1111BBBB2222", Status: "issued", CreatedAt: now},
			{ID: "cert_2", SchoolID: "school_1", StudentID: "stu_other", StudentName: "Other Student", VerificationCode: "CCCC3333DDDD4444", Status: "issued", CreatedAt: now},
		},
	}
}

func certRequest(role, userID string, body string) *http.Request {
	req := httptest.NewRequest("POST", "/api/certificates/generate", bytes.NewReader([]byte(body)))
	req = req.WithContext(api.WithContext(req.Context(), &api.RequestContext{
		UserID:   userID,
		SchoolID: "school_1",
		Role:     role,
	}))
	return req
}

func decodeStatus(t *testing.T, rec *httptest.ResponseRecorder) int {
	t.Helper()
	return rec.Result().StatusCode
}

func TestCertificates_GenerateRoleMatrix(t *testing.T) {
	body := `{"template_id":"ctpl_1","student_ids":["stu_self"]}`

	// Unauthorized roles must be rejected before any side effect.
	for _, role := range []string{"student", "parent", "teacher"} {
		h := New(certTestStore(), func(string, any) {})
		rec := httptest.NewRecorder()
		h.Generate(rec, certRequest(role, "user_"+role, body))
		if code := decodeStatus(t, rec); code != http.StatusForbidden {
			t.Fatalf("role %s: expected 403 on generate, got %d", role, code)
		}
	}

	// Authorized roles keep working (template exists → 200).
	for _, role := range []string{"admin", "owner", "super_admin"} {
		h := New(certTestStore(), func(string, any) {})
		rec := httptest.NewRecorder()
		h.Generate(rec, certRequest(role, "user_"+role, body))
		if code := decodeStatus(t, rec); code != http.StatusOK {
			t.Fatalf("role %s: expected 200 on generate, got %d", role, code)
		}
	}
}

func TestCertificates_RevokeRoleMatrix(t *testing.T) {
	revokeReq := func(role string) *http.Request {
		req := httptest.NewRequest("POST", "/api/certificates/cert_1/revoke", nil)
		rctx := chi.NewRouteContext()
		rctx.URLParams.Add("id", "cert_1")
		req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))
		req = req.WithContext(api.WithContext(req.Context(), &api.RequestContext{UserID: "u_" + role, SchoolID: "school_1", Role: role}))
		return req
	}

	for _, role := range []string{"student", "parent", "teacher"} {
		h := New(certTestStore(), func(string, any) {})
		rec := httptest.NewRecorder()
		h.Revoke(rec, revokeReq(role))
		if code := decodeStatus(t, rec); code != http.StatusForbidden {
			t.Fatalf("role %s: expected 403 on revoke, got %d", role, code)
		}
	}

	h := New(certTestStore(), func(string, any) {})
	rec := httptest.NewRecorder()
	h.Revoke(rec, revokeReq("admin"))
	if code := decodeStatus(t, rec); code != http.StatusOK {
		t.Fatalf("admin: expected 200 on revoke, got %d", code)
	}
}

func TestCertificates_List_StudentSeesOnlyOwn(t *testing.T) {
	h := New(certTestStore(), func(string, any) {})
	req := httptest.NewRequest("GET", "/api/certificates", nil)
	req = req.WithContext(api.WithContext(req.Context(), &api.RequestContext{UserID: "user_stu", SchoolID: "school_1", Role: "student"}))
	rec := httptest.NewRecorder()
	h.ListCertificates(rec, req)

	if code := decodeStatus(t, rec); code != http.StatusOK {
		t.Fatalf("student list: expected 200, got %d", code)
	}
	var res struct {
		Data []map[string]any `json:"data"`
	}
	_ = json.NewDecoder(rec.Result().Body).Decode(&res)
	if len(res.Data) != 1 {
		t.Fatalf("student should see exactly their own certificate, got %d", len(res.Data))
	}
	if res.Data[0]["student_id"] != "stu_self" {
		t.Fatalf("student received another student's certificate: %v", res.Data[0]["student_id"])
	}
}

func TestCertificates_List_StudentCannotUseFilterToSeeOthers(t *testing.T) {
	h := New(certTestStore(), func(string, any) {})
	req := httptest.NewRequest("GET", "/api/certificates?student_id=stu_other", nil)
	req = req.WithContext(api.WithContext(req.Context(), &api.RequestContext{UserID: "user_stu", SchoolID: "school_1", Role: "student"}))
	rec := httptest.NewRecorder()
	h.ListCertificates(rec, req)

	var res struct {
		Data []map[string]any `json:"data"`
	}
	_ = json.NewDecoder(rec.Result().Body).Decode(&res)
	if len(res.Data) != 0 {
		t.Fatalf("student must not obtain another student's certificate via filter, got %d rows", len(res.Data))
	}
}

func TestCertificates_List_AdminSeesSchoolWide(t *testing.T) {
	h := New(certTestStore(), func(string, any) {})
	req := httptest.NewRequest("GET", "/api/certificates", nil)
	req = req.WithContext(api.WithContext(req.Context(), &api.RequestContext{UserID: "user_admin", SchoolID: "school_1", Role: "admin"}))
	rec := httptest.NewRecorder()
	h.ListCertificates(rec, req)

	var res struct {
		Data []map[string]any `json:"data"`
	}
	_ = json.NewDecoder(rec.Result().Body).Decode(&res)
	if len(res.Data) != 2 {
		t.Fatalf("admin should see the full school list, got %d rows", len(res.Data))
	}
}

func TestCertificates_TemplateCRUDRequiresPermission(t *testing.T) {
	store := certTestStore()
	h := New(store, func(string, any) {})
	req := httptest.NewRequest("POST", "/api/certificates/templates", bytes.NewReader([]byte(`{"name":"x"}`)))
	req = req.WithContext(api.WithContext(req.Context(), &api.RequestContext{UserID: "user_stu", SchoolID: "school_1", Role: "student"}))
	rec := httptest.NewRecorder()
	h.CreateTemplate(rec, req)
	if code := decodeStatus(t, rec); code != http.StatusForbidden {
		t.Fatalf("student: expected 403 on template create, got %d", code)
	}

	// Ensure the store was untouched (no side effect before authz).
	if len(store.CertificateTemplates) != 1 {
		t.Fatal("template created despite missing permission")
	}
}

func TestVerificationCode_UsesCryptoRandom16Hex(t *testing.T) {
	seen := map[string]bool{}
	for i := 0; i < 50; i++ {
		code := generateVerificationCode()
		if len(code) != 16 {
			t.Fatalf("expected 16-char code, got %q (len %d)", code, len(code))
		}
		for _, ch := range code {
			if !((ch >= '0' && ch <= '9') || (ch >= 'A' && ch <= 'F')) {
				t.Fatalf("code %q contains non-hex char %q", code, string(ch))
			}
		}
		if seen[code] {
			t.Fatalf("collision in crypto-random codes at iteration %d", i)
		}
		seen[code] = true
	}
}
