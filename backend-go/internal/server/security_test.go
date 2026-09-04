package server

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/eduplexo/backend-go/internal/auth"
	"github.com/eduplexo/backend-go/internal/config"
	"github.com/eduplexo/backend-go/internal/store"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// ─── helpers ─────────────────────────────────────────────────────────────

func newSecurityRouter(t *testing.T) (*store.MemStore, http.Handler) {
	t.Helper()
	s := store.New()
	cfg := config.Config{
		JWTSecret:      "security-test-secret-0123456789",
		AppName:        "school",
		AllowedOrigins: []string{"*"},
	}
	return s, Router(cfg, s, nil, nil)
}

func request(t *testing.T, h http.Handler, method, path, token string, body string) *httptest.ResponseRecorder {
	t.Helper()
	var buf *bytes.Buffer
	if body == "" {
		buf = bytes.NewBuffer(nil)
	} else {
		buf = bytes.NewBufferString(body)
	}
	req := httptest.NewRequest(method, path, buf)
	req.Header.Set("Content-Type", "application/json")
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, req)
	return rec
}

func loginToken(t *testing.T, h http.Handler, email, password string) (string, int) {
	t.Helper()
	body := `{"email":"` + email + `","password":"` + password + `"}`
	rec := request(t, h, http.MethodPost, "/api/auth/login", "", body)
	if rec.Code != http.StatusOK {
		return "", rec.Code
	}
	var res struct {
		Data struct {
			Token string `json:"token"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(rec.Body.Bytes(), &res))
	return res.Data.Token, rec.Code
}

func mustHash(t *testing.T, pw string) string {
	t.Helper()
	h, err := auth.HashPassword(pw)
	require.NoError(t, err)
	return h
}

func addUser(t *testing.T, s *store.MemStore, id, schoolID, email, role, pw string) {
	t.Helper()
	s.Lock()
	s.Users = append(s.Users, &store.User{
		ID:           id,
		SchoolID:     schoolID,
		Email:        email,
		PasswordHash: mustHash(t, pw),
		Role:         role,
		Permissions:  []string{},
		Status:       "active",
		Profile:      store.UserProfile{FirstName: "Test", LastName: role},
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	})
	s.Unlock()
}

// ─── tests ───────────────────────────────────────────────────────────────

// Owner is NOT an Admin: every operational Admin API must return 403 for the
// Owner role, while the Owner's own ERP endpoints keep working.
func TestOwnerCannotAccessAdminAPIs(t *testing.T) {
	s, h := newSecurityRouter(t)
	addUser(t, s, "owner_a", "system", "owner.a@test.school", "owner", "Owner@1234")

	token, code := loginToken(t, h, "owner.a@test.school", "Owner@1234")
	require.Equal(t, http.StatusOK, code, "owner login should succeed")

	// Owner ERP works.
	rec := request(t, h, http.MethodGet, "/api/owner/schools", token, "")
	assert.Equal(t, http.StatusOK, rec.Code, "owner should list own schools")

	// Every operational Admin endpoint is denied.
	for _, path := range []string{
		"/api/students",
		"/api/teachers",
		"/api/classes",
		"/api/subjects",
		"/api/attendance",
		"/api/exams",
		"/api/results",
		"/api/homework",
		"/api/fees",
		"/api/timetable",
		"/api/announcements",
		"/api/certificates",
		"/api/expenses",
	} {
		rec := request(t, h, http.MethodGet, path, token, "")
		assert.Equalf(t, http.StatusForbidden, rec.Code, "owner GET %s must be 403", path)
	}

	// Owner write attempts are denied too.
	for _, path := range []string{
		"/api/students",
		"/api/teachers",
		"/api/classes",
		"/api/attendance",
		"/api/exams",
		"/api/fees/generate",
		"/api/certificates/generate",
	} {
		rec := request(t, h, http.MethodPost, path, token, `{}`)
		assert.Equalf(t, http.StatusForbidden, rec.Code, "owner POST %s must be 403", path)
	}

	// And the admin dashboard aggregate is off-limits (owner scope is the
	// sentinel "system", so even a non-gated handler cannot see tenant data).
	rec = request(t, h, http.MethodGet, "/api/dashboard/composite", token, "")
	assert.NotEqual(t, http.StatusOK, rec.Code)
}

// Admin keeps full operational access after the Owner slimming.
func TestAdminKeepsOperationalAccess(t *testing.T) {
	_, h := newSecurityRouter(t)
	token, code := loginToken(t, h, "school@gmail.com", "Test@123")
	require.Equal(t, http.StatusOK, code, "bootstrap admin login should succeed")

	rec := request(t, h, http.MethodGet, "/api/students", token, "")
	assert.Equal(t, http.StatusOK, rec.Code, "admin should list students")

	// Admin must NOT enter the Owner ERP.
	rec = request(t, h, http.MethodGet, "/api/owner/schools", token, "")
	assert.Equal(t, http.StatusForbidden, rec.Code, "admin must be denied owner endpoints")
}

// Owner A must never see Owner B's school — even with a direct ID request.
func TestOwnerSchoolIsolation(t *testing.T) {
	s, h := newSecurityRouter(t)
	addUser(t, s, "owner_a", "system", "owner.a2@test.school", "owner", "Owner@1234")
	addUser(t, s, "owner_b", "system", "owner.b2@test.school", "owner", "Owner@1234")

	tokenA, _ := loginToken(t, h, "owner.a2@test.school", "Owner@1234")
	tokenB, _ := loginToken(t, h, "owner.b2@test.school", "Owner@1234")
	require.NotEmpty(t, tokenA)
	require.NotEmpty(t, tokenB)

	// Owner A creates a school.
	rec := request(t, h, http.MethodPost, "/api/owner/schools", tokenA,
		`{"name":"Alpha Academy","code":"ALPHA","city":"Lahore","address":"1 Main St","email":"admin@alpha.test","password":"Admin@1234"}`)
	require.Equal(t, http.StatusCreated, rec.Code, "owner A should create a school")
	var created struct {
		Data struct {
			SchoolID string `json:"school_id"`
			ID       string `json:"_id"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(rec.Body.Bytes(), &created))
	schoolID := created.Data.SchoolID
	require.NotEmpty(t, schoolID)

	// Owner A sees exactly one school.
	rec = request(t, h, http.MethodGet, "/api/owner/schools", tokenA, "")
	assert.Equal(t, http.StatusOK, rec.Code)
	var list struct {
		Data []map[string]any `json:"data"`
	}
	require.NoError(t, json.Unmarshal(rec.Body.Bytes(), &list))
	require.Len(t, list.Data, 1)

	// Owner B must NOT see A's school in the list...
	rec = request(t, h, http.MethodGet, "/api/owner/schools", tokenB, "")
	require.NoError(t, json.Unmarshal(rec.Body.Bytes(), &list))
	assert.Empty(t, list.Data, "owner B must not see owner A's school")

	// ...and a direct tampered-ID request must be denied (404, not 200).
	rec = request(t, h, http.MethodDelete, "/api/owner/schools/"+schoolID, tokenB, "")
	assert.Equal(t, http.StatusNotFound, rec.Code, "owner B deleting owner A's school must 404")
}

// Legacy parent accounts can no longer sign in.
func TestParentLoginBlocked(t *testing.T) {
	s, h := newSecurityRouter(t)
	addUser(t, s, "par_1", "school_default", "parent.legacy@test.school", "parent", "Parent@1234")

	_, code := loginToken(t, h, "parent.legacy@test.school", "Parent@1234")
	assert.Equal(t, http.StatusUnauthorized, code, "parent login must be rejected")
}

// Student portal is scoped to the authenticated student's OWN record.
func TestStudentPortalScopedToOwnRecord(t *testing.T) {
	s, h := newSecurityRouter(t)

	// Student A + student record; Student B with a different record.
	now := time.Now()
	s.Lock()
	s.Students = append(s.Students,
		&store.Student{ID: "stu_a", SchoolID: "school_default", UserID: "usr_stu_a", FirstName: "Alice", LastName: "A", AdmissionNo: "ADM-A", ClassID: "cls_1", Section: "A", Status: "active", Guardian: store.Guardian{Name: "Guardian A", Phone: "111", Email: "g.a@test.school"}, CreatedAt: now, UpdatedAt: now},
		&store.Student{ID: "stu_b", SchoolID: "school_default", UserID: "usr_stu_b", FirstName: "Bob", LastName: "B", AdmissionNo: "ADM-B", ClassID: "cls_1", Section: "A", Status: "active", CreatedAt: now, UpdatedAt: now},
	)
	s.Unlock()
	addUser(t, s, "usr_stu_a", "school_default", "student.a@test.school", "student", "Student@1234")
	addUser(t, s, "usr_stu_b", "school_default", "student.b@test.school", "student", "Student@1234")

	tokenA, code := loginToken(t, h, "student.a@test.school", "Student@1234")
	require.Equal(t, http.StatusOK, code)

	// Own info resolves.
	rec := request(t, h, http.MethodGet, "/api/student/info", tokenA, "")
	assert.Equal(t, http.StatusOK, rec.Code)
	var info struct {
		Data struct {
			Students []struct {
				ID string `json:"id"`
			} `json:"students"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(rec.Body.Bytes(), &info))
	require.Len(t, info.Data.Students, 1)
	assert.Equal(t, "stu_a", info.Data.Students[0].ID)

	// IDOR: requesting another student's id must 404.
	rec = request(t, h, http.MethodGet, "/api/student/info?student_id=stu_b", tokenA, "")
	assert.Equal(t, http.StatusNotFound, rec.Code, "student A must not read student B's profile")

	// Portal endpoints answer for the owner of the record.
	for _, path := range []string{
		"/api/student/dashboard/stats",
		"/api/student/attendance",
		"/api/student/results",
		"/api/student/homework",
		"/api/student/announcements",
		"/api/student/fees",
	} {
		rec := request(t, h, http.MethodGet, path, tokenA, "")
		assert.Equalf(t, http.StatusOK, rec.Code, "student GET %s must be 200", path)
	}

	// A non-student role must be rejected from the student portal.
	adminToken, _ := loginToken(t, h, "school@gmail.com", "Test@123")
	rec = request(t, h, http.MethodGet, "/api/student/info", adminToken, "")
	assert.Equal(t, http.StatusForbidden, rec.Code, "admin must be denied the student portal")

	// Students cannot enumerate the school's student directory.
	rec = request(t, h, http.MethodGet, "/api/students", tokenA, "")
	assert.Equal(t, http.StatusForbidden, rec.Code, "student must not list the student directory")
}
