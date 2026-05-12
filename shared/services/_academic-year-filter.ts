import { Types } from "mongoose";
import { tenantFilter } from "../db/tenant-query";
import { AcademicYearModel } from "../models/academic-year.model";
import { ClassModel } from "../models/class.model";
import { RequestContext } from "../types/core";

export async function resolveAcademicYearId(
    ctx: RequestContext,
    academicYearId?: string
): Promise<string | undefined> {
    // If explicit ID is provided, validate that it belongs to the current tenant.
    // If invalid/stale, gracefully fall back to active academic year resolution.
    if (academicYearId && academicYearId !== "undefined") {
        if (Types.ObjectId.isValid(academicYearId)) {
            const explicit = (await AcademicYearModel.findOne(
                tenantFilter(ctx, { _id: new Types.ObjectId(academicYearId) })
            )
                .select("_id")
                .lean()) as { _id?: unknown } | null;

            if (explicit?._id) {
                return String(explicit._id);
            }
        }
    }

    // If context has an active year ID, use it
    if (ctx.active_academic_year_id && ctx.active_academic_year_id !== "undefined") {
        return ctx.active_academic_year_id;
    }

    // Fallback: Find the one marked as is_active: true for this school
    const active = (await AcademicYearModel.findOne(
        tenantFilter(ctx, { is_active: true, status: "active" })
    )
        .select("_id")
        .lean()) as { _id?: unknown } | null;

    if (!active) {
        // In some cases we might want to allow this (e.g. creating the first academic year)
        // but for data fetching, it should probably be required.
        return undefined;
    }

    return String(active._id);
}

export async function resolveClassIdsForAcademicYear(
    ctx: RequestContext,
    academicYearId?: string
): Promise<Types.ObjectId[]> {
    const resolvedAcademicYearId = await resolveAcademicYearId(ctx, academicYearId);
    if (!resolvedAcademicYearId) {
        return [];
    }

    const classes = await ClassModel.find(
        tenantFilter(ctx, { academic_year_id: new Types.ObjectId(resolvedAcademicYearId) })
    )
        .select("_id")
        .lean();

    return classes.map((row) => new Types.ObjectId(String(row._id)));
}
