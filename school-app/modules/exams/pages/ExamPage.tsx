"use client";

import { colors, spacing, typography } from "@edu/shared/design-system/tokens";
import { Card, DataState } from "../../../components/ui";
import { ExamForm } from "../components/ExamForm";

export function ExamPage() {
    async function handleCreateExam(input: any) {
        // TODO: Connect to API
        console.log("Creating exam:", input);
    }

    return (
        <div style={{ display: "grid", gap: spacing.lg }}>
            <Card>
                <ExamForm onCreate={handleCreateExam} />
            </Card>
            <DataState variant="empty" title="No exams scheduled" message="Schedule exams for your academic year." />
        </div>
    );
}
