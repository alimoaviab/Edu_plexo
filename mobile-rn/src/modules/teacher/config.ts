/**
 * Teacher module registry.
 *
 * Teachers hit the SAME backend CRUD endpoints as admins — the Go backend
 * scopes every list/read/write by the authenticated user (a teacher only sees
 * their own classes, homework, attendance, etc.). So the teacher portal reuses
 * the admin module definitions verbatim, narrowing the set to the teacher
 * scope and applying a few teacher-appropriate overrides:
 *
 *   • "My Classes" reads the scoped /school/my-classes endpoint.
 *   • "My Leave" drops the admin approve/reject actions (teachers apply, they
 *     don't adjudicate) and defaults the requester to a teacher.
 */

import { ADMIN_MODULE_BY_KEY } from '@/modules/admin/config';
import type { AdminModuleDefinition } from '@/modules/admin/types';
import { buildRegistry, pickModules, withOverrides } from '@/modules/shared/registry';

// Endpoints reused 1:1 from the admin engine (identical backend routes).
const REUSED_KEYS = [
  'timetable',
  'attendance',
  'homework',
  'tests',
  'exams',
  'results',
  'live-classes',
  'behavior',
  'events',
  'announcements',
  'question-papers',
  'schedules',
  'messages',
];

// Teacher "My Classes" — the scoped roster endpoint.
const myClasses: AdminModuleDefinition = {
  key: 'classes',
  title: 'My Classes',
  subtitle: 'Sections and subjects you teach',
  icon: 'graduation',
  listPath: '/school/my-classes',
  getPath: '/classes/:id',
  clientSearchKeys: ['name', 'section', 'class_teacher_name'],
  displayFields: ['name', 'section', 'student_count', 'class_teacher_name'],
  detailFields: [
    '_id',
    'name',
    'section',
    'student_count',
    'class_teacher_id',
    'class_teacher_name',
    'subjects',
  ],
};

// Teacher "My Leave" — apply + track, without admin adjudication actions.
const myLeave = withOverrides(ADMIN_MODULE_BY_KEY['leave'], {
  title: 'My Leave',
  subtitle: 'Apply for and track your leave requests',
  rowActions: undefined,
});

export const TEACHER_MODULES: AdminModuleDefinition[] = [
  myClasses,
  ...pickModules(ADMIN_MODULE_BY_KEY, REUSED_KEYS),
  myLeave,
];

export const TEACHER_MODULE_BY_KEY = buildRegistry(TEACHER_MODULES);

export const isTeacherModuleKey = (value: string): boolean =>
  Object.prototype.hasOwnProperty.call(TEACHER_MODULE_BY_KEY, value);
