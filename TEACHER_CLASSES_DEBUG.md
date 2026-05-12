# Teacher Classes Not Loading - Debug Guide

## 🔍 Issue
Teacher dashboard `/teacher/classes` page mein classes load nahi ho rahi hain.

---

## ✅ Changes Made

### 1. Frontend Debugging (teacher/classes/page.tsx)
```typescript
// Added comprehensive console logging
console.log('🔍 Fetching teacher classes...');
console.log('🔍 User:', user);
console.log('🔍 Profile ID:', user?.profileId);
console.log('🔍 Using teacher ID:', teacherId);
console.log('🔍 API Response:', result);
```

### 2. Backend Debugging (teacher-portal.service.ts)
```typescript
// Added detailed logging throughout the function
console.log('🔍 getTeacherDashboardData called');
console.log('👨‍🏫 Teacher:', { id, name });
console.log('📚 Assigned classes found:', count);
console.log('✅ Dashboard data prepared');
```

---

## 🧪 Testing Steps

### Step 1: Check Browser Console

1. Login as Teacher
2. Go to: `http://localhost:3000/teacher/classes`
3. Open Console (F12)
4. Look for logs:

```
🔍 Fetching teacher classes...
🔍 User: { email: "...", role: "teacher", profileId: "..." }
🔍 Profile ID: "507f1f77bcf86cd799439011"
🔍 Using teacher ID: "507f1f77bcf86cd799439011"
🔍 API Response: { ok: true, data: {...} }
✅ Classes loaded: 3
```

### Step 2: Check Terminal/Server Logs

Look for backend logs:

```
🔍 getTeacherDashboardData called
🔍 Context: { school_id: "...", user_id: "...", role: "teacher" }
🔍 Teacher ID: session
🔍 Resolving teacher profile...
✅ Teacher resolved: 507f1f77bcf86cd799439011
👨‍🏫 Teacher: { id: "...", name: "John Doe" }
📚 Timetable class IDs: 2
📚 Assigned classes found: 3
✅ Dashboard data prepared
✅ Classes: 3
```

### Step 3: Check Network Tab

1. Open Network tab
2. Filter: `/api/teachers/`
3. Check response:

```json
{
  "ok": true,
  "success": true,
  "data": {
    "teacher": {...},
    "classes": [
      {
        "id": "...",
        "name": "Class 10-A",
        "section": "A",
        "enrolled_students": 25,
        ...
      }
    ],
    "stats": {
      "totalClasses": 3,
      "totalStudents": 75
    }
  }
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: No Teacher Profile Found
**Symptom:** 
```
❌ No teacher profile found
🔧 Returning mock payload
```

**Cause:** Teacher record doesn't exist in database

**Solution:**
```bash
# Check if teacher exists
mongosh "mongodb://localhost:27017/eduplexo"
db.teachers.find().pretty()

# If no teachers, create one via Admin panel:
# Go to: /admin/teachers
# Click: "Add Teacher"
# Fill form and save
```

### Issue 2: Teacher Has No Classes
**Symptom:**
```
✅ Teacher resolved: 507f...
📚 Assigned classes found: 0
```

**Cause:** Teacher not assigned to any classes

**Solution:**
```bash
# Option A: Assign via Admin Panel
# 1. Go to /admin/classes
# 2. Edit a class
# 3. Add teacher to "Teacher IDs" or "Class Teacher"

# Option B: Assign via Timetable
# 1. Go to /admin/timetable
# 2. Create timetable entry
# 3. Select teacher and class
```

### Issue 3: Academic Year Filter Blocking Data
**Symptom:**
```
📚 Assigned classes found: 0
(But classes exist in database)
```

**Cause:** Academic year mismatch

**Solution:**
```javascript
// In browser console, check:
localStorage.getItem('selected_academic_year_id')

// If wrong, update:
localStorage.setItem('selected_academic_year_id', 'CORRECT_ACADEMIC_YEAR_ID')

// Then refresh page
```

### Issue 4: User Not Linked to Teacher Profile
**Symptom:**
```
🔍 Looking up by user_id: 507f...
🔍 Teacher found by user_id: false
🔧 Dev mode: Using first teacher in database
```

**Cause:** Teacher record's `user_id` doesn't match logged-in user

**Solution:**
```bash
# Update teacher record
mongosh "mongodb://localhost:27017/eduplexo"

# Find your user ID
db.users.findOne({ email: "teacher@example.com" })

# Update teacher record
db.teachers.updateOne(
  { email: "teacher@example.com" },
  { $set: { user_id: ObjectId("YOUR_USER_ID") } }
)
```

---

## 📊 Expected Data Flow

```
1. User logs in as Teacher
   ↓
2. Frontend: /teacher/classes page loads
   ↓
3. Frontend: Calls GET /api/teachers/session
   ↓
4. Backend: getTeacherDashboardData()
   ↓
5. Backend: Resolves teacher profile
   ↓
6. Backend: Finds assigned classes
   ↓
7. Backend: Returns classes array
   ↓
8. Frontend: Displays classes in grid/list
```

---

## 🔧 Quick Fixes

### Fix 1: Create Test Teacher

```bash
# Via Admin Panel
1. Login as Admin
2. Go to /admin/teachers
3. Click "Add Teacher"
4. Fill:
   - First Name: John
   - Last Name: Doe
   - Email: teacher@test.com
   - Employee No: EMP001
5. Save
```

### Fix 2: Assign Teacher to Class

```bash
# Via Admin Panel
1. Go to /admin/classes
2. Select a class
3. Click Edit
4. In "Teacher IDs" field, select the teacher
5. Save
```

### Fix 3: Create Timetable Entry

```bash
# Via Admin Panel
1. Go to /admin/timetable
2. Click "Create Entry"
3. Select:
   - Class
   - Teacher
   - Subject
   - Day & Time
4. Save
```

---

## 📝 Database Checks

### Check 1: Teacher Exists
```javascript
db.teachers.find().pretty()

// Expected:
{
  "_id": ObjectId("..."),
  "first_name": "John",
  "last_name": "Doe",
  "email": "teacher@test.com",
  "user_id": ObjectId("..."),
  "school_id": "...",
  "status": "active"
}
```

### Check 2: Classes Exist
```javascript
db.classes.find({ status: "active" }).pretty()

// Expected:
{
  "_id": ObjectId("..."),
  "name": "Class 10-A",
  "section": "A",
  "teacher_ids": [ObjectId("TEACHER_ID")],
  "school_id": "...",
  "academic_year_id": ObjectId("..."),
  "status": "active"
}
```

### Check 3: Teacher-Class Link
```javascript
// Check if teacher is linked to classes
db.classes.find({
  $or: [
    { teacher_ids: ObjectId("TEACHER_ID") },
    { class_teacher_id: ObjectId("TEACHER_ID") },
    { "subjects.teacher_id": ObjectId("TEACHER_ID") }
  ]
}).pretty()
```

---

## 🎯 What to Check Now

1. **Open `/teacher/classes` page**
2. **Check browser console** for 🔍 logs
3. **Check terminal** for backend logs
4. **Share the logs** with me if issue persists

---

## 📞 If Still Not Working

**Send me:**
1. Browser console logs (all 🔍 messages)
2. Terminal/server logs (backend logs)
3. Network tab response for `/api/teachers/session`
4. Result of: `db.teachers.findOne()`

**I will:**
- Identify exact issue
- Provide targeted fix
- Help setup test data if needed

---

**Status:** ✅ Debug logging added  
**Date:** May 12, 2026  
**Next:** Check console logs and share output

