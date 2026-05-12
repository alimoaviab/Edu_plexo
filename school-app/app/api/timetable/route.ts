import { getRequestContext, getQuery, handleApiResponse } from "../../../lib/api-utils";
import { createTimetable, listTimetable } from "@edu/shared/services/timetable.service";

export async function GET(request: Request) {
  const ctx = getRequestContext(request);
  const result = await listTimetable(ctx, getQuery(request));
  return handleApiResponse(result);
}

export async function POST(request: Request) {
  const ctx = getRequestContext(request);
  const result = await createTimetable(ctx, await request.json());
  return handleApiResponse(result);
}
