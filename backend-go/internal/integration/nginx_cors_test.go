package integration

import (
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"testing"
)

// nginx.conf lives at the repository root under nginx/. The integration
// package is backend-go/internal/integration, so we climb three levels.
func readNginxConf(t *testing.T) string {
	t.Helper()
	path := filepath.Join("..", "..", "..", "nginx", "nginx.conf")
	b, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("read %s: %v", path, err)
	}
	return string(b)
}

// CRT-1 regression: the edge (nginx) must be the single authoritative CORS
// layer. The Go backend's chi CORS headers must be hidden at the proxy and
// re-emitted exactly once, otherwise browsers reject responses with
// "multiple Access-Control-Allow-Origin values". This is a structural test —
// it cannot replace a live `nginx -t` + header smoke test, but it pins the
// config invariants so a duplicate CORS regression cannot be reintroduced.
func TestNginxCORS_SingleAuthoritativeLayer(t *testing.T) {
	src := readNginxConf(t)

	corsHeaders := []string{
		"Access-Control-Allow-Origin",
		"Access-Control-Allow-Credentials",
		"Access-Control-Allow-Methods",
		"Access-Control-Allow-Headers",
		"Access-Control-Expose-Headers",
		"Access-Control-Max-Age",
	}

	for _, h := range corsHeaders {
		adds := strings.Count(src, "add_header "+h)
		hides := strings.Count(src, "proxy_hide_header "+h)
		if adds != 1 {
			t.Errorf("%s: expected exactly one add_header, found %d", h, adds)
		}
		if hides != 1 {
			t.Errorf("%s: expected exactly one proxy_hide_header (upstream headers must be stripped at the edge), found %d", h, hides)
		}
	}

	// Every response must carry the nginx-emitted set, including errors.
	if !strings.Contains(src, "add_header Access-Control-Allow-Origin $cors_origin always;") {
		t.Error("expected ACAO add_header to use the `always` flag so nginx-generated 429/502/503/504 responses carry CORS headers")
	}
}

// The nginx origin map must stay in sync with the origins the backend appends
// unconditionally (config.go) plus the dev-server ports the backend allows.
func TestNginxCORS_AllowlistMatchesBackend(t *testing.T) {
	src := readNginxConf(t)

	// Origins the backend always allows (internal/config/config.go appends
	// these to ALLOWED_ORIGINS unconditionally), plus the dev-server ports the
	// backend allowlists by default. Map lines align values with padding, so
	// match on the quoted key/value pair ignoring whitespace.
	for _, origin := range []string{
		"https://app.eduplexo.com",
		"https://www.eduplexo.com",
		"http://localhost:3000",
		"http://localhost:3001",
		"http://localhost:3002",
		"http://localhost:3003",
		"http://localhost:5173",
	} {
		pat := regexp.MustCompile(`"` + regexp.QuoteMeta(origin) + `"\s+"` + regexp.QuoteMeta(origin) + `"`)
		if !pat.MatchString(src) {
			t.Errorf("nginx $cors_origin map is missing backend-allowed origin %s", origin)
		}
	}

	// The map must reject unknown origins (default empty => header treated as
	// absent by browsers).
	if !strings.Contains(src, "default \"\";") {
		t.Error("expected `default \"\";` in the $cors_origin map so non-allowlisted origins receive no ACAO value")
	}
}
