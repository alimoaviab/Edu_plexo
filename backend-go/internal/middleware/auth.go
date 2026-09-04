package middleware

import (
	"net/http"
	"strings"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/auth"
	"github.com/eduplexo/backend-go/internal/config"
	"github.com/eduplexo/backend-go/internal/session"
	"github.com/eduplexo/backend-go/internal/store"
)

// Authenticator builds the auth middleware bound to the active config.
// Mirrors `authenticateRequest` from old-app/shared/auth/middleware.ts:
//  1. Look for the session cookie first.
//  2. Fall back to the Authorization: Bearer header.
//  3. Verify the JWT against the JWT_SECRET.
//  4. Apply the optional x-academic-year-id header override.
//
// revoker is the server-side session registry used to reject tokens whose
// session was revoked (logout). When nil, revocation checks are skipped.
func Authenticator(cfg config.Config, s *store.MemStore, revoker session.Revoker) func(http.Handler) http.Handler {
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

			// Reject tokens whose session was revoked server-side (logout). A
			// logged-out token must not remain usable just because a copy is
			// still held in localStorage/a cookie on some device.
			if revoker != nil && revoker.Revoked(claims.SessionID) {
				api.WriteResult(w, api.Fail("UNAUTHORIZED", "Your session has ended. Please sign in again.", 401, nil))
				return
			}

			// Re-validate the account against the current store on every request.
			// The JWT is long-lived, so role/permission or status changes made
			// after issuance (demotion, deletion, suspension) must take effect
			// immediately instead of lingering until token expiry.
			//
			// We try the in-memory lookup index first (O(1) map). If the index
			// hasn't been built yet, or the user/school was just inserted and
			// the periodic rebuild hasn't fired, we fall back to the original
			// slice scan so behaviour is identical to before — a stale index
			// can never make auth incorrect.
			matchedByID := false
			blocked := false
			actualRole := ""

			if u := s.LookupUser(ctx.UserID, ctx.ActorEmail); u != nil && u.ID == ctx.UserID {
				matchedByID = true
				actualRole = u.Role
				if u.Status == "suspended" || u.Status == "locked" {
					blocked = true
				}
			}
			if !matchedByID {
				s.RLock()
				for _, u := range s.Users {
					if u.ID == ctx.UserID {
						matchedByID = true
						actualRole = u.Role
						if u.Status == "suspended" || u.Status == "locked" {
							blocked = true
						}
						break
					}
				}
				s.RUnlock()
			}

			// The account no longer exists — the token must not keep working.
			if !matchedByID {
				api.WriteResult(w, api.Fail("UNAUTHORIZED", "Your session is no longer valid. Please sign in again.", 401, nil))
				return
			}

			// Account demoted/role changed after issuance — force a fresh login
			// so stale privileged claims can never outlive the demotion.
			if actualRole != "" && actualRole != ctx.Role {
				api.WriteResult(w, api.Fail("UNAUTHORIZED", "Your session is no longer valid. Please sign in again.", 401, nil))
				return
			}

			isSuspended := blocked

			// If the account is active, check if their school is suspended.
			if !isSuspended && ctx.SchoolID != "system" {
				if sch := s.LookupSchool(ctx.SchoolID); sch != nil {
					if sch.Status == "suspended" || sch.Status == "expired" {
						isSuspended = true
					}
				} else {
					s.RLock()
					for _, sch := range s.Schools {
						if sch.SchoolID == ctx.SchoolID {
							if sch.Status == "suspended" || sch.Status == "expired" {
								isSuspended = true
							}
							break
						}
					}
					s.RUnlock()
				}
			}

			if isSuspended {
				api.WriteResult(w, api.Fail("FORBIDDEN", "Your account or school is currently suspended. Please contact support.", 403, nil))
				return
			}

			ctx.IP = clientIP(r)
			ctx.UserAgent = r.Header.Get("user-agent")

			// Allow the client to override the active academic year for this
			// request via the x-academic-year-id header — same behaviour as
			// the Node `authenticateRequest`. The query layer re-validates
			// that the year actually belongs to the caller's tenant.
			if y := strings.TrimSpace(r.Header.Get("x-academic-year-id")); y != "" && y != "undefined" {
				ctx.ActiveAcademicYearID = y
			}

			// Support global school context switching for Owner and Super Admin.
			if sch := strings.TrimSpace(r.Header.Get("x-school-id")); sch != "" && sch != "undefined" && sch != "null" {
				if ctx.Role == "super_admin" || sch == "system" || sch == "__global__" {
					ctx.SchoolID = sch
				} else if ctx.Role == "owner" {
					s.RLock()
					owned := false
					for _, os := range s.OwnerSchools {
						if os.OwnerUserID == ctx.UserID && os.SchoolID == sch {
							owned = true
							break
						}
					}
					if !owned {
						for _, sc := range s.Schools {
							if sc.SchoolID == sch && (sc.OwnerEmail == ctx.ActorEmail || sc.OwnerUserID == ctx.UserID) {
								owned = true
								break
							}
						}
					}
					s.RUnlock()

					if owned {
						ctx.SchoolID = sch
					} else {
						api.WriteResult(w, api.Fail("FORBIDDEN", "You do not have access to this school.", 403, nil))
						return
					}
				}
			}

			// Support global branch/campus context switching
			branch := strings.TrimSpace(r.Header.Get("x-branch-id"))
			if branch == "" {
				branch = strings.TrimSpace(r.Header.Get("x-campus-id"))
			}
			if branch != "" && branch != "undefined" && branch != "all" {
				ctx.CampusID = branch
			}
			r = r.WithContext(api.WithContext(r.Context(), ctx))
			next.ServeHTTP(w, r)
		})
	}
}

func readToken(r *http.Request) string {
	authz := r.Header.Get("Authorization")
	if authz != "" && strings.HasPrefix(strings.ToLower(authz), "bearer ") {
		token := strings.TrimSpace(authz[7:])
		if token != "" {
			return token
		}
	}
	if c, err := r.Cookie("session"); err == nil && c.Value != "" {
		return strings.TrimSpace(c.Value)
	}
	// The browser WebSocket API cannot set Authorization headers, and cookies
	// are not always sent (third-party cookie blocking), so the SPA passes its
	// JWT as ?token= for the /ws handshake only. Query-string tokens are never
	// accepted on regular API routes to keep them out of access logs.
	if r.URL != nil && r.URL.Path == "/ws" {
		if t := strings.TrimSpace(r.URL.Query().Get("token")); t != "" {
			return t
		}
	}
	return ""
}

// clientIP resolves the caller IP from the trusted proxy chain (last
// X-Forwarded-For entry, appended by nginx) rather than the client-controlled
// first entry.
func clientIP(r *http.Request) string {
	return api.ClientIP(r)
}
