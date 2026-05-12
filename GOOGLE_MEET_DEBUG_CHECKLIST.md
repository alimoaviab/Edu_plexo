# Google Meet "Invalid Video Call Name" - Quick Debug Checklist

## 🔍 Step 1: Check Backend Logs

When you schedule a live class, check your Node.js terminal for:

```
📤 Sending to Google Calendar API with conferenceDataVersion: 1
📥 Google Calendar API Response:
  Event ID: [event-id]
  Summary: [class-title]
  hangoutLink: https://meet.google.com/abc-defg-hij
  conferenceData: {...}
✅ Meet link generated successfully: https://meet.google.com/abc-defg-hij
```

### ❌ If you see:
```
❌ CRITICAL: hangoutLink not generated!
```

**Problem:** Google Calendar API didn't generate the Meet link.

**Solutions:**
1. Verify `conferenceDataVersion: 1` is in the API call
2. Verify `conferenceSolutionKey.type: 'hangoutsMeet'` is correct
3. Check Google Cloud credentials have Calendar API enabled
4. Check OAuth scopes include `https://www.googleapis.com/auth/calendar.events`

---

## 🔍 Step 2: Check Frontend Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Schedule a live class
4. Look for POST request to `/api/live/classes`
5. Click on it and check **Response** tab

### ✅ Expected Response:
```json
{
  "ok": true,
  "success": true,
  "data": [
    {
      "_id": "live-class-123",
      "title": "Test Class",
      "meetingLink": "https://meet.google.com/abc-defg-hij",
      "status": "SCHEDULED",
      ...
    }
  ]
}
```

### ❌ If meetingLink is missing:
- Check backend logs (Step 1)
- Verify API route is returning the link

---

## 🔍 Step 3: Check Frontend Console

Open DevTools **Console** tab and look for:

### When fetching classes:
```
📥 Fetching live classes...
📥 API Response: {...}
✅ Classes fetched: [...]
```

### When rendering card:
```
🎥 LiveClassCard Rendered:
  Title: Test Class
  Meeting Link: https://meet.google.com/abc-defg-hij
  Link Type: string
  Link Valid URL: true
  Link Starts with meet.google.com: true
```

### When clicking Join:
```
🔗 Clicking Join button
  Meeting Link: https://meet.google.com/abc-defg-hij
  Opening in new tab...
```

---

## 🔍 Step 4: Verify Link Format

The link should be **exactly** like this:
```
https://meet.google.com/abc-defg-hij
```

### ❌ Common Wrong Formats:

| Wrong Format | Problem |
|---|---|
| `localhost:3000/https://meet.google.com/abc-defg-hij` | Using React Router `<Link>` instead of `<a>` |
| `/https://meet.google.com/abc-defg-hij` | Relative path instead of absolute URL |
| `meet.google.com/abc-defg-hij` | Missing `https://` protocol |
| `https://meet.google.com/mock-meeting-link` | Mock link instead of real link |
| `undefined` | Link not being passed to component |

---

## 🔍 Step 5: Test the Link Directly

1. Copy the link from console
2. Paste it in browser address bar
3. Press Enter

### ✅ If it works:
- Link is valid
- Problem is in how it's being rendered in React

### ❌ If it shows "Invalid video call name":
- Link is malformed
- Check backend logs (Step 1)
- Verify Google Calendar API response

---

## 🔍 Step 6: Verify React Component

Check that `LiveClassCard.tsx` is using:

```tsx
// ✅ CORRECT
<a
  href={liveClass.meetingLink}
  target="_blank"
  rel="noopener noreferrer"
>
  Join Live Class
</a>

// ❌ WRONG
import Link from 'next/link';
<Link href={liveClass.meetingLink}>Join</Link>
```

---

## 📋 Complete Debug Flow

```
1. Schedule Live Class
   ↓
2. Check Backend Logs
   - Is hangoutLink present? ✅ YES → Go to 3
   - Is hangoutLink present? ❌ NO → Fix backend (see Step 1)
   ↓
3. Check Network Tab
   - Is meetingLink in response? ✅ YES → Go to 4
   - Is meetingLink in response? ❌ NO → Check API route
   ↓
4. Check Frontend Console
   - Is link being rendered? ✅ YES → Go to 5
   - Is link being rendered? ❌ NO → Check component props
   ↓
5. Test Link Format
   - Is format correct? ✅ YES → Go to 6
   - Is format correct? ❌ NO → Check React component
   ↓
6. Click Join Button
   - Does it open in new tab? ✅ YES → Go to 7
   - Does it open in new tab? ❌ NO → Check <a> tag attributes
   ↓
7. Google Meet Opens
   - Does it load? ✅ YES → SUCCESS! 🎉
   - Does it show error? ❌ NO → Check link validity
```

---

## 🚀 Quick Fixes

### Fix 1: Link not showing
```tsx
// Check that meetingLink is being passed
console.log('Meeting Link:', liveClass.meetingLink);

// If undefined, check API response
// If defined, check component rendering
```

### Fix 2: Link opens in same tab
```tsx
// Change from:
<Link href={liveClass.meetingLink}>Join</Link>

// To:
<a href={liveClass.meetingLink} target="_blank" rel="noopener noreferrer">
  Join
</a>
```

### Fix 3: "Invalid video call name" error
```typescript
// In backend, verify:
console.log('hangoutLink:', createdEvent.hangoutLink);

// Should be: https://meet.google.com/abc-defg-hij
// NOT: undefined or null
```

### Fix 4: hangoutLink is undefined
```typescript
// Add to calendar.events.insert():
conferenceDataVersion: 1  // ← MUST be present

// Verify conferenceSolutionKey:
conferenceSolutionKey: {
  type: 'hangoutsMeet'  // ← MUST be exactly this
}
```

---

## 📞 Still Not Working?

1. **Collect all logs** from console and terminal
2. **Check Network tab** response
3. **Verify Google Cloud** credentials
4. **Test with curl** (see GOOGLE_MEET_FIX_GUIDE.md)
5. **Check OAuth scopes** are correct

---

## ✅ Success Indicators

- [ ] Backend logs show `hangoutLink: https://meet.google.com/...`
- [ ] Network response includes `meetingLink`
- [ ] Console shows link is valid URL
- [ ] Join button opens link in new tab
- [ ] Google Meet loads without errors
- [ ] Meeting link is clickable and functional
