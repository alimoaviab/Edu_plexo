import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verifyAuthToken } from "@edu/shared/auth/jwt";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip public routes and assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/auth/login" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Get token from cookies or authorization header
  const token = request.cookies.get("session")?.value || 
                request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    // In development, if no token, allow but we should ideally redirect to login
    if (process.env.NODE_ENV === "development") {
        return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    // Determine expected app context (school-app)
    const payload = verifyAuthToken(token, "school");

    // 3. Portal Isolation Enforcement
    if (pathname.startsWith("/admin") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/auth/unauthorized", request.url));
    }
    if (pathname.startsWith("/teacher") && payload.role !== "teacher") {
      return NextResponse.redirect(new URL("/auth/unauthorized", request.url));
    }
    if (pathname.startsWith("/student") && payload.role !== "student") {
      return NextResponse.redirect(new URL("/auth/unauthorized", request.url));
    }
    if (pathname.startsWith("/parent") && payload.role !== "parent") {
      return NextResponse.redirect(new URL("/auth/unauthorized", request.url));
    }

    // 4. Inject School ID into headers for downstream use if needed
    // (Though we mostly use the token in API routes)
    const response = NextResponse.next();
    response.headers.set("x-school-id", payload.school_id);
    
    return response;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
        return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/teacher/:path*",
    "/student/:path*",
    "/parent/:path*",
    "/api/:path*"
  ],
};
