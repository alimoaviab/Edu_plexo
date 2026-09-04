// Package realtime provides a WebSocket hub with Redis Pub/Sub fan-out.
//
// Architecture:
//
//	Client → WS /ws → Hub.ServeWS() → registers connection
//	Redis Pub/Sub → Hub.subscribeSchool() → fan-out to all school's connections
//
// Thread safety: sync.RWMutex protects the connections map.
// Keepalive: ping/pong every 30s, 45s read deadline.
// Cleanup: on disconnect, remove from map + unsubscribe if last user in school.
package realtime

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/eduplexo/backend-go/internal/api"
	"github.com/eduplexo/backend-go/internal/metrics"
	"github.com/gorilla/websocket"
	"github.com/redis/go-redis/v9"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 45 * time.Second
	pingInterval   = 30 * time.Second
	maxMessageSize = 4096
)

// newUpgrader builds a WebSocket upgrader that only accepts handshakes from
// trusted origins. Cross-site WebSocket hijacking is otherwise possible: a
// malicious page can open a socket to this endpoint and the browser silently
// attaches the victim's session cookies (SameSite=None), letting the attacker
// receive the victim's realtime stream. Browsers always send an Origin header
// on WebSocket handshakes, so validating it closes that hole. Requests with no
// Origin (server-side clients, tests) are allowed — they cannot carry cookies
// cross-site.
func newUpgrader(allowedOrigins []string) websocket.Upgrader {
	allowed := make(map[string]bool, len(allowedOrigins))
	for _, o := range allowedOrigins {
		if o := strings.TrimSpace(o); o != "" {
			allowed[strings.ToLower(o)] = true
		}
	}
	return websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			origin := strings.TrimSpace(r.Header.Get("Origin"))
			if origin == "" {
				return true
			}
			return allowed[strings.ToLower(origin)]
		},
	}
}

// Message is the envelope sent over WebSocket to clients.
type Message struct {
	Type    string `json:"type"`    // "notification", "attendance", "fee_update", "job_progress"
	Payload any    `json:"payload"` // Event-specific data
}

// Notifier is the subset of Hub behaviour domain packages rely on for
// user-targeted realtime delivery. It exists so tests can substitute a
// recording fake instead of a live WebSocket hub.
type Notifier interface {
	// SendToUser delivers msg to a single connected user (no-op when the user
	// is offline or on another instance).
	SendToUser(schoolID, userID string, msg Message)
}

// connSeq is a process-wide counter used to mint unique connection IDs so
// multiple connections from the same user (tabs/devices) never collide.
var connSeq uint64

// conn wraps a WebSocket connection with metadata.
type conn struct {
	id       string // unique per connection (multi-tab / reconnect safe)
	ws       *websocket.Conn
	schoolID string
	userID   string
	send     chan []byte
}

// Hub manages all WebSocket connections and Redis Pub/Sub subscriptions.
type Hub struct {
	// connections: schoolID → connectionID → connection. Keyed by a unique
	// connection ID (not user ID) so one user's tabs/devices coexist and a
	// disconnect can only ever tear down its own connection.
	mu    sync.RWMutex
	conns map[string]map[string]*conn

	// Redis client for Pub/Sub
	rdb *redis.Client

	// Active Redis subscriptions per school
	subMu sync.Mutex
	subs  map[string]*redis.PubSub

	// Context for graceful shutdown
	ctx    context.Context
	cancel context.CancelFunc

	// upgrader validates handshake Origins against the configured allowlist.
	upgrader websocket.Upgrader
}

// NewHub creates a WebSocket hub with Redis Pub/Sub integration. Only
// handshakes whose Origin is listed in allowedOrigins are accepted (see
// newUpgrader); pass the deployment's ALLOWED_ORIGINS.
func NewHub(rdb *redis.Client, allowedOrigins []string) *Hub {
	ctx, cancel := context.WithCancel(context.Background())
	return &Hub{
		conns:    make(map[string]map[string]*conn),
		rdb:      rdb,
		subs:     make(map[string]*redis.PubSub),
		ctx:      ctx,
		cancel:   cancel,
		upgrader: newUpgrader(allowedOrigins),
	}
}

// Shutdown gracefully closes all connections and subscriptions.
//
// Connections are snapshotted and removed from the map under the hub lock
// BEFORE their channels are closed, so a concurrently exiting readPump can
// never double-close a send channel (close-of-closed-channel panic would
// crash the process during graceful shutdown).
func (h *Hub) Shutdown() {
	h.cancel()

	h.subMu.Lock()
	for _, sub := range h.subs {
		_ = sub.Close()
	}
	h.subs = make(map[string]*redis.PubSub)
	h.subMu.Unlock()

	h.mu.Lock()
	var all []*conn
	for _, school := range h.conns {
		for _, c := range school {
			all = append(all, c)
		}
	}
	h.conns = make(map[string]map[string]*conn)
	h.mu.Unlock()

	for _, c := range all {
		close(c.send)
		_ = c.ws.Close()
		metrics.ActiveWebsockets.Dec()
	}
	if len(all) > 0 {
		log.Printf("[ws] hub shutdown: closed %d connection(s)", len(all))
	}
}

// ServeWS handles WebSocket upgrade requests.
// Route: r.Get("/ws", hub.ServeWS)
//
// The client must be authenticated — school_id and user_id are extracted
// from the JWT (already validated by the auth middleware).
func (h *Hub) ServeWS(w http.ResponseWriter, r *http.Request) {
	reqCtx := api.FromRequest(r)
	if reqCtx == nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	wsConn, err := h.upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("[ws] upgrade failed: %v", err)
		return
	}

	c := &conn{
		id:       "conn_" + strconv.FormatUint(atomic.AddUint64(&connSeq, 1), 10),
		ws:       wsConn,
		schoolID: reqCtx.SchoolID,
		userID:   reqCtx.UserID,
		send:     make(chan []byte, 64),
	}

	h.register(c)
	metrics.ActiveWebsockets.Inc()

	// Start read/write pumps
	go h.writePump(c)
	go h.readPump(c)
}

// register adds a connection to the hub and starts Redis subscription if
// needed. When the same user already has a live connection (new tab or a
// reconnect that raced the old socket's teardown), the older connection is
// superseded and shut down — otherwise its eventual disconnect would tear
// down the newer connection's channel.
func (h *Hub) register(c *conn) {
	h.mu.Lock()
	if h.conns[c.schoolID] == nil {
		h.conns[c.schoolID] = make(map[string]*conn)
	}
	school := h.conns[c.schoolID]

	var stale []*conn
	for _, existing := range school {
		if existing.userID == c.userID && existing.id != c.id {
			stale = append(stale, existing)
		}
	}
	school[c.id] = c
	schoolConnCount := len(school)
	h.mu.Unlock()

	for _, old := range stale {
		h.unregister(old)
	}

	log.Printf("[ws] connected: school=%s user=%s (school_total=%d)", c.schoolID, c.userID, schoolConnCount)

	// Subscribe to Redis channels for this school (if first connection)
	if schoolConnCount == 1 {
		h.subscribeSchool(c.schoolID)
	}
}

// unregister removes a connection and closes its send channel EXACTLY once.
// It is idempotent and safe from any goroutine (readPump exit, supersede in
// register, Hub.Shutdown): the connection is only acted on while it is still
// present in the map, so no channel is ever closed twice and — because conns
// are keyed by a unique id — no other connection's channel is ever touched.
func (h *Hub) unregister(c *conn) {
	h.mu.Lock()
	school, ok := h.conns[c.schoolID]
	if !ok {
		h.mu.Unlock()
		return
	}
	if _, exists := school[c.id]; !exists {
		h.mu.Unlock()
		return
	}
	delete(school, c.id)
	empty := len(school) == 0
	if empty {
		delete(h.conns, c.schoolID)
	}
	h.mu.Unlock()

	close(c.send)
	_ = c.ws.Close()

	metrics.ActiveWebsockets.Dec()
	log.Printf("[ws] disconnected: school=%s user=%s", c.schoolID, c.userID)

	// Unsubscribe from Redis if no more connections for this school
	if empty {
		h.unsubscribeSchool(c.schoolID)
	}
}

// ─── Redis Pub/Sub ───────────────────────────────────────────────────────

// subscribeSchool starts listening to Redis channels for a school.
func (h *Hub) subscribeSchool(schoolID string) {
	if h.rdb == nil {
		return
	}

	channels := []string{
		"school:" + schoolID + ":notifications",
		"school:" + schoolID + ":attendance",
		"school:" + schoolID + ":fees",
		"school:" + schoolID + ":jobs",
	}

	sub := h.rdb.Subscribe(h.ctx, channels...)

	h.subMu.Lock()
	h.subs[schoolID] = sub
	h.subMu.Unlock()

	// Listen for messages in a goroutine
	go func() {
		ch := sub.Channel()
		for msg := range ch {
			h.fanOut(schoolID, []byte(msg.Payload))
		}
	}()

	log.Printf("[ws] subscribed to Redis channels for school=%s", schoolID)
}

// unsubscribeSchool stops listening to Redis channels for a school.
func (h *Hub) unsubscribeSchool(schoolID string) {
	h.subMu.Lock()
	sub, ok := h.subs[schoolID]
	if ok {
		delete(h.subs, schoolID)
	}
	h.subMu.Unlock()

	if ok && sub != nil {
		_ = sub.Close()
		log.Printf("[ws] unsubscribed from Redis channels for school=%s", schoolID)
	}
}

// fanOut sends a message to all connected users in a school.
//
// Sends happen while holding the read lock: unregister/Shutdown close send
// channels only after removing the connection from the map under the write
// lock, so a channel can never be written after it is closed (send-on-closed
// panic). Sends are non-blocking, so holding the read lock is bounded.
func (h *Hub) fanOut(schoolID string, data []byte) {
	h.mu.RLock()
	school := h.conns[schoolID]
	if school == nil {
		h.mu.RUnlock()
		return
	}
	for _, c := range school {
		select {
		case c.send <- data:
		default:
			// Buffer full — drop message for this client
			log.Printf("[ws] send buffer full, dropping message for user=%s", c.userID)
		}
	}
	h.mu.RUnlock()
}

// SendToUser sends a message to a specific user's connections (if connected).
// Like fanOut, sends happen under the read lock so a channel can never be
// written after it is closed. Delivers to every live connection of the user
// (all tabs).
func (h *Hub) SendToUser(schoolID, userID string, msg Message) {
	data, err := json.Marshal(msg)
	if err != nil {
		return
	}

	h.mu.RLock()
	school := h.conns[schoolID]
	if school == nil {
		h.mu.RUnlock()
		return
	}
	for _, c := range school {
		if c.userID == userID {
			select {
			case c.send <- data:
			default:
			}
		}
	}
	h.mu.RUnlock()
}

// Publish sends a message to all users in a school via Redis Pub/Sub.
// This works across multiple backend instances.
func (h *Hub) Publish(ctx context.Context, schoolID, channel string, msg Message) error {
	if h.rdb == nil {
		// No Redis — direct fan-out (single instance only)
		data, err := json.Marshal(msg)
		if err != nil {
			return err
		}
		h.fanOut(schoolID, data)
		return nil
	}

	data, err := json.Marshal(msg)
	if err != nil {
		return err
	}

	fullChannel := "school:" + schoolID + ":" + channel
	return h.rdb.Publish(ctx, fullChannel, data).Err()
}

// ─── Read/Write Pumps ────────────────────────────────────────────────────

// readPump reads messages from the WebSocket (handles pong, close).
func (h *Hub) readPump(c *conn) {
	defer func() {
		h.unregister(c)
		_ = c.ws.Close()
	}()

	c.ws.SetReadLimit(maxMessageSize)
	_ = c.ws.SetReadDeadline(time.Now().Add(pongWait))
	c.ws.SetPongHandler(func(string) error {
		_ = c.ws.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, _, err := c.ws.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseNormalClosure) {
				log.Printf("[ws] read error: %v", err)
			}
			break
		}
		// We don't process incoming messages from clients (read-only push model).
		// If needed in the future, handle client messages here.
	}
}

// writePump sends messages from the send channel to the WebSocket.
func (h *Hub) writePump(c *conn) {
	ticker := time.NewTicker(pingInterval)
	defer func() {
		ticker.Stop()
		_ = c.ws.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			_ = c.ws.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// Channel closed — send close frame
				_ = c.ws.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.ws.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			_, _ = w.Write(message)

			// Drain queued messages into the same write (batch)
			n := len(c.send)
			for i := 0; i < n; i++ {
				_, _ = w.Write([]byte("\n"))
				_, _ = w.Write(<-c.send)
			}

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			// Send ping
			_ = c.ws.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.ws.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
