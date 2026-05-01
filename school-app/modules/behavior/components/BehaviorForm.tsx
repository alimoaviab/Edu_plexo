"use client";

import { useState } from "react";
import { BehaviorFormInput } from "../types/behavior.types";

interface Props {
  initial?: Partial<BehaviorFormInput>;
  onSubmit: (data: BehaviorFormInput) => void;
  onCancel: () => void;
  students: { _id: string; name: string }[];
  classes: { _id: string; name: string }[];
}

export default function BehaviorForm({ initial, onSubmit, onCancel, students, classes }: Props) {
  const [form, setForm] = useState<BehaviorFormInput>({
    student_id: initial?.student_id ?? "",
    class_id: initial?.class_id ?? "",
    incident_type: initial?.incident_type ?? "conduct",
    severity: initial?.severity ?? "minor",
    description: initial?.description ?? "",
    action_taken: initial?.action_taken ?? "",
    status: initial?.status ?? "open",
    warning_count: initial?.warning_count ?? 1,
    parent_notified: initial?.parent_notified ?? false,
    notes: initial?.notes ?? ""
  });

  const handleChange = (field: keyof BehaviorFormInput, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Student</label>
          <select
            value={form.student_id}
            onChange={e => handleChange("student_id", e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select Student</option>
            {students.map(s => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Class</label>
          <select
            value={form.class_id}
            onChange={e => handleChange("class_id", e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select Class</option>
            {classes.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Incident Type</label>
          <select
            value={form.incident_type}
            onChange={e => handleChange("incident_type", e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="attendance">Attendance</option>
            <option value="conduct">Conduct</option>
            <option value="academic_dishonesty">Academic Dishonesty</option>
            <option value="bullying">Bullying</option>
            <option value="vandalism">Vandalism</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Severity</label>
          <select
            value={form.severity}
            onChange={e => handleChange("severity", e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="minor">Minor</option>
            <option value="moderate">Moderate</option>
            <option value="major">Major</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={e => handleChange("description", e.target.value)}
          className="w-full border rounded px-3 py-2"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Action Taken</label>
        <input
          type="text"
          value={form.action_taken}
          onChange={e => handleChange("action_taken", e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={form.status}
            onChange={e => handleChange("status", e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="open">Open</option>
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
            <option value="escalated">Escalated</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Warning Count</label>
          <input
            type="number"
            min={1}
            value={form.warning_count}
            onChange={e => handleChange("warning_count", parseInt(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="flex items-center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.parent_notified}
              onChange={e => handleChange("parent_notified", e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium">Parent Notified</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          value={form.notes}
          onChange={e => handleChange("notes", e.target.value)}
          className="w-full border rounded px-3 py-2"
          rows={2}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          {initial ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
