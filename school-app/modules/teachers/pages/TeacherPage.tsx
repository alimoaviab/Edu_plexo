"use client";

import { colors, spacing, typography } from "@edu/shared/design-system/tokens";
import { Card, DataState } from "../../../components/ui";
import { TeacherForm } from "../components/TeacherForm";
import { TeacherTable } from "../components/TeacherTable";
import { useTeachers } from "../hooks/useTeachers";

export function TeacherPage() {
    const { state, addTeacher } = useTeachers();

    return (
        <div style={{ display: "grid", gap: spacing.lg }}>
            <Card>
                <TeacherForm onCreate={addTeacher} />
            </Card>

            {state.status === "loading" || state.status === "idle" ? <DataState variant="loading" title="Loading teachers" /> : null}

            {state.status === "error" ? <DataState variant="error" title="Failed to load teachers" message={state.error} /> : null}

            {state.status === "empty" ? <DataState variant="empty" title="No teachers found" message="Add the first teacher to your school." /> : null}

            {state.status === "success" && state.data && state.data.length > 0 ? (
                <Card style={{ padding: 0, overflow: "hidden", borderColor: colors.cardBorder }}>
                    <div style={{ padding: spacing.md, borderBottom: `1px solid ${colors.cardBorder}`, background: colors.surfaceContainerLowest }}>
                        <h2 style={{ ...typography.h3, margin: 0, color: colors.onSurface }}>Teachers</h2>
                    </div>
                    <div style={{ padding: spacing.md }}>
                        <TeacherTable teachers={state.data} />
                    </div>
                </Card>
            ) : null}
        </div>
    );
}
