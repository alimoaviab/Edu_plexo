"use client";

import { FormEvent, useState } from "react";
import { Button, Input } from "../../../components/ui";
import { FormSection, FormGroup } from "../../../components/ui/FormSection";
import { spacing, colors } from "@edu/shared/design-system/tokens";

interface ResultFormInput {
    student_id: string;
    exam_id: string;
    obtained_marks: number;
    grade: string;
    remarks: string;
}

export function ResultForm({ onCreate }: { onCreate: (input: ResultFormInput) => Promise<unknown> }) {
    const [form, setForm] = useState<ResultFormInput>({
        student_id: "",
        exam_id: "",
        obtained_marks: 0,
        grade: "",
        remarks: ""
    });
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    function validate() {
        const newErrors: Record<string, string> = {};
        if (!form.student_id.trim()) newErrors.student_id = "Student is required";
        if (!form.exam_id.trim()) newErrors.exam_id = "Exam is required";
        if (form.obtained_marks < 0) newErrors.obtained_marks = "Marks cannot be negative";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!validate()) return;
        setSaving(true);
        await onCreate(form);
        setForm({
            student_id: "",
            exam_id: "",
            obtained_marks: 0,
            grade: "",
            remarks: ""
        });
        setSaving(false);
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: spacing.lg }}>
            <FormSection title="Enter Results" description="Record exam results for students" columns={2}>
                <FormGroup label="Student" required error={errors.student_id}>
                    <Input
                        placeholder="Select student"
                        value={form.student_id}
                        onChange={(e) => setForm({ ...form, student_id: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Exam" required error={errors.exam_id}>
                    <Input
                        placeholder="Select exam"
                        value={form.exam_id}
                        onChange={(e) => setForm({ ...form, exam_id: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Obtained Marks" required error={errors.obtained_marks}>
                    <Input
                        type="number"
                        min="0"
                        placeholder="Marks obtained"
                        value={form.obtained_marks}
                        onChange={(e) => setForm({ ...form, obtained_marks: parseFloat(e.target.value) || 0 })}
                    />
                </FormGroup>

                <FormGroup label="Grade">
                    <Input
                        placeholder="e.g., A, B, C, D, F"
                        value={form.grade}
                        onChange={(e) => setForm({ ...form, grade: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Remarks">
                    <Input
                        placeholder="Add any remarks or comments"
                        value={form.remarks}
                        onChange={(e) => setForm({ ...form, remarks: e.target.value })}
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
                {saving ? "Saving..." : "Save Result"}
            </Button>
        </form>
    );
}
