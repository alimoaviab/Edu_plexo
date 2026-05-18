/**
 * Module hooks barrel — each hook returns the unified `useCrud` shape so
 * screens don't have to learn a new API per module.
 *
 *   const { items, isLoading, refetch, create, update, remove } = useStudents();
 *
 * `items` is typed to the underlying list shape per module (an array for
 * most, or a `{ data, meta }` envelope for paginated ones).
 */

export { useTenant } from '@/hooks/useTenant';
export { useCompositeDashboard, useParentDashboard } from '@/hooks/useDashboard';
export { useAcademicYears, useSwitchAcademicYear } from '@/hooks/useAcademicYears';

import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { qk } from '@/api/query-keys';
import {
  announcementService,
  attendanceService,
  behaviorService,
  classService,
  eventService,
  examService,
  feeService,
  homeworkService,
  leaveService,
  liveClassService,
  notificationService,
  parentService,
  resultService,
  settingsService,
  studentService,
  subjectService,
  subscriptionService,
  teacherService,
  testService,
  timetableService,
} from '@/services';
import type {
  AnnouncementRow,
  AttendanceRow,
  BehaviorRow,
  ClassListResponse,
  ClassRow,
  EventRow,
  ExamRow,
  HomeworkRow,
  LeaveRow,
  LiveClassRow,
  NotificationRow,
  ResultRow,
  SchoolSettings,
  StudentRow,
  SubjectRow,
  SubscriptionCurrent,
  SubscriptionPlan,
  TeacherRow,
  TimetableRow,
} from '@/services/types';
import { useCrud } from '@/hooks/useCrud';
import { useTenant } from '@/hooks/useTenant';

// ────────────────────────────────────────────────────────────────────────
// Students
// ────────────────────────────────────────────────────────────────────────

export function useStudents(filters?: {
  class_id?: string;
  status?: string;
}) {
  const { schoolId, academicYearId } = useTenant();
  const memoFilters = useMemo(() => filters ?? {}, [filters]);

  return useCrud<StudentRow[], StudentRow>({
    queryKey: qk.students(schoolId, academicYearId, memoFilters),
    enabled: !!schoolId,
    list: () => studentService.list(memoFilters),
    create: studentService.create,
    update: studentService.update,
    remove: studentService.remove,
    invalidateKeys: [qk.compositeDashboard(schoolId, academicYearId)],
  });
}

export function useStudent(id?: string) {
  const query = useQuery({
    queryKey: qk.student(id ?? ''),
    enabled: !!id,
    queryFn: async () => {
      const result = await studentService.get(id!);
      if (!result.ok) throw new Error(result.message ?? 'Student lookup failed');
      return result.data!;
    },
  });
  return {
    student: query.data,
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}

// ────────────────────────────────────────────────────────────────────────
// Teachers
// ────────────────────────────────────────────────────────────────────────

export function useTeachers(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  const { schoolId, academicYearId } = useTenant();
  const memoParams = useMemo(() => params ?? {}, [params]);

  return useCrud<TeacherRow[] | { items: TeacherRow[]; total: number }, TeacherRow>({
    queryKey: qk.teachers(schoolId, academicYearId, memoParams),
    enabled: !!schoolId,
    list: () => teacherService.list(memoParams) as never,
    create: teacherService.create,
    update: teacherService.update,
    remove: teacherService.remove,
    invalidateKeys: [qk.compositeDashboard(schoolId, academicYearId)],
  });
}

// ────────────────────────────────────────────────────────────────────────
// Classes & Subjects
// ────────────────────────────────────────────────────────────────────────

export function useClasses() {
  const { schoolId, academicYearId } = useTenant();
  return useCrud<ClassListResponse, ClassRow>({
    queryKey: qk.classes(schoolId, academicYearId),
    enabled: !!schoolId,
    list: () => classService.list(),
    create: classService.create,
    update: classService.update,
    remove: classService.remove,
    invalidateKeys: [qk.compositeDashboard(schoolId, academicYearId)],
  });
}

export function useSubjects() {
  const { schoolId } = useTenant();
  return useCrud<SubjectRow[], SubjectRow>({
    queryKey: qk.subjects(schoolId),
    enabled: !!schoolId,
    list: () => subjectService.list(),
    create: subjectService.create,
    update: subjectService.update,
    remove: subjectService.remove,
  });
}

// ────────────────────────────────────────────────────────────────────────
// Timetable
// ────────────────────────────────────────────────────────────────────────

export function useTimetable(filters?: {
  class_id?: string;
  teacher_id?: string;
  day_of_week?: number;
}) {
  const { schoolId, academicYearId } = useTenant();
  const memoFilters = useMemo(() => filters ?? {}, [filters]);

  return useCrud<TimetableRow[], TimetableRow>({
    queryKey: qk.timetable(schoolId, academicYearId, memoFilters),
    enabled: !!schoolId,
    list: () => timetableService.list(memoFilters),
    create: timetableService.create,
    update: timetableService.update,
    remove: timetableService.remove,
  });
}

// ────────────────────────────────────────────────────────────────────────
// Attendance
// ────────────────────────────────────────────────────────────────────────

export function useAttendance(filters?: {
  class_id?: string;
  student_id?: string;
  date?: string;
  period?: number;
}) {
  const { schoolId, academicYearId } = useTenant();
  const memoFilters = useMemo(() => filters ?? {}, [filters]);

  return useCrud<AttendanceRow[], AttendanceRow>({
    queryKey: qk.attendance(schoolId, academicYearId, memoFilters),
    enabled: !!schoolId && !!filters?.class_id,
    list: () => attendanceService.list(memoFilters),
    update: attendanceService.update,
    remove: attendanceService.remove,
    invalidateKeys: [qk.compositeDashboard(schoolId, academicYearId)],
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  const { schoolId, academicYearId } = useTenant();

  return useMutation({
    mutationFn: async (input: Parameters<typeof attendanceService.mark>[0]) => {
      const result = await attendanceService.mark(input);
      if (!result.ok) throw new Error(result.message ?? 'Failed to mark attendance');
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({
        queryKey: qk.compositeDashboard(schoolId, academicYearId),
      });
    },
  });
}

// ────────────────────────────────────────────────────────────────────────
// Exams / Tests / Results
// ────────────────────────────────────────────────────────────────────────

export function useExams(filters?: {
  class_id?: string;
  subject?: string;
  type?: string;
}) {
  const { schoolId, academicYearId } = useTenant();
  const memoFilters = useMemo(() => filters ?? {}, [filters]);
  return useCrud<ExamRow[], ExamRow>({
    queryKey: qk.exams(schoolId, academicYearId, memoFilters),
    enabled: !!schoolId,
    list: () => examService.list(memoFilters),
    create: examService.create,
    update: examService.update,
    remove: examService.remove,
  });
}

export function useTests(filters?: { class_id?: string; subject?: string }) {
  const { schoolId, academicYearId } = useTenant();
  const memoFilters = useMemo(() => filters ?? {}, [filters]);
  return useCrud<ExamRow[], ExamRow>({
    queryKey: qk.tests(schoolId, academicYearId, memoFilters),
    enabled: !!schoolId,
    list: () => testService.list(memoFilters),
    create: testService.create,
    update: testService.update,
    remove: testService.remove,
  });
}

export function useResults(filters?: {
  exam_id?: string;
  student_id?: string;
}) {
  const { schoolId, academicYearId } = useTenant();
  const memoFilters = useMemo(() => filters ?? {}, [filters]);
  return useCrud<ResultRow[], ResultRow>({
    queryKey: qk.results(schoolId, academicYearId, memoFilters),
    enabled: !!schoolId,
    list: () => resultService.list(memoFilters),
    create: resultService.save,
    update: resultService.update,
    remove: resultService.remove,
  });
}

// ────────────────────────────────────────────────────────────────────────
// Homework
// ────────────────────────────────────────────────────────────────────────

export function useHomework(filters?: {
  class_id?: string;
  subject_id?: string;
  teacher_id?: string;
  student_id?: string;
}) {
  const { schoolId, academicYearId } = useTenant();
  const memoFilters = useMemo(() => filters ?? {}, [filters]);

  return useCrud<HomeworkRow[], HomeworkRow>({
    queryKey: qk.homework(schoolId, academicYearId, memoFilters),
    enabled: !!schoolId,
    list: () => homeworkService.list(memoFilters),
    create: homeworkService.create,
    update: homeworkService.update,
    remove: homeworkService.remove,
  });
}

// ────────────────────────────────────────────────────────────────────────
// Behavior / Leave / Events / Announcements / Live Classes
// ────────────────────────────────────────────────────────────────────────

export function useBehavior(filters?: {
  student_id?: string;
  teacher_id?: string;
  status?: string;
}) {
  const { schoolId, academicYearId } = useTenant();
  const memoFilters = useMemo(() => filters ?? {}, [filters]);
  return useCrud<BehaviorRow[], BehaviorRow>({
    queryKey: qk.behavior(schoolId, academicYearId, memoFilters),
    enabled: !!schoolId,
    list: () => behaviorService.list(memoFilters),
    create: behaviorService.create,
    update: behaviorService.update,
    remove: behaviorService.remove,
  });
}

export function useLeave(requesterType?: string) {
  const { schoolId } = useTenant();
  return useCrud<LeaveRow[], LeaveRow>({
    queryKey: qk.leave(schoolId, requesterType),
    enabled: !!schoolId,
    list: () => leaveService.list(requesterType),
    create: leaveService.create,
    update: leaveService.update,
    remove: leaveService.remove,
  });
}

export function useApproveLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await leaveService.approve(id);
      if (!result.ok) throw new Error(result.message ?? 'Approval failed');
      return result.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leave'] }),
  });
}

export function useRejectLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; reason: string }) => {
      const result = await leaveService.reject(vars.id, vars.reason);
      if (!result.ok) throw new Error(result.message ?? 'Reject failed');
      return result.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leave'] }),
  });
}

export function useEvents(filters?: {
  eventType?: string;
  classId?: string;
  forClassId?: string;
}) {
  const { schoolId } = useTenant();
  const memoFilters = useMemo(() => filters ?? {}, [filters]);
  return useCrud<EventRow[], EventRow>({
    queryKey: qk.events(schoolId, memoFilters),
    enabled: !!schoolId,
    list: () => eventService.list(memoFilters),
    create: eventService.create,
    update: eventService.update,
    remove: eventService.remove,
  });
}

export function useAnnouncements() {
  const { schoolId } = useTenant();
  return useCrud<AnnouncementRow[], AnnouncementRow>({
    queryKey: qk.announcements(schoolId),
    enabled: !!schoolId,
    list: () => announcementService.list(),
    create: announcementService.create,
    update: announcementService.update,
    remove: announcementService.remove,
  });
}

export function useLiveClasses(filters?: {
  class_id?: string;
  teacher_id?: string;
}) {
  const { schoolId, academicYearId } = useTenant();
  const memoFilters = useMemo(() => filters ?? {}, [filters]);
  return useCrud<LiveClassRow[], LiveClassRow>({
    queryKey: qk.liveClasses(schoolId, academicYearId, memoFilters),
    enabled: !!schoolId,
    list: () => liveClassService.list(),
    create: liveClassService.schedule,
    update: liveClassService.update,
    remove: liveClassService.remove,
  });
}

// ────────────────────────────────────────────────────────────────────────
// Notifications
// ────────────────────────────────────────────────────────────────────────

export function useNotifications() {
  const { schoolId } = useTenant();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: qk.notifications(schoolId),
    enabled: !!schoolId,
    staleTime: 30_000,
    queryFn: async () => {
      const result = await notificationService.list({ limit: 50 });
      if (!result.ok)
        throw new Error(result.message ?? 'Failed to load notifications');
      return result.data?.items ?? [];
    },
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const result = await notificationService.markRead(id);
      if (!result.ok) throw new Error(result.message ?? 'Mark-read failed');
      return result.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: qk.notifications(schoolId) }),
  });

  return {
    items: (query.data ?? []) as NotificationRow[],
    unreadCount: (query.data ?? []).filter((n) => !n.read).length,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
    markRead: markRead.mutateAsync,
    markingRead: markRead.isPending,
  };
}

// ────────────────────────────────────────────────────────────────────────
// Settings
// ────────────────────────────────────────────────────────────────────────

export function useSettings() {
  const { schoolId } = useTenant();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: qk.settings(schoolId),
    enabled: !!schoolId,
    queryFn: async () => {
      const result = await settingsService.get();
      if (!result.ok) throw new Error(result.message ?? 'Settings load failed');
      return result.data ?? null;
    },
  });

  const update = useMutation({
    mutationFn: async (input: Partial<SchoolSettings>) => {
      const result = await settingsService.update(input);
      if (!result.ok) throw new Error(result.message ?? 'Settings update failed');
      return result.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: qk.settings(schoolId) }),
  });

  return {
    settings: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
    error: query.error as Error | null,
    update: update.mutateAsync,
    updating: update.isPending,
    updateError: update.error as Error | null,
  };
}

// ────────────────────────────────────────────────────────────────────────
// Subscription
// ────────────────────────────────────────────────────────────────────────

export function useSubscription() {
  const { schoolId } = useTenant();
  const queryClient = useQueryClient();

  const current = useQuery({
    queryKey: qk.subscription(schoolId),
    enabled: !!schoolId,
    queryFn: async () => {
      const result = await subscriptionService.current();
      if (!result.ok)
        throw new Error(result.message ?? 'Subscription lookup failed');
      return result.data!;
    },
  });

  const plans = useQuery({
    queryKey: qk.subscriptionPlans,
    queryFn: async () => {
      const result = await subscriptionService.plans();
      if (!result.ok) throw new Error(result.message ?? 'Plan lookup failed');
      return result.data ?? [];
    },
  });

  const history = useQuery({
    queryKey: qk.subscriptionHistory(schoolId),
    enabled: !!schoolId,
    queryFn: async () => {
      const result = await subscriptionService.history();
      if (!result.ok) throw new Error(result.message ?? 'History load failed');
      return result.data ?? [];
    },
  });

  const startTrial = useMutation({
    mutationFn: async () => {
      const result = await subscriptionService.startTrial();
      if (!result.ok) throw new Error(result.message ?? 'Trial start failed');
      return result.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: qk.subscription(schoolId) }),
  });

  const upgrade = useMutation({
    mutationFn: async (vars: { planName: string; studentLimit?: number }) => {
      const result = await subscriptionService.upgrade(
        vars.planName,
        vars.studentLimit,
      );
      if (!result.ok) throw new Error(result.message ?? 'Upgrade failed');
      return result.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: qk.subscription(schoolId) }),
  });

  return {
    current: current.data as SubscriptionCurrent | undefined,
    plans: (plans.data ?? []) as SubscriptionPlan[],
    history: history.data ?? [],
    isLoading: current.isLoading || plans.isLoading,
    refetch: current.refetch,
    startTrial: startTrial.mutateAsync,
    upgrade: upgrade.mutateAsync,
  };
}

// ────────────────────────────────────────────────────────────────────────
// Fees (read-only convenience hooks; CRUD lives in the dedicated screens)
// ────────────────────────────────────────────────────────────────────────

export function useFeeDashboardStats() {
  const { schoolId, academicYearId } = useTenant();
  const query = useQuery({
    queryKey: qk.feeDashboardStats(schoolId, academicYearId),
    enabled: !!schoolId,
    queryFn: async () => {
      const result = await feeService.dashboardStats();
      if (!result.ok)
        throw new Error(result.message ?? 'Fee stats load failed');
      return result.data;
    },
  });
  return {
    stats: query.data,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}

export function useStudentFees(studentId?: string) {
  const { schoolId, role } = useTenant();
  const isParent = role === 'parent';
  const query = useQuery({
    queryKey: qk.studentFees(schoolId, studentId),
    enabled: !!schoolId,
    queryFn: async () => {
      const result = isParent
        ? await feeService.parentFees(studentId)
        : await feeService.studentFees(studentId);
      if (!result.ok) throw new Error(result.message ?? 'Fees lookup failed');
      return result.data ?? [];
    },
  });
  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}

// ────────────────────────────────────────────────────────────────────────
// Parent
// ────────────────────────────────────────────────────────────────────────

export function useParentChildren() {
  const { userId, role } = useTenant();
  const query = useQuery({
    queryKey: qk.parentChildren(userId),
    enabled: !!userId && role === 'parent',
    queryFn: async () => {
      const result = await parentService.children();
      if (!result.ok)
        throw new Error(result.message ?? 'Children lookup failed');
      return result.data ?? [];
    },
  });
  return {
    children: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
}


// ────────────────────────────────────────────────────────────────────────
// Parent-scoped helpers
// ────────────────────────────────────────────────────────────────────────

export function useChildAttendance(studentId?: string) {
  const { schoolId, academicYearId } = useTenant();
  const query = useQuery({
    queryKey: ['child-attendance', schoolId, academicYearId, studentId ?? ''],
    enabled: !!schoolId && !!studentId,
    queryFn: async () => {
      const result = await attendanceService.list({ student_id: studentId });
      if (!result.ok) throw new Error(result.message ?? 'Failed.');
      return result.data ?? [];
    },
  });
  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
    error: query.error as Error | null,
  };
}

export function useChildAnnouncements(studentId?: string) {
  const { schoolId } = useTenant();
  const query = useQuery({
    queryKey: ['child-announcements', schoolId, studentId ?? ''],
    enabled: !!schoolId,
    queryFn: async () => {
      const result = await announcementService.parent(studentId);
      if (!result.ok) throw new Error(result.message ?? 'Failed.');
      return result.data ?? [];
    },
  });
  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}

export function useChildHomework(studentId?: string) {
  const { schoolId } = useTenant();
  const query = useQuery({
    queryKey: ['child-homework', schoolId, studentId ?? ''],
    enabled: !!schoolId,
    queryFn: async () => {
      const result = await homeworkService.parent(studentId);
      if (!result.ok) throw new Error(result.message ?? 'Failed.');
      return result.data ?? [];
    },
  });
  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
