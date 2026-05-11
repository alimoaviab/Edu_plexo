"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SchoolShell } from "../../../../layouts/SchoolShell";
import Link from "next/link";

export default function CreateLiveClassPage() {
  const router = useRouter();
  
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    teacherId: "",
    classId: "",
    subjectId: "",
    startTime: "",
    endTime: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFormData = async () => {
        try {
            const [classesRes, subjectsRes, teachersRes] = await Promise.all([
                fetch("/api/school/my-classes"),
                fetch("/api/school/subjects"),
                fetch("/api/teachers")
            ]);

            if (classesRes.ok) {
                const data = await classesRes.json();
                setClasses(data.classes || []);
            }

            if (subjectsRes.ok) {
                const data = await subjectsRes.json();
                setSubjects(data.data || []);
            }

            if (teachersRes.ok) {
                const data = await teachersRes.json();
                setTeachers(data.data || []);
            }
        } catch (error) {
            console.error("Failed to load live class form data", error);
        }
    };

    loadFormData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.teacherId) {
      alert("Please select a teacher.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/live/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/teacher/live-class");
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SchoolShell title="Schedule Live Class" eyebrow="Operations Center">
      <div className="mx-auto max-w-4xl space-y-6 pb-12">
        <div className="flex items-center gap-4">
          <Link href="/teacher/live-class" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Schedule New Session</h1>
            <p className="text-sm text-slate-500 font-medium">Create a new live class via Google Meet integration.</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700" htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-600/5"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700" htmlFor="teacherId">Teacher</label>
              <select
                id="teacherId"
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-600/5"
                value={formData.teacherId}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
              >
                <option value="">Select Teacher...</option>
                {teachers.map((teacher) => {
                  const fullName = `${teacher.first_name || ""} ${teacher.last_name || ""}`.trim() || teacher.name || teacher.email || "Teacher";
                  return (
                    <option key={teacher._id} value={teacher._id}>
                      {fullName}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700" htmlFor="classId">Class</label>
                <select
                  id="classId"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-600/5"
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                >
                  <option value="">Select Class...</option>
                  {classes.map(c => <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700" htmlFor="subjectId">Subject</label>
                <select
                  id="subjectId"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-600/5"
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                >
                  <option value="">Select Subject...</option>
                  {subjects.map(s => <option key={s.id || s._id} value={s.id || s._id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700" htmlFor="startTime">Start Time</label>
                <input
                  id="startTime"
                  type="datetime-local"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-600/5"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700" htmlFor="endTime">End Time</label>
                <input
                  id="endTime"
                  type="datetime-local"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-600/5"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
              <Link href="/teacher/live-class" className="rounded-xl px-6 py-3 font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
                Cancel
              </Link>
              <button type="submit" disabled={loading} className="rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition-all">
                {loading ? "Scheduling..." : "Schedule Class"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </SchoolShell>
  );
}
