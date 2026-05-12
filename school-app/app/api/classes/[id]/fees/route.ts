import { getRequestContext, handleApiResponse } from "@/lib/api-utils";
import { getClassFees } from "@edu/shared/services/fee-flow.service";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const ctx = getRequestContext(req);
    const result = await getClassFees(ctx, id);
    return handleApiResponse(result);
}
