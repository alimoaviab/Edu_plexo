package middleware

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/alicebob/miniredis/v2"
	"github.com/eduplexo/backend-go/internal/api"
	"github.com/redis/go-redis/v9"
)

func newRedisTestLimiter(t *testing.T, limit int) (*RedisAuthLimiter, *miniredis.Miniredis) {
	t.Helper()
	mr := miniredis.RunT(t)
	client := redis.NewClient(&redis.Options{Addr: mr.Addr()})
	t.Cleanup(func() { _ = client.Close() })
	return NewRedisAuthLimiter(client, "test", limit, time.Minute), mr
}

func reqWithIP(ip string) *http.Request {
	r := httptest.NewRequest(http.MethodPost, "/api/auth/login", nil)
	r = r.WithContext(api.WithContext(r.Context(), &api.RequestContext{SchoolID: "system"}))
	r.RemoteAddr = ip + ":12345"
	return r
}

func serve(lim AuthLimiter, r *http.Request) *httptest.ResponseRecorder {
	w := httptest.NewRecorder()
	lim.Limit(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	})(w, r)
	return w
}

func TestRedisAuthLimiter_BlocksBeyondLimit(t *testing.T) {
	lim, _ := newRedisTestLimiter(t, 3)

	for i := 0; i < 3; i++ {
		if w := serve(lim, reqWithIP("10.0.0.1")); w.Code != http.StatusOK {
			t.Fatalf("request %d within limit: got %d", i+1, w.Code)
		}
	}
	if w := serve(lim, reqWithIP("10.0.0.1")); w.Code != http.StatusTooManyRequests {
		t.Fatalf("4th request should be 429, got %d", w.Code)
	}
}

func TestRedisAuthLimiter_IPsAreIndependent(t *testing.T) {
	lim, _ := newRedisTestLimiter(t, 1)

	if w := serve(lim, reqWithIP("10.0.0.1")); w.Code != http.StatusOK {
		t.Fatalf("first request ip A: got %d", w.Code)
	}
	if w := serve(lim, reqWithIP("10.0.0.2")); w.Code != http.StatusOK {
		t.Fatalf("first request ip B: got %d", w.Code)
	}
	if w := serve(lim, reqWithIP("10.0.0.1")); w.Code != http.StatusTooManyRequests {
		t.Fatalf("second request ip A should be 429, got %d", w.Code)
	}
}

func TestRedisAuthLimiter_WindowReset(t *testing.T) {
	lim, mr := newRedisTestLimiter(t, 1)
	if w := serve(lim, reqWithIP("10.0.0.9")); w.Code != http.StatusOK {
		t.Fatalf("first request: got %d", w.Code)
	}
	if w := serve(lim, reqWithIP("10.0.0.9")); w.Code != http.StatusTooManyRequests {
		t.Fatalf("second request should be 429, got %d", w.Code)
	}
	mr.FastForward(time.Minute + time.Second)
	if w := serve(lim, reqWithIP("10.0.0.9")); w.Code != http.StatusOK {
		t.Fatalf("request after window reset: got %d", w.Code)
	}
}

func TestRedisAuthLimiter_FallsBackToMemoryWhenRedisDown(t *testing.T) {
	// Point the client at a dead server; the limiter must degrade to the
	// per-instance limiter with the same limit instead of erroring open.
	lim := NewRedisAuthLimiter(
		redis.NewClient(&redis.Options{Addr: "127.0.0.1:1", DialTimeout: 50 * time.Millisecond}),
		"test", 2, time.Minute,
	)

	for i := 0; i < 2; i++ {
		if w := serve(lim, reqWithIP("10.9.9.9")); w.Code != http.StatusOK {
			t.Fatalf("request %d via fallback: got %d", i+1, w.Code)
		}
	}
	if w := serve(lim, reqWithIP("10.9.9.9")); w.Code != http.StatusTooManyRequests {
		t.Fatalf("3rd request should still be 429 via fallback, got %d", w.Code)
	}

	// A different IP is independent in the fallback too.
	if w := serve(lim, reqWithIP("10.9.9.10")); w.Code != http.StatusOK {
		t.Fatalf("different IP via fallback: got %d", w.Code)
	}
}

func TestRedisAuthLimiter_KeyHasTTL(t *testing.T) {
	lim, mr := newRedisTestLimiter(t, 5)
	ok, err := lim.allowed(context.Background(), "10.0.0.7")
	if err != nil || !ok {
		t.Fatalf("first allowed() should succeed: ok=%v err=%v", ok, err)
	}
	keys := mr.Keys()
	if len(keys) != 1 {
		t.Fatalf("expected 1 key, got %d", len(keys))
	}
	if got := mr.TTL(keys[0]); got <= 0 || got > time.Minute {
		t.Fatalf("expected TTL in (0,1m], got %v", got)
	}
}
