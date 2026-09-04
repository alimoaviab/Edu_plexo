package api

import (
	"net"
	"net/http"
	"strings"
)

// ClientIP returns the best-effort client IP used for rate limiting, audit
// logs, and abuse protection.
//
// The application is deployed behind a single nginx reverse proxy that sets
// X-Forwarded-For with $proxy_add_x_forwarded_for, i.e. any client-supplied
// header followed by the real remote address observed by nginx. The FIRST
// entry of X-Forwarded-For is therefore client-controlled and must never be
// trusted — an attacker can rotate it to bypass per-IP rate limits or forge
// audit attribution. The LAST entry is the address nginx actually saw.
//
// When no X-Forwarded-For is present (direct connections, e.g. local dev),
// RemoteAddr is authoritative.
func ClientIP(r *http.Request) string {
	if r == nil {
		return ""
	}
	if xff := strings.TrimSpace(r.Header.Get("X-Forwarded-For")); xff != "" {
		parts := strings.Split(xff, ",")
		for i := len(parts) - 1; i >= 0; i-- {
			if v := strings.TrimSpace(parts[i]); v != "" {
				return v
			}
		}
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return strings.TrimSpace(r.RemoteAddr)
	}
	return host
}
