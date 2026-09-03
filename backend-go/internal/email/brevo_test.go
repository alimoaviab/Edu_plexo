package email

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestBrevoClient_SendOTP_Success(t *testing.T) {
	var capturedPayload brevoEmailPayload
	var capturedKey string

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		capturedKey = r.Header.Get("api-key")
		if err := json.NewDecoder(r.Body).Decode(&capturedPayload); err != nil {
			t.Fatalf("failed to decode request body: %v", err)
		}
		w.WriteHeader(http.StatusCreated)
		w.Write([]byte(`{"messageId":"<20260903.test@brevo.com>"}`))
	}))
	defer server.Close()

	client := NewBrevoClient(Config{
		APIKey:        "test-brevo-api-key",
		SenderEmail:   "verify@eduplexo.com",
		SenderName:    "EduPlexo",
		OTPTemplateID: 42,
		IsProduction:  true,
	})
	client.apiURL = server.URL

	err := client.SendOTP(context.Background(), "owner@example.com", "Aisha Khan", "004821", 5)
	if err != nil {
		t.Fatalf("unexpected SendOTP error: %v", err)
	}

	if capturedKey != "test-brevo-api-key" {
		t.Fatalf("expected api-key 'test-brevo-api-key', got %q", capturedKey)
	}
	if len(capturedPayload.To) != 1 || capturedPayload.To[0].Email != "owner@example.com" {
		t.Fatalf("unexpected recipient: %+v", capturedPayload.To)
	}
	if capturedPayload.TemplateID != 42 {
		t.Fatalf("expected TemplateID 42, got %d", capturedPayload.TemplateID)
	}
	if capturedPayload.Params["otp"] != "004821" {
		t.Fatalf("expected OTP '004821', got %v", capturedPayload.Params["otp"])
	}
	if capturedPayload.Params["firstName"] != "Aisha" {
		t.Fatalf("expected firstName 'Aisha', got %v", capturedPayload.Params["firstName"])
	}
}

func TestBrevoClient_SendOTP_DevSimulation(t *testing.T) {
	client := NewBrevoClient(Config{
		APIKey:       "",
		IsProduction: false,
	})

	err := client.SendOTP(context.Background(), "dev@example.com", "Dev User", "123456", 5)
	if err != nil {
		t.Fatalf("expected dev simulation to succeed without error, got: %v", err)
	}
}
