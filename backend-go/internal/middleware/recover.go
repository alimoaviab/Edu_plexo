// Package middleware contains HTTP middleware: panic recovery, request
// logging, CORS, and JWT auth. Mirrors the responsibilities of
// old-app/school-app/lib/api-utils.ts (`withAuth`/`safeRoute`) and
// old-app/school-app/middleware.ts.
package middleware

import (
	"log"
	"net/http"
	"runtime/debug"

	"github.com/eduplexo/backend-go/internal/api"
)

// Recover catches panics from any downstream handler, logs them, and renders
// the canonical 500 ServiceResult envelope so the React frontend keeps its
// existing error-handling code path.
func Recover(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if rec := recover(); rec != nil {
				// The full panic value and stack trace stay server-side (logs);
				// clients get the generic envelope. Panic text can leak internals
				// (SQL errors, file paths, dependency messages) that aid attackers.
				log.Printf("[panic] %s %s: %v\n%s", r.Method, r.URL.Path, rec, debug.Stack())
				api.WriteResult(w, api.Fail("INTERNAL_ERROR", "An unexpected error occurred. Please try again.", 500, nil))
			}
		}()
		next.ServeHTTP(w, r)
	})
}
