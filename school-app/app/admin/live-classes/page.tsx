"use client";

import Link from "next/link";
import { SchoolShell } from "../../../layouts/SchoolShell";
import { LiveClassList } from "../../../components/live-classes/LiveClassList";

export default function AdminLiveClassesPage() {
  return (
    <SchoolShell title="Live Classes Oversight" eyebrow="Admin">
      <div className="space-y-8">
        <section className="rounded-[2rem] bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Administration</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">Live Classes Monitor</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
                Monitor all ongoing, scheduled, and completed live classes across the entire school.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.4fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">All Live Classes</h2>
                <p className="mt-1 text-sm text-slate-500">Global view of school-wide online sessions.</p>
              </div>
            </div>

            {/* Using the component with ADMIN role allows viewing all classes and status management if needed */}
            <LiveClassList role="ADMIN" />
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Quick Links</h2>
              <div className="mt-5 space-y-3">
                <Link
                    href="/admin/classes"
                    className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <span>Manage Classes</span>
                    <span className="material-symbols-outlined text-slate-400">class</span>
                </Link>
                <Link
                    href="/admin/teachers"
                    className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <span>Manage Teachers</span>
                    <span className="material-symbols-outlined text-slate-400">group</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SchoolShell>
  );
}
