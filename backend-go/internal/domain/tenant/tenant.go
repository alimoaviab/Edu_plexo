// Package tenant exposes helpers for resolving the active academic year
// inside a tenant. Mirrors old-app/shared/services/_academic-year-filter.ts.
package tenant

import (
	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/store"
)

// ResolveAcademicYearID returns the academic year ID the caller intended to
// scope a query to. Resolution order matches the original:
//   1. Explicit `requestedID` if it belongs to the caller's school.
//   2. `ctx.ActiveAcademicYearID` (from the JWT or x-academic-year-id header).
//   3. Whichever year on this tenant has `is_active=true`.
//   4. Empty string if the tenant has no year at all.
func ResolveAcademicYearID(s *store.MemStore, ctx *api.RequestContext, requestedID string) string {
	if requestedID != "" && requestedID != "undefined" {
		s.RLock()
		for _, y := range s.AcademicYears {
			if y.ID == requestedID && y.SchoolID == ctx.SchoolID {
				s.RUnlock()
				return y.ID
			}
		}
		s.RUnlock()
	}

	if ctx.ActiveAcademicYearID != "" && ctx.ActiveAcademicYearID != "undefined" {
		// The middleware already validated the caller — this is just a
		// best-effort scope. We still verify the year belongs to the tenant.
		s.RLock()
		for _, y := range s.AcademicYears {
			if y.ID == ctx.ActiveAcademicYearID && y.SchoolID == ctx.SchoolID {
				s.RUnlock()
				return y.ID
			}
		}
		s.RUnlock()
	}

	s.RLock()
	defer s.RUnlock()
	for _, y := range s.AcademicYears {
		if y.SchoolID == ctx.SchoolID && y.IsActive {
			return y.ID
		}
	}
	return ""
}
