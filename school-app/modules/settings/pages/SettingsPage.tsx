"use client";

import { colors, spacing, typography } from "@edu/shared/design-system/tokens";
import { Card } from "../../../components/ui";
import { SettingsForm } from "../components/SettingsForm";

export function SettingsPage() {
    async function handleSaveSettings(input: any) {
        // TODO: Connect to API
        console.log("Saving settings:", input);
    }

    return (
        <div style={{ display: "grid", gap: spacing.lg }}>
            <Card>
                <SettingsForm onSave={handleSaveSettings} />
            </Card>
        </div>
    );
}
