package middleware

import (
	"bufio"
	"io"
	"log"
	"net"
	"net/http"
	"time"
)

// statusRecorder wraps http.ResponseWriter so we can capture the status code
// for logging.
//
// It MUST preserve every optional interface the underlying writer may
// implement. Losing them silently breaks functionality that depends on
// interface assertions:
//   - http.Hijacker  → WebSocket upgrades fail with
//     "response does not implement http.Hijacker" (all /ws clients get 500).
//   - http.Flusher   → SSE streaming (e.g. /api/seo/generate) fails with
//     "Streaming not supported".
//   - http.Pusher / io.ReaderFrom → HTTP/2 push and zero-copy writes.
//
// Each method below forwards to the wrapped ResponseWriter only when the
// underlying value actually supports it, mirroring what Go's stdlib
// http.NewResponseController-based handlers expect.
type statusRecorder struct {
	http.ResponseWriter
	status int
}

func (s *statusRecorder) WriteHeader(code int) {
	s.status = code
	s.ResponseWriter.WriteHeader(code)
}

// Unwrap lets http.ResponseController reach the real writer.
func (s *statusRecorder) Unwrap() http.ResponseWriter {
	return s.ResponseWriter
}

// Hijack lets the gorilla/websocket Upgrader hijack the connection for
// WebSocket upgrades through the full middleware chain.
func (s *statusRecorder) Hijack() (net.Conn, *bufio.ReadWriter, error) {
	h, ok := s.ResponseWriter.(http.Hijacker)
	if !ok {
		return nil, nil, http.ErrNotSupported
	}
	return h.Hijack()
}

// Flush keeps SSE streaming (text/event-stream) working through the logger.
func (s *statusRecorder) Flush() {
	if f, ok := s.ResponseWriter.(http.Flusher); ok {
		f.Flush()
	}
}

// Push keeps HTTP/2 server push working through the logger.
func (s *statusRecorder) Push(target string, opts *http.PushOptions) error {
	if p, ok := s.ResponseWriter.(http.Pusher); ok {
		return p.Push(target, opts)
	}
	return http.ErrNotSupported
}

// ReadFrom keeps zero-copy response writes working through the logger.
func (s *statusRecorder) ReadFrom(r io.Reader) (int64, error) {
	if rf, ok := s.ResponseWriter.(io.ReaderFrom); ok {
		return rf.ReadFrom(r)
	}
	return io.Copy(struct{ io.Writer }{s.ResponseWriter}, r)
}

// Logger writes a single line per request: method, path, status, duration.
// Modelled on what Next.js console-logged in development.
func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		rec := &statusRecorder{ResponseWriter: w, status: 200}
		next.ServeHTTP(rec, r)
		// Include the client correlation ID (x-request-id) when present so a
		// failing request can be traced across the browser console, nginx
		// access log and this log. Path only — no query strings or headers.
		reqID := r.Header.Get("X-Request-Id")
		if reqID != "" {
			log.Printf("%s %s -> %d (%s) reqid=%s", r.Method, r.URL.Path, rec.status, time.Since(start), reqID)
			return
		}
		log.Printf("%s %s -> %d (%s)", r.Method, r.URL.Path, rec.status, time.Since(start))
	})
}
