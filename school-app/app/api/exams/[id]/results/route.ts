import { NextRequest } from "next/server";
import { getRequestContext, getQuery, handleApiResponse } from "../../../../../lib/api-utils";
import { listExamResults, saveExamResults } from "@edu/shared/services/result.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = getRequestContext(req);
  const { id } = await params;
  const result = await listExamResults(ctx, id);
  return handleApiResponse(result);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = getRequestContext(req);
  const { id } = await params;
  const body = await req.json();
  const result = await saveExamResults(ctx, id, body.results);
  return handleApiResponse(result);
}
