/**
 * Student portal module route.
 *
 * Students hit the same `/parent/*` + shared endpoints as parents — the Go
 * backend resolves the active student from the JWT. So the student portal
 * reuses the parent module registry, scoped to the signed-in student's own
 * `student_id` / `class_id` taken from the auth session.
 */
import { AdminModuleScreen } from '@/modules/admin/AdminModuleScreen';
import { PARENT_MODULE_BY_KEY } from '@/modules/parent/config';
import { useAuthStore } from '@/store/auth-store';

export default function StudentModuleRoute() {
  const studentId = useAuthStore((s) => s.user?.studentId);
  const classId = useAuthStore((s) => s.user?.classId);
  const scope = { student_id: studentId, class_id: classId };

  return <AdminModuleScreen registry={PARENT_MODULE_BY_KEY} scope={scope} />;
}
