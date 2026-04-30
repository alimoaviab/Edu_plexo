"use client";

import { FormEvent, useState } from "react";
import { Button, Input } from "../../../components/ui";
import { FormSection, FormGroup } from "../../../components/ui/FormSection";
import { spacing, colors } from "@edu/shared/design-system/tokens";

interface ClassFormInput {
    class_name: string;
    teacher_id: string;
    section: string;
    timing: string;
    room_number: string;
    capacity: number;
    description: string;
}

export function ClassForm({ onCreate }: { onCreate: (input: ClassFormInput) => Promise<unknown> }) {
    const [form, setForm] = useState<ClassFormInput>({
        class_name: "",
        teacher_id: "",
        section: "",
        timing: "",
        room_number: "",
        capacity: 40,
        description: ""
    });
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    function validate() {
        const newErrors: Record<string, string> = {};
        if (!form.class_name.trim()) newErrors.class_name = "Class name is required";
        if (!form.teacher_id.trim()) newErrors.teacher_id = "Teacher assignment is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!validate()) return;
        setSaving(true);
        await onCreate(form);
        setForm({
            class_name: "",
            teacher_id: "",
            section: "",
            timing: "",
            room_number: "",
            capacity: 40,
            description: ""
        });
        setSaving(false);
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: spacing.lg }}>
            <FormSection title="Class Details" description="Create a new class for your school" columns={2}>
                <FormGroup label="Class Name" required error={errors.class_name}>
                    <Input
                        placeholder="e.g., Class 10-A"
                        value={form.class_name}
                        onChange={(e) => setForm({ ...form, class_name: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Assigned Teacher" required error={errors.teacher_id}>
                    <Input
                        placeholder="Select teacher"
                        value={form.teacher_id}
                        onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Section">
                    <Input
                        placeholder="e.g., A, B, C"
                        value={form.section}
                        onChange={(e) => setForm({ ...form, section: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Timing">
                    <Input
                        placeholder="e.g., 9:00 AM - 12:30 PM"
                        value={form.timing}
                        onChange={(e) => setForm({ ...form, timing: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Room Number">
                    <Input
                        placeholder="e.g., Room 101"
                        value={form.room_number}
                        onChange={(e) => setForm({ ...form, room_number: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Capacity">
                    <Input
                        placeholder="e.g., 40"
                        type="number"
                        min="1"
                        value={form.capacity}
                        onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 40 })}
                    />
                </FormGroup>

                <FormGroup label="Description">
                    <Input
                        placeholder="Add description or notes"
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
                {saving ? "Creating..." : "Create Class"}
            </Button>
        </form>
    );
}
