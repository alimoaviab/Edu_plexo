import { getRequestContext, handleApiResponse } from "@/lib/api-utils";
import { addClassFee } from "@edu/shared/services/fee-flow.service";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const ctx = getRequestContext(req);
    const body = await req.json();
    const result = await addClassFee(ctx, id, body);
    return handleApiResponse(result);
}
