import { getRequestContext, handleApiResponse } from "@/lib/api-utils";
import { generateMonthlyFees } from "@edu/shared/services/fee-flow.service";

export async function POST(req: Request) {
    const ctx = getRequestContext(req);
    const body = await req.json();

    const result = await generateMonthlyFees(ctx, body);
    return handleApiResponse(result);
}
