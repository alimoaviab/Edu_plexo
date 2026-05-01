import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@edu/shared/auth/middleware";
import { getSubject, updateSubject, deleteSubject } from "@edu/shared/services/subject.service";

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

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const ctx = authenticateRequest(sessionRequest(request), "school");
        const result = await getSubject(ctx, params.id);
        return NextResponse.json(result.ok ? result.data : { error: result.error.message }, { status: result.ok ? 200 : result.error.status ?? 404 });
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const ctx = authenticateRequest(sessionRequest(request), "school");
        const data = await request.json();
        const result = await updateSubject(ctx, params.id, data);
        return NextResponse.json(result.ok ? result.data : { error: result.error.message }, { status: result.ok ? 200 : result.error.status ?? 400 });
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const ctx = authenticateRequest(sessionRequest(request), "school");
        const result = await deleteSubject(ctx, params.id);
        return NextResponse.json(result.ok ? { success: true } : { error: result.error.message }, { status: result.ok ? 200 : result.error.status ?? 400 });
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
