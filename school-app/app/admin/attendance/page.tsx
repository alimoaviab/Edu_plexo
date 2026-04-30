import { SchoolShell } from "../../../layouts/SchoolShell";
import { AttendancePage } from "../../../modules/attendance/pages/AttendancePage";

export default function AdminAttendancePage() {
    return (
        <SchoolShell eyebrow="Academic" title="Attendance">
            <AttendancePage />
        </SchoolShell>
    );
}
