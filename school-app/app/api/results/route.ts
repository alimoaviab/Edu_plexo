import { getRequestContext, getQuery, handleApiResponse } from "../../../lib/api-utils";
import { listResults, saveResult } from "@edu/shared/services/result.service";

export async function GET(request: Request) {
  const ctx = getRequestContext(request);
  const result = await listResults(ctx, getQuery(request));
  return handleApiResponse(result);
}

export async function POST(request: Request) {
  const ctx = getRequestContext(request);
  const result = await saveResult(ctx, await request.json());
  return handleApiResponse(result);
}