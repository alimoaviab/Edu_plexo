// Package subjects implements /api/subjects endpoints.
// Mirrors old-app/shared/services/subject.service.ts.
package subjects

import (
	"encoding/json"
	"net/http"
	"sort"
	"strings"
	"time"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/audit"
	"github.com/eduplexo/backend-go/internal/auth"
	"github.com/eduplexo/backend-go/internal/store"
	"github.com/go-chi/chi/v5"
)

type Handler struct {
	Store *store.MemStore
	Save  func(table string, doc any)
}

func New(s *store.MemStore, save func(string, any)) *Handler {
	if save == nil {
		save = func(string, any) {}
	}
	return &Handler{Store: s, Save: save}
}

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	api.WriteResult(w, api.ServiceTry(func() ([]*store.Subject, error) {
		if err := auth.AssertPermission(ctx, "subjects", auth.ActionView); err != nil {
			return nil, err
		}
		h.Store.RLock()
		rows := make([]*store.Subject, 0)
		for _, s := range h.Store.Subjects {
			if s.SchoolID == ctx.SchoolID {
				rows = append(rows, s)
			}
		}
		h.Store.RUnlock()
		sort.SliceStable(rows, func(i, j int) bool { return rows[i].Name < rows[j].Name })
		return rows, nil
	}))
}

func (h *Handler) Get(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	id := chi.URLParam(r, "id")
	api.WriteResult(w, api.ServiceTry(func() (*store.Subject, error) {
		if err := auth.AssertPermission(ctx, "subjects", auth.ActionView); err != nil {
			return nil, err
		}
		h.Store.RLock()
		defer h.Store.RUnlock()
		for _, s := range h.Store.Subjects {
			if s.ID == id && s.SchoolID == ctx.SchoolID {
				return s, nil
			}
		}
		return nil, api.NewControlledError("NOT_FOUND", "Subject not found.", 404, nil)
	}))
}

type subjectInput struct {
	Name        string `json:"name"`
	Code        string `json:"code"`
	Description string `json:"description"`
	Status      string `json:"status"`
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	var body subjectInput
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "Invalid JSON body.", 400, nil))
		return
	}
	api.WriteResult(w, api.ServiceTry(func() (*store.Subject, error) {
		if err := auth.AssertPermission(ctx, "subjects", auth.ActionCreate); err != nil {
			return nil, err
		}
		if strings.TrimSpace(body.Name) == "" {
			return nil, api.NewControlledError("VALIDATION_ERROR", "name is required.", 400, nil)
		}
		now := time.Now()
		s := &store.Subject{
			ID:          store.NewID("sub"),
			SchoolID:    ctx.SchoolID,
			Name:        body.Name,
			Code:        body.Code,
			Description: body.Description,
			Status:      defaultStr(body.Status, "active"),
			CreatedAt:   now,
		}
		h.Store.Lock()
		h.Store.Subjects = append(h.Store.Subjects, s)
		h.Store.Unlock()
		h.Save("subjects", s)
		audit.Write(h.Store, ctx, audit.Input{Action: "create", EntityType: "subject", EntityID: s.ID, After: s})
		return s, nil
	}))
}

func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	id := chi.URLParam(r, "id")
	body := map[string]json.RawMessage{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		api.WriteResult(w, api.Fail("VALIDATION_ERROR", "Invalid JSON body.", 400, nil))
		return
	}
	api.WriteResult(w, api.ServiceTry(func() (*store.Subject, error) {
		if err := auth.AssertPermission(ctx, "subjects", auth.ActionUpdate); err != nil {
			return nil, err
		}
		h.Store.Lock()
		defer h.Store.Unlock()
		for _, s := range h.Store.Subjects {
			if s.ID == id && s.SchoolID == ctx.SchoolID {
				before := *s
				if v, ok := body["name"]; ok {
					_ = json.Unmarshal(v, &s.Name)
				}
				if v, ok := body["code"]; ok {
					_ = json.Unmarshal(v, &s.Code)
				}
				if v, ok := body["description"]; ok {
					_ = json.Unmarshal(v, &s.Description)
				}
				if v, ok := body["status"]; ok {
					_ = json.Unmarshal(v, &s.Status)
				}
				h.Save("subjects", s)
				audit.Write(h.Store, ctx, audit.Input{
					Action: "update", EntityType: "subject", EntityID: id, Before: before, After: *s,
				})
				return s, nil
			}
		}
		return nil, api.NewControlledError("NOT_FOUND", "Subject not found.", 404, nil)
	}))
}

func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	id := chi.URLParam(r, "id")
	api.WriteResult(w, api.ServiceTry(func() (any, error) {
		if err := auth.AssertPermission(ctx, "subjects", auth.ActionDelete); err != nil {
			return nil, err
		}
		h.Store.Lock()
		defer h.Store.Unlock()
		for i, s := range h.Store.Subjects {
			if s.ID == id && s.SchoolID == ctx.SchoolID {
				before := *s
				h.Store.Subjects = append(h.Store.Subjects[:i], h.Store.Subjects[i+1:]...)
				h.Save("subjects:delete", before.ID)
				audit.Write(h.Store, ctx, audit.Input{
					Action: "delete", EntityType: "subject", EntityID: id, Before: before,
				})
				return map[string]any{"success": true, "id": id}, nil
			}
		}
		return nil, api.NewControlledError("NOT_FOUND", "Subject not found.", 404, nil)
	}))
}

func defaultStr(v, fallback string) string {
	if strings.TrimSpace(v) == "" {
		return fallback
	}
	return v
}
