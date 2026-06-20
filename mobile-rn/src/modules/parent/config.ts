/**
 * Parent module registry.
 *
 * The parent portal is read-mostly and scoped to the parent's selected child.
 * The parent module route injects `{ student_id, class_id }` as scope, which
 * the engine merges into every query (satisfying required filters + query
 * params). Parent-specific read endpoints come from the Go `/parent/*` tree;
 * a few shared endpoints (events, behavior, exams, timetable, leave, messages)
 * are scoped by the child.
 */

import { ADMIN_MODULE_BY_KEY } from '@/modules/admin/config';
import type { AdminModuleDefinition, AdminRecord, SelectOption } from '@/modules/admin/types';
import { buildRegistry, withOverrides } from '@/modules/shared/registry';

const today = () => new Date().toISOString().slice(0, 10);
const opts = (...values: string[]): SelectOption[] =>
  values.map((value) => ({ label: value.replace(/_/g, ' '), value }));

const PARENT_MODULES: AdminModuleDefinition[] = [
  {
    key: 'announcements',
    title: 'Announcements',
    subtitle: "Notices for your child's class and school",
    icon: 'megaphone',
    listPath: '/parent/child/announcements',
    requiredFilters: ['student_id'],
    clientSearchKeys: ['title', 'message', 'author_name'],
    displayFields: ['title', 'message', 'date', 'created_at'],
    detailFields: ['_id', 'title', 'message', 'priority', 'target', 'author_name', 'date', 'created_at'],
  },
  {
    key: 'attendance',
    title: 'Attendance',
    subtitle: "Your child's daily attendance record",
    icon: 'check-circle',
    listPath: '/parent/student-attendance',
    requiredFilters: ['student_id'],
    clientSearchKeys: ['date', 'status', 'class_name'],
    displayFields: ['date', 'status', 'class_name', 'period'],
    detailFields: ['_id', 'student_id', 'class_name', 'date', 'period', 'status', 'remarks', 'note'],
  },
  {
    key: 'results',
    title: 'Results',
    subtitle: 'Exam and test results',
    icon: 'star',
    listPath: '/parent/student-results',
    requiredFilters: ['student_id'],
    clientSearchKeys: ['exam_title', 'subject', 'grade', 'subject_name'],
    displayFields: ['exam_title', 'subject_name', 'obtained_marks', 'total_marks', 'grade'],
    detailFields: ['_id', 'exam_id', 'exam_title', 'subject_name', 'subject', 'obtained_marks', 'total_marks', 'percentage', 'grade', 'remarks'],
  },
  {
    key: 'homework',
    title: 'Homework',
    subtitle: 'Assignments and submission status',
    icon: 'book',
    listPath: '/parent/child/homework',
    requiredFilters: ['student_id'],
    clientSearchKeys: ['title', 'subject_name', 'status'],
    displayFields: ['title', 'subject_name', 'due_date', 'status'],
    detailFields: ['_id', 'title', 'description', 'subject_name', 'class_name', 'assigned_date', 'due_date', 'status'],
  },
  {
    key: 'fees',
    title: 'Fees',
    subtitle: 'Vouchers, dues and payment status',
    icon: 'wallet',
    listPath: '/parent/fees',
    requiredFilters: ['student_id'],
    clientSearchKeys: ['month', 'status', 'invoice_no'],
    displayFields: ['month', 'year', 'effective_amount', 'paid_amount', 'status'],
    detailFields: ['_id', 'invoice_no', 'month', 'year', 'amount', 'effective_amount', 'paid_amount', 'outstanding_amount', 'due_at', 'status'],
  },
  {
    key: 'live-classes',
    title: 'Live Classes',
    subtitle: 'Scheduled and recorded online sessions',
    icon: 'video',
    listPath: '/parent/live-classes',
    requiredFilters: ['student_id'],
    clientSearchKeys: ['title', 'subject_name', 'status'],
    displayFields: ['title', 'subject_name', 'scheduled_at', 'status'],
    detailFields: ['_id', 'title', 'subject_name', 'class_name', 'scheduled_at', 'duration', 'status', 'meeting_link'],
  },
  {
    key: 'behavior',
    title: 'Behavior',
    subtitle: 'Discipline and merit notes',
    icon: 'shield',
    listPath: '/behavior',
    requiredFilters: ['student_id'],
    filters: [{ key: 'student_id', label: 'Student', type: 'text' }],
    clientSearchKeys: ['category', 'severity', 'status'],
    displayFields: ['category', 'severity', 'status', 'created_at'],
    detailFields: ['_id', 'student_name', 'category', 'incident_type', 'description', 'severity', 'action_taken', 'status', 'created_at'],
  },
  {
    key: 'exams',
    title: 'Exams',
    subtitle: "Upcoming exams for your child's class",
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
    subtitle: 'Weekly class schedule',
    icon: 'calendar',
    listPath: '/timetable',
    requiredFilters: ['class_id'],
    filters: [{ key: 'class_id', label: 'Class', type: 'text' }],
    clientSearchKeys: ['day', 'subject_name', 'teacher_name'],
    displayFields: ['day', 'period', 'subject_name', 'teacher_name', 'start_time'],
    detailFields: ['_id', 'class_name', 'day', 'period', 'subject_name', 'teacher_name', 'start_time', 'end_time', 'room'],
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
    subtitle: "Apply for and track your child's leave",
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
    subtitle: 'Message teachers and staff',
  }),
];

export const PARENT_MODULE_BY_KEY = buildRegistry(PARENT_MODULES);

export const isParentModuleKey = (value: string): boolean =>
  Object.prototype.hasOwnProperty.call(PARENT_MODULE_BY_KEY, value);
