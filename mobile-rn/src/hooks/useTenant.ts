/**
 * useTenant — same idea as the web's `useTenantContext`. Reads schoolId,
 * academicYearId, and role from the auth store so query keys can be scoped
 * deterministically.
 *
 * For parent users it also resolves the *active* child:
 *   1. If the parent has explicitly picked one → that wins.
 *   2. Otherwise the JWT's bound `studentId` (admin-set).
 *   3. Otherwise undefined.
 */

import { useEffect } from 'react';

import { useActiveChildStore } from '@/store/active-child-store';
import { useAuthStore } from '@/store/auth-store';
import type { Role } from '@/types/auth';

export interface TenantContext {
  schoolId: string;
  academicYearId: string;
  role: Role | '';
  userId: string;
  studentId?: string;
  classId?: string;
  profileId?: string;
  email: string;
}

export function useTenant(): TenantContext {
  const user = useAuthStore((s) => s.user);
  const activeChild = useActiveChildStore((s) => s.studentId);
  const hydrated = useActiveChildStore((s) => s.hydrated);
  const hydrate = useActiveChildStore((s) => s.hydrate);

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  const isParent = user?.role === 'parent';
  const studentId = isParent
    ? activeChild ?? user?.studentId
    : user?.studentId;

  return {
    schoolId: user?.schoolId ?? '',
    academicYearId: user?.activeAcademicYearId ?? '',
    role: user?.role ?? '',
    userId: user?.id ?? '',
    studentId: studentId ?? undefined,
    classId: user?.classId,
    profileId: user?.profileId,
    email: user?.email ?? '',
  };
}
