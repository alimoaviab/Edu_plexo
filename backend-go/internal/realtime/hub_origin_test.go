package realtime

import (
	"net/http/httptest"
	"testing"
)

func TestHubUpgrader_OriginValidation(t *testing.T) {
	hub := NewHub(nil, []string{"https://app.eduplexo.com", "http://localhost:3000"})

	cases := []struct {
		name   string
		origin string
		want   bool
	}{
		{"no origin (server clients)", "", true},
		{"allowed production origin", "https://app.eduplexo.com", true},
		{"allowed localhost origin", "http://localhost:3000", true},
		{"case-insensitive match", "HTTPS://APP.EDUPLEXO.COM", true},
		{"attacker origin", "https://evil.example.com", false},
		{"similar-looking origin", "https://app.eduplexo.com.evil.example.com", false},
		{"http variant of prod origin not listed", "http://app.eduplexo.com", false},
	}

	for _, tc := range cases {
		req := httptest.NewRequest("GET", "/ws", nil)
		if tc.origin != "" {
			req.Header.Set("Origin", tc.origin)
		}
		if got := hub.upgrader.CheckOrigin(req); got != tc.want {
			t.Errorf("%s: CheckOrigin(%q) = %v, want %v", tc.name, tc.origin, got, tc.want)
		}
	}
}
