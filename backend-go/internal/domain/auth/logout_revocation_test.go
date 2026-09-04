package auth_test

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/eduplexo/backend-go/internal/domain/auth"

	authpkg "github.com/eduplexo/backend-go/internal/auth"
	"github.com/eduplexo/backend-go/internal/config"
	"github.com/eduplexo/backend-go/internal/session"
	"github.com/eduplexo/backend-go/internal/store"
)

func TestLogout_RevokesServerSideSession(t *testing.T) {
	cfg := config.Config{JWTSecret: "logout-test-secret-0123456789abcdef", AppName: "school"}
	memStore := store.New()
	rev := session.New(nil)
	h := auth.NewWithPersist(cfg, memStore, func(string, any) {})
	h.SetRevoker(rev)

	claims := authpkg.Claims{
		SchoolID:  "school_1",
		Role:      "admin",
		SessionID: "sess_logout_1",
	}
	claims.Subject = "user_1"
	token, err := authpkg.SignToken(cfg.JWTSecret, cfg.AppName, claims, time.Hour)
	if err != nil {
		t.Fatal(err)
	}

	if rev.Revoked("sess_logout_1") {
		t.Fatal("session must start valid")
	}

	req := httptest.NewRequest("POST", "/api/auth/logout", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	rec := httptest.NewRecorder()
	h.Logout(rec, req)

	if rec.Result().StatusCode != http.StatusOK {
		t.Fatalf("logout expected 200, got %d", rec.Result().StatusCode)
	}
	if !rev.Revoked("sess_logout_1") {
		t.Fatal("logout must revoke the session server-side")
	}
}

func TestLogout_NoTokenStillClearsCookie(t *testing.T) {
	cfg := config.Config{JWTSecret: "logout-test-secret-0123456789abcdef", AppName: "school"}
	h := auth.NewWithPersist(cfg, store.New(), func(string, any) {})

	req := httptest.NewRequest("POST", "/api/auth/logout", nil)
	rec := httptest.NewRecorder()
	h.Logout(rec, req)

	if rec.Result().StatusCode != http.StatusOK {
		t.Fatalf("logout expected 200, got %d", rec.Result().StatusCode)
	}
	setCookies := rec.Result().Cookies()
	if len(setCookies) == 0 || setCookies[0].MaxAge >= 0 {
		t.Fatal("expected an expiring Set-Cookie clearing the session")
	}
}
