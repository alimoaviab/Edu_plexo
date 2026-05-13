package middleware

import (
	"net/http"
	"strings"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/auth"
	"github.com/eduplexo/backend-go/internal/config"
)

// Authenticator builds the auth middleware bound to the active config.
// Mirrors `authenticateRequest` from old-app/shared/auth/middleware.ts:
//   1. Look for the session cookie first.
//   2. Fall back to the Authorization: Bearer header.
//   3. Verify the JWT against the JWT_SECRET.
//   4. Apply the optional x-academic-year-id header override.
func Authenticator(cfg config.Config) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			token := readToken(r)
			if token == "" {
				api.WriteResult(w, api.Fail("UNAUTHENTICATED", "Authentication required.", 401, nil))
				return
			}

			claims, err := auth.VerifyToken(cfg.JWTSecret, cfg.AppName, token)
			if err != nil {
				api.WriteResult(w, api.Fail("UNAUTHORIZED", err.Error(), 401, nil))
				return
			}

			ctx := auth.ContextFromClaims(claims)
			ctx.IP = clientIP(r)
			ctx.UserAgent = r.Header.Get("user-agent")

			// Allow the client to override the active academic year for this
			// request via the x-academic-year-id header — same behaviour as
			// the Node `authenticateRequest`. The query layer re-validates
			// that the year actually belongs to the caller's tenant.
			if y := strings.TrimSpace(r.Header.Get("x-academic-year-id")); y != "" && y != "undefined" {
				ctx.ActiveAcademicYearID = y
			}

			r = r.WithContext(api.WithContext(r.Context(), ctx))
			next.ServeHTTP(w, r)
		})
	}
}

func readToken(r *http.Request) string {
	if c, err := r.Cookie("session"); err == nil && c.Value != "" {
		return strings.TrimSpace(c.Value)
	}
	authz := r.Header.Get("Authorization")
	if authz == "" {
		return ""
	}
	if strings.HasPrefix(strings.ToLower(authz), "bearer ") {
		return strings.TrimSpace(authz[7:])
	}
	return ""
}

func clientIP(r *http.Request) string {
	if ff := r.Header.Get("x-forwarded-for"); ff != "" {
		parts := strings.Split(ff, ",")
		return strings.TrimSpace(parts[0])
	}
	return r.RemoteAddr
}
