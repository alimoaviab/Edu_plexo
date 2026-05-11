# 🔐 JWT Authentication Fix - Complete Guide

## Problem Identified
**JWT verification failed: invalid signature** - The JWT tokens were being signed with one secret but verified with a different secret.

### Root Cause
Two `.env.local` files had different `JWT_SECRET` values:
- **Root `.env.local`**: `JWT_SECRET=dev-secret` (used by shared modules)
- **`school-app/.env.local`**: `JWT_SECRET=dev-secretttyt` (used by Next.js app)

When the frontend generated a token with one secret and the backend tried to verify it with a different secret, verification failed.

## Solution Applied

### 1. ✅ Fixed JWT_SECRET Mismatch
Updated root `.env.local` to match `school-app/.env.local`:
```
JWT_SECRET=dev-secretttyt
```

Both files now use the same secret.

### 2. ✅ Fixed Token Key Inconsistency
Updated AI Assistant components to use correct token key:
- **Before**: Looking for `"auth_token"` in localStorage
- **After**: Looking for `"token"` in localStorage (matches login page)

**Files updated**:
- `school-app/components/ai/AIAssistant.tsx`
- `school-app/app/admin/ai/page.tsx`

### 3. ✅ Cleared Next.js Cache
Removed `.next` directory to force rebuild with new environment variables.

## How to Complete the Fix

### Step 1: Clear Browser Storage
Open browser DevTools (F12) and run in Console:
```javascript
localStorage.clear();
sessionStorage.clear();
```

Or simply clear browser cache/cookies.

### Step 2: Restart Dev Server
```bash
# Kill any running dev server
# Then restart:
npm run dev
```

### Step 3: Login Again
1. Go to http://localhost:3000/auth/login
2. Login with: `admin@school.com` / `admin123`
3. New token will be generated with correct secret

### Step 4: Verify Fix
After login, check browser DevTools:
- **Application** → **Local Storage** → `token` should exist
- **Network** tab should show API calls with `Authorization: Bearer eyJ...`
- API responses should be `200 OK` (not `401 Unauthorized`)

## Verification Checklist

- [ ] Browser localStorage cleared
- [ ] Dev server restarted
- [ ] Logged in with admin@school.com / admin123
- [ ] Token appears in localStorage
- [ ] API calls return 200 (not 401)
- [ ] Chatbot loads in admin dashboard
- [ ] Chatbot can fetch data (students, classes, etc.)

## Technical Details

### JWT Token Flow
1. **Login** (`/api/auth/login`)
   - User submits email/password
   - Backend verifies password
   - Backend generates JWT with `signAuthToken()` using `JWT_SECRET`
   - Token stored in httpOnly cookie AND returned in response
   - Frontend stores token in localStorage

2. **API Request** (any `/api/*` endpoint)
   - Frontend sends token in `Authorization: Bearer <token>` header
   - Backend receives request in middleware
   - Middleware calls `verifyAuthToken()` using same `JWT_SECRET`
   - If secrets match → token verified ✅
   - If secrets don't match → "invalid signature" error ❌

### Environment Variable Loading
- **Root `.env.local`**: Loaded by Node.js for shared modules
- **`school-app/.env.local`**: Loaded by Next.js for app-specific config
- Both must have same `JWT_SECRET` for consistency

## Files Modified

1. `/Users/ali/Desktop/EDUEXPLO/Eduplexo/.env.local`
   - Changed: `JWT_SECRET=dev-secret` → `JWT_SECRET=dev-secretttyt`

2. `/Users/ali/Desktop/EDUEXPLO/Eduplexo/school-app/components/ai/AIAssistant.tsx`
   - Changed: `localStorage.getItem("auth_token")` → `localStorage.getItem("token")`

3. `/Users/ali/Desktop/EDUEXPLO/Eduplexo/school-app/app/admin/ai/page.tsx`
   - Changed: `localStorage.getItem("auth_token")` → `localStorage.getItem("token")`

4. `/Users/ali/Desktop/EDUEXPLO/Eduplexo/school-app/.next/` (deleted)
   - Cleared Next.js cache to force rebuild

## Testing After Fix

### Test 1: Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"admin123"}'
```

Expected response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "admin@school.com",
  "role": "admin",
  "message": "Login successful"
}
```

### Test 2: API Call with Token
```bash
TOKEN="<token_from_login>"
curl -X GET http://localhost:3000/api/academic-years \
  -H "Authorization: Bearer $TOKEN"
```

Expected: `200 OK` with data (not `401 Unauthorized`)

### Test 3: Chatbot
1. Login to admin dashboard
2. Go to AI section
3. Ask: "How many students are there?"
4. Should get response (not 401 error)

## Summary

✅ **Fixed**: JWT secret mismatch between root and app `.env.local`
✅ **Fixed**: Token key inconsistency in AI components
✅ **Cleared**: Next.js cache for fresh build
⏳ **Next**: Restart dev server and clear browser storage

After these steps, all API calls should work with proper JWT authentication.

---

**Status**: Ready for testing
**Date**: May 11, 2026
**Version**: 1.0.0
