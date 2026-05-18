/**
 * Auth API surface — endpoints match the existing Go backend that the web
 * app already talks to. Kept thin so the auth store has a stable contract
 * regardless of how the endpoints evolve.
 */

import { api } from '@/api/client';
import type { LoginRequest, LoginResponse } from '@/types/auth';

export const authApi = {
  login: (body: LoginRequest) =>
    api.post<LoginResponse, LoginRequest>('/api/auth/login', body),
  /**
   * The Go backend doesn't expose a logout endpoint — sessions die naturally
   * when the JWT expires (8 h). We still hit the legacy `_log` route so we
   * can audit "logout" events centrally if/when the backend adds one.
   */
  logout: () => api.post<{ ok: true }>('/api/auth/_log'),
  /** Switch the active academic year and re-issue the JWT. */
  switchAcademicYear: (academicYearId: string) =>
    api.post<
      { token: string; academic_year_id: string; year: string; is_active: boolean },
      { academic_year_id: string }
    >('/api/academic-years/switch', { academic_year_id: academicYearId }),
};
