# Google Meet Integration - Production-Ready Code Snippets

## 1. Backend: Correct Google Calendar Event Creation

### File: `shared/services/google/calendar.service.ts`

```typescript
import { google, calendar_v3 } from 'googleapis';

export async function createCalendarEventWithMeet(
  accessToken: string,
  encryptedRefreshToken: string,
  eventParams: {
    summary: string;
    description?: string;
    startTime: string;  // ISO 8601: "2026-05-15T10:00:00"
    endTime: string;    // ISO 8601: "2026-05-15T11:00:00"
    timezone: string;   // "Asia/Karachi"
    attendees?: string[];
  }
): Promise<{
  id: string;
  summary: string;
  meetingLink: string;  // https://meet.google.com/abc-defg-hij
  htmlLink: string;
}> {
  try {
    const auth = getAuthenticatedClient(accessToken, encryptedRefreshToken);
    const calendar = google.calendar({ version: 'v3', auth });
    
    // ✅ CORRECT: Full event object with conferenceData
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
      // ✅ CRITICAL: This generates the Google Meet link
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',  // ✅ MUST be exactly this
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
    console.log('📤 Creating Google Calendar event with Meet link...');
    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,  // ✅ REQUIRED
      requestBody: event,
      sendUpdates: 'all',
    });
    
    const createdEvent = response.data;
    
    // ✅ DEBUG: Log the response
    console.log('📥 Google Calendar Response:');
    console.log('  Event ID:', createdEvent.id);
    console.log('  hangoutLink:', createdEvent.hangoutLink);
    
    // ✅ CORRECT: Extract hangoutLink directly (NOT conferenceData.entryPoints)
    const meetingLink = createdEvent.hangoutLink;
    
    if (!meetingLink) {
      console.error('❌ ERROR: hangoutLink not generated!');
      console.error('Response:', JSON.stringify(createdEvent, null, 2));
      throw new Error('Google Meet link generation failed');
    }
    
    console.log('✅ Meet link generated:', meetingLink);
    
    return {
      id: createdEvent.id!,
      summary: createdEvent.summary!,
      meetingLink: meetingLink,  // ✅ Direct assignment
      htmlLink: createdEvent.htmlLink!,
    };
  } catch (error: any) {
    console.error('❌ Error creating calendar event:', error.message);
    throw error;
  }
}
```

---

## 2. Backend: API Route to Schedule Live Class

### File: `school-app/app/api/live/classes/schedule/route.ts`

```typescript
import { NextResponse } from "next/server";
import { createCalendarEventWithMeet } from "@/shared/services/google/calendar.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      title, 
      description, 
      startTime, 
      endTime, 
      classId, 
      subjectId, 
      timezone = "Asia/Karachi",
      teacherId,
      attendeeEmails = []
    } = body;

    // ✅ Validate required fields
    if (!title || !startTime || !endTime || !classId) {
      return NextResponse.json(
        { ok: false, error: { message: "Missing required fields" } },
        { status: 400 }
      );
    }

    console.log('📤 Schedule Live Class Request:');
    console.log('  Title:', title);
    console.log('  Start:', startTime);
    console.log('  End:', endTime);

    // TODO: In production:
    // 1. Get teacher from session
    // 2. Verify teacher has Google Calendar connected
    // 3. Get teacher's access token and refresh token
    // 4. Call createCalendarEventWithMeet()
    
    // For now, using mock data
    const mockMeetingLink = `https://meet.google.com/mock-${Date.now()}`;

    const data = {
      success: true,
      message: "Live class scheduled successfully",
      liveClass: {
        id: `live-class-${Date.now()}`,
        title,
        description,
        startTime,
        endTime,
        classId,
        subjectId,
        timezone,
        meetingLink: mockMeetingLink,  // ✅ In production, use real link from Google
        meetingProvider: "google_meet",
        status: "SCHEDULED",
        createdAt: new Date().toISOString()
      }
    };

    console.log('✅ Returning meeting link:', mockMeetingLink);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("❌ Schedule live class error:", error);
    return NextResponse.json(
      { ok: false, error: { message: "Failed to schedule live class" } },
      { status: 500 }
    );
  }
}
```

---

## 3. Frontend: Correct Way to Render External Links

### File: `school-app/components/live-class/LiveClassCard.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';

interface LiveClassCardProps {
  liveClass: {
    _id: string;
    title: string;
    meetingLink?: string;  // https://meet.google.com/abc-defg-hij
    startTime: string;
    endTime: string;
    status: 'SCHEDULED' | 'LIVE' | 'ENDED';
  };
}

export default function LiveClassCard({ liveClass }: LiveClassCardProps) {
  const [isLive, setIsLive] = useState(false);

  // ✅ Debug logging
  useEffect(() => {
    console.log('🎥 LiveClassCard Rendered:');
    console.log('  Title:', liveClass.title);
    console.log('  Meeting Link:', liveClass.meetingLink);
    console.log('  Link is valid:', liveClass.meetingLink?.startsWith('https://'));
  }, [liveClass.meetingLink]);

  const handleJoinClick = () => {
    console.log('🔗 Join button clicked');
    console.log('  Opening link:', liveClass.meetingLink);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">{liveClass.title}</h3>

      {/* ✅ CORRECT: Use <a> tag for external links */}
      {liveClass.meetingLink && (
        <a
          href={liveClass.meetingLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleJoinClick}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
          </svg>
          Join Live Class
        </a>
      )}

      {/* ❌ WRONG: Don't use Next.js Link for external URLs */}
      {/* 
      import Link from 'next/link';
      <Link href={liveClass.meetingLink}>Join</Link>
      // This will create: localhost:3000/https://meet.google.com/...
      */}
    </div>
  );
}
```

---

## 4. Frontend: Fetch and Display Live Classes

### File: `school-app/components/live-classes/LiveClassList.tsx`

```tsx
'use client';

import { useEffect, useState } from 'react';
import LiveClassCard from './LiveClassCard';

export function LiveClassList() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      console.log('📥 Fetching live classes...');
      const res = await fetch('/api/live/classes');
      const json = await res.json();

      console.log('📥 API Response:', json);

      if (json.success && Array.isArray(json.data)) {
        console.log('✅ Classes fetched:', json.data.length);
        setClasses(json.data);
      } else {
        console.warn('⚠️ Unexpected response format');
      }
    } catch (error) {
      console.error('❌ Failed to fetch live classes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading classes...</div>;
  }

  if (classes.length === 0) {
    return <div className="text-center py-8 text-gray-500">No live classes scheduled</div>;
  }

  return (
    <div className="space-y-4">
      {classes.map((liveClass) => (
        <LiveClassCard
          key={liveClass._id}
          liveClass={liveClass}
        />
      ))}
    </div>
  );
}
```

---

## 5. Frontend: Form to Schedule Live Class

### File: `school-app/modules/live-classes/components/LiveClassForm.tsx`

```tsx
'use client';

import { FormEvent, useState } from 'react';

interface LiveClassFormProps {
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
}

export function LiveClassForm({ onSubmit, loading = false }: LiveClassFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    classId: '',
    timezone: 'Asia/Karachi',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // ✅ Validate all required fields
    if (!formData.title || !formData.startTime || !formData.endTime || !formData.classId) {
      alert('Please fill in all required fields');
      return;
    }

    console.log('📤 Submitting live class form:');
    console.log('  Title:', formData.title);
    console.log('  Start:', formData.startTime);
    console.log('  End:', formData.endTime);

    try {
      await onSubmit(formData);
      console.log('✅ Form submitted successfully');
    } catch (error) {
      console.error('❌ Form submission failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Session Title *</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Weekly Mathematics Review"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Optional description"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Start Date & Time *</label>
          <input
            type="datetime-local"
            required
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">End Date & Time *</label>
          <input
            type="datetime-local"
            required
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Scheduling...' : 'Schedule Live Session'}
      </button>
    </form>
  );
}
```

---

## 6. Key Differences: ✅ Correct vs ❌ Wrong

### Link Rendering

```tsx
// ✅ CORRECT - External link
<a href="https://meet.google.com/abc-defg-hij" target="_blank" rel="noopener noreferrer">
  Join
</a>

// ❌ WRONG - React Router Link
import Link from 'next/link';
<Link href="https://meet.google.com/abc-defg-hij">Join</Link>
// Result: localhost:3000/https://meet.google.com/abc-defg-hij
```

### Conference Data

```typescript
// ✅ CORRECT
conferenceData: {
  createRequest: {
    requestId: `meet-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    conferenceSolutionKey: {
      type: 'hangoutsMeet',
    },
  },
}

// ❌ WRONG
conferenceData: {
  createRequest: {
    conferenceSolutionKey: {
      type: 'hangouts',  // Should be 'hangoutsMeet'
    },
  },
}
```

### Extracting Meet Link

```typescript
// ✅ CORRECT
const meetingLink = createdEvent.hangoutLink;

// ❌ WRONG
const meetingLink = createdEvent.conferenceData?.entryPoints?.[0]?.uri;
// This might work but hangoutLink is the standard property
```

---

## 7. Environment Variables Required

```bash
# .env.local or .env.production

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
GOOGLE_REDIRECT_URI_PROD=https://yourdomain.com/api/auth/google/callback

# Token Encryption
GOOGLE_TOKEN_ENCRYPTION_KEY=your-32-character-hex-key

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

---

## 8. Testing Checklist

- [ ] Backend logs show `hangoutLink: https://meet.google.com/...`
- [ ] API response includes `meetingLink` property
- [ ] Frontend console shows link is valid
- [ ] Join button uses `<a>` tag with `target="_blank"`
- [ ] Clicking Join opens link in new tab
- [ ] Google Meet loads without "Invalid video call name" error
- [ ] Meeting link is clickable and functional
- [ ] Multiple users can join the same meeting
