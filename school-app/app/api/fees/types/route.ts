import { getRequestContext, handleApiResponse } from "@/lib/api-utils";
import { listFeeTypes } from "@edu/shared/services/fee-flow.service";

export async function GET(req: Request) {
    const ctx = getRequestContext(req);
    const result = await listFeeTypes(ctx);
    return handleApiResponse(result);
}
