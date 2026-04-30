"use client";

import { colors, spacing, typography } from "@edu/shared/design-system/tokens";
import { Card, DataState } from "../../../components/ui";
import { AcademyCareForm } from "../components/AcademyCareForm";
import { AcademyCareTable } from "../components/AcademyCareTable";
import { useAcademyCare } from "../hooks/useAcademyCare";

export function AcademyCarePage() {
    const { state, addAcademyYear } = useAcademyCare();

    return (
        <div style={{ display: "grid", gap: spacing.lg }}>
            <Card>
                <AcademyCareForm onCreate={addAcademyYear} />
            </Card>

            {state.status === "loading" || state.status === "idle" ? (
                <DataState variant="loading" title="Loading academic years" />
            ) : null}

            {state.status === "error" ? (
                <DataState variant="error" title="Failed to load academic years" message={state.error} />
            ) : null}

            {state.status === "empty" ? (
                <DataState variant="empty" title="No academic years created" message="Create the first academic year to begin." />
            ) : null}

            {state.status === "success" && state.data && state.data.length > 0 ? (
                <Card style={{ padding: 0, overflow: "hidden", borderColor: colors.cardBorder }}>
                    <div style={{ padding: spacing.md, borderBottom: `1px solid ${colors.cardBorder}`, background: colors.surfaceContainerLowest }}>
                        <h2 style={{ ...typography.h3, margin: 0, color: colors.onSurface }}>Academic Years</h2>
                    </div>
                    <div style={{ padding: spacing.md }}>
                        <AcademyCareTable years={state.data} />
                    </div>
                </Card>
            ) : null}
        </div>
    );
}
