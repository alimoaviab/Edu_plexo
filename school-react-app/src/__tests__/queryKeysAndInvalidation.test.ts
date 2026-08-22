/**
 * Query Keys & Invalidation Tests
 *
 * Verifies:
 * - Parameter normalization (order-independent key creation).
 * - Tenant and academic year isolation in keys.
 * - Targeted invalidation functions match query keys by prefix.
 * - resetTenantCache clears queryClient.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { buildQueryKey, normalizeParams, queryKeys } from "@/lib/query-keys";
import {
  queryClient,
  invalidateStudentQueries,
  invalidateAttendanceQueries,
  invalidateDashboardQueries,
  resetTenantCache,
} from "@/lib/query-client";

describe("Query Keys & Deterministic Keying", () => {
  it("normalizes parameters so key order produces identical cache keys", () => {
    const params1 = { page: 1, limit: 25, search: "Ali" };
    const params2 = { search: "Ali", page: 1, limit: 25 };

    const norm1 = normalizeParams(params1);
    const norm2 = normalizeParams(params2);

    expect(JSON.stringify(norm1)).toEqual(JSON.stringify(norm2));

    const key1 = buildQueryKey("students", { schoolId: "sch_1", academicYearId: "ay_2025" }, params1);
    const key2 = buildQueryKey("students", { schoolId: "sch_1", academicYearId: "ay_2025" }, params2);

    expect(key1).toEqual(key2);
  });

  it("ensures different tenants produce distinct cache keys", () => {
    const keySchoolA = queryKeys.students.list("school_A", "ay_2025", { page: 1 });
    const keySchoolB = queryKeys.students.list("school_B", "ay_2025", { page: 1 });

    expect(keySchoolA).not.toEqual(keySchoolB);
  });

  it("ensures different academic years produce distinct cache keys", () => {
    const keyYear1 = queryKeys.students.list("school_A", "ay_2024", { page: 1 });
    const keyYear2 = queryKeys.students.list("school_A", "ay_2025", { page: 1 });

    expect(keyYear1).not.toEqual(keyYear2);
  });

  it("ensures different pages produce distinct cache keys", () => {
    const keyPage1 = queryKeys.students.list("school_A", "ay_2025", { page: 1 });
    const keyPage2 = queryKeys.students.list("school_A", "ay_2025", { page: 2 });

    expect(keyPage1).not.toEqual(keyPage2);
  });
});

describe("Targeted Invalidation", () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it("invalidates student and dashboard queries upon invalidateStudentQueries", async () => {

    // Populate cache entries
    queryClient.setQueryData(["students", "school_1", "ay_2025", { page: 1 }], { count: 10 });
    queryClient.setQueryData(["dashboard", "school_1", "ay_2025"], { totalStudents: 10 });
    queryClient.setQueryData(["timetable", "school_1", "ay_2025"], { schedule: [] });

    // Perform targeted student invalidation
    await invalidateStudentQueries();


    const studentQueryAfter = queryClient.getQueryCache().find({ queryKey: ["students"], exact: false });
    const dashboardQueryAfter = queryClient.getQueryCache().find({ queryKey: ["dashboard"], exact: false });
    const timetableQueryAfter = queryClient.getQueryCache().find({ queryKey: ["timetable"], exact: false });

    // Student & dashboard queries should be invalidated
    expect(studentQueryAfter?.state.isInvalidated).toBe(true);
    expect(dashboardQueryAfter?.state.isInvalidated).toBe(true);

    // Timetable should remain untouched (NOT invalidated)
    expect(timetableQueryAfter?.state.isInvalidated).toBe(false);
  });



  it("resetTenantCache clears all queries in queryClient", () => {
    queryClient.setQueryData(["students", "sch_1"], { count: 5 });
    queryClient.setQueryData(["dashboard", "sch_1"], { overview: {} });

    expect(queryClient.getQueryCache().getAll().length).toBe(2);

    resetTenantCache();

    expect(queryClient.getQueryCache().getAll().length).toBe(0);
  });
});
