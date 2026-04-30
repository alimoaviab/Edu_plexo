import { SchoolShell } from "../../../layouts/SchoolShell";
import { HomeworkPage } from "../../../modules/homework/pages/HomeworkPage";

export default function AdminHomeworkPage() {
    return (
        <SchoolShell eyebrow="Academic" title="Homework">
            <HomeworkPage />
        </SchoolShell>
    );
}
