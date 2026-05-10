import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@edu/shared/auth/middleware";
import { ok, fail } from "@edu/shared/utils/result";
import { DashboardAnalyticsService } from "@edu/shared/services/dashboard-analytics.service";
import { connectDb } from "../../../../db/connection";

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
    await connectDb();
    const ctx = authenticateRequest(sessionRequest(request), "school");
    const { searchParams } = new URL(request.url);
    const academy_care_id = searchParams.get("academy_care_id") || undefined;
    
    const overview = await DashboardAnalyticsService.getOverviewStats(ctx, academy_care_id);
    const trends = await DashboardAnalyticsService.getAttendanceTrends(ctx, academy_care_id);
    const alerts = await DashboardAnalyticsService.getSystemAlerts(ctx, academy_care_id);
    const classAttendance = await DashboardAnalyticsService.getClassAttendance(ctx, academy_care_id);
    const operationalLogs = await DashboardAnalyticsService.getOperationalLogs(ctx, academy_care_id);

    return NextResponse.json(ok({
      overview,
      trends,
      alerts,
      classAttendance,
      operationalLogs
    }));
  } catch (error: any) {
    console.error("[DashboardAPI] Error:", error);
    return NextResponse.json(fail("INTERNAL_ERROR", error.message || "Failed to fetch dashboard data", 500), { status: 500 });
  }
}
