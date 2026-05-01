import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@edu/shared/auth/middleware";
import { fail } from "@edu/shared/utils/result";
import { createLeave, listLeave } from "@edu/shared/services/leave.service";
import { sessionRequest } from "../_utils";

export async function GET(request: NextRequest) {
  try {
    const ctx = authenticateRequest(sessionRequest(request), "school");
    const status = request.nextUrl.searchParams.get("status") ?? undefined;
    const requester_type = request.nextUrl.searchParams.get("requester_type") ?? undefined;
    const requester_id = request.nextUrl.searchParams.get("requester_id") ?? undefined;
    const start_date = request.nextUrl.searchParams.get("start_date") ?? undefined;
    const end_date = request.nextUrl.searchParams.get("end_date") ?? undefined;
    const result = await listLeave(ctx, { status, requester_type, requester_id, start_date, end_date });
    return NextResponse.json(result, { status: result.ok ? 200 : result.error.status ?? 400 });
  } catch {
    return NextResponse.json(fail("UNAUTHORIZED", "Authentication required.", 401), { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ctx = authenticateRequest(sessionRequest(request), "school");
    const body = await request.json();
    const result = await createLeave(ctx, body);
    return NextResponse.json(result, { status: result.ok ? 201 : result.error.status ?? 400 });
  } catch {
    return NextResponse.json(fail("UNAUTHORIZED", "Authentication required.", 401), { status: 401 });
  }
}
