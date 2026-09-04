package middleware

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/redis/go-redis/v9"
)

// AuthLimiter is implemented by both the in-memory (single-instance) and the
// Redis-backed (distributed) auth rate limiters, so the router can pick the
// backend that matches the deployment without touching route wiring.
type AuthLimiter interface {
	Limit(next http.HandlerFunc) http.HandlerFunc
}

// RedisAuthLimiter is a distributed fixed-window rate limiter for
// unauthenticated abuse-prone endpoints (login, signup, OTP). Counters live
// in Redis so the limit holds across multiple application instances.
//
// Window semantics:
//   - The first request creates the window with SET NX EX (atomic: the key
//     always carries a TTL from birth, so it can never get stuck without an
//     expiry — increments never extend the window).
//   - Every later request INCRs the counter; requests beyond `limit` inside
//     the window are rejected with 429.
//
// Resilience: if Redis is unreachable the limiter fails SAFE-OPEN to an
// embedded per-instance in-memory limiter (same limits, single-instance
// scope) rather than erroring or unlocking the endpoint entirely. An
// attacker who can already take down Redis gets no more than the pre-existing
// per-instance limit.
type RedisAuthLimiter struct {
	client   *redis.Client
	scope    string
	limit    int
	window   time.Duration
	fallback *RateLimiter
}

// NewRedisAuthLimiter builds a distributed limiter. `scope` names the
// endpoint family in the Redis key namespace (e.g. "auth").
func NewRedisAuthLimiter(client *redis.Client, scope string, limit int, window time.Duration) *RedisAuthLimiter {
	return &RedisAuthLimiter{
		client:   client,
		scope:    scope,
		limit:    limit,
		window:   window,
		fallback: NewRateLimiter(limit, window),
	}
}

// Limit returns the middleware handler.
func (rl *RedisAuthLimiter) Limit(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ip := api.ClientIP(r)

		// Bound Redis call latency so a slow Redis cannot stall auth.
		ctx, cancel := context.WithTimeout(r.Context(), 500*time.Millisecond)
		defer cancel()

		allowed, err := rl.allowed(ctx, ip)
		if err != nil {
			// Redis unavailable — degrade to the single-instance limiter.
			rl.fallback.Limit(next)(w, r)
			return
		}
		if !allowed {
			api.WriteJSON(w, http.StatusTooManyRequests, map[string]any{
				"ok":      false,
				"message": "Too many requests. Please try again later.",
			})
			return
		}
		next.ServeHTTP(w, r)
	}
}

// allowed reports whether the request is inside the limit and records it.
func (rl *RedisAuthLimiter) allowed(ctx context.Context, ip string) (bool, error) {
	key := fmt.Sprintf("rl:%s:%d:%s", rl.scope, int64(rl.window/time.Second), ip)

	created, err := rl.client.SetNX(ctx, key, 1, rl.window).Result()
	if err != nil {
		return false, err
	}
	if created {
		return true, nil
	}

	count, err := rl.client.Incr(ctx, key).Result()
	if err != nil {
		return false, err
	}
	return count <= int64(rl.limit), nil
}
