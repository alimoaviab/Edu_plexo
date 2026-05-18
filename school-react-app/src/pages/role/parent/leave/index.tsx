import { SchoolShell } from "@/layouts/SchoolShell";
import ParentLeavePage from "@/modules/leave/pages/ParentLeavePage";

export function ParentLeaveRoute() {
    return (
        <SchoolShell eyebrow="Guardian Portal" title="Leave applications">
            <ParentLeavePage />
        </SchoolShell>
    );
}

export default ParentLeaveRoute;
