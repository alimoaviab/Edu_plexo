"use client";

import { FormEvent, useState } from "react";
import { Button, Input } from "../../../components/ui";
import { FormSection, FormGroup } from "../../../components/ui/FormSection";
import { spacing, colors } from "@edu/shared/design-system/tokens";

interface AttendanceFormInput {
    student_id: string;
    class_id: string;
    date: string;
    status: "present" | "absent" | "late" | "excused";
    remarks: string;
}

export function AttendanceForm({ onCreate }: { onCreate: (input: AttendanceFormInput) => Promise<unknown> }) {
    const [form, setForm] = useState<AttendanceFormInput>({
        student_id: "",
        class_id: "",
        date: new Date().toISOString().split("T")[0],
        status: "present",
        remarks: ""
    });
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    function validate() {
        const newErrors: Record<string, string> = {};
        if (!form.student_id.trim()) newErrors.student_id = "Student is required";
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
            student_id: "",
            class_id: "",
            date: new Date().toISOString().split("T")[0],
            status: "present",
            remarks: ""
        });
        setSaving(false);
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: spacing.lg }}>
            <FormSection title="Mark Attendance" description="Record student attendance" columns={2}>
                <FormGroup label="Student" required error={errors.student_id}>
                    <Input
                        placeholder="Select student"
                        value={form.student_id}
                        onChange={(e) => setForm({ ...form, student_id: e.target.value })}
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

                <FormGroup label="Status" required>
                    <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value as "present" | "absent" | "late" | "excused" })}
                        style={{
                            padding: spacing.sm,
                            borderRadius: "4px",
                            border: `1px solid ${colors.outline}`,
                            fontSize: "14px"
                        }}
                    >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="excused">Excused</option>
                    </select>
                </FormGroup>

                <FormGroup label="Remarks">
                    <Input
                        placeholder="Add any remarks"
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
                {saving ? "Recording..." : "Record Attendance"}
            </Button>
        </form>
    );
}
