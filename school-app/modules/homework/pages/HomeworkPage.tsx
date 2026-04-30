"use client";

import { colors, spacing, typography } from "@edu/shared/design-system/tokens";
import { Card, DataState } from "../../../components/ui";
import { HomeworkForm } from "../components/HomeworkForm";

export function HomeworkPage() {
    async function handleCreateHomework(input: any) {
        // TODO: Connect to API
        console.log("Creating homework:", input);
    }

    return (
        <div style={{ display: "grid", gap: spacing.lg }}>
            <Card>
                <HomeworkForm onCreate={handleCreateHomework} />
            </Card>
            <DataState variant="empty" title="No homework assigned" message="Create homework for your classes." />
        </div>
    );
}
