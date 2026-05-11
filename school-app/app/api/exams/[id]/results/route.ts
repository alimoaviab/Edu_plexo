import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@edu/shared/auth/middleware";
import { fail } from "@edu/shared/utils/result";
import { listExamResults, saveExamResults } from "@edu/shared/services/result.service";
import { sessionRequest } from "../../../_utils";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const ctx = authenticateRequest(sessionRequest(request), "school");
        const { id } = await params;
        const result = await listExamResults(ctx, id);
        return NextResponse.json(result, { status: result.ok ? 200 : result.error.status ?? 400 });
    } catch {
        return NextResponse.json(fail("UNAUTHORIZED", "Authentication required.", 401), { status: 401 });
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const ctx = authenticateRequest(sessionRequest(request), "school");
        const { id } = await params;
        const body = await request.json();
        const result = await saveExamResults(ctx, id, body.results);
        return NextResponse.json(result, { status: result.ok ? 200 : result.error.status ?? 400 });
    } catch {
        return NextResponse.json(fail("UNAUTHORIZED", "Authentication required.", 401), { status: 401 });
    }
}
