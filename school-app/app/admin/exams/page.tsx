import { SchoolShell } from "../../../layouts/SchoolShell";
import { ExamPage } from "../../../modules/exams/pages/ExamPage";

export default function AdminExamsPage() {
    return (
        <SchoolShell eyebrow="Academic" title="Exams">
            <ExamPage />
        </SchoolShell>
    );
}
