import { NextResponse } from "next/server";
import { LiveAttendanceService } from "@edu/shared/services/live/live-attendance.service";
import { authenticateRequest, SessionRequest } from "@edu/shared/auth/middleware";

const sessionRequest = (req: Request): SessionRequest => ({
  headers: Object.fromEntries(req.headers),
  cookies: {
     session: req.headers.get("cookie")?.split("; ").find(c => c.startsWith("session="))?.split("=")[1]
  }
});

export async function GET(req: Request) {
  try {
    const ctx = authenticateRequest(sessionRequest(req), "school");
    const { searchParams } = new URL(req.url);
    const liveClassId = searchParams.get("liveClassId");

    if (!liveClassId) return NextResponse.json({ error: "liveClassId required" }, { status: 400 });

    const data = await LiveAttendanceService.getAttendanceForClass(ctx, liveClassId);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const ctx = authenticateRequest(sessionRequest(req), "school");
    if (ctx.role !== "student") {
      return NextResponse.json({ success: false, error: "Only students can mark join/leave" }, { status: 403 });
    }

    const body = await req.json();
    const { liveClassId, action } = body;

    let result;
    if (action === "join") {
       result = await LiveAttendanceService.markJoin(ctx, liveClassId, ctx.user_id);
    } else if (action === "leave") {
       result = await LiveAttendanceService.markLeave(ctx, liveClassId, ctx.user_id);
    } else {
       return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
