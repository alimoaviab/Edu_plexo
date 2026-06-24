package auth_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"github.com/eduplexo/backend-go/internal/config"
	"github.com/eduplexo/backend-go/internal/domain/auth"
	"github.com/eduplexo/backend-go/internal/store"
	authpkg "github.com/eduplexo/backend-go/internal/auth"
)

func TestLogin_Success(t *testing.T) {
	cfg := config.Config{
		JWTSecret:    "secret",
		AppName:      "eduplexo",
		CookieSecure: false,
	}

	memStore := store.New()

	// Seed user
	hash, _ := authpkg.HashPassword("Test@123")
	user := store.User{
		ID:           "usr_123",
		Email:        "school@gmail.com",
		PasswordHash: hash,
		Role:         "admin",
		Status:       "active",
		SchoolID:     "SCH123",
	}
	memStore.Users = append(memStore.Users, &user)

	// We pass a dummy save function since it's just unit tests for memory
	h := auth.NewWithPersist(cfg, memStore, func(string, any) {})

	body := map[string]any{
		"email":      "school@gmail.com",
		"password":   "Test@123",
		"role":       "admin",
		"rememberMe": true,
	}
	b, _ := json.Marshal(body)
	req := httptest.NewRequest("POST", "/api/auth/login", bytes.NewReader(b))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	h.Login(w, req)

	res := w.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		t.Errorf("expected 200 OK, got %d", res.StatusCode)
	}

	cookies := res.Cookies()
	var sessionCookie *http.Cookie
	for _, c := range cookies {
		if c.Name == "session" {
			sessionCookie = c
		}
	}

	if sessionCookie == nil {
		t.Fatal("expected session cookie to be set")
	}

	// Because rememberMe is true, max age should be 30 days
	if sessionCookie.MaxAge != 60*60*24*30 {
		t.Errorf("expected MaxAge to be 30 days, got %d", sessionCookie.MaxAge)
	}
}

func TestLogin_LockedAccount(t *testing.T) {
	cfg := config.Config{
		JWTSecret:    "secret",
		AppName:      "eduplexo",
		CookieSecure: false,
	}

	memStore := store.New()

	// Seed user
	hash, _ := authpkg.HashPassword("Test@123")
	user := store.User{
		ID:           "usr_123",
		Email:        "locked@gmail.com",
		PasswordHash: hash,
		Role:         "admin",
		Status:       "locked",
		SchoolID:     "SCH123",
	}
	memStore.Users = append(memStore.Users, &user)

	h := auth.NewWithPersist(cfg, memStore, func(string, any) {})

	body := map[string]any{
		"email":    "locked@gmail.com",
		"password": "Test@123",
		"role":     "admin",
	}
	b, _ := json.Marshal(body)
	req := httptest.NewRequest("POST", "/api/auth/login", bytes.NewReader(b))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	h.Login(w, req)

	res := w.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusForbidden {
		t.Errorf("expected 403 Forbidden, got %d", res.StatusCode)
	}
}
