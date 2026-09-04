/**
 * SubscriptionPage — Owner subscription & billing.
 *
 * Fully state-driven: every status, date, remaining-day value, and CTA
 * decision comes from the backend `/api/subscription/current` payload
 * (`phase`, `payment_status`, `scheduled_plan`, `days_remaining`, ...). No
 * hardcoded trial durations, plan prices, or lifecycle text lives here.
 *
 * Sections:
 *   1. Current subscription (compact banner — standard, trial, or the
 *      Owner's negotiated Custom Plan)
 *   2. Student capacity (owner-wide, backend counts)
 *   3. Plans (standard comparison + the Owner's private Custom Plan contract
 *      when Super Admin assigned one; otherwise a "Contact EduPlexo" CTA)
 *   4. Billing activity (real history timeline)
 */

import { useNavigate } from "react-router-dom";
import { SchoolShell } from "@/layouts/SchoolShell";
import { useSubscription } from "../hooks/useSubscription";
import type { CurrentSubscription, Plan } from "../services/subscription.service";
import { AppIcon } from "shared/ui/AppIcon";

const TRIAL_PHASES = new Set(["trial_active", "trial_expiring", "trial_expired"]);
const LAPSED_PHASES = new Set(["expired", "grace", "suspended", "trial_expired", "expiring"]);

function planRank(plan: Plan | undefined): number {
  if (!plan) return -1;
  const s = (plan.id || plan.name || "").toLowerCase();
  if (s.includes("starter")) return 1;
  if (s.includes("growth")) return 2;
  if (s.includes("premium")) return 3;
  return 4;
}

function currentPlanOf(current: CurrentSubscription | null | undefined, plans: Plan[]): Plan | null {
  const sub = current?.subscription;
  if (!sub || !sub.plan_name || sub.plan_name === "trial") return null;
  // Prefer the real catalog / contract object (carries is_custom, prices,
  // limit) — matched by machine plan_id first, then by name.
  const match = (plans || []).find(
    (p) =>
      (sub.plan_id && (p.id === sub.plan_id || p.name === sub.plan_id)) ||
      p.id === sub.plan_name ||
      p.name === sub.plan_name ||
      p.name === `plan_${sub.plan_name}` ||
      p.id === `plan_${sub.plan_name}`
  );
  if (match) return match;
  return {
    id: sub.plan_id || sub.plan_name,
    name: sub.plan_name,
    display_name: planDisplayName(sub.plan_name),
    price: sub.price,
    currency: sub.currency || "PKR",
    student_limit: sub.student_limit,
    features: [],
    is_custom: Boolean(current?.current_plan_is_custom),
    popular: false,
  };
}

function planDisplayName(name: string): string {
  const map: Record<string, string> = {
    trial: "Free Trial",
    free_trial: "Free Trial",
    plan_starter: "Starter Plan",
    starter: "Starter Plan",
    plan_growth: "Growth Plan",
    growth: "Growth Plan",
    plan_premium: "Premium Plan",
    premium: "Premium Plan",
    plan_custom: "Custom Plan",
    custom: "Custom Plan",
  };
  if (map[name]) return map[name];
  if (name) return name.charAt(0).toUpperCase() + name.slice(1);
  return "Standard License";
}

function formatDate(value?: string): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
}

export function SubscriptionPage() {
  const { current, plans, history, isLoading, isUpgrading, isStartingTrial } = useSubscription();
  const navigate = useNavigate();

  if (isLoading && current === undefined && plans.length === 0) {
    return <SubscriptionSkeleton />;
  }

  const sub = current?.subscription;
  const phase = current?.phase ?? (sub?.status === "trial" ? "trial_active" : sub?.status || "expired");
  const isTrialPhase = TRIAL_PHASES.has(phase);
  const isLapsed = LAPSED_PHASES.has(phase);
  const daysRemaining = current?.days_remaining ?? 0;
  const studentsUsed = current?.students_used ?? 0;
  const studentLimit = current?.students_limit ?? sub?.student_limit ?? 0;
  const percentUsed = studentLimit > 0 ? Math.min(100, Math.round((studentsUsed / studentLimit) * 100)) : 0;
  const slotsRemaining = studentLimit > 0 ? Math.max(0, studentLimit - studentsUsed) : 0;

  const rolePrefix = window.location.pathname.startsWith("/admin") ? "/admin" : "/owner";
  const displayPlans = (plans || [])
    .filter((p) => !p.is_custom && p.name !== "trial" && p.id !== "trial" && p.name !== "free_trial")
    .sort((a, b) => planRank(a) - planRank(b));
  const customPlans = (plans || []).filter((p) => p.is_custom);
  const currentPlan = currentPlanOf(current, plans);
  const currentIsCustom = Boolean(current?.current_plan_is_custom);

  const renewalDate = isTrialPhase ? current?.trial_ends_at || sub?.end_date : current?.renews_at || sub?.end_date;
  const scheduledPlan = current?.next_plan ? planDisplayName(current.next_plan) : "";

  return (
    <SchoolShell eyebrow="Owner Portal" title="Subscription & Billing">
      <div className="max-w-6xl mx-auto space-y-6 pb-14">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-700">
                Billing & Licensing
              </span>
              <span className="text-[11px] font-semibold text-slate-400">· Multi-Campus</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Subscription & Billing</h1>
          </div>
          <a
            href="mailto:billing@eduplexo.com"
            className="shrink-0 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
          >
            <AppIcon name="Headphones" size={14} />
            <span>Contact Support</span>
          </a>
        </div>

        {/* ── SECTION 1: Current Subscription (compact) ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    {isTrialPhase ? "Free Trial" : planDisplayName(sub?.plan_name || "") || "No Active Plan"}
                  </h2>
                  {currentIsCustom && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-violet-100 text-violet-700 border border-violet-200">
                      Custom Plan
                    </span>
                  )}
                  <StatusBadge phase={phase} daysRemaining={daysRemaining} />
                  {current?.payment_status === "approved" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {scheduledPlan} scheduled
                    </span>
                  )}
                  {current?.scheduled_plan && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200">
                      {planDisplayName(current.scheduled_plan)} scheduled
                    </span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-600">
                  {sub && sub.price > 0 && (
                    <span className="font-bold text-slate-900 tabular-nums">
                      {sub.currency || "PKR"} {sub.price.toLocaleString()} / month
                    </span>
                  )}
                  {daysRemaining > 0 && !isTrialPhase && (
                    <span className="font-semibold">
                      {current?.custom_plan_ending ? "Plan ends" : "Renews"}:{" "}
                      <strong className="text-slate-900">{formatDate(renewalDate)}</strong>
                    </span>
                  )}
                  {isTrialPhase && (
                    <span className="font-semibold">
                      Trial ends: <strong className="text-slate-900">{formatDate(renewalDate)}</strong> · {daysRemaining}{" "}
                      {daysRemaining === 1 ? "day" : "days"} remaining
                    </span>
                  )}
                  {phase === "expiring" && (
                    <span className="font-semibold text-amber-700">
                      Expires in {daysRemaining} {daysRemaining === 1 ? "day" : "days"}
                    </span>
                  )}
                  {phase === "grace" && (
                    <span className="font-semibold text-rose-600">
                      Grace ends {formatDate(current?.grace_ends_at)} — account suspends unless renewed
                    </span>
                  )}
                  {phase === "suspended" && (
                    <span className="font-semibold text-rose-600">Subscription suspended — renew to restore access</span>
                  )}
                </div>

                {current?.custom_plan_ending && (
                  <p className="mt-2 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 inline-block">
                    Your custom plan is ending {formatDate(current.custom_plan_ends_at)}. Please select a new plan or
                    contact support.
                  </p>
                )}
                {current?.scheduled_plan && current.scheduled_plan_starts_at && (
                  <p className="mt-2 text-xs font-medium text-violet-700 bg-violet-50 border border-violet-100 rounded-lg px-2.5 py-1.5 inline-block">
                    {planDisplayName(current.scheduled_plan)} is scheduled to start on{" "}
                    {formatDate(current.scheduled_plan_starts_at)}.
                  </p>
                )}
                {current?.payment_status === "approved" && scheduledPlan && (
                  <p className="mt-2 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg px-2.5 py-1.5 inline-block">
                    Payment approved — {scheduledPlan} will activate
                    {isTrialPhase ? " after your trial ends" : " now"}.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <PrimaryCta
                  phase={phase}
                  canTrial={Boolean(current?.can_trial)}
                  isTrialPhase={isTrialPhase}
                  isCustomPlan={currentIsCustom}
                  daysRemaining={daysRemaining}
                  onTrial={() => navigate(`${rolePrefix}/subscription/payment`)}
                  onRenew={() => navigate(`${rolePrefix}/subscription/payment`, { state: { plan: currentPlan } })}
                  onUpgrade={() => {
                    const section = document.getElementById("plans-section");
                    if (section) section.scrollIntoView({ behavior: "smooth" });
                    else navigate(`${rolePrefix}/subscription/payment`);
                  }}
                  isBusy={isStartingTrial || isUpgrading}
                />
              </div>
            </div>
          </div>

          {/* Capacity (compact) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Student Capacity</h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  studentLimit > 0 && percentUsed >= 100
                    ? "bg-rose-100 text-rose-700"
                    : percentUsed >= 90
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {studentLimit > 0 ? `${percentUsed}% used` : "No limit"}
              </span>
            </div>
            <p className="text-xl font-black text-slate-900 tabular-nums">
              {studentsUsed.toLocaleString()}
              <span className="text-sm font-semibold text-slate-400">
                {" "}
                / {studentLimit > 0 ? studentLimit.toLocaleString() : "—"} students
              </span>
            </p>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2.5 mb-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  studentLimit > 0 && percentUsed >= 100
                    ? "bg-rose-500"
                    : percentUsed >= 90
                    ? "bg-amber-500"
                    : "bg-blue-500"
                }`}
                style={{ width: `${studentLimit > 0 ? Math.max(3, Math.min(100, percentUsed)) : 3}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
              <span>{slotsRemaining.toLocaleString()} seats remaining</span>
              {studentLimit > 0 && percentUsed >= 90 && (
                <span className="text-amber-700 font-bold">
                  {percentUsed >= 100 ? "Capacity reached" : "Near capacity"}
                </span>
              )}
            </div>
            {current?.payment_status === "pending" && (
              <p className="mt-2 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5">
                Payment proof under review (Ref: {current.pending_payment?.transaction_id})
              </p>
            )}
          </div>
        </div>

        {/* ── SECTION 2: Plans (standard comparison + owner custom contract) ── */}
        <div id="plans-section" className="space-y-3 pt-1 scroll-mt-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-sm font-black text-slate-900 tracking-tight">Plans</h2>
            {customPlans.length === 0 && !currentIsCustom && (
              <a
                href="mailto:billing@eduplexo.com?subject=Custom%20plan%20request"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-lg px-2.5 py-1.5 transition"
              >
                <AppIcon name="Sparkles" size={12} />
                <span>Need a larger plan? Contact EduPlexo</span>
              </a>
            )}
          </div>

          {/* Negotiated custom contract card — only rendered when Super Admin
              actually assigned one to THIS owner (backend-scoped). */}
          {customPlans.length > 0 && (
            <div className="space-y-3">
              {customPlans.map((p) => {
                const isThisCurrent = Boolean(
                  currentIsCustom && currentPlan && (currentPlan.id === p.id || currentPlan.name === p.name)
                );
                return (
                  <CustomContractCard
                    key={p.id || p.name}
                    plan={p}
                    isCurrent={isThisCurrent}
                    ending={isThisCurrent && Boolean(current?.custom_plan_ending)}
                    endingAt={isThisCurrent ? current?.custom_plan_ends_at : undefined}
                    phase={phase}
                    daysRemaining={daysRemaining}
                    studentsUsed={studentsUsed}
                    onRenew={() => navigate(`${rolePrefix}/subscription/payment`, { state: { plan: p } })}
                  />
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {displayPlans.map((plan) => (
              <CompactPlanCard
                key={plan.id || plan.name}
                plan={plan}
                isCurrent={Boolean(
                  !currentIsCustom && currentPlan && planRank(plan) === planRank(currentPlan) && !isTrialPhase && !isLapsed
                )}
                switchMode={currentIsCustom}
                phase={phase}
                daysRemaining={daysRemaining}
                studentsUsed={studentsUsed}
                onSelect={() => navigate(`${rolePrefix}/subscription/payment`, { state: { plan } })}
              />
            ))}
            <div className="relative rounded-2xl border border-dashed border-violet-300 bg-violet-50/40 p-4 flex flex-col justify-between shadow-sm">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-violet-100 text-violet-700">
                  Tailored SLA
                </span>
                <h3 className="text-sm font-black text-slate-900 mt-2">Larger Plan</h3>
                <p className="text-[11px] text-slate-500 mt-1">1,000+ students, multi-campus governance & dedicated support</p>
              </div>
              <div className="mt-4">
                <a
                  href="mailto:billing@eduplexo.com?subject=Custom%20plan%20inquiry"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-sm transition active:scale-95"
                >
                  <AppIcon name="Sparkles" size={13} />
                  <span>Contact EduPlexo</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 3: Billing activity ──────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-200/80 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Billing Activity</h3>
              <p className="text-[11px] text-slate-500 font-medium">Real subscription & payment events</p>
            </div>
            {history.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                {history.length} event{history.length === 1 ? "" : "s"}
              </span>
            )}
          </div>
          {history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-5 font-bold">Date</th>
                    <th className="py-2.5 px-4 font-bold">Event</th>
                    <th className="py-2.5 px-4 font-bold">Plan</th>
                    <th className="py-2.5 px-4 font-bold">Period</th>
                    <th className="py-2.5 px-5 font-bold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-5 text-slate-500 whitespace-nowrap">
                        {new Date(entry.created_at || entry.start_date).toLocaleDateString("en-PK", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold capitalize">
                          {entry.action.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{planDisplayName(entry.plan_name)}</td>
                      <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">
                        {formatDate(entry.start_date)} — {formatDate(entry.end_date)}
                      </td>
                      <td className="py-2.5 px-5 text-right font-extrabold text-slate-900 tabular-nums">
                        {entry.amount > 0 ? `PKR ${entry.amount.toLocaleString()}` : "Free"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs font-medium">
              No billing activity recorded yet. Future plan updates and approved payments will appear here.
            </div>
          )}
        </div>
      </div>
    </SchoolShell>
  );
}

// ─── Negotiated custom contract card ────────────────────────────────────

function CustomContractCard({
  plan,
  isCurrent,
  ending,
  endingAt,
  phase,
  daysRemaining,
  studentsUsed,
  onRenew,
}: {
  plan: Plan;
  isCurrent: boolean;
  ending?: boolean;
  endingAt?: string;
  phase: string;
  daysRemaining: number;
  studentsUsed: number;
  onRenew: () => void;
}) {
  const atCapacity = studentsUsed >= plan.student_limit;
  const isScheduled = !isCurrent && plan.status === "scheduled";
  const lapsed = new Set(["expired", "grace", "suspended", "trial_expired", "expiring"]).has(phase);

  let statusLabel: { text: string; cls: string };
  if (isCurrent) {
    statusLabel = ending
      ? { text: `Ending ${endingAt ? formatDate(endingAt) : ""}`.trim(), cls: "bg-amber-50 text-amber-800 border-amber-200" }
      : lapsed
      ? { text: "Renewal required", cls: "bg-rose-50 text-rose-700 border-rose-200" }
      : { text: "Current Plan", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  } else if (isScheduled) {
    statusLabel = { text: "Scheduled", cls: "bg-violet-50 text-violet-700 border-violet-200" };
  } else {
    statusLabel = { text: "Negotiated", cls: "bg-violet-50 text-violet-700 border-violet-200" };
  }

  return (
    <div className="relative rounded-2xl border-2 border-violet-300 bg-gradient-to-r from-violet-50/80 via-white to-white p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest bg-violet-600 text-white">
            CUSTOM PLAN
          </span>
          <h3 className="text-base font-black text-slate-900 tracking-tight">{plan.display_name}</h3>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusLabel.cls}`}>
            {statusLabel.text}
          </span>
        </div>
        <p className="mt-1 text-[11px] font-medium text-slate-500">
          Negotiated specifically for your institution{plan.description ? ` · ${plan.description}` : ""}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-600">
          <span className="font-black text-slate-900 tabular-nums">
            {plan.currency || "PKR"} {plan.price.toLocaleString()}
            <span className="text-[10px] text-slate-400 font-semibold"> / {plan.duration_days || 30} days</span>
          </span>
          <span className="font-semibold">
            Capacity: <strong className="text-slate-900">{plan.student_limit.toLocaleString()} students</strong>
          </span>
          {atCapacity && <span className="font-bold text-rose-600">Capacity reached</span>}
          {isCurrent && daysRemaining > 0 && phase !== "expired" && (
            <span className="font-semibold">
              {ending ? "Ends in" : "Renews in"} {daysRemaining} {daysRemaining === 1 ? "day" : "days"}
            </span>
          )}
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-2">
        {isCurrent ? (
          lapsed || ending ? (
            <button
              onClick={onRenew}
              className={`px-4 py-2 rounded-xl text-white text-xs font-bold shadow-sm transition active:scale-95 ${
                ending ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              Renew Plan
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
              <AppIcon name="CheckCircle" size={13} />
              Current Plan
            </span>
          )
        ) : isScheduled ? (
          <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-violet-700 bg-violet-50 border border-violet-200">
            <AppIcon name="Clock" size={13} />
            Starts at period end
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 bg-slate-100">
            <AppIcon name="ShieldCheck" size={13} />
            Pre-approved for you
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────

function StatusBadge({ phase, daysRemaining }: { phase: string; daysRemaining: number }) {
  const map: Record<string, { label: string; cls: string; icon: string }> = {
    trial_active: { label: "Trial Active", cls: "bg-blue-50 text-blue-700 border-blue-200", icon: "Clock" },
    trial_expiring: {
      label: `Trial ends in ${daysRemaining}d`,
      cls: "bg-amber-50 text-amber-700 border-amber-200",
      icon: "AlertTriangle",
    },
    trial_expired: {
      label: "Trial Expired",
      cls: "bg-rose-50 text-rose-700 border-rose-200",
      icon: "AlertCircle",
    },
    active: { label: "Active", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: "CheckCircle" },
    expiring: {
      label: `Expires in ${daysRemaining}d`,
      cls: "bg-amber-50 text-amber-700 border-amber-200",
      icon: "AlertTriangle",
    },
    grace: { label: "Grace Period", cls: "bg-rose-50 text-rose-700 border-rose-200", icon: "AlertTriangle" },
    expired: { label: "Expired", cls: "bg-rose-50 text-rose-700 border-rose-200", icon: "AlertCircle" },
    suspended: { label: "Suspended", cls: "bg-rose-100 text-rose-800 border-rose-300", icon: "Ban" },
    scheduled: { label: "Scheduled", cls: "bg-violet-50 text-violet-700 border-violet-200", icon: "Clock" },
  };
  const s = map[phase] || map.expired;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${s.cls}`}>
      <AppIcon name={s.icon} size={11} />
      <span>{s.label}</span>
    </span>
  );
}

// ─── Primary CTA (derived from backend phase, never hardcoded) ────────────

function PrimaryCta({
  phase,
  canTrial,
  isTrialPhase,
  isCustomPlan,
  daysRemaining,
  onTrial,
  onRenew,
  onUpgrade,
  isBusy,
}: {
  phase: string;
  canTrial: boolean;
  isTrialPhase: boolean;
  isCustomPlan: boolean;
  daysRemaining: number;
  onTrial: () => void;
  onRenew: () => void;
  onUpgrade: () => void;
  isBusy: boolean;
}) {
  let label = "Choose Plan";
  let onClick = onUpgrade;
  let cls = "bg-blue-600 hover:bg-blue-700 text-white";

  if (phase === "suspended" || phase === "expired" || phase === "grace" || phase === "trial_expired") {
    label = "Renew Plan";
    onClick = onRenew;
    cls = "bg-emerald-600 hover:bg-emerald-700 text-white";
  } else if (phase === "expiring" || (!isTrialPhase && daysRemaining > 0 && daysRemaining <= 3)) {
    label = "Renew Plan";
    onClick = onRenew;
    cls = "bg-emerald-600 hover:bg-emerald-700 text-white";
  } else if (canTrial && (phase === "none" || isTrialPhase)) {
    label = isTrialPhase ? "Choose Plan" : "Start Free Trial";
    onClick = isTrialPhase ? onUpgrade : onTrial;
  } else if (isTrialPhase || phase === "none") {
    label = "Choose Plan";
  } else {
    // Live plan with plenty of runway: negotiating/paying flows live on the
    // plans section. Custom plans never assume an "upgrade" direction.
    label = isCustomPlan ? "Switch Plan" : "Upgrade Plan";
  }

  return (
    <button
      onClick={onClick}
      disabled={isBusy}
      className={`px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 disabled:opacity-50 shadow-sm ${cls}`}
    >
      {isBusy ? "Processing…" : label}
    </button>
  );
}

// ─── Compact plan card ────────────────────────────────────────────────────

function CompactPlanCard({
  plan,
  isCurrent,
  switchMode,
  phase,
  daysRemaining,
  studentsUsed,
  onSelect,
}: {
  plan: Plan;
  isCurrent: boolean;
  switchMode: boolean;
  phase: string;
  daysRemaining: number;
  studentsUsed: number;
  onSelect: () => void;
}) {
  const isPopular = plan.popular || plan.name === "plan_growth" || plan.id === "plan_growth";
  const atCapacity = studentsUsed >= plan.student_limit;

  let ctaLabel = "Upgrade";
  if (isCurrent) {
    ctaLabel = phase === "expiring" || daysRemaining <= 3 ? "Renew Plan" : "Current Plan";
  } else if (phase === "suspended" || phase === "expired" || phase === "grace") {
    ctaLabel = "Renew Plan";
  } else if (switchMode) {
    // Custom plans have no price/capacity ranking — switching semantics are
    // explicit, never an assumed "upgrade".
    ctaLabel = "Switch to";
  } else if (atCapacity) {
    ctaLabel = "Upgrade";
  }

  return (
    <div
      className={`relative rounded-2xl border p-4 flex flex-col bg-white shadow-sm ${
        isPopular ? "border-blue-400 ring-1 ring-blue-400/30" : "border-slate-200/90"
      } ${isCurrent ? "border-emerald-400 ring-1 ring-emerald-400/30" : ""}`}
    >
      {isPopular && (
        <span className="absolute -top-2 left-4 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider shadow">
          Popular
        </span>
      )}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900">{plan.display_name}</h3>
          <p className="text-[11px] text-slate-500 font-medium">Up to {plan.student_limit.toLocaleString()} students</p>
        </div>
        <div className="text-right">
          <p className="text-base font-black text-slate-900 tabular-nums">PKR {plan.price.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400 font-semibold">/month</p>
        </div>
      </div>

      {isCurrent ? (
        <div className="mt-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <AppIcon name="CheckCircle" size={11} />
            Current Plan{daysRemaining > 0 && daysRemaining <= 3 ? ` · renew in ${daysRemaining}d` : ""}
          </span>
        </div>
      ) : (
        <button
          onClick={onSelect}
          className={`mt-3 w-full py-2 rounded-xl text-xs font-bold transition active:scale-95 shadow-sm ${
            isPopular ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-slate-900 hover:bg-slate-800 text-white"
          }`}
        >
          {ctaLabel === "Switch to"
            ? `Switch to ${plan.display_name.split(" ")[0]}`
            : `${ctaLabel} to ${plan.display_name.split(" ")[0]}`}
        </button>
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────

function SubscriptionSkeleton() {
  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto animate-pulse">
      <div className="h-8 w-64 bg-slate-200 rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-28 bg-slate-100 rounded-2xl" />
        <div className="h-28 bg-slate-100 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-slate-100 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export { SubscriptionPage as AdminSubscriptionPage };
