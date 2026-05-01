import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@edu/shared/auth/middleware";
import { fail } from "@edu/shared/utils/result";
import { createEvent, listEvents } from "@edu/shared/services/event.service";
import { sessionRequest } from "../_utils";

export async function GET(request: NextRequest) {
  try {
    const ctx = authenticateRequest(sessionRequest(request), "school");
    const status = request.nextUrl.searchParams.get("status") ?? undefined;
    const event_type = request.nextUrl.searchParams.get("event_type") ?? undefined;
    const visibility = request.nextUrl.searchParams.get("visibility") ?? undefined;
    const start_date = request.nextUrl.searchParams.get("start_date") ?? undefined;
    const end_date = request.nextUrl.searchParams.get("end_date") ?? undefined;
    const class_id = request.nextUrl.searchParams.get("class_id") ?? undefined;
    const result = await listEvents(ctx, { status, event_type, visibility, start_date, end_date, class_id });
    return NextResponse.json(result, { status: result.ok ? 200 : result.error.status ?? 400 });
  } catch {
    return NextResponse.json(fail("UNAUTHORIZED", "Authentication required.", 401), { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ctx = authenticateRequest(sessionRequest(request), "school");
    const body = await request.json();
    const result = await createEvent(ctx, body);
    return NextResponse.json(result, { status: result.ok ? 201 : result.error.status ?? 400 });
  } catch {
    return NextResponse.json(fail("UNAUTHORIZED", "Authentication required.", 401), { status: 401 });
  }
}
