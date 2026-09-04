// Package session provides a lightweight server-side session revocation
// registry (a deny-list) used to invalidate JWTs on logout.
//
// The system issues long-lived JWTs (1 year) that carry a random session_id
// claim. Tokens are verified with the shared JWT secret, but there is no way
// to "un-issue" a token once it leaves the server — logout previously only
// cleared the cookie and left every issued copy valid until natural expiry.
//
// This package records revoked session ids in Redis (or in memory when Redis
// is unavailable, e.g. single-instance development). The auth middleware
// rejects any request whose session_id appears in the deny-list, so logout —
// and any future "revoke session" flow — takes effect immediately across all
// copies of the token (cookies, localStorage, mobile clients).
//
// Deny-list entries expire after the maximum token lifetime (1 year), which
// bounds storage without ever allowing a revoked token to become valid again
// before its own expiry.
package session

import (
	"context"
	"sync"
	"time"

	"github.com/redis/go-redis/v9"
)

// tokenLifetime is the maximum JWT validity the backend issues (8760h from
// internal/domain/auth). Deny-list entries live at least this long so a
// revoked token can never outlive its revocation record.
const tokenLifetime = 8760 * time.Hour

const denyKeyPrefix = "session:deny:"

// Revoker tracks revoked session ids. Implementations must be safe for
// concurrent use.
type Revoker interface {
	// Revoke records a session id as invalid. sessionID must be non-empty.
	Revoke(sessionID string)
	// Revoked reports whether a session id was previously revoked. Empty
	// session ids (defensive) are never revoked.
	Revoked(sessionID string) bool
}

// New returns a Revoker backed by Redis when rdb is non-nil, otherwise an
// in-memory revoker (single-instance development mode). All backend instances
// sharing the same Redis share revocation state.
func New(rdb *redis.Client) Revoker {
	if rdb != nil {
		return &redisRevoker{rdb: rdb}
	}
	return newMemoryRevoker()
}

// ─── Redis-backed revoker ────────────────────────────────────────────────

type redisRevoker struct {
	rdb *redis.Client
}

func (r *redisRevoker) Revoke(sessionID string) {
	if sessionID == "" || r == nil || r.rdb == nil {
		return
	}
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	_ = r.rdb.Set(ctx, denyKeyPrefix+sessionID, "1", tokenLifetime).Err()
}

func (r *redisRevoker) Revoked(sessionID string) bool {
	if sessionID == "" || r == nil || r.rdb == nil {
		return false
	}
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	n, err := r.rdb.Exists(ctx, denyKeyPrefix+sessionID).Result()
	return err == nil && n > 0
}

// ─── In-memory revoker (no Redis) ────────────────────────────────────────

type memoryRevoker struct {
	mu      sync.Mutex
	revoked map[string]time.Time
}

func newMemoryRevoker() *memoryRevoker {
	return &memoryRevoker{revoked: make(map[string]time.Time)}
}

func (m *memoryRevoker) Revoke(sessionID string) {
	if sessionID == "" {
		return
	}
	m.mu.Lock()
	m.pruneLocked()
	m.revoked[sessionID] = time.Now().Add(tokenLifetime)
	m.mu.Unlock()
}

func (m *memoryRevoker) Revoked(sessionID string) bool {
	if sessionID == "" {
		return false
	}
	m.mu.Lock()
	defer m.mu.Unlock()
	m.pruneLocked()
	exp, ok := m.revoked[sessionID]
	if !ok {
		return false
	}
	if time.Now().After(exp) {
		delete(m.revoked, sessionID)
		return false
	}
	return true
}

// pruneLocked drops expired entries once the map grows large enough to be
// worth scanning (bounded cleanup without a background goroutine).
func (m *memoryRevoker) pruneLocked() {
	if len(m.revoked) < 1024 {
		return
	}
	now := time.Now()
	for id, exp := range m.revoked {
		if now.After(exp) {
			delete(m.revoked, id)
		}
	}
}
