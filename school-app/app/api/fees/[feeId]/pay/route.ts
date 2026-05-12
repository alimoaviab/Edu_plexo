import { getRequestContext, handleApiResponse } from "@/lib/api-utils";
import { collectFeePayment } from "@edu/shared/services/fee-flow.service";

export async function POST(req: Request, { params }: { params: Promise<{ feeId: string }> }) {
    const { feeId } = await params;
    const ctx = getRequestContext(req);
    const body = await req.json();

    const result = await collectFeePayment(ctx, feeId, body);
    return handleApiResponse(result);
}
