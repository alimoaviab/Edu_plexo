package email

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
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
		ReplyToEmail:  "support@eduplexo.com",
		ReplyToName:   "EduPlexo Support",
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
	if capturedPayload.Sender == nil || capturedPayload.Sender.Email != "verify@eduplexo.com" || capturedPayload.Sender.Name != "EduPlexo" {
		t.Fatalf("unexpected sender: %+v", capturedPayload.Sender)
	}
	if capturedPayload.ReplyTo == nil || capturedPayload.ReplyTo.Email != "support@eduplexo.com" || capturedPayload.ReplyTo.Name != "EduPlexo Support" {
		t.Fatalf("unexpected reply-to: %+v", capturedPayload.ReplyTo)
	}
	if capturedPayload.Subject != "Your EduPlexo verification code" {
		t.Fatalf("unexpected subject: %q", capturedPayload.Subject)
	}

	// Branding and logo verification
	if !strings.Contains(capturedPayload.HTMLContent, "https://app.eduplexo.com/logo.jpeg") {
		t.Fatal("expected HTMLContent to contain the official EduPlexo logo asset URL")
	}
	if !strings.Contains(capturedPayload.HTMLContent, `alt="EduPlexo"`) {
		t.Fatal("expected HTMLContent to contain alt text 'EduPlexo'")
	}

	// Verify no generic avatar placeholder remains
	if strings.Contains(capturedPayload.HTMLContent, `border-radius: 12px; text-align: center; vertical-align: middle;">`) {
		t.Fatal("detected obsolete generic 'E' letter avatar in HTMLContent")
	}

	// Verify primary heading and copy
	if !strings.Contains(capturedPayload.HTMLContent, "Verify your email") {
		t.Fatal("expected primary heading 'Verify your email'")
	}
	if !strings.Contains(capturedPayload.HTMLContent, "Hello Aisha,") {
		t.Fatalf("expected 'Hello Aisha,' in HTMLContent, but was not found")
	}
	if !strings.Contains(capturedPayload.HTMLContent, "004821") {
		t.Fatal("expected OTP '004821' in HTMLContent")
	}
	if !strings.Contains(capturedPayload.HTMLContent, "This code expires in 5 minutes.") {
		t.Fatal("expected expiry copy in HTMLContent")
	}

	// Verify plain text fallback
	if !strings.Contains(capturedPayload.TextContent, "Verify your email") {
		t.Fatal("expected TextContent to contain 'Verify your email'")
	}
	if !strings.Contains(capturedPayload.TextContent, "004821") {
		t.Fatal("expected TextContent to contain OTP")
	}
	if !strings.Contains(capturedPayload.TextContent, "For your security, never share this code with anyone.") {
		t.Fatal("expected security notice in TextContent")
	}

	if capturedPayload.Params["otp"] != "004821" {
		t.Fatalf("expected OTP '004821', got %v", capturedPayload.Params["otp"])
	}
	if capturedPayload.Params["firstName"] != "Aisha" {
		t.Fatalf("expected firstName 'Aisha', got %v", capturedPayload.Params["firstName"])
	}
	if capturedPayload.Params["name"] != "Aisha" {
		t.Fatalf("expected name 'Aisha', got %v", capturedPayload.Params["name"])
	}
}

func TestBrevoClient_SendOTP_FallbackSalutationWhenNameEmpty(t *testing.T) {
	var capturedPayload brevoEmailPayload

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_ = json.NewDecoder(r.Body).Decode(&capturedPayload)
		w.WriteHeader(http.StatusCreated)
		w.Write([]byte(`{"messageId":"<20260903.test@brevo.com>"}`))
	}))
	defer server.Close()

	client := NewBrevoClient(Config{
		APIKey:       "test-brevo-api-key",
		IsProduction: true,
	})
	client.apiURL = server.URL

	err := client.SendOTP(context.Background(), "unknown@example.com", "", "998877", 5)
	if err != nil {
		t.Fatalf("unexpected SendOTP error: %v", err)
	}

	if !strings.Contains(capturedPayload.HTMLContent, "Hello there,") {
		t.Fatalf("expected fallback salutation 'Hello there,', got HTML: %s", capturedPayload.HTMLContent)
	}
	if !strings.Contains(capturedPayload.TextContent, "Hello there,") {
		t.Fatalf("expected fallback salutation in TextContent: %s", capturedPayload.TextContent)
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
