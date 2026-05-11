"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SchoolShell } from "../../../layouts/SchoolShell";
import { LiveExamList } from "../../../components/live-exams/LiveExamList";

export default function LiveExamPage() {
    const [listKey, setListKey] = useState(0);

    return (
        <SchoolShell title="Live Exams" eyebrow="Admin">
            <div className="space-y-8">
                <section className="rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-900 p-8 text-white shadow-2xl shadow-slate-950/20">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-200/80">School-wide exam management</p>
                            <h1 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">Admin Live Exam Console</h1>
                            <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">
                                Monitor all ongoing examinations across the school, manage schedules, and review student performance in real-time.
                            </p>
                        </div>
                        <Link
                            href="/admin/live-exam/create"
                            className="rounded-2xl bg-white px-6 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-white/10 transition hover:bg-slate-100"
                        >
                            Schedule New Exam
                        </Link>
                    </div>
                </section>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-sm">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Active Exams</h3>
                        <p className="mt-3 text-3xl font-black text-sky-700">-</p>
                        <p className="mt-4 text-sm text-slate-500">Exams currently in progress.</p>
                    </div>
                    <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-sm">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Scheduled Today</h3>
                        <p className="mt-3 text-3xl font-black text-emerald-700">-</p>
                        <p className="mt-4 text-sm text-slate-500">Exams set for today's sessions.</p>
                    </div>
                    <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-sm">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Total Participants</h3>
                        <p className="mt-3 text-3xl font-black text-violet-700">-</p>
                        <p className="mt-4 text-sm text-slate-500">Students registered for exams.</p>
                    </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">All live exams</h2>
                            <p className="mt-1 text-sm text-slate-500">Manage all examination sessions from one place.</p>
                        </div>
                        <button
                            onClick={() => setListKey((prev) => prev + 1)}
                            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Refresh
                        </button>
                    </div>

                    <LiveExamList key={listKey} role="ADMIN" />
                </div>
            </div>
        </SchoolShell>
    );
}