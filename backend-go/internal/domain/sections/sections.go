package sections

import (
	"encoding/json"
	"net/http"
	"sort"
	"strings"
	"time"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/audit"
	"github.com/eduplexo/backend-go/internal/auth"
	"github.com/eduplexo/backend-go/internal/domain/tenant"
	"github.com/eduplexo/backend-go/internal/store"
	"github.com/go-chi/chi/v5"
)

type Handler struct {
	Store   *store.MemStore
	Persist func(table string, doc any)
}

func New(s *store.MemStore, save func(string, any)) *Handler {
	if save == nil {
		save = func(string, any) {}
	}
	return &Handler{Store: s, Persist: save}
}

// List implements GET /api/sections.
func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	q := r.URL.Query()

	if err := auth.AssertPermission(ctx, "classes", auth.ActionView); err != nil {
		api.WriteResult(w, api.Fail("FORBIDDEN", err.Error(), 403, nil))
		return
	}

	yearID := tenant.ResolveAcademicYearID(h.Store, ctx, q.Get("academic_year_id"))

	api.WriteResult(w, api.ServiceTry(func() (any, error) {
		h.Store.RLock()
		defer h.Store.RUnlock()

		rows := make([]*store.Section, 0)
		for _, s := range h.Store.Sections {
			if s.SchoolID != ctx.SchoolID {
				continue
			}
			if yearID != "" && s.AcademicYearID != yearID {
				continue
			}
			rows = append(rows, s)
		}

		sort.SliceStable(rows, func(i, j int) bool {
			return rows[i].Name < rows[j].Name
		})

		return map[string]any{"data": rows}, nil
	}))
}

type sectionInput struct {
	Name           string `json:"name"`
	AcademicYearID string `json:"academic_year_id"`
}

// Create implements POST /api/sections.
func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	var body sectionInput
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "Invalid JSON body.", 400, nil))
		return
	}
	api.WriteResult(w, api.ServiceTry(func() (*store.Section, error) {
		if err := auth.AssertPermission(ctx, "classes", auth.ActionCreate); err != nil {
			return nil, err
		}
		name := strings.TrimSpace(body.Name)
		if name == "" {
			return nil, api.NewControlledError("VALIDATION_ERROR", "name is required.", 400, nil)
		}
		yearID := body.AcademicYearID
		if yearID == "" {
			yearID = tenant.ResolveAcademicYearID(h.Store, ctx, "")
		}
		if yearID == "" {
			return nil, api.NewControlledError("VALIDATION_ERROR", "No active academic year found.", 400, nil)
		}

		h.Store.RLock()
		for _, s := range h.Store.Sections {
			if s.SchoolID == ctx.SchoolID && s.AcademicYearID == yearID && strings.EqualFold(s.Name, name) {
				h.Store.RUnlock()
				return nil, api.NewControlledError("VALIDATION_ERROR", "Section already exists.", 400, nil)
			}
		}
		h.Store.RUnlock()

		now := time.Now()
		sec := &store.Section{
			ID:             store.NewID("sec"),
			SchoolID:       ctx.SchoolID,
			AcademicYearID: yearID,
			Name:           name,
			Status:         "active",
			CreatedAt:      now,
			UpdatedAt:      now,
		}

		h.Store.Lock()
		h.Store.Sections = append(h.Store.Sections, sec)
		h.Store.Unlock()

		h.Persist("sections", sec)
		audit.Write(h.Store, ctx, audit.Input{
			Action: "create", EntityType: "section", EntityID: sec.ID, After: sec,
		})
		return sec, nil
	}))
}

// Update implements PATCH /api/sections/:id.
func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	id := chi.URLParam(r, "id")
	var body sectionInput
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "Invalid JSON body.", 400, nil))
		return
	}
	api.WriteResult(w, api.ServiceTry(func() (*store.Section, error) {
		if err := auth.AssertPermission(ctx, "classes", auth.ActionUpdate); err != nil {
			return nil, err
		}
		name := strings.TrimSpace(body.Name)

		h.Store.Lock()
		defer h.Store.Unlock()

		for _, s := range h.Store.Sections {
			if s.ID == id && s.SchoolID == ctx.SchoolID {
				before := *s
				if name != "" {
					s.Name = name
				}
				s.UpdatedAt = time.Now()
				h.Persist("sections", s)
				audit.Write(h.Store, ctx, audit.Input{
					Action: "update", EntityType: "section", EntityID: id, Before: before, After: *s,
				})
				return s, nil
			}
		}
		return nil, api.NewControlledError("NOT_FOUND", "Section not found.", 404, nil)
	}))
}

// Delete implements DELETE /api/sections/:id.
func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	id := chi.URLParam(r, "id")
	api.WriteResult(w, api.ServiceTry(func() (any, error) {
		if err := auth.AssertPermission(ctx, "classes", auth.ActionDelete); err != nil {
			return nil, err
		}
		h.Store.Lock()
		defer h.Store.Unlock()
		for i, s := range h.Store.Sections {
			if s.ID == id && s.SchoolID == ctx.SchoolID {
				before := *s
				h.Store.Sections = append(h.Store.Sections[:i], h.Store.Sections[i+1:]...)
				h.Persist("sections:delete", id)
				audit.Write(h.Store, ctx, audit.Input{
					Action: "delete", EntityType: "section", EntityID: id, Before: before,
				})
				return map[string]any{"success": true, "id": id}, nil
			}
		}
		return nil, api.NewControlledError("NOT_FOUND", "Section not found.", 404, nil)
	}))
}
