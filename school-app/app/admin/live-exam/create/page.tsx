"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SchoolShell } from "../../../../layouts/SchoolShell";
import Link from "next/link";

export default function CreateLiveExamPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    class_id: "",
    subject_id: "",
    duration: 60,
    total_marks: 100,
    passing_marks: 40,
    start_time: "",
    end_time: "",
    randomize_questions: false,
    randomize_options: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFormData = async () => {
        try {
            const [classesRes, subjectsRes] = await Promise.all([
                fetch("/api/school/my-classes"),
                fetch("/api/school/subjects")
            ]);

            if (classesRes.ok) {
                const data = await classesRes.json();
                setClasses(data.classes || []);
            }
            if (subjectsRes.ok) {
                const data = await subjectsRes.json();
                setSubjects(data.data || []);
            }
        } catch (e) {
            console.error("Failed to load form data", e);
        }
    };
    fetchFormData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/live-exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...formData,
            duration: Number(formData.duration),
            total_marks: Number(formData.total_marks),
            passing_marks: Number(formData.passing_marks),
        }),
      });
      const result = await res.json();
      if (result.ok) {
        router.push("/admin/live-exam");
      } else {
        alert(`Error: ${result.error.message || "Failed to create exam"}`);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SchoolShell title="Schedule Live Exam" eyebrow="Admin">
      <div className="mx-auto max-w-4xl space-y-6 pb-12">
        <div className="flex items-center gap-4">
          <Link href="/admin/live-exam" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Schedule New Exam</h1>
            <p className="text-sm text-slate-500 font-medium">Create a new live examination session.</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700" htmlFor="title">Exam Title</label>
              <input
                id="title"
                type="text"
                required
                placeholder="e.g. Mid-Term Mathematics 2024"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-600/5"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700" htmlFor="class_id">Class</label>
                <select
                  id="class_id"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-600/5"
                  value={formData.class_id}
                  onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                >
                  <option value="">Select Class...</option>
                  {classes.map(c => <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700" htmlFor="subject_id">Subject</label>
                <select
                  id="subject_id"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-600/5"
                  value={formData.subject_id}
                  onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                >
                  <option value="">Select Subject...</option>
                  {subjects.map(s => <option key={s.id || s._id} value={s.id || s._id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700" htmlFor="duration">Duration (Min)</label>
                <input
                  id="duration"
                  type="number"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-600/5"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700" htmlFor="total_marks">Total Marks</label>
                <input
                  id="total_marks"
                  type="number"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-600/5"
                  value={formData.total_marks}
                  onChange={(e) => setFormData({ ...formData, total_marks: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700" htmlFor="passing_marks">Passing Marks</label>
                <input
                  id="passing_marks"
                  type="number"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-600/5"
                  value={formData.passing_marks}
                  onChange={(e) => setFormData({ ...formData, passing_marks: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700" htmlFor="start_time">Start Time</label>
                <input
                  id="start_time"
                  type="datetime-local"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-600/5"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700" htmlFor="end_time">End Time</label>
                <input
                  id="end_time"
                  type="datetime-local"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-600/5"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-8 pt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                  <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                      checked={formData.randomize_questions}
                      onChange={(e) => setFormData({ ...formData, randomize_questions: e.target.checked })}
                  />
                  <span className="text-sm font-medium text-slate-700">Randomize Questions</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                  <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                      checked={formData.randomize_options}
                      onChange={(e) => setFormData({ ...formData, randomize_options: e.target.checked })}
                  />
                  <span className="text-sm font-medium text-slate-700">Randomize Options</span>
              </label>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
              <Link href="/admin/live-exam" className="rounded-xl px-6 py-3 font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
                Cancel
              </Link>
              <button type="submit" disabled={loading} className="rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition-all">
                {loading ? "Scheduling..." : "Create Exam"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </SchoolShell>
  );
}
