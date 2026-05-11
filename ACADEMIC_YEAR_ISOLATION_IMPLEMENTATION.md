# 📅 Academic Year Data Isolation - Complete Implementation

## 🎯 Goal

**Requirement**: Har academic year ka data completely separate hona chahiye
- 2026 mein create kiya gaya data sirf 2026 mein show ho
- 2027 mein create kiya gaya data sirf 2027 mein show ho
- Koi data mix na ho

---

## ✅ Solution Overview

System mein already infrastructure hai, bas ensure karna hai ke:
1. Har API call mein `academy_care_id` parameter ho
2. Har create form mein current academic year automatically set ho
3. UI mein academic year selector ho

---

## 🔧 Implementation Steps

### Step 1: Add Academic Year Selector to Header

Sabse pehle header mein academic year selector add karein:

**File**: `school-app/components/layout/AdminHeader.tsx` (or similar)

```typescript
"use client";

import { useEffect, useState } from "react";
import { getSelectedAcademyCareId, setSelectedAcademyCareId } from "@/services/academy-care-context";

export function AcademicYearSelector() {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load academic years
    fetch('/api/academic-years')
      .then(r => r.json())
      .then(data => {
        const years = data.data || [];
        setAcademicYears(years);
        
        // Set default to current active year or first year
        const currentId = getSelectedAcademyCareId();
        if (currentId) {
          setSelectedYear(currentId);
        } else {
          const activeYear = years.find((y: any) => y.is_active);
          const defaultYear = activeYear || years[0];
          if (defaultYear) {
            setSelectedYear(defaultYear._id);
            setSelectedAcademyCareId(defaultYear._id);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load academic years:', err);
        setLoading(false);
      });
  }, []);

  const handleChange = (yearId: string) => {
    setSelectedAcademyCareId(yearId);
    setSelectedYear(yearId);
    
    // Reload page to fetch new year's data
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="h-10 w-40 bg-gray-100 animate-pulse rounded-lg"></div>
    );
  }

  if (academicYears.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-gray-400 text-[20px]">
        calendar_today
      </span>
      <select
        value={selectedYear}
        onChange={(e) => handleChange(e.target.value)}
        className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg font-bold text-sm text-gray-700 hover:border-blue-500 focus:border-blue-600 focus:outline-none transition-colors"
      >
        {academicYears.map(year => (
          <option key={year._id} value={year._id}>
            {year.name} ({year.year})
            {year.is_active ? ' - Active' : ''}
          </option>
        ))}
      </select>
    </div>
  );
}
```

**Add to Header**:
```typescript
// In your header component
import { AcademicYearSelector } from './AcademicYearSelector';

export function AdminHeader() {
  return (
    <header className="...">
      {/* Other header content */}
      <AcademicYearSelector />
      {/* User menu, etc */}
    </header>
  );
}
```

---

### Step 2: Update All List Pages

Ensure all list pages use academic year filter:

**Example - Classes List**:

```typescript
import { getAcademyCareQuery } from '@/services/academy-care-context';

export function ClassPage() {
  const { state, addClass } = useClasses();
  
  // Fetch with academic year filter
  useEffect(() => {
    const query = getAcademyCareQuery(); // Returns ?academy_care_id=xxx
    fetch(`/api/classes${query}`)
      .then(r => r.json())
      .then(data => {
        // Handle data
      });
  }, []);
  
  // Rest of component...
}
```

**Apply to all list pages**:
- Classes list
- Students list
- Attendance list
- Exams list
- Results list
- Timetable list

---

### Step 3: Update All Create Forms

Ensure all create forms include academic year:

**Example - Class Create Form**:

```typescript
import { getSelectedAcademyCareId } from '@/services/academy-care-context';

export function ClassCreateForm() {
  const handleSubmit = async (formData: any) => {
    const data = {
      ...formData,
      academy_care_id: getSelectedAcademyCareId(), // ✅ Add this
    };
    
    const response = await fetch('/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    // Handle response...
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

**Apply to all create forms**:
- Class create
- Exam create
- Timetable create
- Any other entity that should be year-specific

---

### Step 4: Update Backend Services

Ensure backend services filter by academic year:

**Example - Class Service**:

```typescript
// shared/services/class.service.ts

export async function listClasses(
  ctx: RequestContext,
  filter: { academy_care_id?: string } = {}
): Promise<ServiceResult<ClassRow[]>> {
  return serviceTry(async () => {
    await connectDb();
    assertPermission(ctx, "classes", "view");

    // Build query with academic year filter
    const query: any = tenantFilter(ctx);
    
    if (filter.academy_care_id) {
      query.academy_care_id = new Types.ObjectId(filter.academy_care_id);
    }

    const rows = await ClassModel.find(query)
      .populate("academy_care_id", "year start_date end_date is_active")
      .populate("teacher_ids", "first_name last_name phone")
      .populate("class_teacher_id", "first_name last_name phone")
      .lean();

    return rows.map(toClassRow);
  });
}
```

**Apply to all services**:
- Class service ✅
- Student service (filter by class → academic year)
- Attendance service (filter by class → academic year)
- Exam service ✅
- Result service (filter by class → academic year)
- Timetable service ✅

---

### Step 5: Update API Routes

Ensure API routes accept and use academic year parameter:

**Example - Classes API**:

```typescript
// school-app/app/api/classes/route.ts

export async function GET(request: NextRequest) {
  try {
    const ctx = authenticateRequest(sessionRequest(request), "school");
    const { searchParams } = request.nextUrl;
    
    // Get academic year from query params
    const academy_care_id = searchParams.get("academy_care_id") || undefined;
    
    const result = await listClasses(ctx, { academy_care_id });
    
    return NextResponse.json(result, { 
      status: result.ok ? 200 : result.error.status ?? 400 
    });
  } catch (error) {
    console.error("[GET /api/classes] Error:", error);
    return NextResponse.json(
      fail("UNAUTHORIZED", "Authentication required.", 401), 
      { status: 401 }
    );
  }
}
```

**Apply to all API routes**:
- `/api/classes` ✅
- `/api/students` ✅
- `/api/attendance` ✅
- `/api/exams` ✅
- `/api/results` ✅
- `/api/timetable` ✅

---

## 🧪 Testing Guide

### Test 1: Create Data in 2026

1. **Select Academic Year**: 2026
2. **Create Class**: 
   - Name: "Grade 1-A"
   - Section: "A"
   - Verify `academy_care_id` is set to 2026's ID
3. **Create Students**:
   - Add 10 students to Grade 1-A
   - Verify they're linked to the class
4. **Mark Attendance**:
   - Mark attendance for these students
   - Verify attendance is recorded
5. **Create Exam**:
   - Create exam for Grade 1-A
   - Verify `academy_care_id` is set to 2026's ID

**Expected Result**: All data created with 2026 academic year

---

### Test 2: Switch to 2027

1. **Select Academic Year**: 2027 (from header dropdown)
2. **View Classes**: Should be empty
3. **View Students**: Should be empty
4. **View Attendance**: Should be empty
5. **View Exams**: Should be empty

**Expected Result**: No data from 2026 visible

---

### Test 3: Create Data in 2027

1. **Select Academic Year**: 2027
2. **Create Class**:
   - Name: "Grade 1-A" (same name as 2026)
   - Section: "A"
   - Verify `academy_care_id` is set to 2027's ID
3. **Create Students**:
   - Add 10 new students
   - Verify they're in 2027's Grade 1-A
4. **Mark Attendance**:
   - Mark attendance for these new students

**Expected Result**: 
- 2027 data is separate from 2026
- Can have same class names in different years
- Students are different

---

### Test 4: Switch Back to 2026

1. **Select Academic Year**: 2026
2. **View Classes**: Should show 2026's Grade 1-A
3. **View Students**: Should show 2026's 10 students
4. **View Attendance**: Should show 2026's attendance

**Expected Result**: 2026 data still intact, 2027 data not visible

---

## 📊 Database Verification

### Check Data in MongoDB

```javascript
// MongoDB Shell

// 1. Check classes per academic year
db.classes.aggregate([
  {
    $group: {
      _id: "$academy_care_id",
      count: { $sum: 1 },
      classes: { $push: "$name" }
    }
  }
]);

// 2. Check students per academic year (through classes)
db.students.aggregate([
  {
    $lookup: {
      from: "classes",
      localField: "class_id",
      foreignField: "_id",
      as: "class"
    }
  },
  { $unwind: "$class" },
  {
    $group: {
      _id: "$class.academy_care_id",
      count: { $sum: 1 }
    }
  }
]);

// 3. Check if any classes are missing academic year
db.classes.find({
  $or: [
    { academy_care_id: null },
    { academy_care_id: { $exists: false } }
  ]
}).count();

// 4. View sample data
db.classes.find().limit(5).pretty();
```

---

## 🔍 Common Issues & Solutions

### Issue 1: "No data showing"

**Cause**: No academic year selected

**Solution**:
```typescript
// Check localStorage
console.log(localStorage.getItem("academy_care_id"));

// If null, set default
import { setSelectedAcademyCareId } from '@/services/academy-care-context';
setSelectedAcademyCareId("your-academic-year-id");
```

---

### Issue 2: "Data from all years showing"

**Cause**: API not filtering by academic year

**Solution**:
1. Check if `getAcademyCareQuery()` is being used in fetch calls
2. Verify backend service uses the `academy_care_id` parameter
3. Check API route extracts the query parameter

---

### Issue 3: "Can't create data"

**Cause**: Academic year not included in create request

**Solution**:
```typescript
// Add to form data
const data = {
  ...formData,
  academy_care_id: getSelectedAcademyCareId(), // ✅ Add this
};
```

---

### Issue 4: "Existing data not showing"

**Cause**: Existing data doesn't have `academy_care_id` set

**Solution**: Run migration script
```javascript
// MongoDB Shell

// Get current active academic year
const activeYear = db.academic_years.findOne({ is_active: true });

// Update all classes without academic year
db.classes.updateMany(
  {
    $or: [
      { academy_care_id: null },
      { academy_care_id: { $exists: false } }
    ]
  },
  {
    $set: { academy_care_id: activeYear._id }
  }
);

// Verify
db.classes.find({ academy_care_id: activeYear._id }).count();
```

---

## 📋 Implementation Checklist

### Frontend

- [ ] Academic year selector added to header
- [ ] Selector shows all academic years
- [ ] Selector saves selection to localStorage
- [ ] Page reloads when year changes
- [ ] All list pages use `getAcademyCareQuery()`
- [ ] All create forms use `getSelectedAcademyCareId()`

### Backend

- [ ] All services accept `academy_care_id` parameter
- [ ] All services filter by academic year
- [ ] All API routes extract `academy_care_id` from query
- [ ] All API routes pass parameter to services

### Database

- [ ] All classes have `academy_care_id` set
- [ ] All exams have `academy_care_id` set
- [ ] All fees have `academic_year_id` set
- [ ] No null/missing academic year references

### Testing

- [ ] Can create data in 2026
- [ ] Can switch to 2027
- [ ] 2027 shows no data initially
- [ ] Can create data in 2027
- [ ] Can switch back to 2026
- [ ] 2026 data still intact
- [ ] Data is completely isolated

---

## ✨ Summary

### What This Achieves

✅ **Complete Data Isolation**: Each academic year's data is separate
✅ **No Data Mixing**: 2026 data never shows in 2027
✅ **Reusable Names**: Can have "Grade 1-A" in multiple years
✅ **Easy Switching**: Change year from header dropdown
✅ **Automatic Filtering**: All queries automatically filtered

### Key Components

1. **Academic Year Selector** - UI component in header
2. **Context Service** - `academy-care-context.ts`
3. **Backend Filtering** - `_academy-care-filter.ts`
4. **Database Schema** - `academy_care_id` field

### Expected Behavior

- User selects 2026 → sees only 2026 data
- User creates class → automatically tagged with 2026
- User switches to 2027 → sees only 2027 data
- User creates class → automatically tagged with 2027
- Data never mixes between years

---

**Status**: Implementation guide complete
**Date**: May 11, 2026
**Priority**: High - Critical for data integrity
