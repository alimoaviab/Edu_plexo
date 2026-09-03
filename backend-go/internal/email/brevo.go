package email

import (
	"bytes"
	"context"
	_ "embed"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"strconv"
	"strings"
	"time"
)

//go:embed template.html
var defaultOTPEmailHTML string

// Client defines the contract for sending transactional emails.
type Client interface {
	SendOTP(ctx context.Context, toEmail, toName, otp string, expiryMinutes int) error
}

// Config holds settings for connecting to the Brevo transactional email API.
type Config struct {
	APIKey          string
	SenderEmail     string
	SenderName      string
	ReplyToEmail    string
	ReplyToName     string
	OTPTemplateID   int64
	IsProduction    bool
}

// BrevoClient implements Client using Brevo's v3 SMTP email API.
type BrevoClient struct {
	cfg        Config
	httpClient *http.Client
	apiURL     string
}

// NewBrevoClient returns a new Brevo email client.
func NewBrevoClient(cfg Config) *BrevoClient {
	if cfg.SenderName == "" {
		cfg.SenderName = "EduPlexo"
	}
	return &BrevoClient{
		cfg: cfg,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
		apiURL: "https://api.brevo.com/v3/smtp/email",
	}
}

type brevoRecipient struct {
	Name  string `json:"name,omitempty"`
	Email string `json:"email"`
}

type brevoSender struct {
	Name  string `json:"name,omitempty"`
	Email string `json:"email"`
}

type brevoEmailPayload struct {
	Sender      *brevoSender      `json:"sender,omitempty"`
	To          []brevoRecipient  `json:"to"`
	ReplyTo     *brevoSender      `json:"replyTo,omitempty"`
	Subject     string            `json:"subject,omitempty"`
	HTMLContent string            `json:"htmlContent,omitempty"`
	TemplateID  int64             `json:"templateId,omitempty"`
	Params      map[string]any    `json:"params,omitempty"`
}

// SendOTP delivers a 6-digit OTP code to the recipient via Brevo.
func (b *BrevoClient) SendOTP(ctx context.Context, toEmail, toName, otp string, expiryMinutes int) error {
	toEmail = strings.TrimSpace(strings.ToLower(toEmail))
	if toEmail == "" {
		return errors.New("recipient email is required")
	}
	if otp == "" {
		return errors.New("OTP code is required")
	}
	if expiryMinutes <= 0 {
		expiryMinutes = 5
	}

	firstName := strings.TrimSpace(toName)
	if firstName == "" {
		firstName = "there"
	} else {
		// Extract first name if full name provided
		parts := strings.Fields(firstName)
		if len(parts) > 0 {
			firstName = parts[0]
		}
	}

	// In development environment without API key configured, simulate delivery safely
	if strings.TrimSpace(b.cfg.APIKey) == "" {
		if b.cfg.IsProduction {
			return errors.New("BREVO_API_KEY is not configured in production")
		}
		slog.Info("DEV EMAIL SIMULATION: Brevo API key is not set; simulated email delivery",
			"to", toEmail,
			"firstName", firstName,
			"expiryMinutes", expiryMinutes,
			"otp", otp,
		)
		return nil
	}

	// Prepare dynamic template parameters
	params := map[string]any{
		"firstName":     firstName,
		"otp":           otp,
		"expiryMinutes": strconv.Itoa(expiryMinutes),
	}

	// Render fallback / inline HTML content
	renderedHTML := defaultOTPEmailHTML
	renderedHTML = strings.ReplaceAll(renderedHTML, "{{firstName}}", firstName)
	renderedHTML = strings.ReplaceAll(renderedHTML, "{{otp}}", otp)
	renderedHTML = strings.ReplaceAll(renderedHTML, "{{expiryMinutes}}", strconv.Itoa(expiryMinutes))

	payload := brevoEmailPayload{
		Sender: &brevoSender{
			Name:  b.cfg.SenderName,
			Email: b.cfg.SenderEmail,
		},
		To: []brevoRecipient{
			{
				Name:  toName,
				Email: toEmail,
			},
		},
		Subject:     "Your EduPlexo verification code",
		HTMLContent: renderedHTML,
		Params:      params,
	}

	if b.cfg.OTPTemplateID > 0 {
		payload.TemplateID = b.cfg.OTPTemplateID
	}

	if b.cfg.ReplyToEmail != "" {
		payload.ReplyTo = &brevoSender{
			Name:  b.cfg.ReplyToName,
			Email: b.cfg.ReplyToEmail,
		}
	}

	bodyBytes, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal Brevo payload: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, b.apiURL, bytes.NewReader(bodyBytes))
	if err != nil {
		return fmt.Errorf("failed to create Brevo HTTP request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("api-key", b.cfg.APIKey)

	resp, err := b.httpClient.Do(req)
	if err != nil {
		slog.Error("Brevo HTTP request failed", "to", toEmail, "err", err)
		return fmt.Errorf("transactional email service unreachable: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		respBody, _ := io.ReadAll(resp.Body)
		slog.Error("Brevo rejected email delivery",
			"status", resp.StatusCode,
			"to", toEmail,
			"response", string(respBody),
		)
		return fmt.Errorf("email delivery failed with status %d", resp.StatusCode)
	}

	slog.Info("Brevo transactional OTP email dispatched successfully",
		"to", toEmail,
		"status", resp.StatusCode,
	)
	return nil
}
