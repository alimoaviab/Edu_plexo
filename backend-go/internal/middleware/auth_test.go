package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/eduplexo/backend-go/internal/auth"
	"github.com/eduplexo/backend-go/internal/config"
	"github.com/eduplexo/backend-go/internal/session"
	"github.com/eduplexo/backend-go/internal/store"
)

const testSecret = "unit-test-jwt-secret-0123456789abcdef"

func authTestConfig() config.Config {
	return config.Config{JWTSecret: testSecret, AppName: "school"}
}

func testUser(id, role, status string) *store.User {
	return &store.User{
		ID:       id,
		SchoolID: "school_1",
		Email:    id + "@test.school",
		Role:     role,
		Status:   status,
	}
}

// doAuthedRequest runs the real Authenticator middleware against next with the
// given token transport (header or cookie or query) and returns the status.
func doAuthedRequest(t *testing.T, s *store.MemStore, rev session.Revoker, claims auth.Claims, applyAuth func(*http.Request)) int {
	t.Helper()
	token, err := auth.SignToken(testSecret, "school", claims, time.Hour)
	if err != nil {
		t.Fatalf("sign token: %v", err)
	}

	handler := Authenticator(authTestConfig(), s, rev)(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	}))

	req := httptest.NewRequest("GET", "/api/ping", nil)
	applyAuth(req)
	req.Header.Set("Authorization", "Bearer "+token)

	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	return rec.Code
}

func bearerClaims(role string) auth.Claims {
	c := auth.Claims{
		SchoolID:  "school_1",
		Role:      role,
		SessionID: "sess_test_1",
	}
	c.Subject = "user_1"
	return c
}

func TestAuthenticator_ValidTokenPasses(t *testing.T) {
	s := &store.MemStore{Users: []*store.User{testUser("user_1", "admin", "active")}}
	code := doAuthedRequest(t, s, session.New(nil), bearerClaims("admin"), func(*http.Request) {})
	if code != http.StatusOK {
		t.Fatalf("expected 200 for valid token, got %d", code)
	}
}

func TestAuthenticator_RevokedSessionRejected(t *testing.T) {
	s := &store.MemStore{Users: []*store.User{testUser("user_1", "admin", "active")}}
	rev := session.New(nil)
	rev.Revoke("sess_test_1")

	code := doAuthedRequest(t, s, rev, bearerClaims("admin"), func(*http.Request) {})
	if code != http.StatusUnauthorized {
		t.Fatalf("expected 401 after logout revocation, got %d", code)
	}
}

func TestAuthenticator_DemotedRoleRejected(t *testing.T) {
	// Token was issued while the user was an admin; the account is now a
	// teacher — the old privileged token must stop working immediately.
	s := &store.MemStore{Users: []*store.User{testUser("user_1", "teacher", "active")}}
	code := doAuthedRequest(t, s, session.New(nil), bearerClaims("admin"), func(*http.Request) {})
	if code != http.StatusUnauthorized {
		t.Fatalf("expected 401 for stale admin token after demotion, got %d", code)
	}
}

func TestAuthenticator_DeletedUserRejected(t *testing.T) {
	// Account was removed after issuance.
	s := &store.MemStore{Users: []*store.User{}}
	code := doAuthedRequest(t, s, session.New(nil), bearerClaims("admin"), func(*http.Request) {})
	if code != http.StatusUnauthorized {
		t.Fatalf("expected 401 for deleted user token, got %d", code)
	}
}

func TestAuthenticator_SuspendedUserBlocked(t *testing.T) {
	s := &store.MemStore{Users: []*store.User{testUser("user_1", "admin", "suspended")}}
	code := doAuthedRequest(t, s, session.New(nil), bearerClaims("admin"), func(*http.Request) {})
	if code != http.StatusForbidden {
		t.Fatalf("expected 403 for suspended user, got %d", code)
	}
}

func TestAuthenticator_LockedUserBlocked(t *testing.T) {
	s := &store.MemStore{Users: []*store.User{testUser("user_1", "admin", "locked")}}
	code := doAuthedRequest(t, s, session.New(nil), bearerClaims("admin"), func(*http.Request) {})
	if code != http.StatusForbidden {
		t.Fatalf("expected 403 for locked user, got %d", code)
	}
}

func TestAuthenticator_FullJWTInQueryRejectedByDefault(t *testing.T) {
	// Long-lived session JWTs must never ride in URLs. With ALLOW_WS_TOKEN_QUERY
	// off (the default, and the only permitted production value), ?token= on
	// /ws is rejected even though the token itself is valid.
	s := &store.MemStore{Users: []*store.User{testUser("user_1", "admin", "active")}}

	token, err := auth.SignToken(testSecret, "school", bearerClaims("admin"), time.Hour)
	if err != nil {
		t.Fatal(err)
	}

	handler := Authenticator(authTestConfig(), s, session.New(nil))(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	req := httptest.NewRequest("GET", "/ws?token="+token, nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("expected full JWT in /ws query to be rejected by default, got %d", rec.Code)
	}
}

func TestAuthenticator_FullJWTInQueryAcceptedWhenOptIn(t *testing.T) {
	// ALLOW_WS_TOKEN_QUERY=true is the non-production dev opt-in.
	s := &store.MemStore{Users: []*store.User{testUser("user_1", "admin", "active")}}

	cfg := authTestConfig()
	cfg.AllowWSTokenQuery = true

	token, err := auth.SignToken(testSecret, "school", bearerClaims("admin"), time.Hour)
	if err != nil {
		t.Fatal(err)
	}

	handler := Authenticator(cfg, s, session.New(nil))(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	req := httptest.NewRequest("GET", "/ws?token="+token, nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected full JWT in /ws query to be accepted when opted in, got %d", rec.Code)
	}
}

func TestAuthenticator_WSTicketInQueryAccepted(t *testing.T) {
	// The production realtime path: a SHORT-LIVED ws-scoped ticket rides in the
	// /ws URL with ALLOW_WS_TOKEN_QUERY off (the flag governs full JWTs only).
	s := &store.MemStore{Users: []*store.User{testUser("user_1", "admin", "active")}}

	wsClaims := bearerClaims("admin")
	wsClaims.Scope = "ws"
	ticket, err := auth.SignToken(testSecret, "school", wsClaims, time.Minute)
	if err != nil {
		t.Fatal(err)
	}

	handler := Authenticator(authTestConfig(), s, session.New(nil))(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	req := httptest.NewRequest("GET", "/ws?token="+ticket, nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected ws-scoped ticket on /ws to be accepted, got %d", rec.Code)
	}

	// The same ticket must NOT work on a regular API route.
	req2 := httptest.NewRequest("GET", "/api/students?token="+ticket, nil)
	rec2 := httptest.NewRecorder()
	handler.ServeHTTP(rec2, req2)
	if rec2.Code != http.StatusUnauthorized {
		t.Fatalf("expected ws-scoped ticket on API route to be rejected, got %d", rec2.Code)
	}
}

func TestAuthenticator_WSTicketMisuseRejectedOnAPI(t *testing.T) {
	// Even via the Authorization header, a ws-scoped ticket must only be
	// honored on the /ws handshake path.
	s := &store.MemStore{Users: []*store.User{testUser("user_1", "admin", "active")}}

	wsClaims := bearerClaims("admin")
	wsClaims.Scope = "ws"
	token, err := auth.SignToken(testSecret, "school", wsClaims, time.Minute)
	if err != nil {
		t.Fatal(err)
	}

	handler := Authenticator(authTestConfig(), s, session.New(nil))(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	req := httptest.NewRequest("GET", "/api/students", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("expected ws-scoped ticket on API route to be rejected, got %d", rec.Code)
	}
}

func TestAuthenticator_QueryTokenRejectedOnAPI(t *testing.T) {
	// Query-string tokens must never be honored on regular API routes (they
	// would leak into access logs, referrers, and history).
	s := &store.MemStore{Users: []*store.User{testUser("user_1", "admin", "active")}}

	token, err := auth.SignToken(testSecret, "school", bearerClaims("admin"), time.Hour)
	if err != nil {
		t.Fatal(err)
	}

	handler := Authenticator(authTestConfig(), s, session.New(nil))(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	req := httptest.NewRequest("GET", "/api/students?token="+token, nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("expected query token on API route to be rejected, got %d", rec.Code)
	}
}
