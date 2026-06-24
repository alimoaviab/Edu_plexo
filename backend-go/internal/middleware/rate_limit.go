package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/eduplexo/backend-go/internal/api"
)

// RateLimiter is a simple in-memory IP-based rate limiter
type RateLimiter struct {
	mu       sync.Mutex
	visitors map[string]*visitor
	limit    int
	window   time.Duration
}

type visitor struct {
	count     int
	lastVisit time.Time
}

// NewRateLimiter creates a rate limiter with requests per window
func NewRateLimiter(limit int, window time.Duration) *RateLimiter {
	rl := &RateLimiter{
		visitors: make(map[string]*visitor),
		limit:    limit,
		window:   window,
	}

	// cleanup stale visitors
	go func() {
		for {
			time.Sleep(window)
			rl.mu.Lock()
			for ip, v := range rl.visitors {
				if time.Since(v.lastVisit) > window {
					delete(rl.visitors, ip)
				}
			}
			rl.mu.Unlock()
		}
	}()

	return rl
}

// Limit is the middleware handler
func (rl *RateLimiter) Limit(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ip := r.Header.Get("X-Forwarded-For")
		if ip == "" {
			ip = r.RemoteAddr
		}

		rl.mu.Lock()
		v, exists := rl.visitors[ip]
		if !exists {
			rl.visitors[ip] = &visitor{count: 1, lastVisit: time.Now()}
			rl.mu.Unlock()
			next.ServeHTTP(w, r)
			return
		}

		if time.Since(v.lastVisit) > rl.window {
			v.count = 0
		}

		v.count++
		v.lastVisit = time.Now()
		
		if v.count > rl.limit {
			rl.mu.Unlock()
			api.WriteJSON(w, http.StatusTooManyRequests, map[string]any{
				"ok":      false,
				"message": "Too many requests. Please try again later.",
			})
			return
		}
		rl.mu.Unlock()

		next.ServeHTTP(w, r)
	}
}
