import { AppIcon } from "shared/ui/AppIcon";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLeave } from "../hooks/useLeave";
import { LeaveFormInput, LeaveRecordRow } from "../types/leave.types";
import { useSelectedChild } from "@/contexts/SelectedChildContext";
import { Button, DataState, Input, StatCardGrid } from "@/components/ui";
import { showToast } from "@/utils/toast";

const TYPE_OPTIONS: { value: LeaveFormInput["leave_type"]; label: string; icon: string }[] =
  [
    { value: "sick", label: "Sick", icon: "MedicalServices" },
    { value: "personal", label: "Personal", icon: "User" },
    { value: "family", label: "Family", icon: "Home" },
    { value: "other", label: "Other", icon: "MoreHorizontal" },
  ];

const TYPE_ACCENT: Record<string, string> = {
    sick: "bg-rose-50 text-rose-600 border-rose-100",
    personal: "bg-blue-50 text-blue-600 border-blue-100",
    family: "bg-violet-50 text-violet-600 border-violet-100",
    other: "bg-slate-50 text-slate-600 border-slate-100",
};

const STATUS_STYLE: Record<
    string,
    { label: string; pill: string; ring: string; icon: string; color: string }
> = {
    pending: {
        label: "Pending Review",
        pill: "bg-amber-50 text-amber-700 border-amber-200",
        ring: "ring-amber-200/60",
        icon: "Hourglass",
        color: "text-amber-500",
    },
    approved: {
        label: "Approved",
        pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
        ring: "ring-emerald-200/60",
        icon: "CheckCircle",
        color: "text-emerald-500",
    },
    rejected: {
        label: "Rejected",
        pill: "bg-rose-50 text-rose-700 border-rose-200",
        ring: "ring-rose-200/60",
        icon: "XCircle",
        color: "text-rose-500",
    },
    cancelled: {
        label: "Cancelled",
        pill: "bg-slate-50 text-slate-600 border-slate-200",
        ring: "ring-slate-200/60",
        icon: "MinusCircle",
        color: "text-slate-400",
    },
};

function fmtDate(s: string) {
    if (!s) return "—";
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return s;
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function daySpan(start: string, end: string): number {
    const a = new Date(start);
    const b = new Date(end);
    if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 1;
    return Math.max(1, Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)) + 1);
}

export default function ParentLeavePage() {
    const { state, addLeave, deleteLeave } = useLeave();
    const { selectedChild, children, loading: childLoading } = useSelectedChild();

    const [open, setOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<
        "all" | "pending" | "approved" | "rejected" | "cancelled"
    >("all");

    const stats = useMemo(() => {
        const rows = state.data || [];
        return {
            total: rows.length,
            pending: rows.filter((r) => r.status === "pending").length,
            approved: rows.filter((r) => r.status === "approved").length,
            rejected: rows.filter((r) => r.status === "rejected").length,
        };
    }, [state.data]);

    const filtered = useMemo(() => {
        const rows = state.data || [];
        if (statusFilter === "all") return rows;
        return rows.filter((r) => r.status === statusFilter);
    }, [state.data, statusFilter]);

    async function handleSubmit(input: LeaveFormInput) {
        const res = await addLeave(input);
        if ((res as any).ok || res) {
            setOpen(false);
            showToast("Leave request submitted successfully.", "success");
        }
    }

    const noChildren = !childLoading && children.length === 0;

    return (
        <div className="space-y-6 pb-12">
            {/* Hero Card */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                  <AppIcon name="CalendarDays" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Leave Management</h2>
                  <p className="text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">
                    Submit applications and track school approval timeline
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {selectedChild && (
                  <div className="hidden md:flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-1.5 border border-slate-100">
                    <div className="h-6 w-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">
                      {selectedChild.student_name.substring(0, 1)}
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black text-slate-700 leading-tight">
                        {selectedChild.student_name}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 leading-none mt-0.5">
                        {selectedChild.class_name}
                      </p>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  disabled={noChildren || !selectedChild}
                  onClick={() => setOpen(true)}
                  className="h-10 px-5 rounded-xl bg-slate-950 text-white text-[11px] font-black uppercase tracking-wider hover:bg-slate-900 active:scale-[0.98] transition-all inline-flex items-center gap-2 disabled:opacity-50"
                >
                  <AppIcon name="Plus" size={16} />
                  Apply for Leave
                </button>
              </div>
            </div>

            {noChildren && (
                <DataState
                    variant="empty"
                    title="No linked child found"
                    message="Your account isn't linked to a student yet. Reach out to the school admin to link your guardian profile."
                />
            )}

            {!noChildren && (
                <>
                    <StatCardGrid
                        items={[
                            {
                                label: "Total Applications",
                                value: stats.total,
                                icon: "assignment",
                                accent: "blue",
                            },
                            {
                                label: "Pending Review",
                                value: stats.pending,
                                icon: "hourglass_empty",
                                accent: "amber",
                            },
                            {
                                label: "Approved",
                                value: stats.approved,
                                icon: "verified",
                                accent: "emerald",
                            },
                            {
                                label: "Rejected",
                                value: stats.rejected,
                                icon: "cancel",
                                accent: "rose",
                            },
                        ]}
                    />

                    {/* Filter chips */}
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
                        {(
                            [
                                { id: "all", label: "All Statuses" },
                                { id: "pending", label: "Pending Review" },
                                { id: "approved", label: "Approved" },
                                { id: "rejected", label: "Rejected" },
                                { id: "cancelled", label: "Cancelled" },
                            ] as const
                        ).map((chip) => {
                            const isActive = statusFilter === chip.id;
                            return (
                                <button
                                    key={chip.id}
                                    onClick={() => setStatusFilter(chip.id as any)}
                                    type="button"
                                    className={`h-8 px-4 rounded-xl text-[11px] font-bold whitespace-nowrap border transition-all ${
                                        isActive
                                            ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                                            : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-900"
                                    }`}
                                >
                                    {chip.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Timeline of applications */}
                    {state.status === "loading" && !state.data ? (
                        <LeaveListSkeleton />
                    ) : filtered.length === 0 ? (
                        <DataState
                            variant="empty"
                            title={
                                statusFilter === "all"
                                    ? "No leave applications yet"
                                    : `No ${statusFilter} requests`
                            }
                            message={
                                statusFilter === "all"
                                    ? "Apply for leave above and the school admin will review it here."
                                    : "Try a different filter to see other applications."
                            }
                        />
                    ) : (
                        <div className="space-y-4">
                            {filtered.map((row) => (
                                <LeaveTimelineCard
                                    key={row._id}
                                    row={row}
                                    onCancel={() => deleteLeave(row._id)}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            <AnimatePresence>
                {open && selectedChild && (
                    <ApplyLeaveDrawer
                        childName={selectedChild.student_name}
                        childClass={[selectedChild.class_name, selectedChild.class_section]
                            .filter(Boolean)
                            .join(" · ")}
                        childId={selectedChild.student_id}
                        onClose={() => setOpen(false)}
                        onSubmit={handleSubmit}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// ────────────────────────────────────────────────────────────────────────
// Timeline card — one leave application
// ────────────────────────────────────────────────────────────────────────

function LeaveTimelineCard({
    row,
    onCancel,
}: {
    row: LeaveRecordRow;
    onCancel: () => void;
}) {
    const status = STATUS_STYLE[row.status] || STATUS_STYLE.pending;
    const accent = TYPE_ACCENT[row.leave_type] || TYPE_ACCENT.other;
    const days = daySpan(row.start_date, row.end_date);
    const typeLabel =
        TYPE_OPTIONS.find((t) => t.value === row.leave_type)?.label ||
        row.leave_type;
    const typeIcon =
        TYPE_OPTIONS.find((t) => t.value === row.leave_type)?.icon || "MoreHorizontal";

    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="group relative rounded-2xl border border-slate-200/70 bg-white shadow-[0_4px_18px_rgb(0,0,0,0.02)] hover:shadow-md transition-all overflow-hidden p-5"
        >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[9px] font-black tracking-wider uppercase ${accent}`}>
                            <AppIcon name={typeIcon} size={12} />
                            {typeLabel}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[9px] font-black tracking-wider uppercase ${status.pill}`}>
                            <AppIcon name={status.icon} size={12} />
                            {status.label}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase">
                            • {days} day{days > 1 ? "s" : ""}
                        </span>
                    </div>

                    <div className="mt-3">
                        <h4 className="text-sm font-bold text-slate-900">{row.requester_name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">{row.class_name}</p>
                    </div>

                    {row.reason && (
                        <p className="text-[12px] text-slate-600 bg-slate-50 border border-slate-100 rounded-xl p-3 mt-3 italic">
                          "{row.reason}"
                        </p>
                    )}

                    {/* Progress timeline */}
                    <div className="mt-5 border-t border-slate-100 pt-4">
                        <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Application Progress</h5>
                        <div className="flex items-center gap-2">
                            {/* Step 1 */}
                            <div className="flex items-center gap-2">
                                <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">
                                    <AppIcon name="Check" size={12} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-700">Submitted</span>
                            </div>
                            <div className="h-0.5 w-8 bg-slate-200" />
                            {/* Step 2 */}
                            <div className="flex items-center gap-2">
                                <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${
                                    row.status !== "pending" 
                                        ? "bg-blue-100 text-blue-600" 
                                        : "bg-amber-100 text-amber-600 animate-pulse"
                                }`}>
                                    <AppIcon name={row.status === "pending" ? "Hourglass" : "Check"} size={12} />
                                </div>
                                <span className={`text-[10px] font-bold ${row.status === "pending" ? "text-amber-600" : "text-slate-700"}`}>
                                    {row.status === "pending" ? "Under Review" : "Reviewed"}
                                </span>
                            </div>
                            {row.status !== "pending" && (
                                <>
                                    <div className="h-0.5 w-8 bg-slate-200" />
                                    {/* Step 3 */}
                                    <div className="flex items-center gap-2">
                                        <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${
                                            row.status === "approved"
                                                ? "bg-emerald-100 text-emerald-600"
                                                : row.status === "rejected"
                                                ? "bg-rose-100 text-rose-600"
                                                : "bg-slate-100 text-slate-500"
                                        }`}>
                                            <AppIcon name={row.status === "approved" ? "Check" : row.status === "rejected" ? "X" : "Minus"} size={12} />
                                        </div>
                                        <span className={`text-[10px] font-bold ${
                                            row.status === "approved"
                                                ? "text-emerald-600"
                                                : row.status === "rejected"
                                                ? "text-rose-600"
                                                : "text-slate-500"
                                        }`}>
                                            {row.status === "approved" ? "Approved" : row.status === "rejected" ? "Rejected" : "Cancelled"}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {row.status === "rejected" && row.rejection_reason && (
                        <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50/50 p-3 flex gap-2">
                            <AppIcon name="AlertTriangle" size={16} className="text-rose-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-black text-rose-700 uppercase tracking-wider">
                                    Rejection Reason
                                </p>
                                <p className="text-[11px] text-rose-700 font-medium mt-0.5 leading-normal">
                                    {row.rejection_reason}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 shrink-0 border-t lg:border-t-0 border-slate-50 pt-4 lg:pt-0">
                    <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                        <AppIcon name="Calendar" size={18} className="text-slate-400" />
                        <div>
                            <p className="text-[11px] font-black text-slate-700 leading-tight">
                                {fmtDate(row.start_date)}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                                to {fmtDate(row.end_date)}
                            </p>
                        </div>
                    </div>

                    {row.status === "pending" && (
                        <div className="relative">
                            {!showConfirm ? (
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(true)}
                                    className="text-[10px] font-black text-rose-500 hover:text-rose-600 uppercase tracking-wider inline-flex items-center gap-1 hover:underline py-1"
                                >
                                    <AppIcon name="XCircle" size={14} />
                                    Withdraw
                                </button>
                            ) : (
                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-2 rounded-xl">
                                    <span className="text-[9px] font-bold text-slate-500">Confirm?</span>
                                    <button
                                        type="button"
                                        onClick={onCancel}
                                        className="text-[9px] font-black text-rose-600 hover:underline uppercase"
                                    >
                                        Yes
                                    </button>
                                    <span className="text-slate-300">|</span>
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(false)}
                                        className="text-[9px] font-bold text-slate-600 hover:underline uppercase"
                                    >
                                        No
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function LeaveListSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="h-32 rounded-2xl border border-slate-100 bg-white animate-pulse"
                />
            ))}
        </div>
    );
}

// ────────────────────────────────────────────────────────────────────────
// Apply Drawer (Right Slide out panel)
// ────────────────────────────────────────────────────────────────────────

function ApplyLeaveDrawer({
    childName,
    childClass,
    childId,
    onClose,
    onSubmit,
}: {
    childName: string;
    childClass: string;
    childId: string;
    onClose: () => void;
    onSubmit: (input: LeaveFormInput) => Promise<void>;
}) {
    const [form, setForm] = useState<LeaveFormInput>({
        requester_type: "student",
        requester_id: childId,
        leave_type: "sick",
        start_date: "",
        end_date: "",
        reason: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [busy, setBusy] = useState(false);

    function set<K extends keyof LeaveFormInput>(key: K, value: LeaveFormInput[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => {
            if (!prev[key as string]) return prev;
            const { [key as string]: _omit, ...rest } = prev;
            return rest;
        });
    }

    function validate() {
        const next: Record<string, string> = {};
        if (!form.start_date) next.start_date = "Start date is required";
        if (!form.end_date) next.end_date = "End date is required";
        if (form.start_date && form.end_date && form.end_date < form.start_date) {
            next.end_date = "End date must be on or after start date";
        }
        if (!form.reason.trim()) next.reason = "Please describe the reason";
        if (form.reason.trim().length < 10) {
            next.reason = "Please enter at least 10 characters.";
        }
        if (form.reason.trim().length > 200) {
            next.reason = "Reason cannot exceed 200 characters.";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        setBusy(true);
        try {
            await onSubmit({ ...form, requester_id: childId });
        } catch (err) {
            showToast("Failed to submit request.", "error");
        } finally {
            setBusy(false);
        }
    }

    const days =
        form.start_date && form.end_date
            ? daySpan(form.start_date, form.end_date)
            : 0;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Slide out drawer */}
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="relative w-full max-w-lg h-full bg-white shadow-2xl border-l border-slate-100 flex flex-col z-10"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                            New Application
                        </p>
                        <h3 className="text-[16px] font-black text-slate-900 mt-0.5">
                            Apply for Leave
                        </h3>
                        <p className="text-[11px] text-slate-400 font-bold mt-1">
                            Filing for: <span className="text-slate-600">{childName}</span> ({childClass})
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                        aria-label="Close"
                    >
                        <AppIcon name="X" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Category pills */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Leave Category
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {TYPE_OPTIONS.map((opt) => {
                                const active = form.leave_type === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => set("leave_type", opt.value)}
                                        className={`h-11 px-4 rounded-xl border text-[11px] font-bold inline-flex items-center gap-2.5 transition-all ${
                                            active
                                                ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                                                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                        }`}
                                    >
                                        <AppIcon name={opt.icon} size={16} />
                                        <span className="capitalize">{opt.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Date Pickers */}
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Start Date"
                            type="date"
                            value={form.start_date}
                            onChange={(e) => set("start_date", e.target.value)}
                            error={errors.start_date}
                            required
                            className="rounded-xl"
                        />
                        <Input
                            label="End Date"
                            type="date"
                            value={form.end_date}
                            onChange={(e) => set("end_date", e.target.value)}
                            error={errors.end_date}
                            required
                            className="rounded-xl"
                        />
                    </div>

                    {/* Duration preview */}
                    {days > 0 && (
                        <div className="flex items-center gap-2 rounded-xl bg-blue-50/50 border border-blue-100/30 px-3.5 py-2.5">
                            <AppIcon name="Clock" size={16} className="text-blue-500" />
                            <p className="text-[11px] font-bold text-blue-700">
                                Leave duration: {days} day{days > 1 ? "s" : ""}
                            </p>
                        </div>
                    )}

                    {/* Reason text area */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                                Reason <span className="text-rose-500">*</span>
                            </label>
                            <span className={`text-[10px] font-bold ${
                                form.reason.trim().length < 10 || form.reason.trim().length > 200
                                    ? "text-rose-500"
                                    : "text-slate-400"
                            }`}>
                                {form.reason.trim().length} / 200 chars
                            </span>
                        </div>
                        <textarea
                            value={form.reason}
                            onChange={(e) => set("reason", e.target.value)}
                            rows={4}
                            maxLength={200}
                            placeholder="Provide details about why your child needs leave (visible to admin review desk)..."
                            className={`w-full rounded-xl border bg-white p-3 text-sm text-slate-800 outline-none focus:ring-2 transition-all placeholder:text-slate-400 ${
                                errors.reason
                                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                                    : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                            }`}
                        />
                        {errors.reason && (
                            <p className="mt-1 text-[10px] font-bold text-rose-600">
                                {errors.reason}
                            </p>
                        )}
                    </div>

                    {/* Mock Attachment Upload */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Attachments (Optional)
                        </label>
                        <div className="border border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-slate-50/50">
                            <AppIcon name="Upload" size={20} className="text-slate-400 mb-2" />
                            <p className="text-[11px] font-bold text-slate-600">Medical certificates / leave documents</p>
                            <p className="text-[9px] font-medium text-slate-400 mt-0.5">Drag & drop or click to upload (mock)</p>
                        </div>
                    </div>
                </form>

                {/* Sticky Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-10 px-4 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-500 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <Button
                        type="submit"
                        disabled={busy}
                        onClick={handleSubmit}
                        className="h-10 px-5 bg-slate-950 text-white rounded-xl text-[11px] font-bold shadow-md hover:bg-slate-900 inline-flex items-center gap-1.5"
                    >
                        {busy ? (
                            <>
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                Submitting…
                            </>
                        ) : (
                            <>
                                <AppIcon name="Send" size={14} />
                                Submit Request
                            </>
                        )}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
