import { SchoolShell } from "../../../layouts/SchoolShell";
import { ClassPage } from "../../../modules/classes/pages/ClassPage";

export default function AdminClassesPage() {
    return (
        <SchoolShell eyebrow="Academic" title="Classes">
            <ClassPage />
        </SchoolShell>
    );
}
