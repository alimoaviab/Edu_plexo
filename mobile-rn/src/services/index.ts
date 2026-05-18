/**
 * Mobile service layer — 1:1 port of school-react-app/src/modules/<m>/services/*.
 *
 * Every function here calls the same backend route the web client uses, with
 * the same body shape, headers (via the api client), and response envelope.
 * UI screens consume these through TanStack Query hooks in `src/hooks/`.
 *
 * Why one file: keeps surface visible at a glance and avoids 20 micro-files
 * with identical imports. The types live in `src/services/types.ts`.
 */

import { api, getAcademicYearQuery } from '@/api/client';
import type { ServiceResult, PaginatedResponse } from '@/types/api';
import type {
  AcademicYearRow,
  AnnouncementRow,
  AttendanceMarkInput,
  AttendanceRow,
  BehaviorRow,
  ClassFee,
  ClassListResponse,
  ClassRow,
  EventRow,
  ExamRow,
  FeeAdjustmentRow,
  FeeMonthlyRow,
  FeePaymentRow,
  FeeType,
  HomeworkRow,
  LeaveRow,
  LiveClassRow,
  NotificationRow,
  ParentDashboardStats,
  ParentChildRow,
  ResultRow,
  SchoolSettings,
  StudentRow,
  SubjectRow,
  SubscriptionCurrent,
  SubscriptionHistoryEntry,
  SubscriptionPlan,
  TeacherRow,
  TimetableRow,
} from '@/services/types';

// ────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────

function paramsToQuery(
  filters?: Record<string, string | number | boolean | undefined | null>,
): string {
  if (!filters) return '';
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === '') continue;
    search.set(key, String(value));
  }
  const s = search.toString();
  return s ? `?${s}` : '';
}

async function withYear(
  filters?: Record<string, string | number | boolean | undefined | null>,
): Promise<string> {
  const yearQ = await getAcademicYearQuery();
  const params = new URLSearchParams(yearQ ? yearQ.slice(1) : '');
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || value === null || value === '') continue;
      params.set(key, String(value));
    }
  }
  const s = params.toString();
  return s ? `?${s}` : '';
}

// ────────────────────────────────────────────────────────────────────────
// Academic Year
// ────────────────────────────────────────────────────────────────────────

export const academicYearService = {
  list: (params?: { page?: number; limit?: number }) =>
    api.get<{
      items: AcademicYearRow[];
      total: number;
      page: number;
      limit: number;
      pages: number;
    }>(`/api/academic-years${paramsToQuery(params)}`),
  create: (input: Partial<AcademicYearRow>) =>
    api.post<AcademicYearRow>('/api/academic-years', input),
  update: (id: string, input: Partial<AcademicYearRow>) =>
    api.patch<AcademicYearRow>(`/api/academic-years/${id}`, input),
  remove: (id: string) =>
    api.delete<{ success: boolean; id: string }>(`/api/academic-years/${id}`),
  switch: (academicYearId: string) =>
    api.post<{
      token: string;
      academic_year_id: string;
      year: string;
      is_active: boolean;
    }>('/api/academic-years/switch', { academic_year_id: academicYearId }),
};

// ────────────────────────────────────────────────────────────────────────
// Students
// ────────────────────────────────────────────────────────────────────────

export const studentService = {
  list: async (filters?: {
    class_id?: string;
    status?: string;
    academic_year_id?: string;
  }) => {
    const qs = await withYear(filters);
    return api.get<StudentRow[]>(`/api/students${qs}`);
  },
  get: (id: string) => api.get<StudentRow>(`/api/students/${id}`),
  create: (input: Partial<StudentRow>) =>
    api.post<StudentRow>('/api/students', input),
  update: (id: string, input: Partial<StudentRow>) =>
    api.patch<StudentRow>(`/api/students/${id}`, input),
  remove: (id: string) =>
    api.delete<{ success: boolean; id: string }>(`/api/students/${id}`),
  checkParentEmail: (email: string) =>
    api.post<{ exists: boolean; user_id?: string; email?: string }>(
      '/api/parents/check-email',
      { email },
    ),
};

// ────────────────────────────────────────────────────────────────────────
// Teachers
// ────────────────────────────────────────────────────────────────────────

export const teacherService = {
  list: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => {
    const qs = await withYear(params);
    if (params?.page || params?.limit) {
      return api.get<PaginatedResponse<TeacherRow>>(`/api/teachers${qs}`);
    }
    return api.get<TeacherRow[]>(`/api/teachers${qs}`);
  },
  get: (id: string) => api.get<TeacherRow>(`/api/teachers/${id}`),
  create: (input: Partial<TeacherRow>) =>
    api.post<TeacherRow>('/api/teachers', input),
  update: (id: string, input: Partial<TeacherRow>) =>
    api.patch<TeacherRow>(`/api/teachers/${id}`, input),
  remove: (id: string) =>
    api.delete<{ success: boolean; id: string }>(`/api/teachers/${id}`),
};

// ────────────────────────────────────────────────────────────────────────
// Classes & Subjects
// ────────────────────────────────────────────────────────────────────────

export const classService = {
  list: async (params?: { page?: number; limit?: number }) => {
    const qs = await withYear(params);
    return api.get<ClassListResponse>(`/api/classes${qs}`);
  },
  myClasses: async () => {
    const qs = await withYear();
    return api.get<ClassListResponse>(`/api/school/my-classes${qs}`);
  },
  get: (id: string) => api.get<ClassRow>(`/api/classes/${id}`),
  subjects: (classId: string) =>
    api.get<SubjectRow[]>(`/api/classes/${classId}/subjects`),
  create: (input: Partial<ClassRow>) =>
    api.post<ClassRow>('/api/classes', input),
  update: (id: string, input: Partial<ClassRow>) =>
    api.patch<ClassRow>(`/api/classes/${id}`, input),
  remove: (id: string) =>
    api.delete<{ success: boolean; id: string }>(`/api/classes/${id}`),
};

export const subjectService = {
  list: () => api.get<SubjectRow[]>('/api/subjects'),
  get: (id: string) => api.get<SubjectRow>(`/api/subjects/${id}`),
  create: (input: Partial<SubjectRow>) =>
    api.post<SubjectRow>('/api/subjects', input),
  update: (id: string, input: Partial<SubjectRow>) =>
    api.put<SubjectRow>(`/api/subjects/${id}`, input),
  remove: (id: string) =>
    api.delete<{ success: boolean; id: string }>(`/api/subjects/${id}`),
};

// ────────────────────────────────────────────────────────────────────────
// Timetable
// ────────────────────────────────────────────────────────────────────────

export const timetableService = {
  list: async (filters?: {
    class_id?: string;
    teacher_id?: string;
    day_of_week?: number;
  }) => {
    const qs = await withYear(filters);
    return api.get<TimetableRow[]>(`/api/timetable${qs}`);
  },
  summary: async () => {
    const qs = await withYear();
    return api.get<unknown>(`/api/timetable/summary${qs}`);
  },
  get: (id: string) => api.get<TimetableRow>(`/api/timetable/${id}`),
  create: (input: Partial<TimetableRow>) =>
    api.post<TimetableRow>('/api/timetable', input),
  createBulk: (input: {
    class_id: string;
    sessions: Array<{
      day_of_week: number;
      period: number;
      start_time: string;
      end_time: string;
      subject_id: string;
      teacher_id: string;
      room?: string;
    }>;
  }) =>
    api.post<TimetableRow | TimetableRow[]>('/api/timetable', input),
  update: (id: string, input: Partial<TimetableRow>) =>
    api.patch<TimetableRow>(`/api/timetable/${id}`, input),
  remove: (id: string) =>
    api.delete<{ success: boolean; id: string }>(`/api/timetable/${id}`),
};

// ────────────────────────────────────────────────────────────────────────
// Attendance
// ────────────────────────────────────────────────────────────────────────

export const attendanceService = {
  list: async (filters?: {
    class_id?: string;
    student_id?: string;
    date?: string;
    period?: number;
  }) => {
    const qs = await withYear(filters);
    return api.get<AttendanceRow[]>(`/api/attendance${qs}`);
  },
  mark: (input: AttendanceMarkInput) =>
    api.post<{ inserted: number; updated: number }>(
      '/api/attendance/mark',
      input,
    ),
  create: (input: Partial<AttendanceRow>) =>
    api.post<AttendanceRow>('/api/attendance', input),
  update: (id: string, input: Partial<AttendanceRow>) =>
    api.patch<AttendanceRow>(`/api/attendance/${id}`, input),
  remove: (id: string) =>
    api.delete<{ success: boolean; id: string }>(`/api/attendance/${id}`),
  parent: () => api.get<unknown>('/api/parent/attendance'),
  parentReport: () => api.get<unknown>('/api/parent/student-attendance'),
};

// ────────────────────────────────────────────────────────────────────────
// Exams / Tests / Results
// ────────────────────────────────────────────────────────────────────────

export const examService = {
  list: async (filters?: {
    class_id?: string;
    subject?: string;
    type?: string;
  }) => {
    const qs = await withYear({ ...filters, type: filters?.type ?? 'exam' });
    return api.get<ExamRow[]>(`/api/exams${qs}`);
  },
  get: (id: string) => api.get<ExamRow>(`/api/exams/${id}`),
  create: (input: Partial<ExamRow>) =>
    api.post<ExamRow>('/api/exams', { ...input, type: input.type ?? 'exam' }),
  update: (id: string, input: Partial<ExamRow>) =>
    api.patch<ExamRow>(`/api/exams/${id}`, input),
  remove: (id: string) =>
    api.delete<{ success: boolean; id: string }>(`/api/exams/${id}`),
};

export const testService = {
  list: async (filters?: { class_id?: string; subject?: string }) => {
    const qs = await withYear({ ...filters, type: 'test' });
    return api.get<ExamRow[]>(`/api/tests${qs}`);
  },
  get: (id: string) => api.get<ExamRow>(`/api/tests/${id}`),
  create: (input: Partial<ExamRow>) =>
    api.post<ExamRow>('/api/tests', { ...input, type: 'test' }),
  update: (id: string, input: Partial<ExamRow>) =>
    api.patch<ExamRow>(`/api/tests/${id}`, input),
  remove: (id: string) =>
    api.delete<{ success: boolean; id: string }>(`/api/tests/${id}`),
};

export const resultService = {
  list: async (filters?: { exam_id?: string; student_id?: string }) => {
    const qs = await withYear(filters);
    return api.get<ResultRow[]>(`/api/results${qs}`);
  },
  get: (id: string) => api.get<ResultRow>(`/api/results/${id}`),
  forExam: (examId: string) =>
    api.get<ResultRow[]>(`/api/exams/${examId}/results`),
  save: (input: Partial<ResultRow>) =>
    api.post<ResultRow>('/api/results', input),
  saveForExam: (examId: string, input: Partial<ResultRow>) =>
    api.post<ResultRow>(`/api/exams/${examId}/results`, input),
  update: (id: string, input: Partial<ResultRow>) =>
    api.patch<ResultRow>(`/api/results/${id}`, input),
  remove: (id: string) =>
    api.delete<{ success: boolean; id: string }>(`/api/results/${id}`),
  parent: () =>
    api.get<unknown>('/api/parent/student-results'),
};

// ────────────────────────────────────────────────────────────────────────
// Homework
// ────────────────────────────────────────────────────────────────────────

export const homeworkService = {
  list: async (filters?: {
    class_id?: string;
    subject_id?: string;
    teacher_id?: string;
    student_id?: string;
  }) => {
    const qs = await withYear(filters);
    return api.get<HomeworkRow[]>(`/api/homework${qs}`);
  },
  get: (id: string) => api.get<HomeworkRow>(`/api/homework/${id}`),
  create: (input: Partial<HomeworkRow>) =>
    api.post<HomeworkRow>('/api/homework', input),
  update: (id: string, input: Partial<HomeworkRow>) =>
    api.patch<HomeworkRow>(`/api/homework/${id}`, input),
  remove: (id: string) =>
    api.delete<{ success: boolean; id: string }>(`/api/homework/${id}`),
  parent: (studentId?: string) =>
    api.get<HomeworkRow[]>(
      `/api/parent/child/homework${paramsToQuery({ student_id: studentId })}`,
    ),
};

// ────────────────────────────────────────────────────────────────────────
// Behavior
// ────────────────────────────────────────────────────────────────────────

export const behaviorService = {
  list: async (filters?: {
    student_id?: string;
    teacher_id?: string;
    status?: string;
  }) => {
    const qs = await withYear(filters);
    return api.get<BehaviorRow[]>(`/api/behavior${qs}`);
  },
  get: (id: string) => api.get<BehaviorRow>(`/api/behavior/${id}`),
  create: (input: Partial<BehaviorRow>) =>
    api.post<BehaviorRow>('/api/behavior', input),
  update: (id: string, input: Partial<BehaviorRow>) =>
    api.patch<BehaviorRow>(`/api/behavior/${id}`, input),
  remove: (id: string) =>
    api.delete<{ success: boolean; id: string }>(`/api/behavior/${id}`),
};

// ────────────────────────────────────────────────────────────────────────
// Leave
// ────────────────────────────────────────────────────────────────────────

export const leaveService = {
  list: (requesterType?: string) =>
    api.get<LeaveRow[]>(
      `/api/leave${paramsToQuery({ requester_type: requesterType })}`,
    ),
  get: (id: string) => api.get<LeaveRow>(`/api/leave/${id}`),
  create: (input: Partial<LeaveRow>) =>
    api.post<LeaveRow>('/api/leave', input),
  update: (id: string, input: Partial<LeaveRow>) =>
    api.patch<LeaveRow>(`/api/leave/${id}`, input),
  remove: (id: string) =>
    api.delete<{ success: boolean; id: string }>(`/api/leave/${id}`),
  approve: (id: string) =>
    api.patch<LeaveRow>(`/api/leave/${id}`, { status: 'approved' }),
  reject: (id: string, reason: string) =>
    api.patch<LeaveRow>(`/api/leave/${id}`, {
      status: 'rejected',
      rejection_reason: reason,
    }),
};

// ────────────────────────────────────────────────────────────────────────
// Events
// ────────────────────────────────────────────────────────────────────────

export const eventService = {
  list: (filters?: {
    eventType?: string;
    classId?: string;
    forClassId?: string;
  }) => {
    const params: Record<string, string | undefined> = {};
    if (filters?.eventType) params.event_type = filters.eventType;
    if (filters?.classId) params.class_id = filters.classId;
    if (filters?.forClassId) params.for_class_id = filters.forClassId;
    return api.get<EventRow[]>(`/api/events${paramsToQuery(params)}`);
  },
  get: (id: string) => api.get<EventRow>(`/api/events/${id}`),
  create: (input: Partial<EventRow>) =>
    api.post<EventRow>('/api/events', input),
  update: (id: string, input: Partial<EventRow>) =>
    api.patch<EventRow>(`/api/events/${id}`, input),
  remove: (id: string) =>
    api.delete<{ success: boolean; id: string }>(`/api/events/${id}`),
};

// ────────────────────────────────────────────────────────────────────────
// Announcements
// ────────────────────────────────────────────────────────────────────────

export const announcementService = {
  list: () => api.get<AnnouncementRow[]>('/api/announcements'),
  get: (id: string) => api.get<AnnouncementRow>(`/api/announcements/${id}`),
  create: (input: Partial<AnnouncementRow>) =>
    api.post<AnnouncementRow>('/api/announcements', input),
  update: (id: string, input: Partial<AnnouncementRow>) =>
    api.patch<AnnouncementRow>(`/api/announcements/${id}`, input),
  remove: (id: string) =>
    api.delete<{ success: boolean; id: string }>(`/api/announcements/${id}`),
  parent: (studentId?: string) =>
    api.get<AnnouncementRow[]>(
      `/api/parent/child/announcements${paramsToQuery({
        student_id: studentId,
      })}`,
    ),
};

// ────────────────────────────────────────────────────────────────────────
// Live classes
// ────────────────────────────────────────────────────────────────────────

export const liveClassService = {
  list: async () => {
    const qs = await withYear();
    return api.get<LiveClassRow[]>(`/api/live/classes${qs}`);
  },
  get: (id: string) => api.get<LiveClassRow>(`/api/live/classes/${id}`),
  schedule: (input: Partial<LiveClassRow>) =>
    api.post<LiveClassRow>('/api/live/classes/schedule', input),
  update: (id: string, input: Partial<LiveClassRow>) =>
    api.patch<LiveClassRow>(`/api/live/classes/${id}`, input),
  remove: (id: string) =>
    api.delete<{ success: boolean; id: string }>(`/api/live/classes/${id}`),
  parent: () => api.get<LiveClassRow[]>('/api/parent/live-classes'),
};

// ────────────────────────────────────────────────────────────────────────
// Notifications
// ────────────────────────────────────────────────────────────────────────

export const notificationService = {
  list: (params?: { limit?: number; cursor?: string }) =>
    api.get<{ items: NotificationRow[]; next_cursor?: string }>(
      `/api/notifications${paramsToQuery(params)}`,
    ),
  markRead: (id: string) =>
    api.patch<NotificationRow>(`/api/notifications/${id}/read`),
};

// ────────────────────────────────────────────────────────────────────────
// Settings & Subscription
// ────────────────────────────────────────────────────────────────────────

export const settingsService = {
  get: () => api.get<SchoolSettings>('/api/settings'),
  update: (input: Partial<SchoolSettings>) =>
    api.patch<SchoolSettings>('/api/settings', input),
};

export const subscriptionService = {
  current: () => api.get<SubscriptionCurrent>('/api/subscription/current'),
  plans: () => api.get<SubscriptionPlan[]>('/api/subscription/plans'),
  history: () =>
    api.get<SubscriptionHistoryEntry[]>('/api/subscription/history'),
  startTrial: () =>
    api.post<SubscriptionCurrent>('/api/subscription/start-trial'),
  upgrade: (planName: string, studentLimit?: number) =>
    api.post<SubscriptionCurrent>('/api/subscription/upgrade', {
      plan_name: planName,
      student_limit: studentLimit,
    }),
  paymentMethods: () =>
    api.get<unknown>('/api/payment/methods'),
  uploadPayment: (input: {
    plan_id: string;
    payment_method_id?: string;
    screenshot_url?: string;
    transaction_id: string;
    amount: number;
    notes?: string;
  }) => api.post<unknown>('/api/payment/upload', input),
};

// ────────────────────────────────────────────────────────────────────────
// Fees
// ────────────────────────────────────────────────────────────────────────

export const feeService = {
  types: () => api.get<FeeType[]>('/api/fees/types'),
  schoolTypes: () => api.get<FeeType[]>('/api/school/fees/types'),
  createType: (input: Partial<FeeType>) =>
    api.post<FeeType>('/api/fees/types', input),

  classFees: (classId: string) =>
    api.get<ClassFee[]>(`/api/classes/${classId}/fees/components`),
  addClassFee: (classId: string, input: Partial<ClassFee>) =>
    api.post<ClassFee>(`/api/classes/${classId}/fees/components`, input),
  updateClassFee: (classId: string, feeId: string, input: Partial<ClassFee>) =>
    api.patch<ClassFee>(
      `/api/classes/${classId}/fees/components/${feeId}`,
      input,
    ),
  deleteClassFee: (classId: string, feeId: string) =>
    api.delete<{ success: boolean }>(
      `/api/classes/${classId}/fees/components/${feeId}`,
    ),
  toggleClassFee: (classId: string, feeId: string) =>
    api.post<ClassFee>(
      `/api/classes/${classId}/fees/components/${feeId}/toggle`,
    ),

  generate: (input: { month: string; year: number; class_ids?: string[] }) =>
    api.post<{ generated: number; skipped: number }>(
      '/api/fees/generate',
      input,
    ),
  generateAsync: (input: {
    month: string;
    year: number;
    class_ids?: string[];
  }) => api.post<{ job_id: string }>('/api/fees/generate-async', input),

  list: async (filters?: {
    class_id?: string;
    student_id?: string;
    status?: string;
    month?: string;
  }) => {
    const qs = await withYear(filters);
    return api.get<FeeMonthlyRow[]>(`/api/fees${qs}`);
  },
  ledger: async () => {
    const qs = await withYear();
    return api.get<unknown>(`/api/fees/ledger${qs}`);
  },
  recordPayment: (
    feeId: string,
    input: {
      amount: number;
      payment_method?: string;
      payment_date?: string;
      transaction_id?: string;
      notes?: string;
    },
  ) => api.post<FeePaymentRow>(`/api/fees/${feeId}/pay`, input),
  payments: async (filters?: { date?: string; class_id?: string }) => {
    const qs = await withYear(filters);
    return api.get<FeePaymentRow[]>(`/api/fees/payments${qs}`);
  },
  dailyCollection: async () => {
    const qs = await withYear();
    return api.get<unknown>(`/api/fees/daily-collection${qs}`);
  },

  adjustments: async (filters?: { student_id?: string; class_id?: string }) => {
    const qs = await withYear(filters);
    return api.get<FeeAdjustmentRow[]>(`/api/fees/adjustments${qs}`);
  },
  createAdjustment: (input: Partial<FeeAdjustmentRow>) =>
    api.post<FeeAdjustmentRow>('/api/fees/adjustments', input),
  deleteAdjustment: (id: string) =>
    api.delete<{ success: boolean }>(`/api/fees/adjustments/${id}`),

  dashboardStats: async () => {
    const qs = await withYear();
    return api.get<{
      totalExpected: number;
      totalPaid: number;
      percentage: number;
      pendingCount: number;
    }>(`/api/school/fees/dashboard-stats${qs}`);
  },
  classesSummary: async () => {
    const qs = await withYear();
    return api.get<unknown>(`/api/school/fees/classes-summary${qs}`);
  },

  studentFees: (studentId?: string) =>
    api.get<FeeMonthlyRow[]>(
      `/api/student/fees${paramsToQuery({ student_id: studentId })}`,
    ),
  parentFees: (studentId?: string) =>
    api.get<FeeMonthlyRow[]>(
      `/api/parent/fees${paramsToQuery({ student_id: studentId })}`,
    ),
};

// ────────────────────────────────────────────────────────────────────────
// Dashboard
// ────────────────────────────────────────────────────────────────────────

export const dashboardService = {
  composite: async () => {
    const qs = await withYear();
    return api.get<{
      overview: {
        totalStudents: number;
        totalTeachers: number;
        totalClasses: number;
        attendanceToday: number;
        attendanceDetailed: { present: number; absent: number; total: number };
        activeExams: number;
        pendingLeave: number;
        unmarkedStudents: number;
        feeCollection: {
          total: number;
          paid: number;
          percentage: number;
          pending_count: number;
        };
      };
      attendance: {
        present: number;
        absent: number;
        late: number;
        total: number;
        percent: number;
        unmarked: number;
      };
      fees: {
        totalExpected: number;
        totalPaid: number;
        percentage: number;
        pendingCount: number;
      };
      pendingLeaves: number;
      activities: Array<{
        _id: string;
        action: string;
        entity_type: string;
        actor_email: string;
        created_at: string;
      }>;
      upcomingEvents: Array<{
        _id: string;
        title: string;
        start_date: string;
        event_type: string;
      }>;
      classAttendance: Array<{
        id: string;
        name: string;
        has_attendance: boolean;
      }>;
    }>(`/api/dashboard/composite${qs}`);
  },
  analytics: async () => {
    const qs = await withYear();
    return api.get<unknown>(`/api/analytics/dashboard${qs}`);
  },
};

// ────────────────────────────────────────────────────────────────────────
// Parent portal
// ────────────────────────────────────────────────────────────────────────

export const parentService = {
  studentInfo: () =>
    api.get<unknown>('/api/parent/student-info'),
  children: () => api.get<ParentChildRow[]>('/api/parent/children'),
  dashboardStats: (studentId?: string) =>
    api.get<ParentDashboardStats>(
      `/api/parent/dashboard/stats${paramsToQuery({ student_id: studentId })}`,
    ),
  performanceChart: (studentId?: string) =>
    api.get<unknown>(
      `/api/parent/performance-chart${paramsToQuery({ student_id: studentId })}`,
    ),
  liveClasses: () => api.get<LiveClassRow[]>('/api/parent/live-classes'),
};

// ────────────────────────────────────────────────────────────────────────
// Re-export the result envelope for convenience.
// ────────────────────────────────────────────────────────────────────────

export type { ServiceResult };
