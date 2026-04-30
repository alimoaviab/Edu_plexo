"use client";

import { FormEvent, useState } from "react";
import { Button, Input } from "../../../components/ui";
import { FormSection, FormGroup } from "../../../components/ui/FormSection";
import { spacing, colors } from "@edu/shared/design-system/tokens";
import { AcademyYearFormInput } from "../types/academyCare.types";

const initialForm: AcademyYearFormInput = {
    year: "",
    start_date: "",
    end_date: "",
    is_active: false,
    description: ""
};

export function AcademyCareForm({ onCreate }: { onCreate: (input: AcademyYearFormInput) => Promise<unknown> }) {
    const [form, setForm] = useState<AcademyYearFormInput>(initialForm);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    function validate() {
        const newErrors: Record<string, string> = {};
        if (!form.year.trim()) newErrors.year = "Academic year is required";
        if (!form.start_date) newErrors.start_date = "Start date is required";
        if (!form.end_date) newErrors.end_date = "End date is required";
        if (form.start_date && form.end_date && new Date(form.start_date) > new Date(form.end_date)) {
            newErrors.end_date = "End date must be after start date";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!validate()) return;

        setSaving(true);
        await onCreate(form);
        setForm(initialForm);
        setSaving(false);
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: spacing.lg }}>
            <FormSection title="Academic Year Details" description="Create a new academic year for your school">
                <FormGroup label="Academic Year" required error={errors.year}>
                    <Input
                        placeholder="e.g., 2024-2025"
                        value={form.year}
                        onChange={(e) => setForm({ ...form, year: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Start Date" required error={errors.start_date}>
                    <Input
                        type="date"
                        value={form.start_date}
                        onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="End Date" required error={errors.end_date}>
                    <Input
                        type="date"
                        value={form.end_date}
                        onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Description" >
                    <Input
                        placeholder="Add notes about this academic year"
                        value={form.description || ""}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                </FormGroup>
            </FormSection>

            <FormSection title="Options">
                <label style={{ display: "flex", alignItems: "center", gap: spacing.sm, cursor: "pointer" }}>
                    <input
                        type="checkbox"
                        checked={form.is_active}
                        onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                        style={{ width: "20px", height: "20px", cursor: "pointer" }}
                    />
                    <span style={{ fontSize: "14px", color: colors.onSurface }}>Set as Active Academic Year</span>
                </label>
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
                {saving ? "Creating..." : "Create Academic Year"}
            </Button>
        </form>
    );
}
