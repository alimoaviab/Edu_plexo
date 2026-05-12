import { NextResponse } from "next/server";

function createMockJwt(role: string, email: string) {
  const base64Url = (value: string) =>
    Buffer.from(value)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");

  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64Url(
    JSON.stringify({
      sub: "mock-user-id",
      actor_email: email,
      role,
      school_id: "mock-school-id",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
    })
  );

  return `${header}.${payload}.mock-signature`;
}

function ok(data: any = null) {
  return NextResponse.json({ ok: true, success: true, data });
}

function notFound(message = "Not found") {
  return NextResponse.json(
    { ok: false, success: false, message, error: { code: "NOT_FOUND", message } },
    { status: 404 }
  );
}

export async function GET(_req: Request, context: any) {
  const params = await context.params;
  const slug = params?.slug || [];
  const first = slug[0] || "";

  // Return sensible defaults for common list endpoints
  if (["classes", "teachers", "exams", "academic-years", "subjects", "students", "results", "attendance", "events", "behavior", "leave"].includes(first)) {
    return ok([]);
  }

  if (first === "auth") {
    // /api/auth/session or similar
    return ok(null);
  }

  return notFound();
}

export async function POST(req: Request, context: any) {
  const params = await context.params;
  const slug = params?.slug || [];
  const first = slug[0] || "";

  if (first === "auth" && slug[1] === "login") {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const role = body?.role || "admin";
    const email = body?.email || "demo@school.com";
    const token = createMockJwt(role, email);

    return NextResponse.json({
      ok: true,
      success: true,
      role,
      token,
      profile_id: "mock-profile-id",
      class_id: role === "student" ? "mock-class-id" : undefined,
      student_id: role === "student" ? "mock-student-id" : undefined,
      data: {
        role,
        token,
        profile_id: "mock-profile-id",
        class_id: role === "student" ? "mock-class-id" : undefined,
        student_id: role === "student" ? "mock-student-id" : undefined,
      },
    });
  }

  // Accept create/submit operations and return success
  if (first) return ok({ success: true });
  return notFound();
}

export async function PATCH(_req: Request, context: any) {
  await context.params;
  return ok({ success: true });
}

export async function DELETE(_req: Request, context: any) {
  await context.params;
  return ok({ success: true });
}
