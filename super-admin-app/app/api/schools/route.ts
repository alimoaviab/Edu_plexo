import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@edu/shared/auth/middleware";
import { fail } from "@edu/shared/utils/result";
import { createSchool, listSchools } from "../../../modules/schools/services/school.service";

function sessionRequest(request: NextRequest) {
  return {
    cookies: Object.fromEntries(request.cookies.getAll().map((cookie) => [cookie.name, cookie.value])),
    headers: {
      authorization: request.headers.get("authorization") ?? undefined,
      "user-agent": request.headers.get("user-agent") ?? undefined
    },
    ip: request.headers.get("x-forwarded-for") ?? undefined
  };
}

export async function GET(request: NextRequest) {
  try {
    const ctx = authenticateRequest(sessionRequest(request), "super_admin");
    const url = new URL(request.url);
    const skip = parseInt(url.searchParams.get("skip") || "0", 10);
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    const status = url.searchParams.get("status") || undefined;
    const search = url.searchParams.get("search") || undefined;

    const result = await listSchools(ctx, { skip, limit, status, search });
    return NextResponse.json(result, { status: result.ok ? 200 : result.error.status ?? 400 });
  } catch {
    return NextResponse.json(fail("UNAUTHORIZED", "Authentication required.", 401), { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ctx = authenticateRequest(sessionRequest(request), "super_admin");
    const body = await request.json();
    const result = await createSchool(ctx, body);
    return NextResponse.json(result, { status: result.ok ? 201 : result.error.status ?? 400 });
  } catch {
    return NextResponse.json(fail("UNAUTHORIZED", "Authentication required.", 401), { status: 401 });
  }
}
