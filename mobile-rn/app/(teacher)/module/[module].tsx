/**
 * Teacher portal module route — drives the generic config-driven CRUD screen
 * with the teacher registry so teachers get list / search / filter / paginate /
 * detail / create / update / delete on every teacher-scoped module.
 */
import { AdminModuleScreen } from '@/modules/admin/AdminModuleScreen';
import { TEACHER_MODULE_BY_KEY } from '@/modules/teacher/config';

export default function TeacherModuleRoute() {
  return <AdminModuleScreen registry={TEACHER_MODULE_BY_KEY} />;
}
