import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// We assume there's a service account or an admin user who has authorized the app,
// or we use service account credentials directly to manage domain-wide calendars.
// For the sake of simplicity and following ERP guidelines, we'll use a standard Google Auth setup.

export async function createGoogleMeetEvent(
  title: string,
  startTime: string,
  endTime: string,
  description?: string
) {
  // Try to use a service account if credentials exist, otherwise default to OAuth2
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/calendar.events"],
  });

  let authClient;
  try {
     authClient = await auth.getClient();
  } catch (e) {
     // Fallback to oauth2 client if service account not present (needs access token set externally though)
     authClient = oauth2Client;
  }

  const calendar = google.calendar({ version: "v3", auth: authClient as any });

  const event = {
    summary: title,
    description: description || "Live Class Session",
    start: {
      dateTime: startTime,
      timeZone: "UTC",
    },
    end: {
      dateTime: endTime,
      timeZone: "UTC",
    },
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      conferenceDataVersion: 1,
      requestBody: event,
    });

    return {
      eventId: response.data.id,
      meetingLink: response.data.hangoutLink,
      status: response.status,
    };
  } catch (error) {
    console.error("Error creating Google Calendar event:", error);
    throw error;
  }
}

export async function deleteGoogleMeetEvent(eventId: string) {
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/calendar.events"],
  });

  let authClient;
  try {
     authClient = await auth.getClient();
  } catch (e) {
     authClient = oauth2Client;
  }

  const calendar = google.calendar({ version: "v3", auth: authClient as any });

  try {
    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      eventId,
    });
    return true;
  } catch (error) {
    console.error("Error deleting Google Calendar event:", error);
    throw error;
  }
}
