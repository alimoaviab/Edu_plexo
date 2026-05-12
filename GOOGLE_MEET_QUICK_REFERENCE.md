# Google Meet Integration - Quick Reference Card

## 🎯 The Problem
Google Meet shows: **"Invalid video call name"** when clicking join link

## ✅ The Solution

### Backend (Node.js)
```typescript
// ✅ MUST HAVE
const response = await calendar.events.insert({
  calendarId: 'primary',
  conferenceDataVersion: 1,  // ← CRITICAL
  requestBody: {
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}-${Math.random()}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet',  // ← MUST BE EXACT
        },
      },
    },
  },
});

// ✅ EXTRACT CORRECTLY
const meetingLink = createdEvent.hangoutLink;  // NOT conferenceData.entryPoints
```

### Frontend (React)
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

## 🔍 Quick Debug

### Backend Logs
```
✅ Should see:
📤 Sending to Google Calendar API with conferenceDataVersion: 1
📥 Google Calendar API Response:
  hangoutLink: https://meet.google.com/abc-defg-hij
✅ Meet link generated successfully: https://meet.google.com/abc-defg-hij

❌ If you see:
❌ CRITICAL: hangoutLink not generated!
→ Check conferenceDataVersion and conferenceSolutionKey
```

### Frontend Console
```javascript
// Check link format
fetch('/api/live/classes')
  .then(r => r.json())
  .then(data => {
    console.log('Link:', data.data[0]?.meetingLink);
    // Should be: https://meet.google.com/abc-defg-hij
  });
```

---

## 📋 Checklist

- [ ] Backend: `conferenceDataVersion: 1` ✅
- [ ] Backend: `type: 'hangoutsMeet'` ✅
- [ ] Backend: Extract `hangoutLink` directly ✅
- [ ] Frontend: Using `<a>` tag (not `<Link>`) ✅
- [ ] Frontend: `target="_blank"` ✅
- [ ] Frontend: `rel="noopener noreferrer"` ✅
- [ ] Link format: `https://meet.google.com/abc-defg-hij` ✅
- [ ] Click opens in new tab ✅
- [ ] Google Meet loads without errors ✅

---

## 🚀 Common Fixes

| Problem | Fix |
|---------|-----|
| `hangoutLink` undefined | Add `conferenceDataVersion: 1` |
| Link is `undefined` | Check API response in Network tab |
| Link opens in same tab | Add `target="_blank"` |
| "Invalid video call name" | Check link format in console |
| `localhost:3000/https://...` | Use `<a>` tag, not `<Link>` |

---

## 📞 Documentation

1. **GOOGLE_MEET_DEBUG_CHECKLIST.md** ← Start here
2. **GOOGLE_MEET_TROUBLESHOOTING.md** ← Detailed help
3. **GOOGLE_MEET_CODE_SNIPPETS.md** ← Copy code
4. **GOOGLE_MEET_FIX_GUIDE.md** ← Full explanation

---

## 🔗 Key Files

**Backend:**
- `shared/services/google/calendar.service.ts`
- `school-app/app/api/live/classes/route.ts`

**Frontend:**
- `school-app/components/live-class/LiveClassCard.tsx`
- `school-app/components/live-classes/LiveClassList.tsx`

---

## ✨ Expected Result

1. Schedule live class ✅
2. Backend generates Google Meet link ✅
3. Frontend displays link ✅
4. Click "Join" button ✅
5. Opens Google Meet in new tab ✅
6. No "Invalid video call name" error ✅
7. Meeting loads successfully ✅

---

**Last Updated:** May 12, 2026
