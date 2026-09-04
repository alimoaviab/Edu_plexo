/**
 * Dashboard data fetchers. Each returns typed data or throws, so the screens
 * can wire them straight into TanStack Query (`useQuery`). All requests go
 * through the shared `api` client, which attaches the Bearer JWT and the
 * X-Academic-Year-Id header — identical to the web behaviour.
 */

import { api } from '@/api/client';
import type {
  AdminComposite,
  OwnerDashboard,
  StudentDashboardStats,
  StudentInfo,
  TeacherPortal,
} from '@/modules/dashboard/types';

/** GET /api/dashboard/composite — the all-in-one admin dashboard payload. */
export async function fetchAdminComposite(): Promise<AdminComposite> {
  const result = await api.get<AdminComposite>('/dashboard/composite');
  if (!result.ok || !result.data) {
    throw new Error(result.message ?? 'Unable to load the dashboard.');
  }
  return result.data;
}

/** GET /api/owner/dashboard — owner-level portfolio stats (owner-only). */
export async function fetchOwnerDashboard(): Promise<OwnerDashboard> {
  const result = await api.get<OwnerDashboard>('/owner/dashboard');
  if (!result.ok || !result.data) {
    throw new Error(result.message ?? 'Unable to load the portfolio.');
  }
  return result.data;
}

/** GET /api/teachers/session — the teacher portal payload. */
export async function fetchTeacherPortal(): Promise<TeacherPortal> {
  const result = await api.get<TeacherPortal>('/teachers/session');
  if (!result.ok || !result.data) {
    throw new Error(result.message ?? 'Unable to load your workspace.');
  }
  return result.data;
}

/** GET /api/student/dashboard/stats — the signed-in student's own stats. */
export async function fetchStudentStats(): Promise<StudentDashboardStats> {
  const result = await api.get<StudentDashboardStats>('/student/dashboard/stats');
  if (!result.ok || !result.data) {
    throw new Error(result.message ?? 'Unable to load the dashboard.');
  }
  return result.data;
}

/** GET /api/student/info — the signed-in student's own profile record. */
export async function fetchStudentInfo(): Promise<StudentInfo> {
  const result = await api.get<unknown>('/student/info');
  if (!result.ok) {
    throw new Error(result.message ?? 'Unable to load your profile.');
  }
  return normalizeStudentInfo(result.data);
}

// ─── helpers ────────────────────────────────────────────────────────────────

/** Extract the student record from the /student/info envelope. */
function normalizeStudentInfo(payload: unknown): StudentInfo {
  if (!payload || typeof payload !== 'object') {
    return { id: '', name: '', roll_no: '', class: '', section: '', status: '' };
  }
  const obj = payload as Record<string, unknown>;
  const student =
    obj.student && typeof obj.student === 'object'
      ? (obj.student as Record<string, unknown>)
      : obj.students && Array.isArray(obj.students)
        ? ((obj.students[0] ?? {}) as Record<string, unknown>)
        : obj;
  return {
    id: String(student.id ?? student._id ?? ''),
    name: String(student.name ?? ''),
    first_name: student.first_name ? String(student.first_name) : undefined,
    last_name: student.last_name ? String(student.last_name) : undefined,
    roll_no: String(student.roll_no ?? student.admission_no ?? ''),
    admission_no: student.admission_no ? String(student.admission_no) : undefined,
    email: student.email ? String(student.email) : undefined,
    phone: student.phone ? String(student.phone) : undefined,
    class: String(student.class ?? student.class_name ?? ''),
    class_name: student.class_name ? String(student.class_name) : undefined,
    section: student.section ? String(student.section) : '',
    academic_year: student.academic_year ? String(student.academic_year) : undefined,
    status: student.status ? String(student.status) : 'active',
  };
}
