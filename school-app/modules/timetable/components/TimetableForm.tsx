"use client";

import { FormEvent, useState } from "react";
import { Button, Input, Select } from "../../../components/ui";
import { TimetableFormInput, DayOfWeek } from "../types/timetable.types";

const DAYS: { label: DayOfWeek; value: DayOfWeek }[] = [
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
  { label: "Sunday", value: "Sunday" },
];

export function TimetableForm({
  onCreate,
  classOptions = [],
  teacherOptions = [],
  subjectOptions = []
}: {
  onCreate: (input: TimetableFormInput) => Promise<unknown>;
  classOptions?: Array<{ id: string; label: string }>;
  teacherOptions?: Array<{ id: string; label: string }>;
  subjectOptions?: Array<{ id: string; label: string }>;
}) {
  const [form, setForm] = useState<TimetableFormInput>({
    class_id: "",
    teacher_id: "",
    subject_id: "",
    day: "Monday",
    start_time: "08:00",
    end_time: "09:00",
    room: ""
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!form.class_id) newErrors.class_id = "Class is required";
    if (!form.teacher_id) newErrors.teacher_id = "Teacher is required";
    if (!form.subject_id) newErrors.subject_id = "Subject is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const result = (await onCreate(form)) as { success?: boolean } | undefined;
      if (result?.success !== false) {
        setForm({
          class_id: "",
          teacher_id: "",
          subject_id: "",
          day: "Monday",
          start_time: "08:00",
          end_time: "09:00",
          room: ""
        });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Class"
          value={form.class_id}
          onChange={(e) => setForm({ ...form, class_id: e.target.value })}
          options={[{ label: "Select class", value: "" }, ...classOptions.map(o => ({ label: o.label, value: o.id }))]}
          error={errors.class_id}
          required
        />
        <Select
          label="Teacher"
          value={form.teacher_id}
          onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}
          options={[{ label: "Select teacher", value: "" }, ...teacherOptions.map(o => ({ label: o.label, value: o.id }))]}
          error={errors.teacher_id}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Subject"
          value={form.subject_id}
          onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
          options={[{ label: "Select subject", value: "" }, ...subjectOptions.map(o => ({ label: o.label, value: o.id }))]}
          error={errors.subject_id}
          required
        />
        <Select
          label="Day"
          value={form.day}
          onChange={(e) => setForm({ ...form, day: e.target.value as DayOfWeek })}
          options={DAYS.map(d => ({ label: d.label, value: d.value }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Start Time"
          type="time"
          value={form.start_time}
          onChange={(e) => setForm({ ...form, start_time: e.target.value })}
          required
        />
        <Input
          label="End Time"
          type="time"
          value={form.end_time}
          onChange={(e) => setForm({ ...form, end_time: e.target.value })}
          required
        />
      </div>

      <Input
        label="Room"
        placeholder="Enter room number"
        value={form.room || ""}
        onChange={(e) => setForm({ ...form, room: e.target.value })}
      />

      <div className="flex justify-end pt-4 border-t border-border">
        <Button type="submit" disabled={saving} className="w-full md:w-auto min-w-[150px]">
          {saving ? "Creating..." : "Create Timetable Entry"}
        </Button>
      </div>
    </form>
  );
}
