import { getRequestContext, getQuery, handleApiResponse } from "../../../lib/api-utils";
import { listAttendance, createAttendance } from "@edu/shared/services/attendance.service";

export async function GET(request: Request) {
  const ctx = getRequestContext(request);
  const result = await listAttendance(ctx, getQuery(request));
  return handleApiResponse(result);
}

export async function POST(request: Request) {
  const ctx = getRequestContext(request);
  const result = await createAttendance(ctx, await request.json());
  return handleApiResponse(result);
}
