import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@edu/shared/auth/middleware";
import { fail } from "@edu/shared/utils/result";
import { updateTimetable, deleteTimetable, getTimetable } from "@edu/shared/services/timetable.service";
import { sessionRequest } from "../../_utils";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const ctx = authenticateRequest(sessionRequest(request), "school");
    const { id } = await params;
    const result = await getTimetable(ctx, id);
    return NextResponse.json(result, { status: result.ok ? 200 : result.error.status ?? 400 });
  } catch {
    return NextResponse.json(fail("UNAUTHORIZED", "Authentication required.", 401), { status: 401 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const ctx = authenticateRequest(sessionRequest(request), "school");
    const { id } = await params;
    const body = await request.json();
    const result = await updateTimetable(ctx, id, body);
    return NextResponse.json(result, { status: result.ok ? 200 : result.error.status ?? 400 });
  } catch {
    return NextResponse.json(fail("UNAUTHORIZED", "Authentication required.", 401), { status: 401 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const ctx = authenticateRequest(sessionRequest(request), "school");
    const { id } = await params;
    const result = await deleteTimetable(ctx, id);
    return NextResponse.json(result, { status: result.ok ? 200 : result.error.status ?? 400 });
  } catch {
    return NextResponse.json(fail("UNAUTHORIZED", "Authentication required.", 401), { status: 401 });
  }
}
