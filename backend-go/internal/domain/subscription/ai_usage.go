// ai_usage.go — AI request usage tracking and enforcement.
package subscription

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/jackc/pgx/v5"
)

// AIUsage represents the current AI usage state for a school.
type AIUsage struct {
	SchoolID     string    `json:"school_id"`
	UsedRequests int       `json:"used_requests"`
	MaxRequests  int       `json:"max_requests"`
	Remaining    int       `json:"remaining"`
	LastResetAt  time.Time `json:"last_reset_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// GetAIUsage returns the current AI usage for the authenticated school.
func (h *Handler) GetAIUsage(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	api.WriteResult(w, api.ServiceTry(func() (*AIUsage, error) {
		usage, err := h.fetchOrCreateAIUsage(r.Context(), ctx.SchoolID)
		if err != nil {
			return nil, err
		}
		return usage, nil
	}))
}

// IncrementAIUsage increments the AI usage counter. Called after a successful AI response.
func (h *Handler) IncrementAIUsage(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	api.WriteResult(w, api.ServiceTry(func() (*AIUsage, error) {
		usage, err := h.fetchOrCreateAIUsage(r.Context(), ctx.SchoolID)
		if err != nil {
			return nil, err
		}

		if usage.UsedRequests >= usage.MaxRequests {
			return nil, api.NewControlledError("AI_LIMIT_REACHED",
				fmt.Sprintf("You have used all %d AI requests for this billing period. Please upgrade your plan for more.", usage.MaxRequests),
				403,
				map[string]any{
					"used":      usage.UsedRequests,
					"max":       usage.MaxRequests,
					"remaining": 0,
				},
			)
		}

		// Increment
		_, err = h.Pool.Exec(r.Context(), `
			UPDATE ai_usage SET used_requests = used_requests + 1, updated_at = NOW()
			WHERE school_id = $1
		`, ctx.SchoolID)
		if err != nil {
			return nil, fmt.Errorf("increment ai usage: %w", err)
		}

		usage.UsedRequests++
		usage.Remaining = usage.MaxRequests - usage.UsedRequests
		if usage.Remaining < 0 {
			usage.Remaining = 0
		}
		return usage, nil
	}))
}

// CheckAILimit checks if the school can make an AI request.
func (h *Handler) CheckAILimit(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	api.WriteResult(w, api.ServiceTry(func() (map[string]any, error) {
		usage, err := h.fetchOrCreateAIUsage(r.Context(), ctx.SchoolID)
		if err != nil {
			return nil, err
		}

		allowed := usage.UsedRequests < usage.MaxRequests
		return map[string]any{
			"allowed":   allowed,
			"used":      usage.UsedRequests,
			"max":       usage.MaxRequests,
			"remaining": usage.Remaining,
		}, nil
	}))
}

// AdminGetAllAIUsage returns AI usage for all schools (super admin).
func (h *Handler) AdminGetAllAIUsage(w http.ResponseWriter, r *http.Request) {
	ctx := api.FromRequest(r)
	if ctx.Role != "super_admin" {
		api.WriteResult(w, api.Fail("FORBIDDEN", "Super admin access required.", 403, nil))
		return
	}
	api.WriteResult(w, api.ServiceTry(func() ([]map[string]any, error) {
		rows, err := h.Pool.Query(r.Context(), `
			SELECT a.school_id, a.used_requests, a.max_requests, a.last_reset_at,
			       COALESCE(s.name, '') as school_name
			FROM ai_usage a
			LEFT JOIN schools s ON s.id = a.school_id OR s.school_id = a.school_id
			ORDER BY a.used_requests DESC
			LIMIT 100
		`)
		if err != nil {
			return nil, fmt.Errorf("list ai usage: %w", err)
		}
		defer rows.Close()

		results := make([]map[string]any, 0)
		for rows.Next() {
			var schoolID, schoolName string
			var used, max int
			var lastReset time.Time
			if err := rows.Scan(&schoolID, &used, &max, &lastReset, &schoolName); err != nil {
				continue
			}
			results = append(results, map[string]any{
				"school_id":     schoolID,
				"school_name":   schoolName,
				"used_requests": used,
				"max_requests":  max,
				"remaining":     max - used,
				"last_reset_at": lastReset,
			})
		}
		return results, nil
	}))
}

// fetchOrCreateAIUsage fetches or initializes AI usage for a school.
func (h *Handler) fetchOrCreateAIUsage(ctx context.Context, schoolID string) (*AIUsage, error) {
	if h.Pool == nil {
		return &AIUsage{SchoolID: schoolID, MaxRequests: 10, Remaining: 10}, nil
	}

	var usage AIUsage
	err := h.Pool.QueryRow(ctx, `
		SELECT school_id, used_requests, max_requests, last_reset_at, updated_at
		FROM ai_usage WHERE school_id = $1
	`, schoolID).Scan(&usage.SchoolID, &usage.UsedRequests, &usage.MaxRequests, &usage.LastResetAt, &usage.UpdatedAt)

	if err == pgx.ErrNoRows {
		// Get max from subscription
		maxReqs := 10
		sub, _ := GetActiveSubscriptionHelper(ctx, h.Pool, h.Store, schoolID)
		if sub != nil {
			switch sub.PlanName {
			case "starter":
				maxReqs = 50
			case "growth":
				maxReqs = 100
			case "custom":
				maxReqs = 200
			}
			if sub.IsTrial {
				maxReqs = 10
			}
		}

		// Create entry
		_, _ = h.Pool.Exec(ctx, `
			INSERT INTO ai_usage (school_id, used_requests, max_requests, last_reset_at, updated_at)
			VALUES ($1, 0, $2, NOW(), NOW())
			ON CONFLICT (school_id) DO NOTHING
		`, schoolID, maxReqs)

		return &AIUsage{
			SchoolID:     schoolID,
			UsedRequests: 0,
			MaxRequests:  maxReqs,
			Remaining:    maxReqs,
			LastResetAt:  time.Now(),
			UpdatedAt:    time.Now(),
		}, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get ai usage: %w", err)
	}

	// Check if we need to reset (monthly)
	if time.Since(usage.LastResetAt) > 30*24*time.Hour {
		_, _ = h.Pool.Exec(ctx, `
			UPDATE ai_usage SET used_requests = 0, last_reset_at = NOW(), updated_at = NOW()
			WHERE school_id = $1
		`, schoolID)
		usage.UsedRequests = 0
		usage.LastResetAt = time.Now()
	}

	usage.Remaining = usage.MaxRequests - usage.UsedRequests
	if usage.Remaining < 0 {
		usage.Remaining = 0
	}
	return &usage, nil
}
