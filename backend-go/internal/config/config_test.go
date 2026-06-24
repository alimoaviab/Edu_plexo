package config

import (
	"strings"
	"testing"
)

func setProductionBaseEnv(t *testing.T) {
	t.Helper()
	t.Setenv("APP_ENV", "production")
	t.Setenv("PORT", "8080")
	t.Setenv("JWT_SECRET", "test-production-jwt-secret-at-least-32-bytes")
	t.Setenv("DATABASE_URL", "postgres://user:pass@db:5432/app?sslmode=require")
	t.Setenv("ALLOWED_ORIGINS", "https://app.eduplexo.com,https://admin.eduplexo.com")
	t.Setenv("COOKIE_SECURE", "true")
	t.Setenv("GEMINI_API_KEY", "test-gemini-key")
	t.Setenv("ANTHROPIC_API_KEY", "test-anthropic-key")
}

func TestLoadProductionRequiresJWTSecret(t *testing.T) {
	setProductionBaseEnv(t)
	t.Setenv("JWT_SECRET", "")

	_, err := Load()
	if err == nil || !strings.Contains(err.Error(), "JWT_SECRET") {
		t.Fatalf("expected missing JWT_SECRET error, got %v", err)
	}
}

func TestLoadProductionRequiresSecureCookie(t *testing.T) {
	setProductionBaseEnv(t)
	t.Setenv("COOKIE_SECURE", "false")

	_, err := Load()
	if err == nil || !strings.Contains(err.Error(), "COOKIE_SECURE=true") {
		t.Fatalf("expected COOKIE_SECURE error, got %v", err)
	}
}

func TestLoadProductionRejectsInsecureOrigins(t *testing.T) {
	setProductionBaseEnv(t)
	t.Setenv("ALLOWED_ORIGINS", "https://app.eduplexo.com,http://localhost:3000")

	_, err := Load()
	if err == nil || !strings.Contains(err.Error(), "insecure origin") {
		t.Fatalf("expected insecure origin error, got %v", err)
	}
}

func TestLoadProductionAcceptsSecureConfig(t *testing.T) {
	setProductionBaseEnv(t)

	cfg, err := Load()
	if err != nil {
		t.Fatalf("expected secure production config to load, got %v", err)
	}
	if !cfg.IsProduction() {
		t.Fatal("expected production environment")
	}
	if cfg.JWTSecret == "dev-only-jwt-secret-change-me" {
		t.Fatal("production config must not use development JWT fallback")
	}
}

func TestLoadDevelopmentUsesLocalFallback(t *testing.T) {
	t.Setenv("APP_ENV", "development")
	t.Setenv("JWT_SECRET", "")
	t.Setenv("DATABASE_URL", "")
	t.Setenv("ALLOWED_ORIGINS", "")
	t.Setenv("COOKIE_SECURE", "false")
	t.Setenv("GEMINI_API_KEY", "")
	t.Setenv("ANTHROPIC_API_KEY", "")

	cfg, err := Load()
	if err != nil {
		t.Fatalf("expected development config to load, got %v", err)
	}
	if cfg.JWTSecret != "dev-only-jwt-secret-change-me" {
		t.Fatalf("expected development JWT fallback, got %q", cfg.JWTSecret)
	}
}
