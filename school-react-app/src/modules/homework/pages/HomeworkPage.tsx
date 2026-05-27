import { AppIcon } from "shared/ui/AppIcon";
/**
 * /admin/homework — Homework dashboard page.
 *
 * Layout (matches the timetable dashboard pattern):
 *   1. Toolbar (search, status filter, "New Assignment" CTA)
 *   2. 4-up summary stat tiles (total, pending, overdue, completed)
 *   3. Assignment cards grid (compact, status-aware, responsive)
 *   4. Proper empty state with onboarding CTA
 *
 * Uses serviceRequest (not raw fetch) so JWT + academic-year headers
 * are always attached.
 */

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { StatCardCompact, Skeleton, DataState, ConfirmModal, EntityCard, EntityGrid } from "@/components/ui";
import { serviceRequest } from "@/services/service-client";
import { showToast } from "@/utils/toast";
import { bindRefresh } from "@/services/data-bus";

interface HomeworkPageProps {
  role: "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";
  studentId?: string;
}

type StatusFilter = "all" | "assigned" | "draft" | "closed";

export function HomeworkPage({ role, studentId }: HomeworkPageProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [pendingDelete, setPendingDelete] = useState<any>(null);
  
  // Drawer state for parent/student details
  const [selectedHw, setSelectedHw] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Track whether we've done the initial load. After that, refetches
  // keep existing data visible (no skeleton flash).
  const hasLoadedOnce = useRef(false);

  const fetchHomeworks = useCallback(async () => {
    if (!hasLoadedOnce.current) {
      setLoading(true);
    }
    try {
      const url =
        role === "PARENT" && studentId
          ? `/api/parent/child/homework?student_id=${studentId}`
          : studentId
            ? `/api/homework?student_id=${studentId}`
            : "/api/homework";

      const res = await serviceRequest<any>(url);
      if (res.ok && res.data) {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.homework_list || res.data.data || [];
        setHomeworks(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("[HomeworkPage] fetch error:", error);
    } finally {
      setLoading(false);
      hasLoadedOnce.current = true;
    }
  }, [role, studentId]);

  useEffect(() => {
    fetchHomeworks();
    return bindRefresh("homework", fetchHomeworks);
  }, [fetchHomeworks]);

  // Fetch homework details on card click (for parent / student drawer)
  const handleOpenDetail = useCallback(async (hw: any) => {
    setIsDrawerOpen(true);
    setDetailLoading(true);
    setSelectedHw(null);
    try {
      const id = hw._id || hw.id;
      const res = await serviceRequest<any>(`/api/homework/${id}`);
      if (res.ok && res.data) {
        setSelectedHw(res.data);
      } else {
        showToast("Failed to load homework details.", "error");
        setIsDrawerOpen(false);
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to load homework details.", "error");
      setIsDrawerOpen(false);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  // ─── Derived data ──────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let list = homeworks;
    if (statusFilter !== "all") {
      list = list.filter((hw) => hw.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (hw) =>
          hw.title?.toLowerCase().includes(q) ||
          hw.subject_name?.toLowerCase().includes(q) ||
          hw.subject?.toLowerCase().includes(q) ||
          hw.class_name?.toLowerCase().includes(q) ||
          hw.teacher_name?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [homeworks, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = homeworks.length;
    const assigned = homeworks.filter((h) => h.status === "assigned").length;
    const draft = homeworks.filter((h) => h.status === "draft").length;
    const closed = homeworks.filter((h) => h.status === "closed").length;
    const now = new Date();
    const overdue = homeworks.filter((h) => {
      if (h.status !== "assigned") return false;
      const due = new Date(h.due_at || h.due_date);
      return due < now;
    }).length;
    return { total, assigned, draft, closed, overdue };
  }, [homeworks]);

  // ─── Actions ───────────────────────────────────────────────────────────

  const canCreate = role === "ADMIN" || role === "TEACHER";
  const createPath = role === "ADMIN" ? "/admin/homework/create" : "/teacher/homework/create";
  const basePath =
    role === "ADMIN"
      ? "/admin/homework"
      : role === "TEACHER"
        ? "/teacher/homework"
        : role === "PARENT"
          ? "/parent/homework"
          : "/student/homework";

  async function handleDelete() {
    if (!pendingDelete) return;
    const id = pendingDelete._id || pendingDelete.id;
    const res = await serviceRequest<any>(`/api/homework/${id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Assignment deleted.", "success");
      fetchHomeworks();
    } else {
      showToast(res.error?.message || "Failed to delete.", "error");
    }
    setPendingDelete(null);
  }

  function formatDate(value?: string) {
    if (!value) return "—";
    try {
      return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return value;
    }
  }

  function isOverdue(hw: any): boolean {
    if (hw.status !== "assigned") return false;
    const due = new Date(hw.due_at || hw.due_date);
    return due < new Date();
  }

  // Helper: subject style tags
  function getSubjectColors(subjectName: string) {
    const name = (subjectName || "").toLowerCase();
    if (name.includes("math") || name.includes("calc") || name.includes("algebra")) {
      return {
        bg: "bg-indigo-50/60 border-indigo-100",
        text: "text-indigo-700",
        badge: "bg-indigo-100/80 text-indigo-800",
        gradient: "from-indigo-500 to-purple-600",
        iconColor: "text-indigo-500",
      };
    }
    if (name.includes("science") || name.includes("phys") || name.includes("chem") || name.includes("bio")) {
      return {
        bg: "bg-emerald-50/60 border-emerald-100",
        text: "text-emerald-700",
        badge: "bg-emerald-100/80 text-emerald-800",
        gradient: "from-emerald-500 to-teal-600",
        iconColor: "text-emerald-500",
      };
    }
    if (name.includes("history") || name.includes("social") || name.includes("geo")) {
      return {
        bg: "bg-amber-50/60 border-amber-100",
        text: "text-amber-700",
        badge: "bg-amber-100/80 text-amber-800",
        gradient: "from-amber-500 to-orange-600",
        iconColor: "text-amber-500",
      };
    }
    if (name.includes("english") || name.includes("lit") || name.includes("lang")) {
      return {
        bg: "bg-sky-50/60 border-sky-100",
        text: "text-sky-700",
        badge: "bg-sky-100/80 text-sky-800",
        gradient: "from-sky-500 to-blue-600",
        iconColor: "text-sky-500",
      };
    }
    if (name.includes("art") || name.includes("music") || name.includes("design")) {
      return {
        bg: "bg-rose-50/60 border-rose-100",
        text: "text-rose-700",
        badge: "bg-rose-100/80 text-rose-800",
        gradient: "from-rose-500 to-pink-600",
        iconColor: "text-rose-500",
      };
    }
    return {
      bg: "bg-slate-50 border-slate-100",
      text: "text-slate-700",
      badge: "bg-slate-100 text-slate-800",
      gradient: "from-slate-500 to-slate-700",
      iconColor: "text-slate-500",
    };
  }

  // Helper: countdown
  function getDueCountdown(dueDateStr: string) {
    const now = new Date();
    const due = new Date(dueDateStr);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      const daysAgo = Math.abs(diffDays);
      return {
        text: `Overdue by ${daysAgo} day${daysAgo > 1 ? "s" : ""}`,
        isOverdue: true,
        color: "text-rose-600 font-semibold",
      };
    } else if (diffDays === 0) {
      return {
        text: "Due today",
        isOverdue: false,
        color: "text-amber-600 font-semibold animate-pulse",
      };
    } else if (diffDays === 1) {
      return {
        text: "Due tomorrow",
        isOverdue: false,
        color: "text-amber-600 font-semibold",
      };
    } else {
      return {
        text: `${diffDays} days left`,
        isOverdue: false,
        color: "text-slate-500 font-medium",
      };
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 pb-12">
      {/* ─── Summary Stats ────────────────────────────────────────────── */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCardCompact
            label="Total Assignments"
            value={stats.total}
            icon="assignment"
            accent="blue"
          />
          <StatCardCompact
            label="Active / Pending"
            value={stats.assigned}
            icon="pending_actions"
            accent="purple"
            hint={stats.overdue > 0 ? `${stats.overdue} overdue` : "All on track"}
          />
          <StatCardCompact
            label="Drafts"
            value={stats.draft}
            icon="edit_note"
            accent="amber"
            hint="Not yet published"
          />
          <StatCardCompact
            label="Completed"
            value={stats.closed}
            icon="task_alt"
            accent="emerald"
            hint="Closed assignments"
          />
        </div>
      )}

      {/* ─── Toolbar ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white/80 backdrop-blur-md rounded-xl border border-slate-200/80 px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shrink-0 shadow-sm shadow-blue-600/15">
            <AppIcon name="FileText" size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 normal-case truncate">
              Assignments · {stats.total} total
            </p>
            <p className="text-[13px] font-bold text-slate-900 tracking-tight">
              Homework Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <AppIcon name="Search" size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search…"
              className="h-8 w-[180px] rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-[12px] font-medium text-slate-700 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 placeholder:text-slate-400"
            />
          </div>

          {/* Status filter */}
          <div className="inline-flex items-center bg-slate-50 rounded-lg border border-slate-200 p-0.5">
            {(["all", "assigned", "draft", "closed"] as StatusFilter[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`h-7 px-2.5 rounded-md text-[11px] font-bold transition-colors capitalize ${statusFilter === s
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Create CTA */}
          {canCreate && (
            <button
              type="button"
              onClick={() => navigate(createPath)}
              className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-blue-600 text-white text-[12px] font-bold shadow-sm shadow-blue-600/15 hover:bg-blue-700 transition-colors active:scale-[0.98]"
            >
              <AppIcon name="Plus" size={16} />
              New assignment
            </button>
          )}
        </div>
      </div>

      {/* ─── Loading ──────────────────────────────────────────────────── */}
      {loading && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[160px] w-full rounded-2xl" />
            ))}
          </div>
        </div>
      )}

      {/* ─── Empty State ──────────────────────────────────────────────── */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px]">
            <div className="px-6 py-10 md:px-8 md:py-12 flex flex-col justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-5 shadow-sm">
                <AppIcon name="FileText" size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {searchQuery || statusFilter !== "all"
                  ? "No assignments match your filters"
                  : "No homework assigned yet"}
              </h3>
              <p className="mt-2 text-[13px] leading-6 text-slate-500 max-w-xl font-medium">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or status filter to find what you're looking for."
                  : role === "PARENT"
                    ? "Teachers have not published homework for your class yet."
                    : "Create your first assignment and it will appear here. Students see it in their portal immediately."}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                {canCreate && !searchQuery && statusFilter === "all" && (
                  <button
                    type="button"
                    onClick={() => navigate(createPath)}
                    className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-blue-600 text-white text-[12px] font-bold shadow-sm shadow-blue-600/15 hover:bg-blue-700 transition-colors active:scale-[0.98]"
                  >
                    <AppIcon name="Plus" size={16} />
                    Create first assignment
                  </button>
                )}
                {(searchQuery || statusFilter !== "all") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                    className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-slate-200 bg-white text-[12px] font-bold text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-colors"
                  >
                    <AppIcon name="FilterX" size={16} />
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* Side guidance */}
            <div className="border-t lg:border-t-0 lg:border-l border-slate-100 bg-slate-50/40 px-6 py-8 flex flex-col justify-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Quick tips</p>
              <ul className="space-y-3.5">
                {[
                  { icon: "school", text: "Pick a class and subject" },
                  { icon: "calendar_today", text: "Set a due date" },
                  { icon: "person", text: "Assign a teacher" },
                  { icon: "send", text: "Publish — students see it instantly" },
                ].map((tip) => (
                  <li key={tip.icon} className="flex items-start gap-2.5">
                    <AppIcon name={tip.icon} size={16} className="text-blue-500 mt-0.5" />
                    <span className="text-[12px] font-semibold text-slate-600">{tip.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ─── Assignment Cards Grid ────────────────────────────────────── */}
      {!loading && filtered.length > 0 && (
        role === "PARENT" || role === "STUDENT" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((hw) => {
              const id = hw._id || hw.id;
              const overdue = isOverdue(hw);
              const colors = getSubjectColors(hw.subject_name || hw.subject);
              const countdown = getDueCountdown(hw.due_at || hw.due_date);
              
              // Try to find submission status
              let subStatus = "pending";
              if (hw.my_submission) {
                subStatus = hw.my_submission.status;
              } else if (hw.submissions && Array.isArray(hw.submissions)) {
                const activeStudentId = studentId || hw.student_id;
                const match = hw.submissions.find((s: any) => s.student_id === activeStudentId);
                if (match) subStatus = match.status;
              }

              // Color codes for status pills
              let statusBadgeClass = "bg-yellow-50 text-yellow-700 border-yellow-100";
              let statusLabel = "Pending";
              if (subStatus === "submitted") {
                statusBadgeClass = "bg-green-50 text-green-700 border-green-100";
                statusLabel = "Submitted";
              } else if (subStatus === "graded") {
                statusBadgeClass = "bg-blue-50 text-blue-700 border-blue-100";
                statusLabel = "Graded";
              } else if (overdue) {
                statusBadgeClass = "bg-rose-50 text-rose-700 border-rose-100";
                statusLabel = "Overdue";
              }

              return (
                <div
                  key={id}
                  onClick={() => handleOpenDetail(hw)}
                  className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 cursor-pointer overflow-hidden"
                >
                  {/* Accent Top Bar */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${colors.gradient}`} />

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    {/* Header: Subject Badge + Status Pill */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${colors.badge}`}>
                        {hw.subject_name || hw.subject || "General"}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadgeClass}`}>
                        {statusLabel}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h4 className="text-[14px] font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                        {hw.title}
                      </h4>
                    </div>

                    {/* Details: Due Date + Instructor */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="h-6 w-6 rounded-full bg-slate-100 border border-slate-200/60 flex items-center justify-center font-bold text-slate-600 shrink-0 text-[10px]">
                          {(hw.teacher_name || "T").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-slate-500 font-semibold truncate">
                          {hw.teacher_name || "Instructor"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <AppIcon name="Clock" size={12} className={countdown.isOverdue ? "text-rose-500" : "text-slate-400"} />
                        <span className={countdown.color}>
                          {countdown.text}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EntityGrid>
            {filtered.map((hw) => {
              const id = hw._id || hw.id;
              const overdue = isOverdue(hw);
              const accent: "rose" | "blue" | "amber" | "emerald" = overdue
                ? "rose"
                : hw.status === "draft"
                  ? "amber"
                  : hw.status === "closed"
                    ? "emerald"
                    : "blue";
              const statusLabel = overdue ? "Overdue" : hw.status || "assigned";

              return (
                <EntityCard
                  key={id}
                  icon="assignment"
                  accent={accent}
                  title={hw.title}
                  subtitle={hw.subject_name || hw.subject}
                  status={{ label: statusLabel, accent }}
                  hoverActions={[
                    ...(canCreate
                      ? [{
                          label: "View submissions",
                          icon: "visibility",
                          onClick: () => navigate(`${basePath}/${id}/review`),
                          accent: "blue" as const,
                        }]
                      : [{
                          label: "Open",
                          icon: "visibility",
                          onClick: () => navigate(`${basePath}/${id}`),
                          accent: "blue" as const,
                        }]),
                    ...(canCreate
                      ? ([
                          {
                            label: "Edit",
                            icon: "edit",
                            onClick: () =>
                              navigate(
                                `${role === "ADMIN" ? "/admin" : "/teacher"}/homework/edit/${id}`
                              ),
                            accent: "blue" as const,
                          },
                          {
                            label: "Delete",
                            icon: "delete",
                            onClick: () => setPendingDelete(hw),
                            accent: "rose" as const,
                          },
                        ])
                      : []),
                  ]}
                  metrics={[
                    { label: "Class", value: hw.class_name || "—" },
                    { label: "Due", value: formatDate(hw.due_at || hw.due_date) },
                  ]}
                  context={{
                    label: hw.teacher_name || "Instructor",
                    icon: (
                      <div className="h-6 w-6 rounded-md bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                        {(hw.teacher_name || "T").charAt(0).toUpperCase()}
                      </div>
                    ),
                    to: `${basePath}/${id}`,
                  }}
                  actions={[
                    {
                      label: "Open",
                      icon: "visibility",
                      to: `${basePath}/${id}`,
                      accent: "blue",
                      primary: true,
                    },
                  ]}
                />
              );
            })}
          </EntityGrid>
        )
      )}

      {/* ─── Details Slide Drawer ────────────────────────────────────── */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40"
            />

            {/* Slide drawer panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-slate-50 shadow-2xl z-50 flex flex-col border-l border-slate-200 overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                    <AppIcon name="FileText" size={16} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-slate-900">Homework Details</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Assignment View
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="h-8 w-8 rounded-full border border-slate-200 hover:border-slate-300 bg-white flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all active:scale-95"
                >
                  <AppIcon name="X" size={16} />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {detailLoading ? (
                  // Detail Loader Shimmer
                  <div className="space-y-5">
                    <Skeleton className="h-6 w-1/3 rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <Skeleton className="h-32 w-full rounded-2xl" />
                    <Skeleton className="h-20 w-full rounded-xl" />
                  </div>
                ) : selectedHw ? (
                  <>
                    {/* General Summary */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${getSubjectColors(selectedHw.subject_name || selectedHw.subject).badge}`}>
                          {selectedHw.subject_name || selectedHw.subject || "General"}
                        </span>
                        <span className="text-[12px] font-semibold text-slate-500">
                          Due: {formatDate(selectedHw.due_at || selectedHw.due_date)}
                        </span>
                      </div>
                      <h2 className="text-base font-bold text-slate-900 leading-snug">
                        {selectedHw.title}
                      </h2>
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-[12px]">
                        <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200/60 shrink-0">
                          {(selectedHw.teacher_name || "T").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{selectedHw.teacher_name || "Teacher"}</p>
                          <p className="text-[10px] font-medium text-slate-400">Assigned Instructor</p>
                        </div>
                      </div>
                    </div>

                    {/* Instructions Section */}
                    <div className="space-y-2">
                      <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Instructions</h4>
                      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                        <p className="text-[13px] leading-6 text-slate-600 whitespace-pre-wrap font-medium">
                          {selectedHw.instructions || "No specific instructions provided by the instructor."}
                        </p>
                      </div>
                    </div>

                    {/* Attachments Section */}
                    {selectedHw.attachments && selectedHw.attachments.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Attachments</h4>
                        <div className="space-y-2">
                          {selectedHw.attachments.map((url: string, index: number) => {
                            const fileName = url.substring(url.lastIndexOf("/") + 1) || `attachment_${index + 1}`;
                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-[0_2px_6px_rgba(0,0,0,0.01)] hover:border-slate-300 transition-colors"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                                    <AppIcon name="FileText" size={16} />
                                  </div>
                                  <span className="text-[12px] font-bold text-slate-700 truncate max-w-[240px]">
                                    {fileName}
                                  </span>
                                </div>
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="h-8 px-3 rounded-lg border border-slate-200 hover:border-slate-300 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-sm"
                                >
                                  <AppIcon name="Download" size={13} />
                                  Download
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Submission / Evaluation Timeline */}
                    <div className="space-y-3">
                      <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Submission Timeline</h4>
                      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-6">
                        
                        {/* Milestone 1: Assigned */}
                        <div className="flex gap-4 relative">
                          <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-emerald-500" />
                          <div className="h-6 w-6 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 font-bold text-[10px] z-10">
                            ✓
                          </div>
                          <div>
                            <p className="text-[12px] font-bold text-slate-800">Assignment Published</p>
                            <p className="text-[11px] font-medium text-slate-400">Visible on dashboard</p>
                          </div>
                        </div>

                        {/* Milestone 2: Submitted */}
                        {selectedHw.my_submission ? (
                          <div className="flex gap-4 relative">
                            {selectedHw.my_submission.status === "graded" && (
                              <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-emerald-500" />
                            )}
                            <div className="h-6 w-6 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 font-bold text-[10px] z-10">
                              ✓
                            </div>
                            <div>
                              <p className="text-[12px] font-bold text-slate-800">Submitted by Student</p>
                              {selectedHw.my_submission.submitted_at && (
                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                  {formatDate(selectedHw.my_submission.submitted_at)}
                                </p>
                              )}
                              {selectedHw.my_submission.attachment_urls && selectedHw.my_submission.attachment_urls.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {selectedHw.my_submission.attachment_urls.map((surl: string, si: number) => (
                                    <div key={si} className="text-[11px] font-medium text-blue-600 truncate">
                                      🔗 Student_Upload_{si + 1}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-4 relative">
                            <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center shrink-0 font-bold text-[10px] z-10">
                              2
                            </div>
                            <div>
                              <p className="text-[12px] font-bold text-slate-500">Awaiting Submission</p>
                              <p className="text-[11px] font-medium text-slate-400">Student has not submitted files yet</p>
                            </div>
                          </div>
                        )}

                        {/* Milestone 3: Graded / Evaluation */}
                        {selectedHw.my_submission && selectedHw.my_submission.status === "graded" ? (
                          <div className="flex gap-4">
                            <div className="h-6 w-6 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0 font-bold text-[10px] z-10">
                              ✓
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="text-[12px] font-bold text-slate-800">Evaluated & Graded</p>
                                {selectedHw.my_submission.marks !== null && (
                                  <span className="bg-blue-50 text-blue-700 font-bold text-[11px] px-2 py-0.5 rounded border border-blue-100">
                                    Marks: {selectedHw.my_submission.marks}
                                  </span>
                                )}
                              </div>
                              {selectedHw.my_submission.feedback && (
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mt-1">
                                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Teacher Feedback</p>
                                  <p className="text-[12px] italic text-slate-600 font-medium leading-relaxed">
                                    "{selectedHw.my_submission.feedback}"
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-4">
                            <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center shrink-0 font-bold text-[10px] z-10">
                              3
                            </div>
                            <div>
                              <p className="text-[12px] font-bold text-slate-500">Grading & Feedback</p>
                              <p className="text-[11px] font-medium text-slate-400">Awaiting evaluation by teacher</p>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-slate-500 font-medium">Failed to retrieve data.</div>
                )}
              </div>

              {/* Drawer Sticky Footer Actions */}
              <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-end shrink-0">
                {role === "PARENT" ? (
                  <p className="text-[11px] font-semibold text-slate-400 italic">
                    Parents can review this assignment in read-only mode.
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="h-9 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[12px] font-bold transition-colors"
                  >
                    Close Panel
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Delete Confirm ───────────────────────────────────────────── */}
      <ConfirmModal
        isOpen={pendingDelete !== null}
        title="Delete this assignment?"
        message={
          pendingDelete
            ? `"${pendingDelete.title}" will be permanently removed. Student submissions will be lost.`
            : ""
        }
        confirmLabel="Delete"
        confirmVariant="danger"
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
