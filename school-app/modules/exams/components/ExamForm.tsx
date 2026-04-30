"use client";

import { FormEvent, useState } from "react";
import { Button, Input } from "../../../components/ui";
import { FormSection, FormGroup } from "../../../components/ui/FormSection";
import { spacing, colors } from "@edu/shared/design-system/tokens";

interface ExamFormInput {
    exam_name: string;
    class_id: string;
    date: string;
    total_marks: number;
    passing_marks: number;
    description: string;
}

export function ExamForm({ onCreate }: { onCreate: (input: ExamFormInput) => Promise<unknown> }) {
    const [form, setForm] = useState<ExamFormInput>({
        exam_name: "",
        class_id: "",
        date: "",
        total_marks: 100,
        passing_marks: 40,
        description: ""
    });
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    function validate() {
        const newErrors: Record<string, string> = {};
        if (!form.exam_name.trim()) newErrors.exam_name = "Exam name is required";
        if (!form.class_id.trim()) newErrors.class_id = "Class is required";
        if (!form.date) newErrors.date = "Date is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!validate()) return;
        setSaving(true);
        await onCreate(form);
        setForm({
            exam_name: "",
            class_id: "",
            date: "",
            total_marks: 100,
            passing_marks: 40,
            description: ""
        });
        setSaving(false);
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: spacing.lg }}>
            <FormSection title="Schedule Exam" description="Create new exam schedule" columns={2}>
                <FormGroup label="Exam Name" required error={errors.exam_name}>
                    <Input
                        placeholder="e.g., Mid-Term Exam"
                        value={form.exam_name}
                        onChange={(e) => setForm({ ...form, exam_name: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Class" required error={errors.class_id}>
                    <Input
                        placeholder="Select class"
                        value={form.class_id}
                        onChange={(e) => setForm({ ...form, class_id: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Date" required error={errors.date}>
                    <Input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Total Marks">
                    <Input
                        type="number"
                        min="1"
                        value={form.total_marks}
                        onChange={(e) => setForm({ ...form, total_marks: parseInt(e.target.value) || 100 })}
                    />
                </FormGroup>

                <FormGroup label="Passing Marks">
                    <Input
                        type="number"
                        min="0"
                        value={form.passing_marks}
                        onChange={(e) => setForm({ ...form, passing_marks: parseInt(e.target.value) || 40 })}
                    />
                </FormGroup>

                <FormGroup label="Description">
                    <Input
                        placeholder="Exam description or instructions"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                {saving ? "Creating..." : "Schedule Exam"}
            </Button>
        </form>
    );
}
