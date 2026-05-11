import { SchoolShell } from "../../../../../layouts/SchoolShell";
import { TimetableEditPage } from "../../../../../modules/timetable/pages/TimetableEditPage";

export default function AdminTimetableEditPage({ params }: { params: { id: string } }) {
    return (
        <SchoolShell eyebrow="Academic" title="Edit Timetable Entry">
            <TimetableEditPage id={params.id} />
        </SchoolShell>
    );
}
