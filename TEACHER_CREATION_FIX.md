# Teacher Creation Fix - Duplicate Email Issue

## Problem Summary
When trying to create a teacher with an email that was already used (even from a failed previous attempt), the system would show "email already registered" error and the teacher would not be created.

## Root Causes Identified

### Issue 1: Silent User Creation Failure
- The code used `ON CONFLICT DO NOTHING` when inserting user records
- When a duplicate email existed, the insert silently failed
- The `userID` variable remained empty
- Teacher record was created with empty `UserID`, causing data inconsistency

### Issue 2: Overly Strict Duplicate Check
- The duplicate check only looked at the Users table
- It didn't check if the user was already a teacher
- This prevented reusing existing user accounts for teacher creation
- It blocked legitimate teacher creation after any failed attempt

### Issue 3: Missing Error Handling
- No check for rows affected after user insert
- Database errors were ignored using `_, _ = h.Pool.Exec(...)`
- Failed inserts went undetected

## Solution Implemented

### 1. Smart User Account Reuse
```go
// Check if user with this email already exists
var existingUser *store.User
for _, u := range h.Store.Users {
    if strings.EqualFold(u.Email, body.Email) && u.SchoolID == ctx.SchoolID {
        existingUser = u
        break
    }
}
```

### 2. Proper Teacher Duplication Check
```go
// If user exists, check if they're already a teacher
if existingUser != nil {
    for _, t := range h.Store.Teachers {
        if t.SchoolID == ctx.SchoolID && strings.EqualFold(t.Email, body.Email) {
            h.Store.Unlock()
            return nil, api.NewControlledError("DUPLICATE", "This email is already registered as a teacher.", 400, nil)
        }
    }
}
```

### 3. Reuse Existing User Account
```go
// If user exists, reuse the existing user account
if existingUser != nil {
    userID = existingUser.ID
} else if body.Password != "" {
    // Create new user account
    // ...
}
```

### 4. Proper Error Handling
```go
result, err := h.Pool.Exec(r.Context(), `
    INSERT INTO users (...)
    VALUES (...)
    ON CONFLICT (school_id, email) DO NOTHING
`, ...)

if err != nil {
    h.Store.Unlock()
    return nil, api.NewControlledError("DB_ERROR", "Failed to create user account: "+err.Error(), 500, nil)
}

// Check if insert actually happened (rowsAffected > 0)
if result.RowsAffected() == 0 {
    h.Store.Unlock()
    return nil, api.NewControlledError("DUPLICATE", "This email is already registered in the system.", 400, nil)
}
```

## Benefits of This Fix

1. **Allows legitimate retries**: If teacher creation failed previously but user was created, the system now reuses the existing user account
2. **Better error messages**: Distinguishes between "email exists as user" vs "email exists as teacher"
3. **Data consistency**: Ensures teacher records always have valid user IDs
4. **Proper error handling**: Catches and reports database errors appropriately
5. **School isolation**: Properly scopes email checks to the current school

## Testing Recommendations

### Test Case 1: Normal Teacher Creation
1. Create a new teacher with a fresh email
2. Should succeed and create both user and teacher records

### Test Case 2: Duplicate Teacher Prevention
1. Create a teacher with email "test@example.com"
2. Try to create another teacher with same email
3. Should show: "This email is already registered as a teacher"

### Test Case 3: User Account Reuse (Edge Case)
1. Manually create a user account in the database
2. Try to create a teacher with that email
3. Should succeed and reuse the existing user account

### Test Case 4: Failed Insert Recovery
1. If teacher creation fails after user creation
2. Retry should now work (previously would fail with duplicate email)

## Files Modified
- `/Users/ali/Desktop/EDUEXPLO/Eduplexo/backend-go/internal/domain/teachers/teachers.go`
  - Modified `Create()` function (lines 537-640)

## No Breaking Changes
This fix is backward compatible and doesn't change the API contract or database schema.
