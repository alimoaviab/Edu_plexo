import { NextResponse } from "next/server";
import { authenticateRequest } from "@edu/shared/auth/middleware";
import { RequestContext, ServiceResult } from "@edu/shared/types/core";

export function parseCookies(cookieHeader: string | null) {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split("; ").map((entry) => {
      const separatorIndex = entry.indexOf("=");
      return separatorIndex >= 0 ? [entry.slice(0, separatorIndex), entry.slice(separatorIndex + 1)] : [entry, ""];
    })
  );
}

export function getRequestContext(request: Request): RequestContext {
  return authenticateRequest(
    {
      cookies: parseCookies(request.headers.get("cookie")),
      headers: Object.fromEntries(request.headers.entries())
    },
    "school"
  );
}

export function getQuery(request: Request) {
  return Object.fromEntries(new URL(request.url).searchParams.entries());
}

export function handleApiResponse<T>(result: ServiceResult<T>) {
  if (result.ok) {
    return NextResponse.json(result, { status: 200 });
  }
  
  const status = (result as any).error?.status || 400;
  return NextResponse.json(result, { status });
}
