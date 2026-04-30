"use client";

import { FormEvent, useState } from "react";
import { Button, Input } from "../../../components/ui";
import { FormSection, FormGroup } from "../../../components/ui/FormSection";
import { spacing, colors, typography } from "@edu/shared/design-system/tokens";
import { TeacherFormInput } from "../types/teacher.types";

const initialForm: TeacherFormInput = {
    employee_no: "",
    first_name: "",
    last_name: "",
    email: "",
    subjects: []
};

export function TeacherForm({ onCreate }: { onCreate: (input: TeacherFormInput) => Promise<unknown> }) {
    const [form, setForm] = useState<TeacherFormInput>(initialForm);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    function validate() {
        const newErrors: Record<string, string> = {};
        if (!form.employee_no.trim()) newErrors.employee_no = "Employee number is required";
        if (!form.first_name.trim()) newErrors.first_name = "First name is required";
        if (!form.last_name.trim()) newErrors.last_name = "Last name is required";
        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Invalid email address";
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
            <FormSection title="Teacher Information" description="Add a new teacher to your school" columns={2}>
                <FormGroup label="Employee Number" required error={errors.employee_no}>
                    <Input
                        placeholder="e.g., TCH-2024-001"
                        value={form.employee_no}
                        onChange={(e) => setForm({ ...form, employee_no: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Email" required error={errors.email}>
                    <Input
                        placeholder="teacher@school.edu"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="First Name" required error={errors.first_name}>
                    <Input
                        placeholder="Teacher's first name"
                        value={form.first_name}
                        onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Last Name" required error={errors.last_name}>
                    <Input
                        placeholder="Teacher's last name"
                        value={form.last_name}
                        onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Subjects">
                    <Input
                        placeholder="e.g., Mathematics, English (comma-separated)"
                        value={form.subjects?.join(", ") || ""}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                subjects: e.target.value
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter((s) => s.length > 0)
                            })
                        }
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
                {saving ? "Creating..." : "Add Teacher"}
            </Button>
        </form>
    );
}
