package api

import (
	"net/http/httptest"
	"testing"
)

func TestClientIP_UsesLastXFFEntry(t *testing.T) {
	req := httptest.NewRequest("GET", "/", nil)
	req.RemoteAddr = "203.0.113.9:4444"
	// Attacker-supplied prefix + the address nginx observed (appended last).
	req.Header.Set("X-Forwarded-For", "6.6.6.6, 203.0.113.9")

	if got := ClientIP(req); got != "203.0.113.9" {
		t.Fatalf("expected trusted (last) XFF entry, got %q", got)
	}
}

func TestClientIP_SpoofedFirstEntryCannotBypass(t *testing.T) {
	req := httptest.NewRequest("GET", "/", nil)
	req.RemoteAddr = "203.0.113.9:4444"

	// Rotating the client-controlled prefix must NOT change the resolved IP.
	for _, prefix := range []string{"1.1.1.1", "2.2.2.2", "3.3.3.3, 4.4.4.4"} {
		req.Header.Set("X-Forwarded-For", prefix+", 203.0.113.9")
		if got := ClientIP(req); got != "203.0.113.9" {
			t.Fatalf("spoofed prefix %q changed resolved IP to %q", prefix, got)
		}
	}
}

func TestClientIP_NoXFFUsesRemoteAddr(t *testing.T) {
	req := httptest.NewRequest("GET", "/", nil)
	req.RemoteAddr = "203.0.113.9:4444"
	if got := ClientIP(req); got != "203.0.113.9" {
		t.Fatalf("expected remote addr host, got %q", got)
	}
}

func TestClientIP_TrailingCommaAndWhitespace(t *testing.T) {
	req := httptest.NewRequest("GET", "/", nil)
	req.RemoteAddr = "203.0.113.9:4444"
	req.Header.Set("X-Forwarded-For", "6.6.6.6, 203.0.113.9, ")
	if got := ClientIP(req); got != "203.0.113.9" {
		t.Fatalf("expected last non-empty entry, got %q", got)
	}
}
