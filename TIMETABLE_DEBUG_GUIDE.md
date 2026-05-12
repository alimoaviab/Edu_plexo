# Timetable Display Issue - Debug Guide

## 🔍 Issue Description

**Problem:** Timetable entries create ho rahe hain lekin show nahi ho rahe

**Expected:** 
- All classes ka timetable show ho
- Per class filter work kare
- Grid mein properly display ho

---

## ✅ Code Changes Made

### 1. Added Debug Logging

#### TimetableGrid.tsx
```typescript
// Line 18: Added useEffect for debugging
useEffect(() => {
  console.log('📊 TimetableGrid received records:', records);
  console.log('📊 Total records:', records?.length || 0);
  if (records && records.length > 0) {
    console.log('📊 Sample record:', records[0]);
  }
}, [records]);
```

#### TimetablePage.tsx
```typescript
// Added useEffect for debugging state
useEffect(() => {
  console.log('🔍 Timetable state:', state);
  console.log('🔍 Class ID filter:', classId);
  console.log('🔍 Data count:', state.data?.length || 0);
}, [state, classId]);
```

---

## 🧪 Testing Steps

### Step 1: Check Browser Console

1. Open `/admin/timetable` page
2. Open browser console (F12)
3. Look for these logs:

```
🔍 Timetable state: { status: "success", data: [...] }
🔍 Class ID filter: ""
🔍 Data count: 5

📊 TimetableGrid received records: [...]
📊 Total records: 5
📊 Sample record: { _id: "...", day_of_week: 1, ... }
```

### Step 2: Check API Response

1. Open Network tab in browser
2. Look for `/api/timetable` request
3. Check response:

```json
{
  "ok": true,
  "success": true,
  "data": [
    {
      "_id": "...",
      "class_id": "...",
      "class_name": "Class 10-A",
      "subject_name": "Mathematics",
      "teacher_name": "John Doe",
      "day_of_week": 1,
      "start_time": "09:00",
      "end_time": "10:00",
      "room": "Room 101"
    }
  ]
}
```

### Step 3: Check Database

```bash
# Connect to MongoDB
mongosh "mongodb://localhost:27017/eduplexo"

# Check timetable collection
db.timetables.find().pretty()

# Expected fields:
# - school_id
# - academic_year_id
# - class_id
# - teacher_id
# - subject_id or subject
# - day_of_week (number 1-7)
# - start_time (string "HH:MM")
# - end_time (string "HH:MM")
# - room
```

---

## 🐛 Common Issues & Solutions

### Issue 1: No Data in Console
**Symptom:** `Data count: 0`

**Possible Causes:**
1. No timetable entries in database
2. Academic year filter blocking data
3. Class filter too restrictive

**Solution:**
```typescript
// Check if academic year is set
console.log('Academic Year ID:', localStorage.getItem('selected_academic_year_id'));

// Try without class filter
// Go to: /admin/timetable (without ?class_id=...)
```

### Issue 2: Data Exists But Not Showing in Grid
**Symptom:** `Data count: 5` but grid is empty

**Possible Causes:**
1. `day_of_week` format mismatch
2. `start_time` format issue
3. Grid filtering logic problem

**Solution:**
Check the sample record format:
```javascript
// In console, check:
console.log('Day of week type:', typeof records[0].day_of_week);
console.log('Day of week value:', records[0].day_of_week);
console.log('Start time:', records[0].start_time);

// Should be:
// Day of week type: "number"
// Day of week value: 1 (Monday) to 7 (Sunday)
// Start time: "09:00" (HH:MM format)
```

### Issue 3: Wrong Day Mapping
**Symptom:** Entries showing on wrong days

**Day Mapping:**
```
1 = Monday
2 = Tuesday
3 = Wednesday
4 = Thursday
5 = Friday
6 = Saturday
7 = Sunday
```

**Fix:** Check TimetableGrid.tsx line 90-95:
```typescript
const dayNumber = dayIdx + 1; // dayIdx is 0-6, dayNumber is 1-7
const slots = (records || []).filter(r => {
  const rDay = Number(r.day_of_week);
  if (rDay !== dayNumber) return false;
  // ...
});
```

### Issue 4: Time Slot Not Matching
**Symptom:** Entry exists but not in correct time row

**Fix:** Check time comparison logic:
```typescript
const rHour = parseInt(r.start_time.split(':')[0]);
const tHour = parseInt(time.split(':')[0]);
return rHour === tHour;
```

**Example:**
- Entry: `start_time: "09:00"`
- Time slot: `"09:00"`
- Should match: ✅

---

## 🔧 Quick Fixes

### Fix 1: Force Refresh Data

```typescript
// In TimetablePage.tsx, add refresh button
<button onClick={() => refresh()}>
  Refresh Timetable
</button>
```

### Fix 2: Remove Class Filter

```typescript
// In TimetablePage.tsx, temporarily disable class filter
const { state, ... } = useTimetable(); // Remove filters
```

### Fix 3: Check Academic Year

```typescript
// In browser console
localStorage.getItem('selected_academic_year_id')

// If null or undefined, set it:
localStorage.setItem('selected_academic_year_id', 'YOUR_ACADEMIC_YEAR_ID')
```

---

## 📊 Expected Data Flow

```
1. User opens /admin/timetable
   ↓
2. TimetablePage loads
   ↓
3. useTimetable hook calls listTimetable()
   ↓
4. API: GET /api/timetable?academic_year_id=...&class_id=...
   ↓
5. Backend: listTimetable() in timetable.service.ts
   ↓
6. MongoDB query with filters
   ↓
7. Returns array of records
   ↓
8. TimetableGrid receives records
   ↓
9. Grid filters by day and time
   ↓
10. PeriodCard displays each entry
```

---

## 🎯 What to Check Now

### 1. Open Browser Console
```
Go to: http://localhost:3000/admin/timetable
Press: F12
Look for: 🔍 and 📊 emoji logs
```

### 2. Check Network Tab
```
Filter: /api/timetable
Check: Response status (200?)
Check: Response data (array with items?)
```

### 3. Verify Database
```bash
mongosh "mongodb://localhost:27017/eduplexo"
db.timetables.countDocuments()
db.timetables.findOne()
```

### 4. Test Without Filters
```
URL: http://localhost:3000/admin/timetable
(Remove any ?class_id=... from URL)
```

---

## 📝 Sample Working Record

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "class_id": "507f1f77bcf86cd799439012",
  "class_name": "Class 10-A",
  "section": "A",
  "subject_id": "507f1f77bcf86cd799439013",
  "subject_name": "Mathematics",
  "subject_code": "MATH101",
  "teacher_id": "507f1f77bcf86cd799439014",
  "teacher_name": "John Doe",
  "day_of_week": 1,
  "period_number": 1,
  "start_time": "09:00",
  "end_time": "10:00",
  "room": "Room 101",
  "created_at": "2026-05-12T10:00:00.000Z",
  "updated_at": "2026-05-12T10:00:00.000Z"
}
```

---

## 🚀 Next Steps

1. **Run the app:** `npm run dev`
2. **Open timetable page:** `/admin/timetable`
3. **Check console logs** for debugging info
4. **Share the console output** with me if issue persists

---

## 📞 If Still Not Working

**Send me:**
1. Browser console logs (🔍 and 📊 messages)
2. Network tab response for `/api/timetable`
3. One sample document from `db.timetables.findOne()`

**I will:**
- Identify exact issue
- Provide targeted fix
- Update code if needed

---

**Status:** ✅ Debug logging added  
**Date:** May 12, 2026  
**Next:** Check console logs and share output

