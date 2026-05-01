import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@edu/shared/auth/middleware";
import { fail } from "@edu/shared/utils/result";
import { createAnnouncement, listAnnouncements } from "@edu/shared/services/announcement.service";
import { sessionRequest } from "../_utils";

export async function GET(request: NextRequest) {
  try {
    const ctx = authenticateRequest(sessionRequest(request), "school");
    const status = request.nextUrl.searchParams.get("status") ?? undefined;
    const target_type = request.nextUrl.searchParams.get("target_type") ?? undefined;
    const priority = request.nextUrl.searchParams.get("priority") ?? undefined;
    const result = await listAnnouncements(ctx, { status, target_type, priority });
    return NextResponse.json(result, { status: result.ok ? 200 : result.error.status ?? 400 });
  } catch {
    return NextResponse.json(fail("UNAUTHORIZED", "Authentication required.", 401), { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ctx = authenticateRequest(sessionRequest(request), "school");
    const body = await request.json();
    const result = await createAnnouncement(ctx, body);
    return NextResponse.json(result, { status: result.ok ? 201 : result.error.status ?? 400 });
  } catch {
    return NextResponse.json(fail("UNAUTHORIZED", "Authentication required.", 401), { status: 401 });
  }
}
