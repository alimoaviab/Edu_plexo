import { getRequestContext, getQuery, handleApiResponse } from "../../../lib/api-utils";
import { createClass, listClasses } from "@edu/shared/services/class.service";

export async function GET(request: Request) {
  const ctx = getRequestContext(request);
  const result = await listClasses(ctx, getQuery(request));
  return handleApiResponse(result);
}

export async function POST(request: Request) {
  const ctx = getRequestContext(request);
  const result = await createClass(ctx, await request.json());
  return handleApiResponse(result);
}