"use client";

import { FormEvent, useState } from "react";
import { Button, Input } from "../../../components/ui";
import { FormSection, FormGroup } from "../../../components/ui/FormSection";
import { spacing, colors } from "@edu/shared/design-system/tokens";

interface HomeworkFormInput {
    title: string;
    class_id: string;
    subject: string;
    due_date: string;
    description: string;
    attachments: string;
}

export function HomeworkForm({ onCreate }: { onCreate: (input: HomeworkFormInput) => Promise<unknown> }) {
    const [form, setForm] = useState<HomeworkFormInput>({
        title: "",
        class_id: "",
        subject: "",
        due_date: "",
        description: "",
        attachments: ""
    });
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    function validate() {
        const newErrors: Record<string, string> = {};
        if (!form.title.trim()) newErrors.title = "Title is required";
        if (!form.class_id.trim()) newErrors.class_id = "Class is required";
        if (!form.subject.trim()) newErrors.subject = "Subject is required";
        if (!form.due_date) newErrors.due_date = "Due date is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!validate()) return;
        setSaving(true);
        await onCreate(form);
        setForm({
            title: "",
            class_id: "",
            subject: "",
            due_date: "",
            description: "",
            attachments: ""
        });
        setSaving(false);
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: spacing.lg }}>
            <FormSection title="Assign Homework" description="Create new homework assignment" columns={2}>
                <FormGroup label="Title" required error={errors.title}>
                    <Input
                        placeholder="e.g., Math Algebra Problems"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Class" required error={errors.class_id}>
                    <Input
                        placeholder="Select class"
                        value={form.class_id}
                        onChange={(e) => setForm({ ...form, class_id: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Subject" required error={errors.subject}>
                    <Input
                        placeholder="e.g., Mathematics"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Due Date" required error={errors.due_date}>
                    <Input
                        type="date"
                        value={form.due_date}
                        onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Description">
                    <Input
                        placeholder="Describe the homework assignment"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                </FormGroup>

                <FormGroup label="Attachments">
                    <Input
                        placeholder="Add attachment URLs or file references"
                        value={form.attachments}
                        onChange={(e) => setForm({ ...form, attachments: e.target.value })}
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
                {saving ? "Creating..." : "Assign Homework"}
            </Button>
        </form>
    );
}
