package integration

// Regression test for F-04: WebSocket upgrades must survive the REAL
// production middleware chain (RequestID → CORS → Compress → metrics →
// Recover → Logger → Authenticator). Earlier, the logging/metrics wrappers
// dropped http.Hijacker, so every /ws upgrade through the real stack failed
// with "response does not implement http.Hijacker" (500) while isolated test
// routers (no Logger) kept passing. This test dials through the exact chain
// router.go builds and requires a successful 101 upgrade.

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/eduplexo/backend-go/internal/auth"
	"github.com/eduplexo/backend-go/internal/config"
	"github.com/eduplexo/backend-go/internal/metrics"
	"github.com/eduplexo/backend-go/internal/middleware"
	"github.com/eduplexo/backend-go/internal/realtime"
	"github.com/eduplexo/backend-go/internal/session"
	"github.com/eduplexo/backend-go/internal/store"
	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/gorilla/websocket"
	"github.com/stretchr/testify/require"
)

func realStackWSConfig() config.Config {
	return config.Config{
		JWTSecret:      "realstack-test-secret-0123456789abcdef",
		AppName:        "school",
		AllowedOrigins: []string{"http://localhost:3000"},
	}
}

// realStackWSServer builds a server whose /ws route sits behind the exact
// same middleware chain as production router.go.
func realStackWSServer(t *testing.T, cfg config.Config, s *store.MemStore) (*httptest.Server, *realtime.Hub) {
	t.Helper()

	hub := realtime.NewHub(nil, cfg.AllowedOrigins)
	t.Cleanup(func() { hub.Shutdown() })

	r := chi.NewRouter()
	r.Use(chimw.RequestID)
	r.Use(middleware.NewCORS(cfg))
	r.Use(middleware.Compress)
	r.Use(metrics.Middleware)
	r.Use(middleware.Recover)
	r.Use(middleware.Logger)

	r.Group(func(r chi.Router) {
		r.Use(middleware.Authenticator(cfg, s, session.New(nil)))
		r.Get("/ws", hub.ServeWS)
	})

	server := httptest.NewServer(r)
	t.Cleanup(func() { server.Close() })
	return server, hub
}

func realStackUser(id, school, role string) *store.User {
	return &store.User{
		ID:       id,
		SchoolID: school,
		Role:     role,
		Email:    id + "@test.school",
		Status:   "active",
	}
}

func signForStack(cfg config.Config, u *store.User, scope string) string {
	claims := auth.Claims{
		SchoolID:   u.SchoolID,
		Role:       u.Role,
		SessionID:  "sess_" + u.ID,
		App:        cfg.AppName,
		ActorEmail: u.Email,
		Scope:      scope,
	}
	claims.Subject = u.ID
	ttl := time.Hour
	if scope == "ws" {
		ttl = time.Minute
	}
	tok, err := auth.SignToken(cfg.JWTSecret, cfg.AppName, claims, ttl)
	if err != nil {
		panic(err)
	}
	return tok
}

// dialThroughStack dials /ws with the given headers/query and returns the
// response status (http.StatusSwitchingProtocols on success).
func dialThroughStack(t *testing.T, server *httptest.Server, token string, inQuery bool) int {
	t.Helper()
	wsURL := "ws" + strings.TrimPrefix(server.URL, "http") + "/ws"
	if inQuery && token != "" {
		wsURL += "?token=" + token
	}

	header := http.Header{}
	header.Set("Origin", "http://localhost:3000")
	if token != "" && !inQuery {
		header.Set("Authorization", "Bearer "+token)
	}

	conn, resp, err := websocket.DefaultDialer.Dial(wsURL, header)
	if err != nil {
		if resp != nil {
			return resp.StatusCode
		}
		return -1
	}
	defer conn.Close()

	require.NotNil(t, resp)
	if resp.StatusCode != http.StatusSwitchingProtocols {
		return resp.StatusCode
	}

	// Connection is alive: ping and expect no immediate error.
	require.NoError(t, conn.WriteMessage(websocket.PingMessage, []byte("hi")))
	return resp.StatusCode
}

func TestWS_RealMiddlewareStack_FullJWTViaHeader(t *testing.T) {
	cfg := realStackWSConfig()
	s := &store.MemStore{Users: []*store.User{realStackUser("user_a", "school_1", "admin")}}
	server, _ := realStackWSServer(t, cfg, s)

	status := dialThroughStack(t, server, signForStack(cfg, s.Users[0], ""), false)
	require.Equal(t, http.StatusSwitchingProtocols, status,
		"F-04: full JWT via Authorization header must upgrade through the real middleware stack")
}

func TestWS_RealMiddlewareStack_WSTicketViaQuery(t *testing.T) {
	cfg := realStackWSConfig()
	s := &store.MemStore{Users: []*store.User{realStackUser("user_b", "school_2", "teacher")}}
	server, _ := realStackWSServer(t, cfg, s)

	status := dialThroughStack(t, server, signForStack(cfg, s.Users[0], "ws"), true)
	require.Equal(t, http.StatusSwitchingProtocols, status,
		"F-06: ws-scoped ticket via ?token= must upgrade through the real middleware stack")
}

func TestWS_RealMiddlewareStack_UnauthenticatedRejected(t *testing.T) {
	cfg := realStackWSConfig()
	s := &store.MemStore{Users: []*store.User{realStackUser("user_a", "school_1", "admin")}}
	server, _ := realStackWSServer(t, cfg, s)

	status := dialThroughStack(t, server, "", false)
	require.Equal(t, http.StatusUnauthorized, status,
		"unauthenticated /ws handshake must be rejected with 401")
}

func TestWS_RealMiddlewareStack_FullJWTInQueryRejected(t *testing.T) {
	// A full session JWT in the URL must be rejected (ALLOW_WS_TOKEN_QUERY off
	// by default — forbidden in production).
	cfg := realStackWSConfig()
	s := &store.MemStore{Users: []*store.User{realStackUser("user_a", "school_1", "admin")}}
	server, _ := realStackWSServer(t, cfg, s)

	status := dialThroughStack(t, server, signForStack(cfg, s.Users[0], ""), true)
	require.Equal(t, http.StatusUnauthorized, status,
		"full session JWT in the /ws URL must be rejected by default")
}

// TestWS_HubShutdownRacingWithDisconnect is a regression for a crash found
// while exercising the real stack: Hub.Shutdown closed every connection's send
// channel without removing the connections from the hub map, so a readPump
// that was concurrently tearing down the same connection double-closed the
// channel ("close of closed channel" panic → process crash during graceful
// shutdown). Run under -race to also validate map/channel synchronization.
func TestWS_HubShutdownRacingWithDisconnect(t *testing.T) {
	for i := 0; i < 10; i++ {
		cfg := realStackWSConfig()
		s := &store.MemStore{Users: []*store.User{realStackUser("user_race", "school_race", "admin")}}
		hub := realtime.NewHub(nil, cfg.AllowedOrigins)

		r := chi.NewRouter()
		r.Use(middleware.NewCORS(cfg))
		r.Group(func(r chi.Router) {
			r.Use(middleware.Authenticator(cfg, s, session.New(nil)))
			r.Get("/ws", hub.ServeWS)
		})
		server := httptest.NewServer(r)

		token := signForStack(cfg, s.Users[0], "ws")
		wsURL := "ws" + strings.TrimPrefix(server.URL, "http") + "/ws?token=" + token
		header := http.Header{}
		header.Set("Origin", "http://localhost:3000")

		// Rapid connect+disconnect cycles, then shutdown while the server-side
		// unregister goroutines may still be tearing down.
		for j := 0; j < 3; j++ {
			conn, resp, err := websocket.DefaultDialer.Dial(wsURL, header)
			require.NoError(t, err)
			require.Equal(t, http.StatusSwitchingProtocols, resp.StatusCode)
			conn.Close()
		}

		hub.Shutdown()
		server.Close()
	}
}
