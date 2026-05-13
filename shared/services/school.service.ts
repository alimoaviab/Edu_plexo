import { assertPermission } from "../auth/rbac";
import { connectDb } from "../db/connect";
import { requirePlatformContext } from "../db/tenant-query";
import { SchoolModel } from "../models/school.model";
import { RequestContext, ServiceResult } from "../types/core";
import { serviceTry } from "../utils/result";
import {
  SchoolCreateInput,
  schoolCreateSchema,
} from "../validation/school.schema";
import { writeAuditLog } from "./audit.service";

export async function listSchools(
  ctx: RequestContext,
  options?: { skip?: number; limit?: number; status?: string; search?: string },
): Promise<ServiceResult<{ data: unknown[]; total: number }>> {
  return serviceTry(async () => {
    await connectDb();
    requirePlatformContext(ctx);
    assertPermission(ctx, "schools", "view");

    const query: any = {};
    if (options?.status) {
      query.status = options.status;
    }
    if (options?.search) {
      const searchRegex = new RegExp(options.search, "i");
      query.$or = [
        { name: searchRegex },
        { code: searchRegex },
        { school_id: searchRegex },
        { owner_name: searchRegex },
        { contact_email: searchRegex },
        { contact_phone: searchRegex },
      ];
    }

    const total = await SchoolModel.countDocuments(query);
    const data = await SchoolModel.find(query)
      .sort({ created_at: -1 })
      .skip(options?.skip || 0)
      .limit(options?.limit || 50)
      .lean();

    return { data, total };
  });
}

export async function createSchool(
  ctx: RequestContext,
  input: SchoolCreateInput,
): Promise<ServiceResult<unknown>> {
  return serviceTry(async () => {
    await connectDb();
    requirePlatformContext(ctx);
    assertPermission(ctx, "schools", "create");

    const parsed = schoolCreateSchema.parse(input);
    const created = await SchoolModel.create({
      ...parsed,
      code: parsed.code.toUpperCase(),
      created_by: ctx.user_id,
    });

    await writeAuditLog(ctx, {
      action: "create",
      entity_type: "school",
      entity_id: parsed.school_id,
      after: created.toObject(),
    });

    return created.toObject();
  });
}

export async function setSchoolBlocked(
  ctx: RequestContext,
  schoolId: string,
  blocked: boolean,
): Promise<ServiceResult<unknown>> {
  return serviceTry(async () => {
    await connectDb();
    requirePlatformContext(ctx);
    assertPermission(ctx, "schools", "update");

    const before = await SchoolModel.findOne({ school_id: schoolId }).lean();
    const after = await SchoolModel.findOneAndUpdate(
      { school_id: schoolId },
      {
        $set: {
          status: blocked ? "blocked" : "active",
          updated_by: ctx.user_id,
        },
      },
      { new: true, runValidators: true },
    ).lean();

    await writeAuditLog(ctx, {
      action: blocked ? "block" : "unblock",
      entity_type: "school",
      entity_id: schoolId,
      before,
      after,
    });

    return after;
  });
}

export async function updateSchoolStatus(
  ctx: RequestContext,
  schoolId: string,
  status: string,
  reason?: string,
): Promise<ServiceResult<unknown>> {
  return serviceTry(async () => {
    await connectDb();
    requirePlatformContext(ctx);
    assertPermission(ctx, "schools", "update");

    const before = await SchoolModel.findOne({ school_id: schoolId }).lean();
    if (!before) {
      throw new Error("School not found");
    }

    const updates: any = {
      status,
      updated_by: ctx.user_id,
    };

    if (status === "approved") {
      updates.approved_by = ctx.user_id;
      updates.approved_at = new Date();
    }

    const after = await SchoolModel.findOneAndUpdate(
      { school_id: schoolId },
      { $set: updates },
      { new: true, runValidators: true },
    ).lean();

    await writeAuditLog(ctx, {
      action: `status_changed_to_${status}` as import("../types/core").AuditAction,
      entity_type: "school",
      entity_id: schoolId,
      metadata: reason ? { reason } : undefined,
      before,
      after,
    });

    // Handle Emails (Mocking the sending behavior for now)
    if (status === "approved" && (before as any).contact_email) {
      console.log(`[Email Service] Sent approval email to ${(before as any).contact_email} for school ${schoolId}`);
    } else if (status === "rejected" && (before as any).contact_email) {
      console.log(`[Email Service] Sent rejection email to ${(before as any).contact_email} for school ${schoolId}. Reason: ${reason || "No reason provided"}`);
    }

    return after;
  });
}
