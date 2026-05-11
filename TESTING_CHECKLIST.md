# ✅ JWT Fix Testing Checklist

## Pre-Testing Setup

- [ ] Read `JWT_FIX_COMPLETE.txt` for overview
- [ ] Read `IMMEDIATE_ACTION_PLAN.md` for detailed steps
- [ ] Have browser DevTools ready (F12)
- [ ] Have terminal ready for dev server

---

## Step 1: Clear Browser Storage

- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab
- [ ] Run: `localStorage.clear(); sessionStorage.clear();`
- [ ] Verify no errors in console
- [ ] Close DevTools

---

## Step 2: Restart Dev Server

- [ ] Kill current dev server (Ctrl+C)
- [ ] Wait 2 seconds
- [ ] Run: `npm run dev`
- [ ] Wait for "ready - started server on 0.0.0.0:3000"
- [ ] Verify no errors in terminal

---

## Step 3: Login

- [ ] Go to http://localhost:3000/auth/login
- [ ] Enter email: `admin@school.com`
- [ ] Enter password: `admin123`
- [ ] Click "Login" button
- [ ] Wait for redirect to dashboard

---

## Step 4: Verify Login Success

- [ ] ✅ Redirected to `/admin/dashboard`
- [ ] ✅ No 401 errors in console
- [ ] ✅ No "JWT verification failed" errors
- [ ] ✅ Dashboard loads without errors
- [ ] ✅ Token appears in localStorage

**Check token in DevTools Console:**
```javascript
console.log(localStorage.getItem("token") ? "✅ Token found" : "❌ Token missing");
```

---

## Step 5: Test API Calls

Open DevTools Console and run:

```javascript
// Test 1: Academic Years
fetch('/api/academic-years', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
}).then(r => r.json()).then(d => console.log("Academic Years:", d.ok ? "✅ OK" : "❌ Error"));

// Test 2: Classes
fetch('/api/classes', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
}).then(r => r.json()).then(d => console.log("Classes:", d.ok ? "✅ OK" : "❌ Error"));

// Test 3: Teachers
fetch('/api/teachers', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
}).then(r => r.json()).then(d => console.log("Teachers:", d.ok ? "✅ OK" : "❌ Error"));

// Test 4: Students
fetch('/api/students', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
}).then(r => r.json()).then(d => console.log("Students:", d.ok ? "✅ OK" : "❌ Error"));
```

Expected output:
```
Academic Years: ✅ OK
Classes: ✅ OK
Teachers: ✅ OK
Students: ✅ OK
```

- [ ] All API calls return OK
- [ ] No 401 errors
- [ ] No "invalid signature" errors

---

## Step 6: Test Chatbot

- [ ] Navigate to admin dashboard
- [ ] Look for AI/Chatbot section
- [ ] Verify chatbot component loads
- [ ] Try asking: "How many students are there?"
- [ ] Verify response appears (not 401 error)
- [ ] Try asking: "Show me all classes"
- [ ] Verify response appears

---

## Step 7: Check Network Tab

- [ ] Open DevTools Network tab
- [ ] Refresh page
- [ ] Look for API calls
- [ ] Verify all API calls show 200 status
- [ ] Verify no 401 responses
- [ ] Check Authorization headers are present

---

## Step 8: Verify No Errors

- [ ] Open DevTools Console
- [ ] Verify no red error messages
- [ ] Verify no "JWT verification failed" messages
- [ ] Verify no "invalid signature" messages
- [ ] Verify no 401 errors

---

## Final Verification

- [ ] Dashboard loads without errors
- [ ] All API calls return 200 OK
- [ ] Chatbot loads and responds
- [ ] No JWT-related errors in console
- [ ] No 401 Unauthorized responses
- [ ] Token is stored in localStorage

---

## Success Criteria

✅ **All of the following must be true:**

1. Login successful with admin@school.com / admin123
2. Redirected to admin dashboard
3. Token stored in localStorage
4. All API calls return 200 OK
5. No 401 Unauthorized errors
6. No "JWT verification failed" errors
7. Chatbot loads in admin dashboard
8. Chatbot responds to queries
9. No errors in browser console
10. Network tab shows all requests with 200 status

---

## Troubleshooting

### Issue: Still getting 401 errors

**Solution:**
1. Clear browser cache completely (not just localStorage)
2. Close browser completely
3. Reopen browser
4. Clear localStorage again
5. Restart dev server
6. Login again

### Issue: Token not in localStorage

**Solution:**
1. Check if login was successful
2. Check browser console for errors
3. Check if redirected to dashboard
4. Try logging out and logging in again

### Issue: Chatbot not loading

**Solution:**
1. Verify token is in localStorage
2. Check browser console for errors
3. Check Network tab for failed requests
4. Verify API calls return 200 OK

### Issue: API calls still returning 401

**Solution:**
1. Verify JWT_SECRET is same in both .env.local files
2. Verify .next directory was deleted
3. Verify dev server was restarted
4. Verify browser storage was cleared
5. Try logging in again

---

## Documentation Reference

- `JWT_FIX_COMPLETE.txt` - Overview
- `JWT_FIX_GUIDE.md` - Technical details
- `IMMEDIATE_ACTION_PLAN.md` - Step-by-step guide
- `CHANGES_MADE.md` - What was changed
- `JWT_FIX_SUMMARY.txt` - Quick reference

---

## Sign-Off

- [ ] All tests passed
- [ ] No errors found
- [ ] Ready for production

**Tested by**: _______________
**Date**: _______________
**Time**: _______________

---

**Status**: ✅ Ready for Testing
**Date**: May 11, 2026
