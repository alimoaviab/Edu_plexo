# Codebase Issues & Broken Endpoints Report

Based on testing and reviewing the codebase, here are the issues currently causing builds or endpoints to break, along with the steps to fix them.

## 1. Backend Compilation Errors (Multiple `main` declarations)
**Issue:**
The Go backend fails to compile. There are multiple files in the root of `backend-go` that declare `package main` and a `main()` function:
- `test_api.go`
- `test_api2.go`
- `test_plans.go`
Because they are in the same directory, the Go compiler throws a `main redeclared in this block` error, breaking the entire build process.

**How to fix:**
Delete these leftover test scripts or move them to separate subdirectories under `cmd/` if they are still needed.
```bash
cd backend-go
rm test_api.go test_api2.go test_plans.go
```

## 2. Broken Authentication Endpoint Logic (`/api/auth/login`)
**Issue:**
The `TestLogin_Success` unit test in `backend-go/internal/domain/auth/auth_test.go` is failing.
The test expects that when a user logs in with `rememberMe: true`, the session cookie `MaxAge` should be exactly **30 days** (`2592000` seconds). However, the actual endpoint logic in `auth.go` sets the `MaxAge` to **5 years** (`157680000` seconds), which causes the test assertion to fail.

**How to fix:**
Open `backend-go/internal/domain/auth/auth.go` and update the `setSessionCookie` function to correctly assign a 30-day max age when `rememberMe` is true.

```go
func (h *Handler) setSessionCookie(w http.ResponseWriter, token string, rememberMe bool) {
	// ...
	maxAge := 60 * 60 * 24 * 365 // 1 year default
	if rememberMe {
		maxAge = 60 * 60 * 24 * 30 // Update this to 30 days
	}
	// ...
}
```

## 3. Frontend Testing Environment Broken
**Issue:**
Running the frontend test suite via `npm run test` in `school-react-app` fails with a `vitest: not found` error because the required dependencies are missing from the environment.

**How to fix:**
Ensure all Node dependencies are installed prior to running the test suite.
```bash
cd school-react-app
npm install
npm run test
```