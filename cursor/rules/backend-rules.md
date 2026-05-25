# Go Backend Development Rules & Conventions

This document outlines the development guidelines, rules, and architecture for the **Eduplexo Go Backend** (`backend-go`). Every developer or agent modifying the backend must adhere to these standards.

---

## 1. Core Technology Stack
- **Language**: Go (golang) 1.21+
- **Router**: Chi Mux (`go-chi/chi/v5`)
- **Persistence**: PostgreSQL persistence layer (`persistence.Persister`) using `pgx/v5` connection pooling.
- **State Fallback**: Fast, thread-safe memory fallback store (`store.MemStore`) for development and instant unit testing without database setup.
- **Caching**: Redis client (`cache.Client`) for session-level state caching.

---

## 2. API Design & Parity
- **1:1 Parity**: Maintain exact path, method, and JSON response shape parity with legacy specifications.
- **Standard JSON Output**: Always use `api.WriteJSON` helper to return responses to clients:
  ```go
  api.WriteJSON(w, http.StatusOK, responseBody)
  ```
- **Error Boundaries**: Never expose raw db trace errors to clients. Log internally and return standardized API error blocks:
  ```go
  api.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": "Failed to update record"})
  ```

---

## 3. Strict Compile & Import Guard
- **No Unused Imports**: Go compiler is highly restrictive. Never leave imported packages unused (e.g. `ai` or `chatbot` domain helpers) when commenting out features. If a feature or route is temporarily commented out, ensure their respective package imports are commented out or removed.
- **Verification Command**: Always run `go build ./...` inside `backend-go` folder to confirm code compiles perfectly before commit.

---

## 4. Database Operations
- **Non-Destructive Changes**: Keep database alterations fully backward-compatible.
- **User Permission Warning**: Never run drop table or truncate table migrations automatically. Destructive changes must trigger a strict user prompt approval check.
- **MemStore Sync**: Ensure that saves inside `MemStore` accurately trigger `saveFn` hooks so background Postgres syncs happen reliably.
