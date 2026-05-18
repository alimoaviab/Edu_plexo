/**
 * Service-layer DTOs.
 *
 * These shapes mirror what the Go backend returns and what the web app
 * consumes via school-react-app/src/modules/<module>/types/*. Fields that
 * vary across handlers are marked optional so screens can render partial
 * data gracefully.
 */

// ────────────────────────────────────────────────────────────────────────
// Academic year
// ────────────────────────────────────────────────────────────────────────

export interface AcademicYearRow {
  _id?: string;
  id?: string;
  school_id?: string;
  year: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  status?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// ────────────────────────────────────────────────────────────────────────
// People
// ────────────────────────────────────────────────────────────────────────

export interface ProfileBlock {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  phone?: string;
  email?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  avatar_url?: string;
  blood_group?: string;
}

export interface StudentRow {
  _id?: string;
  id?: string;
  school_id?: string;
  user_id?: string;
  parent_user_id?: string;
  parent_email?: string;
  link_parent_user_id?: string;
  class_id?: string;
  section?: string;
  roll_no?: string;
  admission_no?: string;
  admission_date?: string;
  enrollment_date?: string;
  academic_year_id?: string;
  status?: string;
  profile?: ProfileBlock;
  // flat fallback fields
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  parent_name?: string;
  parent_phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TeacherRow {
  _id?: string;
  id?: string;
  school_id?: string;
  user_id?: string;
  employee_id?: string;
  email?: string;
  status?: string;
  qualifications?: string;
  designation?: string;
  date_of_joining?: string;
  academic_year_id?: string;
  subjects_taught?: string[];
  classes_assigned?: string[];
  profile?: ProfileBlock;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

// ────────────────────────────────────────────────────────────────────────
// Classes & subjects
// ────────────────────────────────────────────────────────────────────────

export interface ClassRow {
  _id?: string;
  id?: string;
  school_id?: string;
  name: string;
  grade_level?: string | number;
  section?: string;
  class_teacher_id?: string;
  academic_year_id?: string;
  capacity?: number;
  status?: string;
  description?: string;
  subjects?: string[];
  fee_structure?: ClassFee[];
  created_at?: string;
  updated_at?: string;
}

export interface ClassListResponse {
  data: ClassRow[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface SubjectRow {
  _id?: string;
  id?: string;
  school_id?: string;
  name: string;
  code?: string;
  description?: string;
  is_optional?: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

// ────────────────────────────────────────────────────────────────────────
// Timetable
// ────────────────────────────────────────────────────────────────────────

export interface TimetableRow {
  _id?: string;
  id?: string;
  school_id?: string;
  class_id: string;
  subject_id?: string;
  teacher_id?: string;
  day_of_week?: number; // 1..7 ISO
  period_number?: number;
  start_time?: string; // 'HH:mm'
  end_time?: string;
  room?: string;
  academic_year_id?: string;
  created_at?: string;
}

// ────────────────────────────────────────────────────────────────────────
// Attendance
// ────────────────────────────────────────────────────────────────────────

export interface AttendanceRow {
  _id?: string;
  id?: string;
  school_id?: string;
  class_id?: string;
  student_id: string;
  date: string; // ISO date
  status: 'present' | 'absent' | 'late' | 'excused';
  period?: number;
  remarks?: string;
  marked_by?: string;
  academic_year_id?: string;
}

export interface AttendanceMarkInput {
  class_id: string;
  date: string; // YYYY-MM-DD
  period?: number;
  records: Array<{
    student_id: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    remarks?: string;
  }>;
}

// ────────────────────────────────────────────────────────────────────────
// Exams / Tests / Results
// ────────────────────────────────────────────────────────────────────────

export interface ExamSubject {
  subject_id: string;
  subject_name?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  total_marks?: number;
  passing_marks?: number;
  room?: string;
}

export interface ExamRow {
  _id?: string;
  id?: string;
  school_id?: string;
  type?: string;
  name: string;
  description?: string;
  class_id?: string;
  subject_id?: string;
  subjects?: ExamSubject[];
  start_date?: string;
  end_date?: string;
  total_marks?: number;
  passing_marks?: number;
  status?: string;
  academic_year_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ResultRow {
  _id?: string;
  id?: string;
  school_id?: string;
  exam_id?: string;
  test_id?: string;
  student_id: string;
  subject_id?: string;
  marks_obtained?: number;
  total_marks?: number;
  grade?: string;
  remarks?: string;
  academic_year_id?: string;
  created_at?: string;
}

// ────────────────────────────────────────────────────────────────────────
// Homework
// ────────────────────────────────────────────────────────────────────────

export interface HomeworkSubmission {
  student_id: string;
  submitted_at?: string;
  submission_url?: string;
  text?: string;
  marks_obtained?: number;
  feedback?: string;
  status?: string;
}

export interface HomeworkRow {
  _id?: string;
  id?: string;
  school_id?: string;
  class_id?: string;
  subject_id?: string;
  teacher_id?: string;
  title: string;
  description?: string;
  due_date?: string;
  attachments?: string[];
  submissions?: HomeworkSubmission[];
  status?: string;
  academic_year_id?: string;
  created_at?: string;
}

// ────────────────────────────────────────────────────────────────────────
// Behavior
// ────────────────────────────────────────────────────────────────────────

export interface BehaviorRow {
  _id?: string;
  id?: string;
  school_id?: string;
  student_id: string;
  teacher_id?: string;
  category?: string;
  type?: string;
  severity?: string;
  notes?: string;
  occurrence_date?: string;
  status?: string;
  academic_year_id?: string;
  created_at?: string;
}

// ────────────────────────────────────────────────────────────────────────
// Leave
// ────────────────────────────────────────────────────────────────────────

export interface LeaveRow {
  _id?: string;
  id?: string;
  school_id?: string;
  requester_id: string;
  requester_type?: string;
  leave_type?: string;
  reason?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  rejection_reason?: string;
  created_at?: string;
}

// ────────────────────────────────────────────────────────────────────────
// Events / Announcements / Live class
// ────────────────────────────────────────────────────────────────────────

export interface EventRow {
  _id?: string;
  id?: string;
  school_id?: string;
  title: string;
  description?: string;
  event_type?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  class_ids?: string[];
  visibility?: string;
  created_at?: string;
}

export interface AnnouncementRow {
  _id?: string;
  id?: string;
  school_id?: string;
  title: string;
  body?: string;
  audience?: string;
  audience_classes?: string[];
  audience_roles?: string[];
  pinned?: boolean;
  created_at?: string;
  created_by?: string;
}

export interface LiveClassRow {
  _id?: string;
  id?: string;
  school_id?: string;
  class_id?: string;
  subject_id?: string;
  teacher_id?: string;
  title: string;
  description?: string;
  scheduled_at?: string;
  duration_minutes?: number;
  meeting_url?: string;
  recording_url?: string;
  status?: string;
}

// ────────────────────────────────────────────────────────────────────────
// Notifications
// ────────────────────────────────────────────────────────────────────────

export interface NotificationRow {
  _id?: string;
  id?: string;
  user_id?: string;
  type?: string;
  title?: string;
  body?: string;
  data?: Record<string, unknown>;
  read?: boolean;
  created_at?: string;
}

// ────────────────────────────────────────────────────────────────────────
// Settings
// ────────────────────────────────────────────────────────────────────────

export interface SchoolSettings {
  school_id?: string;
  school_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  logo_url?: string;
  language?: string;
  timezone?: string;
  currency?: string;
  academic_year_start_month?: number;
  attendance_required_days?: number;
  features?: Record<string, boolean>;
  notifications?: {
    email_enabled?: boolean;
    sms_enabled?: boolean;
    push_enabled?: boolean;
  };
}

// ────────────────────────────────────────────────────────────────────────
// Subscription & billing
// ────────────────────────────────────────────────────────────────────────

export interface SubscriptionPlan {
  id: string;
  name: string;
  display_name?: string;
  price: number;
  currency?: string;
  student_limit: number;
  features?: string[];
  is_custom?: boolean;
  popular?: boolean;
}

export interface SubscriptionInner {
  id: string;
  school_id: string;
  plan_name: string;
  student_limit: number;
  price: number;
  currency?: string;
  start_date: string;
  end_date: string;
  status: string;
  is_trial?: boolean;
  trial_used?: boolean;
  trial_start_date?: string;
  trial_end_date?: string;
}

export interface SubscriptionCurrent {
  subscription: SubscriptionInner | null;
  students_used: number;
  students_limit: number;
  days_remaining: number;
  is_expired: boolean;
  can_trial: boolean;
}

export interface SubscriptionHistoryEntry {
  id: string;
  plan_name: string;
  student_limit: number;
  amount: number;
  payment_status: string;
  start_date: string;
  end_date: string;
  action: string;
  created_at: string;
}

// ────────────────────────────────────────────────────────────────────────
// Fees
// ────────────────────────────────────────────────────────────────────────

export interface FeeType {
  _id?: string;
  id?: string;
  school_id?: string;
  name: string;
  code?: string;
  description?: string;
  is_recurring?: boolean;
  is_active?: boolean;
}

export interface ClassFee {
  _id?: string;
  id?: string;
  class_id?: string;
  fee_type_id?: string;
  fee_type_name?: string;
  amount: number;
  currency?: string;
  is_active?: boolean;
  is_optional?: boolean;
  due_day_of_month?: number;
}

export interface FeeMonthlyRow {
  _id?: string;
  id?: string;
  school_id?: string;
  class_id?: string;
  student_id: string;
  student_name?: string;
  month?: string;
  year?: number;
  amount: number;
  adjustment_amount?: number;
  paid_amount?: number;
  due_date?: string;
  status?: string;
  payments?: FeePaymentRow[];
}

export interface FeePaymentRow {
  _id?: string;
  id?: string;
  fee_id?: string;
  student_id?: string;
  amount: number;
  payment_method?: string;
  payment_date?: string;
  transaction_id?: string;
  notes?: string;
  collected_by?: string;
  created_at?: string;
}

export interface FeeAdjustmentRow {
  _id?: string;
  id?: string;
  school_id?: string;
  class_id?: string;
  student_id?: string;
  fee_type_id?: string;
  amount: number;
  type?: 'discount' | 'penalty' | 'refund' | string;
  reason?: string;
  effective_date?: string;
  created_at?: string;
}

// ────────────────────────────────────────────────────────────────────────
// Parent
// ────────────────────────────────────────────────────────────────────────

export interface ParentChildRow {
  _id?: string;
  id?: string;
  student_id?: string;
  full_name?: string;
  class_name?: string;
  class_id?: string;
  section?: string;
  roll_no?: string;
  admission_no?: string;
  avatar_url?: string;
}

export interface ParentDashboardStats {
  attendance?: {
    present: number;
    absent: number;
    late: number;
    total: number;
    percent: number;
  };
  fees?: {
    total: number;
    paid: number;
    pending: number;
  };
  homework_due?: number;
  upcoming_exams?: number;
  recent_results?: Array<{
    exam_name?: string;
    marks?: number;
    total?: number;
    grade?: string;
  }>;
}
