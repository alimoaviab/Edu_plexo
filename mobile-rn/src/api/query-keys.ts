/**
 * Centralised TanStack Query key factory.
 *
 * Every key embeds `schoolId` and `academicYearId` so a tenant switch (or
 * year switch) automatically invalidates everything previously cached.
 */

export const qk = {
  // Auth & tenant
  session: ['session'] as const,
  academicYears: (schoolId: string) => ['academic-years', schoolId] as const,

  // Dashboards
  compositeDashboard: (schoolId: string, year: string) =>
    ['dashboard', 'composite', schoolId, year] as const,
  analyticsDashboard: (schoolId: string, year: string) =>
    ['dashboard', 'analytics', schoolId, year] as const,
  parentDashboard: (schoolId: string, studentId: string | undefined) =>
    ['dashboard', 'parent', schoolId, studentId] as const,

  // People
  students: (schoolId: string, year: string, filters?: Record<string, unknown>) =>
    ['students', schoolId, year, filters ?? {}] as const,
  student: (id: string) => ['student', id] as const,
  teachers: (schoolId: string, year: string, filters?: Record<string, unknown>) =>
    ['teachers', schoolId, year, filters ?? {}] as const,
  teacher: (id: string) => ['teacher', id] as const,

  // Academics
  classes: (schoolId: string, year: string) =>
    ['classes', schoolId, year] as const,
  classDetail: (id: string) => ['class', id] as const,
  classSubjects: (classId: string) => ['class-subjects', classId] as const,
  subjects: (schoolId: string) => ['subjects', schoolId] as const,
  subject: (id: string) => ['subject', id] as const,
  timetable: (
    schoolId: string,
    year: string,
    filters?: Record<string, unknown>,
  ) => ['timetable', schoolId, year, filters ?? {}] as const,
  timetableSummary: (schoolId: string, year: string) =>
    ['timetable-summary', schoolId, year] as const,

  // Attendance
  attendance: (
    schoolId: string,
    year: string,
    filters?: Record<string, unknown>,
  ) => ['attendance', schoolId, year, filters ?? {}] as const,

  // Exams / tests / results
  exams: (
    schoolId: string,
    year: string,
    filters?: Record<string, unknown>,
  ) => ['exams', schoolId, year, filters ?? {}] as const,
  tests: (
    schoolId: string,
    year: string,
    filters?: Record<string, unknown>,
  ) => ['tests', schoolId, year, filters ?? {}] as const,
  results: (
    schoolId: string,
    year: string,
    filters?: Record<string, unknown>,
  ) => ['results', schoolId, year, filters ?? {}] as const,

  // Homework / behavior / leave / events / announcements
  homework: (
    schoolId: string,
    year: string,
    filters?: Record<string, unknown>,
  ) => ['homework', schoolId, year, filters ?? {}] as const,
  behavior: (
    schoolId: string,
    year: string,
    filters?: Record<string, unknown>,
  ) => ['behavior', schoolId, year, filters ?? {}] as const,
  leave: (
    schoolId: string,
    requesterType?: string,
  ) => ['leave', schoolId, requesterType ?? 'all'] as const,
  events: (
    schoolId: string,
    filters?: Record<string, unknown>,
  ) => ['events', schoolId, filters ?? {}] as const,
  announcements: (schoolId: string) =>
    ['announcements', schoolId] as const,
  liveClasses: (
    schoolId: string,
    year: string,
    filters?: Record<string, unknown>,
  ) => ['live-classes', schoolId, year, filters ?? {}] as const,

  // Fees
  feeTypes: (schoolId: string) => ['fee-types', schoolId] as const,
  feeDashboardStats: (schoolId: string, year: string) =>
    ['fee-dashboard-stats', schoolId, year] as const,
  feeClassesSummary: (schoolId: string, year: string) =>
    ['fee-classes-summary', schoolId, year] as const,
  studentFees: (schoolId: string, studentId?: string) =>
    ['student-fees', schoolId, studentId ?? ''] as const,
  classFees: (classId: string) => ['class-fees', classId] as const,

  // Notifications & settings & subscription
  notifications: (schoolId: string) =>
    ['notifications', schoolId] as const,
  settings: (schoolId: string) => ['settings', schoolId] as const,
  subscription: (schoolId: string) => ['subscription', schoolId] as const,
  subscriptionPlans: ['subscription-plans'] as const,
  subscriptionHistory: (schoolId: string) =>
    ['subscription-history', schoolId] as const,

  // Parent
  parentChildren: (userId: string) => ['parent-children', userId] as const,
  parentStudentInfo: (userId: string) =>
    ['parent-student-info', userId] as const,
};
