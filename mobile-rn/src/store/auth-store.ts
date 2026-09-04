/**
 * Auth store — single source of truth for the current session.
 *
 * Mirrors school-react-app/src/hooks/useAuth.ts so behaviour stays identical:
 *   • Reads JWT from secure storage on app start.
 *   • Decodes claims to populate the AuthUser.
 *   • Enforces the cross-tenant guard (wipes caches if school_id changed).
 *   • Persists the academic year scoped per school_id.
 *   • Listens for 401 events from the HTTP client and clears state.
 */

import { create } from 'zustand';

import { authApi } from '@/api/auth';
import { onUnauthorized } from '@/api/client';
import { resetMobileQueryCache } from '@/api/query-client';
import type { AuthUser, LoginRequest, LoginResponse, Role } from '@/types/auth';

import { decodeJwtPayload, isTokenExpired } from '@/utils/jwt';
import { prefStorage, secureStorage, StorageKeys } from '@/utils/secure-storage';

interface AuthState {
  user: AuthUser | null;
  hydrated: boolean;
  loading: boolean;
  error: string | null;
  activeSchoolId: string | null;
  activeBranchId: string | null;

  hydrate: () => Promise<void>;
  login: (input: LoginRequest) => Promise<{ ok: boolean; role?: Role; message?: string }>;
  logout: () => Promise<void>;
  setActiveSchool: (schoolId: string) => Promise<void>;
  setActiveBranch: (branchId: string) => Promise<void>;
  clearError: () => void;
}

async function enforceSchoolBoundary(currentSchoolId: string): Promise<void> {
  const lastSchoolId = await prefStorage.get(StorageKeys.lastSchoolId);
  if (lastSchoolId && lastSchoolId !== currentSchoolId) {
    // Different tenant on the same device — wipe everything except the new
    // token (which is needed for the next request).
    await Promise.all([
      prefStorage.remove(StorageKeys.profileId),
      prefStorage.remove(StorageKeys.classId),
      prefStorage.remove(StorageKeys.studentId),
      prefStorage.remove(StorageKeys.academicYearId),
      prefStorage.remove(StorageKeys.activeSchoolId),
    ]);
  }
  await prefStorage.set(StorageKeys.lastSchoolId, currentSchoolId);
}

async function persistLoginExtras(payload: LoginResponse): Promise<void> {
  if (payload.profile_id) await prefStorage.set(StorageKeys.profileId, payload.profile_id);
  else await prefStorage.remove(StorageKeys.profileId);

  if (payload.class_id) await prefStorage.set(StorageKeys.classId, payload.class_id);
  else await prefStorage.remove(StorageKeys.classId);

  if (payload.student_id) await prefStorage.set(StorageKeys.studentId, payload.student_id);
  else await prefStorage.remove(StorageKeys.studentId);

  if (payload.active_academic_year_id) {
    await prefStorage.set(StorageKeys.academicYearId, payload.active_academic_year_id);
  }

  if (payload.branch_id || payload.campus_id) {
    await prefStorage.set(StorageKeys.activeBranchId, (payload.branch_id || payload.campus_id)!);
  }
}

async function buildUserFromToken(token: string): Promise<AuthUser | null> {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  if (isTokenExpired(payload)) return null;

  await enforceSchoolBoundary(payload.school_id);

  const [profileId, classId, studentId, scopedYear, activeSchoolId, activeBranchId] = await Promise.all([
    prefStorage.get(StorageKeys.profileId),
    prefStorage.get(StorageKeys.classId),
    prefStorage.get(StorageKeys.studentId),
    prefStorage.get(StorageKeys.academicYearId),
    prefStorage.get(StorageKeys.activeSchoolId),
    prefStorage.get(StorageKeys.activeBranchId),
  ]);

  const effectiveYear = scopedYear || payload.active_academic_year_id;
  if (effectiveYear) {
    await prefStorage.set(StorageKeys.academicYearId, effectiveYear);
  }

  const effectiveSchoolId = payload.role === 'owner'
    ? payload.school_id
    : activeSchoolId || payload.school_id;
  if (effectiveSchoolId) {
    await prefStorage.set(StorageKeys.activeSchoolId, effectiveSchoolId);
  }

  // Owners never operate inside a school context: any stale active-school
  // value left by the old "Switch Campus" feature must not leak into the
  // session, or owner requests would be scoped to an arbitrary school.
  if (payload.role === 'owner') {
    await prefStorage.remove(StorageKeys.activeSchoolId);
    await prefStorage.remove(StorageKeys.activeBranchId);
  }

  return {
    id: payload.sub,
    email: payload.actor_email || payload.email || '',
    role: payload.role,
    schoolId: effectiveSchoolId,
    ownerId: payload.owner_id,
    branchId: activeBranchId || payload.branch_id || payload.campus_id,
    campusId: activeBranchId || payload.campus_id,
    isOwner: payload.is_owner || payload.role === 'owner',
    activeAcademicYearId: effectiveYear ?? undefined,
    profileId: profileId ?? undefined,
    classId: classId ?? undefined,
    studentId: studentId ?? undefined,
    activeSchoolId: activeSchoolId ?? undefined,
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  hydrated: false,
  loading: false,
  error: null,
  activeSchoolId: null,
  activeBranchId: null,

  hydrate: async () => {
    const token = await secureStorage.get(StorageKeys.token);
    if (!token) {
      set({ user: null, hydrated: true });
      return;
    }
    const [activeSchoolId, activeBranchId] = await Promise.all([
      prefStorage.get(StorageKeys.activeSchoolId),
      prefStorage.get(StorageKeys.activeBranchId),
    ]);
    const user = await buildUserFromToken(token);
    if (!user) {
      // Token expired or malformed — clean up.
      await secureStorage.remove(StorageKeys.token);
      set({ user: null, hydrated: true, activeSchoolId: null, activeBranchId: null });
      return;
    }
    set({ user, hydrated: true, activeSchoolId, activeBranchId });
  },

  login: async (input) => {
    set({ loading: true, error: null });
    const result = await authApi.login(input);
    if (!result.ok || !result.data?.token) {
      const message = result.message ?? 'Sign in failed. Please try again.';
      set({ loading: false, error: message });
      return { ok: false, message };
    }

    const data = result.data;
    await secureStorage.set(StorageKeys.token, data.token);
    await persistLoginExtras(data);
    await prefStorage.set(StorageKeys.lastEmail, input.email);
    await prefStorage.set(StorageKeys.lastLoginRole, input.role);

    const user = await buildUserFromToken(data.token);
    set({
      user,
      loading: false,
      error: null,
      activeSchoolId: user?.role === 'owner' ? null : (user?.schoolId || null),
      activeBranchId: user?.role === 'owner' ? null : (user?.branchId || null),
    });
    return { ok: true, role: data.role ?? user?.role };
  },

  logout: async () => {
    // Best-effort server logout — don't block the UI on it.
    authApi.logout().catch(() => {});

    resetMobileQueryCache();

    await Promise.all([
      secureStorage.remove(StorageKeys.token),
      prefStorage.remove(StorageKeys.profileId),
      prefStorage.remove(StorageKeys.classId),
      prefStorage.remove(StorageKeys.studentId),
      prefStorage.remove(StorageKeys.academicYearId),
      prefStorage.remove(StorageKeys.activeSchoolId),
      prefStorage.remove(StorageKeys.activeBranchId),
    ]);

    set({ user: null, activeSchoolId: null, activeBranchId: null });
  },

  setActiveSchool: async (schoolId: string) => {
    resetMobileQueryCache();
    await prefStorage.set(StorageKeys.activeSchoolId, schoolId);
    await prefStorage.remove(StorageKeys.activeBranchId);
    const user = get().user;
    if (user) {
      set({ activeSchoolId: schoolId, activeBranchId: null, user: { ...user, schoolId } });
    }
  },

  setActiveBranch: async (branchId: string) => {
    if (branchId) {
      await prefStorage.set(StorageKeys.activeBranchId, branchId);
    } else {
      await prefStorage.remove(StorageKeys.activeBranchId);
    }
    const user = get().user;
    if (user) {
      set({ activeBranchId: branchId || null, user: { ...user, branchId, campusId: branchId } });
    }
  },

  clearError: () => set({ error: null }),
}));

// Wire the 401 listener once at module load. Any expired/invalid token will
// fire this and force the user back to /login.
onUnauthorized(() => {
  resetMobileQueryCache();
  if (useAuthStore.getState().user) {
    useAuthStore.setState({ user: null });
  }
});

