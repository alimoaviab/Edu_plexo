import { getRequestContext, handleApiResponse } from "@/lib/api-utils";
import { deleteClassFee } from "@edu/shared/services/fee-flow.service";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; feeId: string }> }) {
    const { id, feeId } = await params;
    const ctx = getRequestContext(req);
    const result = await deleteClassFee(ctx, id, feeId);
    return handleApiResponse(result);
}
