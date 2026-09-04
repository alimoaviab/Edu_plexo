/**
 * Student portal module route.
 *
 * Students hit the `/api/student/*` portal endpoints plus shared role-scoped
 * endpoints — the Go backend resolves the student's own record from the JWT
 * and rejects any injected `student_id` that is not the caller's own, so
 * the scope below is only used to satisfy shared-endpoint filters
 * (e.g. `/exams?class_id=…`).
 */
import { AdminModuleScreen } from '@/modules/admin/AdminModuleScreen';
import { STUDENT_MODULE_BY_KEY } from '@/modules/student/config';
import { useAuthStore } from '@/store/auth-store';

export default function StudentModuleRoute() {
  const studentId = useAuthStore((s) => s.user?.studentId);
  const classId = useAuthStore((s) => s.user?.classId);
  const scope = { student_id: studentId, class_id: classId };

  return <AdminModuleScreen registry={STUDENT_MODULE_BY_KEY} scope={scope} />;
}
