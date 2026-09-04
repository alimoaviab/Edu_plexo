package auth_test

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/eduplexo/backend-go/internal/domain/superadmin"
	"github.com/eduplexo/backend-go/internal/store"
)

func TestSignup_SkipOTP_DirectCreation(t *testing.T) {
	h, memStore, mockEmail := setupTestAuthHandler()

	// Enable SkipOTP in PlatformSettings
	origSettings := superadmin.GetPlatformSettings()
	defer superadmin.SetPlatformSettings(origSettings)

	modifiedSettings := origSettings
	modifiedSettings.SkipOTP = true
	superadmin.SetPlatformSettings(modifiedSettings)

	signupPayload := map[string]any{
		"fullName": "Direct Owner",
		"email":    "direct_owner@example.com",
		"password": "Password123!",
		"phone":    "+923001234567",
		"role":     "owner",
	}
	body, _ := json.Marshal(signupPayload)
	req := httptest.NewRequest("POST", "/api/auth/signup", bytes.NewReader(body))
	w := httptest.NewRecorder()

	h.Signup(w, req)

	resp := w.Result()
	if resp.StatusCode != 201 {
		t.Fatalf("expected 201 Created when SkipOTP is enabled, got %d", resp.StatusCode)
	}

	var res map[string]any
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if res["ok"] != true || res["skipped_otp"] != true {
		t.Fatalf("expected ok:true and skipped_otp:true, got: %v", res)
	}

	data, ok := res["data"].(map[string]any)
	if !ok {
		t.Fatalf("missing data object in response: %v", res)
	}

	if data["token"] == nil || data["token"] == "" {
		t.Fatalf("expected active auth session token in response when SkipOTP is enabled")
	}

	if data["email"] != "direct_owner@example.com" {
		t.Fatalf("expected email 'direct_owner@example.com', got %v", data["email"])
	}

	// Verify NO email was dispatched via Brevo
	if mockEmail.lastSent() != nil {
		t.Fatalf("expected NO email to be dispatched when SkipOTP is enabled, but found: %v", mockEmail.lastSent())
	}

	// Verify user is created directly in Store with active status and owner role
	memStore.RLock()
	defer memStore.RUnlock()
	var foundUser *store.User
	for _, u := range memStore.Users {
		if u.Email == "direct_owner@example.com" {
			foundUser = u
			break
		}
	}

	if foundUser == nil {
		t.Fatalf("expected user to be created in store directly, but not found")
	}
	if foundUser.Status != "active" {
		t.Fatalf("expected user status to be 'active', got '%s'", foundUser.Status)
	}
	if foundUser.Role != "owner" {
		t.Fatalf("expected user role to be 'owner', got '%s'", foundUser.Role)
	}

	// Verify no pending signup was created
	for _, ps := range memStore.PendingSignups {
		if ps.Email == "direct_owner@example.com" {
			t.Fatalf("expected NO pending signup record when SkipOTP is enabled, found one: %v", ps)
		}
	}
}
