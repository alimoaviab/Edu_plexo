import { getRequestContext, handleApiResponse } from "@/lib/api-utils";
import { toggleClassFeeStatus } from "@edu/shared/services/fee-flow.service";

export async function POST(req: Request, { params }: { params: Promise<{ id: string; feeId: string }> }) {
    const { id, feeId } = await params;
    const ctx = getRequestContext(req);
    const result = await toggleClassFeeStatus(ctx, id, feeId);
    return handleApiResponse(result);
}
