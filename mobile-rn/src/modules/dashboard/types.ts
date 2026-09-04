/**
 * Dashboard response types — mirror the Go backend payloads exactly so the
 * mobile dashboards render the same numbers the web dashboards show.
 *
 *   • Admin   → GET /api/dashboard/composite (dashboard/composite.go)
 *   • Teacher → GET /api/teachers/session     (teachers.getTeacherPortalData)
 *   • Owner   → GET /api/owner/dashboard      (owner.DashboardStats)
 *   • Student → GET /api/student/dashboard/stats (studentportal.DashboardStats)
 */

// ─── Admin: /dashboard/composite ──────────────────────────────────────────

export interface AdminOverview {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalGuardians: number;
  totalClasses: number;
  totalSubjects: number;
  attendanceToday: number;
  attendanceDetailed?: Record<string, number>;
  activeExams: number;
  pendingLeave: number;
  unmarkedStudents: number;
  feeCollection?: Record<string, number>;
  totalHomework: number;
  totalLiveClasses: number;
  activeTeachers: number;
  presentToday: number;
  pendingFees: number;
  collectedFees: number;
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  total: number;
  percent: number;
  unmarked: number;
}

export interface FeeSummary {
  totalExpected: number;
  totalPaid: number;
  percentage: number;
  pendingCount: number;
}

export interface AdminComposite {
  overview: AdminOverview;
  attendance: AttendanceSummary;
  fees: FeeSummary;
  pendingLeaves: number;
  activities: Record<string, unknown>[];
  upcomingEvents: Record<string, unknown>[];
  classAttendance: Record<string, unknown>[];
}

// ─── Teacher: /teachers/session ─────────────────────────────────────────────

export interface TeacherPortalClass {
  id: string;
  name: string;
  section: string;
  studentCount: number;
  pendingHomework: number;
  upcomingExams: number;
  academicYear?: string;
}

export interface TeacherScheduleSlot {
  id: string;
  start_time: string;
  end_time: string;
  class_name: string;
  subject_name: string;
  room?: string;
  attendance_marked?: boolean;
}

export interface TeacherPortal {
  teacher: {
    id: string;
    employee_no?: string;
    first_name: string;
    last_name: string;
    email?: string;
    qualification?: string;
    status?: string;
  };
  school?: { name?: string; session?: string };
  alerts?: {
    type: string;
    priority: 'blue' | 'orange' | 'red' | 'green';
    title: string;
    message: string;
    action?: string;
  }[];
  operationalStats?: {
    todayAttendance?: { total: number; marked: number };
    pendingGrading?: number;
    homeworkStatus?: { pending: number };
  };
  classes?: TeacherPortalClass[];
  todaySchedule?: TeacherScheduleSlot[];
  announcements?: { id: string; title: string; message: string; date: string }[];
}

// ─── Owner: /owner/dashboard ────────────────────────────────────────────────

export interface OwnerDashboard {
  total_schools: number;
  total_campuses: number;
  total_students: number;
  total_teachers: number;
  total_staff: number;
  active_subscriptions: number;
  expiring_subscriptions: number;
  schools?: {
    school_id: string;
    name: string;
    status?: string;
  }[];
}

// ─── Student: /student/dashboard/stats + /student/info ─────────────────────

export interface StudentOverview {
  student_id: string;
  name: string;
  class: string;
  current_grade: string;
  attendance_percentage: number;
  pending_fees: number;
  pending_assignments: number;
}

export interface StudentDashboardStats {
  dashboard?: { children_overview?: StudentOverview[] };
  attendance?: { present?: number; total?: number; percentage?: number };
  upcomingExams?: { _id: string; title: string; subject?: string; starts_at?: string }[];
  recentResults?: { _id: string; exam_id?: string; obtained_marks?: number }[];
  feeDue?: { amount?: number; due_date?: string | null };
}

export interface StudentInfo {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  roll_no: string;
  admission_no?: string;
  email?: string;
  phone?: string;
  class: string;
  class_name?: string;
  section: string;
  academic_year?: string;
  status: string;
}
