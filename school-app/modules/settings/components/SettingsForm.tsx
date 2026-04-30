"use client";

import { FormEvent, useState } from "react";
import { Button, Input } from "../../../components/ui";
import { FormSection, FormGroup } from "../../../components/ui/FormSection";
import { spacing, colors, typography } from "@edu/shared/design-system/tokens";

interface SettingsFormInput {
    academy_name: string;
    academy_phone: string;
    academy_email: string;
    academy_address: string;
    logo_url: string;
    principal_name: string;
    established_year: string;
}

export function SettingsForm({ onSave }: { onSave: (input: SettingsFormInput) => Promise<unknown> }) {
    const [form, setForm] = useState<SettingsFormInput>({
        academy_name: "",
        academy_phone: "",
        academy_email: "",
        academy_address: "",
        logo_url: "",
        principal_name: "",
        established_year: new Date().getFullYear().toString()
    });
    const [saving, setSaving] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        await onSave(form);
        setSaving(false);
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: spacing.lg }}>
            <FormSection title="School Information" description="Update your school details" columns={2}>
                <FormGroup label="School Name">
                    <Input
                        placeholder="School name"
                        value={form.academy_name}
                        onChange={(e) => setForm({ ...form, academy_name: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Principal Name">
                    <Input
                        placeholder="Principal's name"
                        value={form.principal_name}
                        onChange={(e) => setForm({ ...form, principal_name: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Email">
                    <Input
                        placeholder="school@example.com"
                        type="email"
                        value={form.academy_email}
                        onChange={(e) => setForm({ ...form, academy_email: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Phone">
                    <Input
                        placeholder="Phone number"
                        type="tel"
                        value={form.academy_phone}
                        onChange={(e) => setForm({ ...form, academy_phone: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Address">
                    <Input
                        placeholder="School address"
                        value={form.academy_address}
                        onChange={(e) => setForm({ ...form, academy_address: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Established Year">
                    <Input
                        type="number"
                        placeholder="Year established"
                        value={form.established_year}
                        onChange={(e) => setForm({ ...form, established_year: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Logo URL">
                    <Input
                        placeholder="https://example.com/logo.png"
                        value={form.logo_url}
                        onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                    />
                </FormGroup>
            </FormSection>

            <Button
                type="submit"
                disabled={saving}
                style={{
                    background: colors.actionBlue,
                    color: "white",
                    padding: `${spacing.md}px`,
                    alignSelf: "flex-start"
                }}
            >
                {saving ? "Saving..." : "Save Settings"}
            </Button>
        </form>
    );
}
