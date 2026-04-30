import { SchoolShell } from "../../../layouts/SchoolShell";
import { TeacherPage } from "../../../modules/teachers/pages/TeacherPage";

export default function AdminTeachersPage() {
    return (
        <SchoolShell eyebrow="Operations" title="Teachers">
            <TeacherPage />
        </SchoolShell>
    );
}
