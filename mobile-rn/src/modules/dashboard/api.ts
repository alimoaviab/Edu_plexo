/**
 * Dashboard data fetchers. Each returns typed data or throws, so the screens
 * can wire them straight into TanStack Query (`useQuery`). All requests go
 * through the shared `api` client, which attaches the Bearer JWT and the
 * X-Academic-Year-Id header — identical to the web behaviour.
 */

import { api } from '@/api/client';
import type {
  AdminComposite,
  ParentChild,
  ParentDashboardStats,
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

/** GET /api/teachers/session — the teacher portal payload. */
export async function fetchTeacherPortal(): Promise<TeacherPortal> {
  const result = await api.get<TeacherPortal>('/teachers/session');
  if (!result.ok || !result.data) {
    throw new Error(result.message ?? 'Unable to load your workspace.');
  }
  return result.data;
}

/** GET /api/parent/children — children linked to the signed-in parent. */
export async function fetchParentChildren(): Promise<ParentChild[]> {
  const result = await api.get<unknown>('/parent/children');
  if (!result.ok) {
    throw new Error(result.message ?? 'Unable to load your children.');
  }
  return normalizeChildren(result.data);
}

/** GET /api/parent/dashboard/stats — per-child dashboard stats. */
export async function fetchParentStats(studentId?: string): Promise<ParentDashboardStats> {
  const result = await api.get<ParentDashboardStats>('/parent/dashboard/stats', {
    query: studentId ? { student_id: studentId } : undefined,
  });
  if (!result.ok || !result.data) {
    throw new Error(result.message ?? 'Unable to load the dashboard.');
  }
  return result.data;
}

// ─── helpers ────────────────────────────────────────────────────────────────

function normalizeChildren(payload: unknown): ParentChild[] {
  const list = extractArray(payload);
  return list.map((raw) => {
    const child = (raw ?? {}) as Record<string, unknown>;
    const first = String(child.first_name ?? '');
    const last = String(child.last_name ?? '');
    const composed = `${first} ${last}`.trim();
    return {
      student_id: String(child.student_id ?? child.id ?? child._id ?? ''),
      id: child.id ? String(child.id) : undefined,
      name: String(child.name ?? composed ?? '').trim() || 'Student',
      first_name: first || undefined,
      last_name: last || undefined,
      class: child.class ? String(child.class) : undefined,
      class_id: child.class_id ? String(child.class_id) : undefined,
      class_name: child.class_name ? String(child.class_name) : undefined,
      section: child.section ? String(child.section) : undefined,
      roll_no: child.roll_no ? String(child.roll_no) : undefined,
      admission_no: child.admission_no ? String(child.admission_no) : undefined,
    };
  });
}

function extractArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    for (const key of ['children', 'students', 'items', 'data', 'results']) {
      if (Array.isArray(obj[key])) return obj[key] as unknown[];
    }
    // Single student-info object → wrap as a one-element list.
    if (obj.student && typeof obj.student === 'object') return [obj.student];
    if (obj.student_id || obj.id || obj._id) return [obj];
  }
  return [];
}
