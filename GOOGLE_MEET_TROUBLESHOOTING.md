# Google Meet Integration - Troubleshooting Guide

## Error: "Invalid Video Call Name"

### What This Means
Google Meet received a malformed or invalid meeting link. The link either:
- Is incomplete or corrupted
- Doesn't follow the correct format
- Wasn't generated properly by Google Calendar API

---

## Diagnosis & Solutions

### Issue 1: hangoutLink is `undefined` in Backend

**Symptoms:**
```
❌ CRITICAL: hangoutLink not generated!
Full event response: {...}
```

**Causes:**
1. `conferenceDataVersion: 1` not set in API call
2. `conferenceSolutionKey.type` is not `'hangoutsMeet'`
3. Google Cloud Calendar API not enabled
4. OAuth scopes don't include calendar.events

**Solutions:**

```typescript
// ✅ Fix 1: Add conferenceDataVersion
const response = await calendar.events.insert({
  calendarId: 'primary',
  conferenceDataVersion: 1,  // ← ADD THIS
  requestBody: event,
});

// ✅ Fix 2: Verify conferenceSolutionKey
const event = {
  conferenceData: {
    createRequest: {
      requestId: `meet-${Date.now()}-${Math.random()}`,
      conferenceSolutionKey: {
        type: 'hangoutsMeet',  // ← MUST be exactly this
      },
    },
  },
};

// ✅ Fix 3: Check Google Cloud Console
// 1. Go to Google Cloud Console
// 2. Enable "Google Calendar API"
// 3. Verify OAuth scopes include:
//    - https://www.googleapis.com/auth/calendar.events
//    - https://www.googleapis.com/auth/calendar
```

**Verification:**
```bash
# Check if Calendar API is enabled
curl https://www.googleapis.com/calendar/v3/calendars/primary \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Should return calendar details, not 403 Forbidden
```

---

### Issue 2: Link is `undefined` in Frontend

**Symptoms:**
```
🎥 LiveClassCard Rendered:
  Meeting Link: undefined
```

**Causes:**
1. API not returning meetingLink
2. Component not receiving meetingLink prop
3. Data not being passed through state

**Solutions:**

```typescript
// ✅ Fix 1: Verify API response
// In browser console:
fetch('/api/live/classes')
  .then(r => r.json())
  .then(data => {
    console.log('Full response:', data);
    console.log('First class:', data.data[0]);
    console.log('Meeting link:', data.data[0]?.meetingLink);
  });

// ✅ Fix 2: Check component props
// In LiveClassCard.tsx
console.log('Props received:', liveClass);
console.log('Meeting link:', liveClass.meetingLink);

// ✅ Fix 3: Verify data flow
// Schedule → API → State → Component
// Add logs at each step
```

---

### Issue 3: Link Format is Wrong

**Symptoms:**
```
Meeting Link: localhost:3000/https://meet.google.com/abc-defg-hij
// OR
Meeting Link: /https://meet.google.com/abc-defg-hij
// OR
Meeting Link: meet.google.com/abc-defg-hij (no https://)
```

**Causes:**
1. Using React Router `<Link>` instead of `<a>` tag
2. Link not being passed as absolute URL
3. Link being treated as relative path

**Solutions:**

```tsx
// ❌ WRONG - Using Next.js Link
import Link from 'next/link';
<Link href={liveClass.meetingLink}>Join</Link>
// Result: localhost:3000/https://meet.google.com/...

// ✅ CORRECT - Using HTML <a> tag
<a
  href={liveClass.meetingLink}
  target="_blank"
  rel="noopener noreferrer"
>
  Join Live Class
</a>
// Result: Opens https://meet.google.com/... in new tab

// ✅ CORRECT - Verify link format
if (liveClass.meetingLink?.startsWith('https://meet.google.com/')) {
  // Link is valid
} else {
  console.error('Invalid link format:', liveClass.meetingLink);
}
```

---

### Issue 4: Link Opens in Same Tab

**Symptoms:**
- Clicking Join button navigates to a 404 page
- URL shows `localhost:3000/https://meet.google.com/...`

**Causes:**
1. Missing `target="_blank"` attribute
2. Using React Router Link component
3. onClick handler preventing default behavior

**Solutions:**

```tsx
// ✅ CORRECT
<a
  href={liveClass.meetingLink}
  target="_blank"              // ← REQUIRED
  rel="noopener noreferrer"    // ← REQUIRED for security
  onClick={() => {
    console.log('Opening:', liveClass.meetingLink);
    // Don't prevent default - let browser handle it
  }}
>
  Join Live Class
</a>

// ❌ WRONG
<a
  href={liveClass.meetingLink}
  onClick={(e) => {
    e.preventDefault();  // ← This breaks the link
    window.open(liveClass.meetingLink);
  }}
>
  Join Live Class
</a>
```

---

### Issue 5: Google Meet Shows "Invalid Video Call Name"

**Symptoms:**
- Link opens in new tab
- Google Meet page loads
- Error message: "Invalid video call name"

**Causes:**
1. Link is malformed (missing characters)
2. Link is incomplete
3. Link was corrupted during transmission
4. Meeting ID is invalid

**Solutions:**

```typescript
// ✅ Verify link format
const validMeetLink = /^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/i;

if (validMeetLink.test(liveClass.meetingLink)) {
  console.log('✅ Link format is valid');
} else {
  console.error('❌ Link format is invalid:', liveClass.meetingLink);
}

// ✅ Check link length
// Valid: https://meet.google.com/abc-defg-hij (approximately 35 characters)
console.log('Link length:', liveClass.meetingLink?.length);

// ✅ Check for encoding issues
console.log('Encoded link:', encodeURIComponent(liveClass.meetingLink));
console.log('Decoded link:', decodeURIComponent(liveClass.meetingLink));
```

**Verification:**
```bash
# Test link directly in browser
# Copy from console and paste in address bar
# Should open Google Meet without errors
```

---

### Issue 6: Link Works in Console but Not in UI

**Symptoms:**
- Console shows correct link
- Copying and pasting link works
- But clicking button doesn't work

**Causes:**
1. Link is being modified by React
2. Event handler is preventing default
3. Link is being URL-encoded incorrectly

**Solutions:**

```tsx
// ✅ Debug the actual href attribute
<a
  href={liveClass.meetingLink}
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => {
    const href = event.currentTarget.getAttribute('href');
    console.log('Actual href:', href);
    console.log('Expected:', liveClass.meetingLink);
    console.log('Match:', href === liveClass.meetingLink);
  }}
>
  Join Live Class
</a>

// ✅ Use useEffect to verify
useEffect(() => {
  if (liveClass.meetingLink) {
    const linkElement = document.querySelector('a[href*="meet.google.com"]');
    if (linkElement) {
      console.log('Link element href:', linkElement.getAttribute('href'));
    }
  }
}, [liveClass.meetingLink]);
```

---

## Complete Debugging Workflow

### Step 1: Backend Verification
```typescript
// Add to calendar.service.ts
console.log('=== BACKEND DEBUG ===');
console.log('1. Event created:', createdEvent.id);
console.log('2. hangoutLink:', createdEvent.hangoutLink);
console.log('3. Link type:', typeof createdEvent.hangoutLink);
console.log('4. Link valid:', createdEvent.hangoutLink?.startsWith('https://'));
console.log('====================');
```

**Expected Output:**
```
=== BACKEND DEBUG ===
1. Event created: abc123def456
2. hangoutLink: https://meet.google.com/abc-defg-hij
3. Link type: string
4. Link valid: true
====================
```

### Step 2: API Response Verification
```javascript
// In browser console
fetch('/api/live/classes')
  .then(r => r.json())
  .then(data => {
    console.log('=== API RESPONSE DEBUG ===');
    console.log('1. Response ok:', data.ok);
    console.log('2. Response success:', data.success);
    console.log('3. Data array:', Array.isArray(data.data));
    console.log('4. First item:', data.data[0]);
    console.log('5. Meeting link:', data.data[0]?.meetingLink);
    console.log('==========================');
  });
```

**Expected Output:**
```
=== API RESPONSE DEBUG ===
1. Response ok: true
2. Response success: true
3. Data array: true
4. First item: {_id: "...", title: "...", meetingLink: "..."}
5. Meeting link: https://meet.google.com/abc-defg-hij
==========================
```

### Step 3: Component Rendering Verification
```tsx
// In LiveClassCard.tsx
useEffect(() => {
  console.log('=== COMPONENT DEBUG ===');
  console.log('1. Props:', liveClass);
  console.log('2. Meeting link:', liveClass.meetingLink);
  console.log('3. Link type:', typeof liveClass.meetingLink);
  console.log('4. Link valid:', liveClass.meetingLink?.startsWith('https://'));
  console.log('5. Link includes meet.google.com:', liveClass.meetingLink?.includes('meet.google.com'));
  console.log('=======================');
}, [liveClass]);
```

**Expected Output:**
```
=== COMPONENT DEBUG ===
1. Props: {_id: "...", title: "...", meetingLink: "..."}
2. Meeting link: https://meet.google.com/abc-defg-hij
3. Link type: string
4. Link valid: true
5. Link includes meet.google.com: true
=======================
```

### Step 4: Click Handler Verification
```tsx
// In LiveClassCard.tsx
<a
  href={liveClass.meetingLink}
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => {
    console.log('=== CLICK DEBUG ===');
    console.log('1. Link:', liveClass.meetingLink);
    console.log('2. Target:', '_blank');
    console.log('3. Opening in new tab...');
    console.log('===================');
  }}
>
  Join Live Class
</a>
```

**Expected Output:**
```
=== CLICK DEBUG ===
1. Link: https://meet.google.com/abc-defg-hij
2. Target: _blank
3. Opening in new tab...
===================
```

---

## Quick Fix Checklist

- [ ] Backend: `conferenceDataVersion: 1` is set
- [ ] Backend: `conferenceSolutionKey.type: 'hangoutsMeet'`
- [ ] Backend: `hangoutLink` is extracted correctly
- [ ] Backend: Console logs show valid link
- [ ] API: Response includes `meetingLink`
- [ ] Frontend: Component receives `meetingLink` prop
- [ ] Frontend: Using `<a>` tag (not `<Link>`)
- [ ] Frontend: `target="_blank"` is set
- [ ] Frontend: `rel="noopener noreferrer"` is set
- [ ] Frontend: Console shows valid link
- [ ] Frontend: Clicking opens in new tab
- [ ] Google Meet: Loads without errors

---

## Common Error Messages & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid video call name" | Malformed link | Check link format in console |
| "404 Not Found" | Link opens in same tab | Add `target="_blank"` |
| "localhost:3000/https://..." | Using React Link | Use HTML `<a>` tag |
| "undefined" link | API not returning link | Check backend logs |
| "Cannot read property 'meetingLink'" | Component not receiving prop | Check data flow |
| "403 Forbidden" | Calendar API not enabled | Enable in Google Cloud |
| "401 Unauthorized" | Invalid access token | Refresh token |

---

## Prevention Checklist

Before deploying to production:

- [ ] Test with real Google Calendar account
- [ ] Test with multiple attendees
- [ ] Test link persistence (should not expire)
- [ ] Test on mobile browsers
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Verify email notifications are sent
- [ ] Verify meeting recordings work
- [ ] Test with different timezones
- [ ] Test with different languages
- [ ] Load test with multiple concurrent meetings

---

## Still Not Working?

1. **Collect all logs** from backend and frontend
2. **Check Network tab** in DevTools
3. **Verify Google Cloud** credentials
4. **Test with curl** (see GOOGLE_MEET_CODE_SNIPPETS.md)
5. **Check OAuth scopes** are correct
6. **Verify timezone** is valid
7. **Check event dates** are in future
8. **Verify attendee emails** are valid

---

**Last Updated:** May 12, 2026
**Status:** Complete Troubleshooting Guide
