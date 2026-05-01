import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@edu/shared/auth/middleware";
import { fail } from "@edu/shared/utils/result";
import { createTimetable, listTimetable } from "@edu/shared/services/timetable.service";
import { sessionRequest } from "../_utils";

export async function GET(request: NextRequest) {
  try {
    const ctx = authenticateRequest(sessionRequest(request), "school");
    const class_id = request.nextUrl.searchParams.get("class_id") ?? undefined;
    const teacher_id = request.nextUrl.searchParams.get("teacher_id") ?? undefined;
    const day_of_week = request.nextUrl.searchParams.get("day_of_week") ? parseInt(request.nextUrl.searchParams.get("day_of_week")!) : undefined;
    const academic_year_id = request.nextUrl.searchParams.get("academic_year_id") ?? undefined;
    const result = await listTimetable(ctx, { class_id, teacher_id, day_of_week, academic_year_id });
    return NextResponse.json(result, { status: result.ok ? 200 : result.error.status ?? 400 });
  } catch {
    return NextResponse.json(fail("UNAUTHORIZED", "Authentication required.", 401), { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ctx = authenticateRequest(sessionRequest(request), "school");
    const body = await request.json();
    const result = await createTimetable(ctx, body);
    return NextResponse.json(result, { status: result.ok ? 201 : result.error.status ?? 400 });
  } catch {
    return NextResponse.json(fail("UNAUTHORIZED", "Authentication required.", 401), { status: 401 });
  }
}
