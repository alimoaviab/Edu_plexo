/**
 * Standardized, Deterministic Query Key Factory for EduPlexo.
 *
 * Ensures:
 * 1. Strict Tenant Isolation (school_id, academic_year_id).
 * 2. User Isolation where appropriate (user_id / student_id / teacher_id).
 * 3. Canonical Parameter Sorting (different key order yields identical cache identity).
 * 4. Deterministic invalidation targets.
 */

/**
 * Deterministically normalize query params so object key insertion order
 * does not create duplicate cache entries.
 */
export function normalizeParams(
  params?: Record<string, unknown> | null
): Record<string, unknown> | null {
  if (!params || typeof params !== "object") return null;

  const keys = Object.keys(params).sort();
  const normalized: Record<string, unknown> = {};

  for (const key of keys) {
    const val = params[key];
    if (val !== undefined && val !== null && val !== "") {
      if (typeof val === "object" && !Array.isArray(val)) {
        normalized[key] = normalizeParams(val as Record<string, unknown>);
      } else {
        normalized[key] = val;
      }
    }
  }

  return Object.keys(normalized).length > 0 ? normalized : null;
}

export interface TenantScopeOptions {
  schoolId?: string | null;
  academicYearId?: string | null;
  userScope?: string | null;
}

/**
 * Base query key builder with tenant scoping and normalized parameters.
 * Places the resource name first so queryClient.invalidateQueries({ queryKey: [resource] })
 * matches by prefix across all tenants/parameters.
 */
export function buildQueryKey(
  resource: string,
  scope: TenantScopeOptions = {},
  params?: Record<string, unknown> | null
): readonly unknown[] {
  const school = scope.schoolId || "global";
  const ay = scope.academicYearId || "all";
  const normParams = normalizeParams(params);

  const base: unknown[] = [resource, school, ay];

  if (scope.userScope) {
    base.push(`user:${scope.userScope}`);
  }

  if (normParams) {
    base.push(normParams);
  }

  return Object.freeze(base);
}


/**
 * Standard query key builders for domain modules.
 */
export const queryKeys = {
  dashboard: {
    all: (schoolId?: string | null, ayId?: string | null) =>
      buildQueryKey("dashboard", { schoolId, academicYearId: ayId }),
    composite: (schoolId?: string | null, ayId?: string | null) =>
      buildQueryKey("dashboard", { schoolId, academicYearId: ayId }, { type: "composite" }),
    stats: (schoolId?: string | null, ayId?: string | null) =>
      buildQueryKey("dashboard", { schoolId, academicYearId: ayId }, { type: "stats" }),
  },
  students: {
    all: (schoolId?: string | null, ayId?: string | null) =>
      buildQueryKey("students", { schoolId, academicYearId: ayId }),
    list: (schoolId?: string | null, ayId?: string | null, params?: Record<string, unknown>) =>
      buildQueryKey("students", { schoolId, academicYearId: ayId }, params),
    detail: (schoolId?: string | null, studentId?: string) =>
      buildQueryKey("students", { schoolId, userScope: studentId }, { type: "profile" }),
  },
  attendance: {
    all: (schoolId?: string | null, ayId?: string | null) =>
      buildQueryKey("attendance", { schoolId, academicYearId: ayId }),
    sheet: (schoolId?: string | null, ayId?: string | null, classId?: string, date?: string) =>
      buildQueryKey("attendance", { schoolId, academicYearId: ayId }, { classId, date }),
    student: (schoolId?: string | null, ayId?: string | null, studentId?: string) =>
      buildQueryKey("attendance", { schoolId, academicYearId: ayId, userScope: studentId }),
  },
  fees: {
    all: (schoolId?: string | null, ayId?: string | null) =>
      buildQueryKey("fees", { schoolId, academicYearId: ayId }),
    list: (schoolId?: string | null, ayId?: string | null, params?: Record<string, unknown>) =>
      buildQueryKey("fees", { schoolId, academicYearId: ayId }, params),
    student: (schoolId?: string | null, studentId?: string) =>
      buildQueryKey("fees", { schoolId, userScope: studentId }),
  },
  classes: {
    all: (schoolId?: string | null, ayId?: string | null) =>
      buildQueryKey("classes", { schoolId, academicYearId: ayId }),
    list: (schoolId?: string | null, ayId?: string | null, params?: Record<string, unknown>) =>
      buildQueryKey("classes", { schoolId, academicYearId: ayId }, params),
    detail: (schoolId?: string | null, ayId?: string | null, classId?: string) =>
      buildQueryKey("classes", { schoolId, academicYearId: ayId }, { classId }),
  },
  teachers: {
    all: (schoolId?: string | null) =>
      buildQueryKey("teachers", { schoolId }),
    list: (schoolId?: string | null, params?: Record<string, unknown>) =>
      buildQueryKey("teachers", { schoolId }, params),
    detail: (schoolId?: string | null, teacherId?: string) =>
      buildQueryKey("teachers", { schoolId, userScope: teacherId }),
  },
  timetable: {
    all: (schoolId?: string | null, ayId?: string | null) =>
      buildQueryKey("timetable", { schoolId, academicYearId: ayId }),
    class: (schoolId?: string | null, ayId?: string | null, classId?: string) =>
      buildQueryKey("timetable", { schoolId, academicYearId: ayId }, { classId }),
    teacher: (schoolId?: string | null, ayId?: string | null, teacherId?: string) =>
      buildQueryKey("timetable", { schoolId, academicYearId: ayId, userScope: teacherId }),
  },
  exams: {
    all: (schoolId?: string | null, ayId?: string | null) =>
      buildQueryKey("exams", { schoolId, academicYearId: ayId }),
    list: (schoolId?: string | null, ayId?: string | null, params?: Record<string, unknown>) =>
      buildQueryKey("exams", { schoolId, academicYearId: ayId }, params),
  },
  results: {
    all: (schoolId?: string | null, ayId?: string | null) =>
      buildQueryKey("results", { schoolId, academicYearId: ayId }),
    list: (schoolId?: string | null, ayId?: string | null, params?: Record<string, unknown>) =>
      buildQueryKey("results", { schoolId, academicYearId: ayId }, params),
    student: (schoolId?: string | null, ayId?: string | null, studentId?: string) =>
      buildQueryKey("results", { schoolId, academicYearId: ayId, userScope: studentId }),
  },
  notifications: (userId?: string | null) =>
    buildQueryKey("notifications", { userScope: userId }),
};

