"use client";

import { colors, spacing, typography } from "@edu/shared/design-system/tokens";
import { Card, DataState } from "../../../components/ui";
import { ResultForm } from "../components/ResultForm";

export function ResultPage() {
    async function handleCreateResult(input: any) {
        // TODO: Connect to API
        console.log("Creating result:", input);
    }

    return (
        <div style={{ display: "grid", gap: spacing.lg }}>
            <Card>
                <ResultForm onCreate={handleCreateResult} />
            </Card>
            <DataState variant="empty" title="No results available" message="Enter exam results for students." />
        </div>
    );
}
