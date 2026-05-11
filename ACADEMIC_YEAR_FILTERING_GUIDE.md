# 📅 Academic Year-Based Data Filtering - Implementation Guide

## 🎯 Requirement

Har academic year ka data separate hona chahiye:
- 2026 academic year mein create kiye gaye classes sirf 2026 mein show hon
- 2026 academic year mein create kiye gaye students sirf 2026 mein show hon
- Har year ka data usi year mein show ho, baqi years mein nahi

---

## ✅ Current System Status

System mein already academic year filtering ka infrastructure hai:

### 1. Database Schema
- **Classes**: `academy_care_id` field (references Academic Year)
- **Students**: `class_id` → Class → `academy_care_id`
- **Attendance**: Filtered through class → academic year
- **Exams**: `academy_care_id` field
- **Results**: Filtered through class → academic year
- **Fees**: `academic_year_id` field

### 2. Frontend Context
- **Storage**: `localStorage.getItem("academy_care_id")`
- **Service**: `academy-care-context.ts`
- **Functions**:
  - `getSelectedAcademyCareId()` - Get current selected year
  - `setSelectedAcademyCareId(id)` - Set current year
  - `getAcademyCareQuery()` - Get query string with year ID

### 3. Backend Filtering
- **Service**: `_academy-care-filter.ts`
- **Function**: `resolveClassIdsForAcademyCare(ctx, academicYearId)`
- **Purpose**: Filters classes by academic year, then filters other data by those classes

---

## 🔧 How It Works

### Data Flow

```
Academic Year (2026)
    ↓
Classes (filtered by academy_care_id)
    ↓
Students (filtered by class_id)
    ↓
Attendance, Results, Fees (filtered by student/class)
```

### Example

**Academic Year 2026**:
- Classes: Grade 1-A, Grade 2-B (academy_care_id = "2026_id")
- Students: 500 students in these classes
- Attendance: Only for these students
- Results: Only for these students

**Academic Year 2027**:
- Classes: Grade 1-A, Grade 2-B (academy_care_id = "2027_id")
- Students: New 500 students in these classes
- Attendance: Only for these new students
- Results: Only for these new students

**Result**: Data is completely separate!

---

## 📋 Implementation Checklist

### ✅ Already Implemented

1. **Database Schema**
   - [x] Classes have `academy_care_id`
   - [x] Students linked through `class_id`
   - [x] Exams have `academy_care_id`
   - [x] Fees have `academic_year_id`

2. **Frontend Context**
   - [x] Academic year selection stored in localStorage
   - [x] Context service for getting/setting year
   - [x] Query string helper for API calls

3. **Backend Filtering**
   - [x] `resolveClassIdsForAcademyCare()` function
   - [x] Services filter by academic year
   - [x] Tenant isolation (school_id + academy_care_id)

### ⚠️ Needs Verification

1. **API Routes**
   - [ ] All GET endpoints accept `academy_care_id` query param
   - [ ] All POST endpoints require `academy_care_id` in body
   - [ ] Default to current active academic year if not provided

2. **Frontend Components**
   - [ ] Academic year selector in header/navbar
   - [ ] All list pages use selected academic year
   - [ ] All create forms include academic year field

3. **Data Migration**
   - [ ] Existing data has `academy_care_id` set
   - [ ] Default academic year created
   - [ ] All classes linked to academic year

---

## 🚀 Implementation Steps

### Step 1: Verify Academic Year Selector

Check if academic year selector exists in UI:

**Location**: Header/Navbar component

**Required Features**:
- Dropdown to select academic year
- Shows current selected year
- Updates localStorage on change
- Refreshes data when changed

**Code Example**:
```typescript
import { getSelectedAcademyCareId, setSelectedAcademyCareId } from '@/services/academy-care-context';

function AcademicYearSelector() {
  const [selectedYear, setSelectedYear] = useState(getSelectedAcademyCareId());
  const [academicYears, setAcademicYears] = useState([]);

  useEffect(() => {
    // Fetch academic years
    fetch('/api/academic-years')
      .then(r => r.json())
      .then(data => setAcademicYears(data.data || []));
  }, []);

  const handleChange = (yearId: string) => {
    setSelectedAcademyCareId(yearId);
    setSelectedYear(yearId);
    window.location.reload(); // Refresh to load new year's data
  };

  return (
    <select value={selectedYear} onChange={(e) => handleChange(e.target.value)}>
      {academicYears.map(year => (
        <option key={year._id} value={year._id}>
          {year.name} ({year.year})
        </option>
      ))}
    </select>
  );
}
```

---

### Step 2: Update API Calls

Ensure all API calls include academic year:

**Before**:
```typescript
fetch('/api/classes')
```

**After**:
```typescript
import { getAcademyCareQuery } from '@/services/academy-care-context';

fetch(`/api/classes${getAcademyCareQuery()}`)
// Results in: /api/classes?academy_care_id=xxx
```

---

### Step 3: Update Create Forms

Ensure all create forms include academic year:

**Classes Create Form**:
```typescript
const formData = {
  name: "Grade 1-A",
  section: "A",
  academy_care_id: getSelectedAcademyCareId(), // ✅ Include this
  // ... other fields
};
```

**Students Create Form**:
```typescript
// Students are automatically linked through class_id
// Class already has academy_care_id
const formData = {
  name: "John Doe",
  class_id: selectedClassId, // Class has academy_care_id
  // ... other fields
};
```

---

### Step 4: Verify Backend Services

Check that services filter by academic year:

**Example - Class Service**:
```typescript
export async function listClasses(ctx: RequestContext, filter: any) {
  const academicYearId = filter.academy_care_id;
  
  const query = tenantFilter(ctx, {
    academy_care_id: academicYearId ? new Types.ObjectId(academicYearId) : undefined
  });
  
  const classes = await ClassModel.find(query);
  return classes;
}
```

**Example - Student Service**:
```typescript
export async function listStudents(ctx: RequestContext, filter: any) {
  const academicYearId = filter.academy_care_id;
  
  // Get classes for this academic year
  const classIds = await resolveClassIdsForAcademyCare(ctx, academicYearId);
  
  // Filter students by these classes
  const students = await StudentModel.find(
    tenantFilter(ctx, { class_id: { $in: classIds } })
  );
  
  return students;
}
```

---

## 🧪 Testing Checklist

### Test Scenario 1: Create Data in 2026

1. Select Academic Year: 2026
2. Create Class: "Grade 1-A"
3. Create Students: 10 students in Grade 1-A
4. Mark Attendance: For these students
5. Create Exam: For Grade 1-A
6. Add Results: For these students

**Expected**: All data created with `academy_care_id = 2026_id`

---

### Test Scenario 2: Switch to 2027

1. Select Academic Year: 2027
2. View Classes: Should be empty (no classes in 2027 yet)
3. View Students: Should be empty
4. View Attendance: Should be empty
5. View Exams: Should be empty

**Expected**: No data from 2026 visible

---

### Test Scenario 3: Create Data in 2027

1. Select Academic Year: 2027
2. Create Class: "Grade 1-A" (same name, different year)
3. Create Students: 10 new students
4. Mark Attendance: For these new students

**Expected**: 
- 2027 data separate from 2026
- Can have same class names in different years
- Students are different

---

### Test Scenario 4: Switch Back to 2026

1. Select Academic Year: 2026
2. View Classes: Should show 2026 classes
3. View Students: Should show 2026 students
4. View Attendance: Should show 2026 attendance

**Expected**: 2026 data still intact, 2027 data not visible

---

## 📊 Database Queries

### Check Data Distribution

```javascript
// MongoDB Shell

// Count classes per academic year
db.classes.aggregate([
  { $group: { _id: "$academy_care_id", count: { $sum: 1 } } }
]);

// Count students per academic year (through classes)
db.students.aggregate([
  { $lookup: { from: "classes", localField: "class_id", foreignField: "_id", as: "class" } },
  { $unwind: "$class" },
  { $group: { _id: "$class.academy_care_id", count: { $sum: 1 } } }
]);

// Check if any data is missing academic year
db.classes.find({ academy_care_id: null }).count();
db.classes.find({ academy_care_id: { $exists: false } }).count();
```

---

## 🔍 Common Issues & Solutions

### Issue 1: Data Shows from All Years

**Cause**: API not filtering by academic year

**Solution**: 
- Check if `academy_care_id` query param is being sent
- Verify backend service uses the param
- Check `getAcademyCareQuery()` is being used

---

### Issue 2: No Data Shows

**Cause**: No academic year selected

**Solution**:
- Check `localStorage.getItem("academy_care_id")`
- Set default to current active academic year
- Add academic year selector to UI

---

### Issue 3: Can't Create Data

**Cause**: Academic year not included in create request

**Solution**:
- Add `academy_care_id: getSelectedAcademyCareId()` to form data
- Verify backend accepts and saves the field
- Check database has the field

---

## 📚 Key Files

### Frontend
- `school-app/services/academy-care-context.ts` - Context service
- `school-app/modules/classes/hooks/useClasses.ts` - Class hooks
- `school-app/modules/students/hooks/useStudents.ts` - Student hooks

### Backend
- `shared/services/_academy-care-filter.ts` - Filtering helper
- `shared/services/class.service.ts` - Class service
- `shared/services/student.service.ts` - Student service
- `shared/services/attendance.service.ts` - Attendance service
- `shared/services/result.service.ts` - Result service

### Database Models
- `shared/models/class.model.ts` - Class schema
- `shared/models/student.model.ts` - Student schema
- `shared/models/academic-year.model.ts` - Academic year schema

---

## ✨ Summary

### Current Status
✅ **Infrastructure exists** - Academic year filtering is already implemented
✅ **Database schema** - All tables have academic year references
✅ **Backend services** - Filtering functions exist
✅ **Frontend context** - Year selection stored in localStorage

### What Needs Verification
⚠️ **UI Components** - Academic year selector in header
⚠️ **API Calls** - All calls include academic year param
⚠️ **Create Forms** - All forms include academic year field
⚠️ **Data Migration** - Existing data has academic year set

### Expected Behavior
✅ 2026 data only shows in 2026
✅ 2027 data only shows in 2027
✅ Each year is completely isolated
✅ Can have same class names in different years
✅ Students are separate per year

---

**Status**: Infrastructure exists, needs verification and testing
**Date**: May 11, 2026
**Priority**: High - Data isolation is critical
