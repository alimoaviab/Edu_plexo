"use client";

import { useState } from "react";
import { useBehavior } from "../hooks/useBehavior";
import { useStudents } from "../../students/hooks/useStudents";
import { useClasses } from "../../classes/hooks/useClasses";
import { BehaviorRecordRow, BehaviorFormInput } from "../types/behavior.types";
import BehaviorForm from "./BehaviorForm";
import { showToast } from "../../../utils/toast";

export default function BehaviorListPage() {
  const { state, addBehavior, updateBehavior, deleteBehavior } = useBehavior();
  const { state: studentState } = useStudents();
  const { state: classState } = useClasses();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BehaviorRecordRow | null>(null);

  const handleSubmit = async (data: BehaviorFormInput) => {
    if (editing) {
      await updateBehavior(editing._id, data);
    } else {
      await addBehavior(data);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleEdit = (record: BehaviorRecordRow) => {
    setEditing(record);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this behavior record?")) return;
    await deleteBehavior(id);
  };

  const students = studentState.data?.map(s => ({ _id: s._id, name: s.name })) ?? [];
  const classes = classState.data?.map(c => ({ _id: c._id, name: c.name })) ?? [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Behavior Records</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Record
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            {editing ? "Edit Behavior Record" : "New Behavior Record"}
          </h2>
          <BehaviorForm
            initial={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => { setShowForm(false); setEditing(null); }}
            students={students}
            classes={classes}
          />
        </div>
      )}

      {state.loading && <p>Loading...</p>}
      {state.error && <p className="text-red-600">{state.error}</p>}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Class</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Severity</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Warnings</th>
              <th className="px-4 py-3 text-left">Parent Notified</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.data?.map(record => (
              <tr key={record._id} className="border-t">
                <td className="px-4 py-3">{record.student_name}</td>
                <td className="px-4 py-3">{record.class_name}</td>
                <td className="px-4 py-3 capitalize">{record.incident_type.replace("_", " ")}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    record.severity === "critical" ? "bg-red-100 text-red-800" :
                    record.severity === "major" ? "bg-orange-100 text-orange-800" :
                    record.severity === "moderate" ? "bg-yellow-100 text-yellow-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {record.severity}
                  </span>
                </td>
                <td className="px-4 py-3 capitalize">{record.status.replace("_", " ")}</td>
                <td className="px-4 py-3">{record.warning_count}</td>
                <td className="px-4 py-3">{record.parent_notified ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => handleEdit(record)} className="text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(record._id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
