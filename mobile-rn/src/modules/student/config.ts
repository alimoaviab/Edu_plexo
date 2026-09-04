/**
 * Student module registry.
 *
 * The student portal is read-mostly and scoped to the signed-in student's
 * OWN record. The Go backend resolves the student from the JWT on every
 * `/student/*` endpoint (`studentportal` package) — an injected
 * `?student_id` that is not the caller's own id is rejected, so ID tampering
 * cannot leak another student's data.
 *
 *   • Portal endpoints:  GET /student/{info,dashboard/stats,attendance,
 *                        results,homework,announcements,fees}
 *   • Shared endpoints:  /exams, /timetable, /live/classes, /behavior,
 *                        /events, /leave, /messages/conversations — the
 *                        backend scopes these by the authenticated role and
 *                        the student's class/student ids.
 *
 * This replaces the old parent module registry: students were previously
 * served by `/parent/*` endpoints (the "Parent secretly powers Student"
 * anti-pattern). The Parent role no longer exists.
 */

import type { AdminModuleDefinition, AdminRecord, SelectOption } from '@/modules/admin/types';
import { ADMIN_MODULE_BY_KEY } from '@/modules/admin/config';
import { buildRegistry, withOverrides } from '@/modules/shared/registry';

const today = () => new Date().toISOString().slice(0, 10);
const opts = (...values: string[]): SelectOption[] =>
  values.map((value) => ({ label: value.replace(/_/g, ' '), value }));

const STUDENT_MODULES: AdminModuleDefinition[] = [
  {
    key: 'announcements',
    title: 'Announcements',
    subtitle: 'Notices for your school',
    icon: 'megaphone',
    listPath: '/student/announcements',
    clientSearchKeys: ['title', 'body', 'priority'],
    displayFields: ['title', 'audience', 'priority', 'created_at'],
    detailFields: ['_id', 'title', 'body', 'priority', 'audience', 'created_at'],
  },
  {
    key: 'attendance',
    title: 'Attendance',
    subtitle: 'My daily attendance record',
    icon: 'check-circle',
    listPath: '/student/attendance',
    singleton: true,
    displayFields: ['class', 'student', 'attendance_summary.attendance_percentage'],
    detailFields: ['student', 'class', 'attendance_summary.present_days', 'attendance_summary.absent_days', 'attendance_summary.late_days', 'attendance_summary.leave_days', 'attendance_summary.total_days', 'attendance_summary.attendance_percentage', 'recent_records'],
  },
  {
    key: 'results',
    title: 'Results',
    subtitle: 'My exam and test results',
    icon: 'star',
    listPath: '/student/results',
    clientSearchKeys: ['exam_title', 'exam_subject', 'grade'],
    displayFields: ['exam_title', 'exam_subject', 'obtained_marks', 'max_marks', 'grade'],
    detailFields: ['_id', 'exam_id', 'exam_title', 'exam_subject', 'subjects', 'obtained_marks', 'max_marks', 'grade', 'remarks', 'graded_at'],
  },
  {
    key: 'homework',
    title: 'Homework',
    subtitle: 'Assignments for my class',
    icon: 'book',
    listPath: '/student/homework',
    clientSearchKeys: ['title', 'subject', 'status'],
    displayFields: ['title', 'subject_name', 'due_at', 'status'],
    detailFields: ['_id', 'title', 'subject_name', 'teacher_name', 'due_at', 'status'],
  },
  {
    key: 'fees',
    title: 'Fees',
    subtitle: 'My vouchers, dues and payment status',
    icon: 'wallet',
    listPath: '/student/fees',
    clientSearchKeys: ['month', 'status', 'invoice_no'],
    displayFields: ['month', 'year', 'total', 'paid', 'pending', 'status'],
    detailFields: ['invoice_no', 'month', 'year', 'total', 'paid', 'pending', 'discount_amount', 'due_date', 'status'],
  },
  {
    key: 'exams',
    title: 'Exams',
    subtitle: 'Upcoming exams for my class',
    icon: 'clipboard',
    listPath: '/exams',
    requiredFilters: ['class_id'],
    filters: [{ key: 'class_id', label: 'Class', type: 'text' }],
    clientSearchKeys: ['title', 'subject', 'status'],
    displayFields: ['title', 'subject', 'starts_at', 'max_marks', 'status'],
    detailFields: ['_id', 'title', 'class_name', 'subject', 'term', 'starts_at', 'max_marks', 'status', 'description'],
  },
  {
    key: 'timetable',
    title: 'Timetable',
    subtitle: 'My weekly class schedule',
    icon: 'calendar',
    listPath: '/timetable',
    requiredFilters: ['class_id'],
    filters: [{ key: 'class_id', label: 'Class', type: 'text' }],
    clientSearchKeys: ['subject_name', 'teacher_name'],
    displayFields: ['subject_name', 'teacher_name', 'day_of_week', 'period_number', 'start_time'],
    detailFields: ['_id', 'class_name', 'day_of_week', 'period_number', 'subject_name', 'teacher_name', 'start_time', 'end_time', 'room'],
  },
  {
    key: 'live-classes',
    title: 'Live Classes',
    subtitle: 'Scheduled and recorded online sessions',
    icon: 'video',
    listPath: '/live/classes',
    requiredFilters: ['class_id'],
    filters: [{ key: 'class_id', label: 'Class', type: 'text' }],
    clientSearchKeys: ['title', 'subject', 'status'],
    displayFields: ['title', 'subject', 'starts_at', 'status'],
    detailFields: ['_id', 'title', 'subject', 'class_name', 'starts_at', 'ends_at', 'status', 'join_url'],
  },
  {
    key: 'behavior',
    title: 'Behavior',
    subtitle: 'My conduct notes',
    icon: 'shield',
    listPath: '/behavior',
    requiredFilters: ['student_id'],
    filters: [{ key: 'student_id', label: 'Student', type: 'text' }],
    clientSearchKeys: ['category', 'severity', 'status'],
    displayFields: ['category', 'severity', 'status', 'created_at'],
    detailFields: ['_id', 'student_name', 'category', 'incident_type', 'description', 'severity', 'action_taken', 'status', 'created_at'],
  },
  withOverrides(ADMIN_MODULE_BY_KEY['events'], {
    subtitle: 'School calendar and activities',
    createPath: undefined,
    updatePath: undefined,
    deletePath: undefined,
    fields: undefined,
  }),
  {
    key: 'leave',
    title: 'Leave',
    subtitle: 'Apply for and track my leave',
    icon: 'clock',
    listPath: '/leave',
    getPath: '/leave/:id',
    createPath: '/leave',
    clientSearchKeys: ['leave_type', 'status', 'reason'],
    displayFields: ['leave_type', 'start_date', 'end_date', 'status'],
    detailFields: ['_id', 'requester_name', 'leave_type', 'start_date', 'end_date', 'reason', 'status', 'rejection_reason'],
    scopeToPayload: { student_id: 'requester_id' },
    fields: [
      { key: 'leave_type', label: 'Leave Type', type: 'select', required: true, defaultValue: 'sick', options: opts('sick', 'personal', 'family', 'vacation', 'other') },
      { key: 'start_date', label: 'Start Date', type: 'date', required: true, defaultValue: today() },
      { key: 'end_date', label: 'End Date', type: 'date', required: true, defaultValue: today() },
      { key: 'reason', label: 'Reason', type: 'textarea', required: true },
    ],
    transformPayload: (payload: AdminRecord): AdminRecord => ({ ...payload, requester_type: 'student' }),
  },
  withOverrides(ADMIN_MODULE_BY_KEY['messages'], {
    subtitle: 'Message my teachers',
  }),
];

export const STUDENT_MODULE_BY_KEY = buildRegistry(STUDENT_MODULES);

export const isStudentModuleKey = (value: string): boolean =>
  Object.prototype.hasOwnProperty.call(STUDENT_MODULE_BY_KEY, value);