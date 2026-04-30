"use client";

import { colors, spacing, typography } from "@edu/shared/design-system/tokens";
import { Card, DataState } from "../../../components/ui";
import { AttendanceForm } from "../components/AttendanceForm";

export function AttendancePage() {
    async function handleRecordAttendance(input: any) {
        // TODO: Connect to API
        console.log("Recording attendance:", input);
    }

    return (
        <div style={{ display: "grid", gap: spacing.lg }}>
            <Card>
                <AttendanceForm onCreate={handleRecordAttendance} />
            </Card>
            <DataState variant="empty" title="No attendance records" message="Start marking attendance for your classes." />
        </div>
    );
}
