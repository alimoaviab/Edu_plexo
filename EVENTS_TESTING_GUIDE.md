# Events Feature - Testing Guide

## Quick Test

### Step 1: Navigate to Events Page
```
URL: http://localhost:3000/admin/events
```

### Step 2: Click "Add Event" Button
- Look for the blue "Add Event" button in the top right
- A modal form should appear

### Step 3: Fill the Form
```
Title: "Annual Sports Day"
Description: "Annual sports competition for all students"
Event Type: "Sports"
Start Date: 2026-06-15
End Date: 2026-06-16
Start Time: 09:00
End Time: 17:00
Location: "School Ground"
Organizer: "Sports Department"
Visibility: "All"
Status: "Scheduled"
```

### Step 4: Submit
- Click "Create" button
- Should see success toast: "Event created."
- Modal should close
- Event should appear in the list

### Step 5: Verify
- Event appears in the grid/list view
- Event shows correct details
- Status badge shows "Scheduled"
- Can edit and delete the event

---

## Test Cases

### Test 1: Create Event with All Fields
**Expected:** Event created successfully ✅

### Test 2: Create Event with Minimal Fields
**Input:**
- Title: "Test"
- Start Date: 2026-06-15
- Status: "Scheduled"

**Expected:** Event created successfully ✅

### Test 3: Create Event with Different Event Types
**Test each:**
- Academic
- Holiday
- Sports
- Cultural
- Other

**Expected:** All create successfully ✅

### Test 4: Create Event with Different Visibility
**Test each:**
- All
- Specific Classes

**Expected:** All create successfully ✅

### Test 5: Create Event with Different Status
**Test each:**
- Scheduled
- Cancelled
- Completed

**Expected:** All create successfully ✅

### Test 6: Edit Event
1. Create an event
2. Click edit button
3. Change title
4. Click "Update"

**Expected:** Event updated successfully ✅

### Test 7: Delete Event
1. Create an event
2. Click delete button
3. Confirm deletion

**Expected:** Event deleted successfully ✅

### Test 8: Filter Events
1. Create multiple events
2. Use status filter
3. Use search

**Expected:** Filtering works correctly ✅

### Test 9: View Modes
1. Click "Grid" button
2. Click "List" button

**Expected:** Both views display events correctly ✅

---

## Troubleshooting

### Issue: Event not created
**Check:**
1. Browser console for errors
2. Network tab for API response
3. Verify all required fields are filled
4. Check database connection

### Issue: Form validation error
**Check:**
1. Title is not empty
2. Start date is before end date
3. All enum values are correct

### Issue: Event appears but then disappears
**Check:**
1. Page refresh
2. Check if event was actually saved
3. Check database directly

---

## Valid Enum Values

### Event Type
- academic
- holiday
- sports
- cultural
- other

### Visibility
- all
- specific_classes

### Status
- scheduled
- cancelled
- completed

---

## Database Query

To verify events in database:
```javascript
// In MongoDB
db.events.find({})
db.events.findOne({ title: "Annual Sports Day" })
```

---

## API Testing

### Create Event
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "event_type": "academic",
    "start_date": "2026-06-15",
    "end_date": "2026-06-16",
    "visibility": "all",
    "status": "scheduled"
  }'
```

### List Events
```bash
curl http://localhost:3000/api/events
```

### Get Single Event
```bash
curl http://localhost:3000/api/events/{id}
```

### Update Event
```bash
curl -X PATCH http://localhost:3000/api/events/{id} \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'
```

### Delete Event
```bash
curl -X DELETE http://localhost:3000/api/events/{id}
```

---

## Success Criteria

- [ ] Can create events with all valid enum values
- [ ] Events appear in list after creation
- [ ] Can edit events
- [ ] Can delete events
- [ ] Filtering works correctly
- [ ] Both grid and list views work
- [ ] Status badges display correctly
- [ ] No console errors
- [ ] No API errors
- [ ] Database records are created

---

**Status:** Ready for Testing ✅
