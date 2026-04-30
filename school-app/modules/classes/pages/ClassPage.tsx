"use client";

import { colors, spacing, typography } from "@edu/shared/design-system/tokens";
import { Card, DataState } from "../../../components/ui";
import { ClassForm } from "../components/ClassForm";

export function ClassPage() {
    async function handleCreateClass(input: any) {
        // TODO: Connect to API
        console.log("Creating class:", input);
    }

    return (
        <div style={{ display: "grid", gap: spacing.lg }}>
            <Card>
                <ClassForm onCreate={handleCreateClass} />
            </Card>
            <DataState variant="empty" title="No classes created" message="Create your first class to begin." />
        </div>
    );
}
