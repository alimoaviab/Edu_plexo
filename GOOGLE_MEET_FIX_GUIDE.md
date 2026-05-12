# Google Meet "Invalid Video Call Name" - Complete Fix Guide

## Problem Analysis

The "Invalid video call name" error occurs when:
1. The Meet link is malformed or incomplete
2. The link is being modified during transmission (URL encoding issues)
3. The link is being appended to localhost URL
4. The `hangoutLink` is not being properly extracted from Google Calendar API response

---

## 1. BACKEND FIX - Node.js/Google Calendar API

### Issue: Correct conferenceData Structure

Your current implementation is **CORRECT**, but let me verify the exact response structure:

```typescript
// ✅ CORRECT - Your current implementation
conferenceData: {
  createRequest: {
    requestId: `meet-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    conferenceSolutionKey: {
      type: 'hangoutsMeet',  // ✅ CORRECT - generates Google Meet
    },
  },
},
```

### Key Points:
- `conferenceDataVersion: 1` ✅ You have this in `calendar.events.insert()`
- `conferenceSolutionKey.type: 'hangoutsMeet'` ✅ Correct
- `createRequest.requestId` ✅ Must be unique (you're doing this correctly)

### The Real Issue: Extracting the Link

**PROBLEM:** Google Calendar API returns the Meet link in `hangoutLink`, NOT in `conferenceData.entryPoints`.

```typescript
// ❌ WRONG - Your current fallback
const meetingLink = createdEvent.hangoutLink || createdEvent.conferenceData?.entryPoints?.find(
  ep => ep.entryPointType === 'video'
)?.uri;

// ✅ CORRECT - Should be:
const meetingLink = createdEvent.hangoutLink;

// If hangoutLink is missing, the event creation failed
if (!meetingLink) {
  console.error('CRITICAL: hangoutLink not generated. Event:', JSON.stringify(createdEvent, null, 2));
  throw new Error('Google Meet link generation failed');
}
```

### Updated Backend Code:

```typescript
// shared/services/google/calendar.service.ts

export async function createCalendarEventWithMeet(
  accessToken: string,
  encryptedRefreshToken: string,
  eventParams: CreateEventParams
): Promise<CalendarEvent> {
  try {
    const auth = getAuthenticatedClient(accessToken, encryptedRefreshToken);
    const calendar = google.calendar({ version: 'v3', auth });
    
    const event: calendar_v3.Schema$Event = {
      summary: eventParams.summary,
      description: eventParams.description,
      start: {
        dateTime: eventParams.startTime,
        timeZone: eventParams.timezone,
      },
      end: {
        dateTime: eventParams.endTime,
        timeZone: eventParams.timezone,
      },
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
      attendees: eventParams.attendees?.map(email => ({ email })),
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };
    
    // ✅ CRITICAL: conferenceDataVersion MUST be 1
    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: event,
      sendUpdates: 'all',
    });
    
    const createdEvent = response.data;
    
    // ✅ DEBUG LOGGING
    console.log('=== GOOGLE CALENDAR EVENT CREATED ===');
    console.log('Event ID:', createdEvent.id);
    console.log('Event Summary:', createdEvent.summary);
    console.log('hangoutLink:', createdEvent.hangoutLink);
    console.log('conferenceData:', JSON.stringify(createdEvent.conferenceData, null, 2));
    console.log('=====================================');
    
    // ✅ CORRECT: Extract hangoutLink directly
    const meetingLink = createdEvent.hangoutLink;
    
    if (!meetingLink) {
      console.error('❌ CRITICAL ERROR: hangoutLink not generated!');
      console.error('Full event response:', JSON.stringify(createdEvent, null, 2));
      throw new Error('Google Meet link generation failed - hangoutLink is missing');
    }
    
    return {
      id: createdEvent.id!,
      summary: createdEvent.summary!,
      description: createdEvent.description ?? undefined,
      startTime: createdEvent.start?.dateTime!,
      endTime: createdEvent.end?.dateTime!,
      meetingLink: meetingLink, // ✅ Direct assignment
      htmlLink: createdEvent.htmlLink!,
    };
  } catch (error: any) {
    console.error('❌ Error creating calendar event:', error);
    throw new Error(`Failed to create calendar event: ${error.message}`);
  }
}
```

---

## 2. FRONTEND FIX - React Component

### Issue: How the Link is Being Rendered

Your `LiveClassCard.tsx` is **CORRECT** - it uses:
```tsx
<a
  href={liveClass.meetingLink}
  target="_blank"
  rel="noopener noreferrer"
  className="..."
>
  Join Live Class
</a>
```

✅ This is the **CORRECT** way to render external links in React.

### Why NOT to use React Router's `<Link>`:

```tsx
// ❌ WRONG - This will break the URL
import Link from 'next/link';
<Link href={liveClass.meetingLink}>Join</Link>
// Result: localhost:3000/https://meet.google.com/abc-defg-hij

// ✅ CORRECT - Use HTML <a> tag
<a href={liveClass.meetingLink} target="_blank" rel="noopener noreferrer">
  Join
</a>
// Result: Opens https://meet.google.com/abc-defg-hij in new tab
```

### Verify the Link Format:

Add this debugging code to `LiveClassCard.tsx`:

```tsx
useEffect(() => {
  if (liveClass.meetingLink) {
    console.log('=== LIVE CLASS CARD DEBUG ===');
    console.log('Meeting Link:', liveClass.meetingLink);
    console.log('Link Type:', typeof liveClass.meetingLink);
    console.log('Link Length:', liveClass.meetingLink.length);
    console.log('Starts with https://meet.google.com:', liveClass.meetingLink.startsWith('https://meet.google.com'));
    console.log('============================');
  }
}, [liveClass.meetingLink]);
```

---

## 3. COMPLETE DEBUGGING CHECKLIST

### Backend (Node.js) - Add These Logs:

```typescript
// 1. In calendar.service.ts - createCalendarEventWithMeet()
console.log('📤 SENDING TO GOOGLE CALENDAR API:');
console.log('Event Summary:', event.summary);
console.log('Conference Data:', JSON.stringify(event.conferenceData, null, 2));
console.log('conferenceDataVersion:', 1);

// 2. After API response
console.log('📥 RECEIVED FROM GOOGLE CALENDAR API:');
console.log('Response Status:', response.status);
console.log('Event ID:', createdEvent.id);
console.log('hangoutLink:', createdEvent.hangoutLink);
console.log('Full Response:', JSON.stringify(createdEvent, null, 2));

// 3. Before returning
console.log('✅ RETURNING TO FRONTEND:');
console.log('Meeting Link:', meetingLink);
console.log('Link is valid URL:', meetingLink?.startsWith('https://'));
```

### Frontend (React) - Add These Logs:

```typescript
// 1. In LiveClassCreatePage.tsx - handleSubmit()
console.log('📤 SUBMITTING FORM:');
console.log('Form Data:', data);

// 2. After API response
console.log('📥 RECEIVED FROM API:');
console.log('Response Status:', res.status);
console.log('Response Body:', result);
console.log('Meeting Link:', result.data?.meetingLink);

// 3. In LiveClassList.tsx - fetchClasses()
console.log('📥 FETCHED LIVE CLASSES:');
console.log('Classes:', classes);
classes.forEach(cls => {
  console.log(`Class: ${cls.title}, Link: ${cls.meetingLink}`);
});

// 4. In LiveClassCard.tsx - useEffect
console.log('🎥 RENDERING LIVE CLASS CARD:');
console.log('Meeting Link:', liveClass.meetingLink);
console.log('Link Valid:', liveClass.meetingLink?.startsWith('https://'));
```

---

## 4. STEP-BY-STEP TESTING

### Step 1: Verify Backend Response
```bash
# Check what Google Calendar API returns
curl -X POST https://www.googleapis.com/calendar/v3/calendars/primary/events \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "summary": "Test Meeting",
    "start": {"dateTime": "2026-05-15T10:00:00", "timeZone": "UTC"},
    "end": {"dateTime": "2026-05-15T11:00:00", "timeZone": "UTC"},
    "conferenceData": {
      "createRequest": {
        "requestId": "test-123",
        "conferenceSolutionKey": {"type": "hangoutsMeet"}
      }
    }
  }' \
  -G --data-urlencode "conferenceDataVersion=1"

# Look for "hangoutLink" in response
```

### Step 2: Check Frontend Network Tab
1. Open DevTools → Network tab
2. Schedule a live class
3. Look for POST to `/api/live/classes`
4. Check Response tab - verify `meetingLink` is present and valid

### Step 3: Verify Link Format
The link should look like:
```
https://meet.google.com/abc-defg-hij
```

NOT:
```
localhost:3000/https://meet.google.com/abc-defg-hij
/https://meet.google.com/abc-defg-hij
meet.google.com/abc-defg-hij (missing https://)
```

---

## 5. COMMON ISSUES & SOLUTIONS

| Issue | Cause | Solution |
|-------|-------|----------|
| "Invalid video call name" | Link is malformed or incomplete | Check `hangoutLink` in API response |
| Link opens in same tab | Using `<Link>` instead of `<a>` | Use `<a href={} target="_blank">` |
| Link appends to localhost | React Router intercepting link | Use plain `<a>` tag, not Next.js `<Link>` |
| hangoutLink is undefined | conferenceDataVersion not set | Add `conferenceDataVersion: 1` to insert() |
| hangoutLink is undefined | conferenceSolutionKey wrong | Use `type: 'hangoutsMeet'` exactly |
| Link works in console but not in UI | Link not being passed to component | Check data flow: API → State → Component |

---

## 6. FINAL VERIFICATION

After applying fixes, test with this checklist:

- [ ] Backend logs show `hangoutLink` in Google Calendar response
- [ ] Frontend receives `meetingLink` in API response
- [ ] `LiveClassCard` receives `meetingLink` prop
- [ ] Console shows correct link format (https://meet.google.com/...)
- [ ] Clicking "Join" opens link in new tab
- [ ] Google Meet loads without "Invalid video call name" error
- [ ] Meeting link is clickable and functional

---

## 7. PRODUCTION CHECKLIST

Before deploying:

- [ ] Remove all console.log debug statements
- [ ] Verify `conferenceDataVersion: 1` is set
- [ ] Verify `hangoutLink` extraction is correct
- [ ] Test with real Google Calendar account
- [ ] Test with multiple attendees
- [ ] Verify email notifications are sent
- [ ] Test link expiration (should not expire)
- [ ] Test on mobile browsers
