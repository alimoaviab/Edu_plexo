/**
 * SubscriptionPage — Owner subscription & billing.
 *
 * Fully state-driven: every status, date, remaining-day value, and CTA
 * decision comes from the backend `/api/subscription/current` payload
 * (`phase`, `payment_status`, `next_plan`, `days_remaining`, ...). No
 * hardcoded trial durations, plan prices, or lifecycle text lives here.
 *
 * Sections:
 *   1. Current subscription (compact banner)
 *   2. Student capacity (owner-wide, backend counts)
 *   3. Plan comparison (compact cards from the plan catalog API)
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

function currentPlanOf(current?: CurrentSubscription | null): Plan | null {
  const sub = current?.subscription;
  if (!sub || !sub.plan_name || sub.plan_name === "trial") return null;
  return {
    id: sub.plan_name.startsWith("plan_") ? sub.plan_name : `plan_${sub.plan_name}`,
    name: sub.plan_name,
    display_name: planDisplayName(sub.plan_name),
    price: sub.price,
    currency: sub.currency || "PKR",
    student_limit: sub.student_limit,
    features: [],
    is_custom: false,
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
  const displayPlans = (plans || []).filter((p) => !p.is_custom && p.name !== "plan_custom" && p.id !== "plan_custom");
  const currentPlan = currentPlanOf(current);

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
                  <StatusBadge phase={phase} daysRemaining={daysRemaining} />
                  {current?.payment_status === "approved" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {scheduledPlan} scheduled
                    </span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-600">
                  {sub && sub.price > 0 && (
                    <span className="font-bold text-slate-900 tabular-nums">
                      PKR {sub.price.toLocaleString()} / month
                    </span>
                  )}
                  {daysRemaining > 0 && (
                    <span className="font-semibold">
                      {isTrialPhase ? "Trial ends" : "Renews"}:{" "}
                      <strong className="text-slate-900">{formatDate(renewalDate)}</strong>
                    </span>
                  )}
                  {isTrialPhase && (
                    <span className="font-semibold">
                      {daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining
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
              <span className="text-sm font-semibold text-slate-400"> / {studentLimit > 0 ? studentLimit.toLocaleString() : "—"} students</span>
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

        {/* ── SECTION 2: Plan comparison (compact) ─────────────────────── */}
        <div id="plans-section" className="space-y-3 pt-1 scroll-mt-6">
          <h2 className="text-sm font-black text-slate-900 tracking-tight">Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {displayPlans.map((plan) => (
              <CompactPlanCard
                key={plan.id || plan.name}
                plan={plan}
                isCurrent={Boolean(
                  currentPlan &&
                    planRank(plan) === planRank(currentPlan) &&
                    !isTrialPhase &&
                    !isLapsed
                )}
                phase={phase}
                daysRemaining={daysRemaining}
                studentsUsed={studentsUsed}
                onSelect={() => navigate(`${rolePrefix}/subscription/payment`, { state: { plan } })}
              />
            ))}
          </div>
        </div>

        {/* ── SECTION 3: Billing activity ──────────────────────────────── */}
        {history.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Billing Activity</h3>
                <p className="text-[11px] text-slate-500 font-medium">Real subscription & payment events</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                {history.length} event{history.length === 1 ? "" : "s"}
              </span>
            </div>
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
          </div>
        )}
      </div>
    </SchoolShell>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────

function StatusBadge({ phase, daysRemaining }: { phase: string; daysRemaining: number }) {
  const map: Record<string, { label: string; cls: string; icon: string }> = {
    trial_active: { label: "Trial Active", cls: "bg-blue-50 text-blue-700 border-blue-200", icon: "Clock" },
    trial_expiring: { label: `Trial ends in ${daysRemaining}d`, cls: "bg-amber-50 text-amber-700 border-amber-200", icon: "AlertTriangle" },
    trial_expired: { label: "Trial Expired", cls: "bg-rose-50 text-rose-700 border-rose-200", icon: "AlertCircle" },
    active: { label: "Active", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: "CheckCircle" },
    expiring: { label: `Expires in ${daysRemaining}d`, cls: "bg-amber-50 text-amber-700 border-amber-200", icon: "AlertTriangle" },
    grace: { label: "Grace Period", cls: "bg-rose-50 text-rose-700 border-rose-200", icon: "AlertTriangle" },
    expired: { label: "Expired", cls: "bg-rose-50 text-rose-700 border-rose-200", icon: "AlertCircle" },
    suspended: { label: "Suspended", cls: "bg-rose-100 text-rose-800 border-rose-300", icon: "Ban" },
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
  daysRemaining,
  onTrial,
  onRenew,
  onUpgrade,
  isBusy,
}: {
  phase: string;
  canTrial: boolean;
  isTrialPhase: boolean;
  daysRemaining: number;
  onTrial: () => void;
  onRenew: () => void;
  onUpgrade: () => void;
  isBusy: boolean;
}) {
  let label = "Choose Plan";
  let onClick = onUpgrade;
  let cls = "bg-blue-600 hover:bg-blue-700 text-white";

  if (isTrialPhase) {
    label = "Choose Plan";
    onClick = onUpgrade;
  } else if (phase === "suspended" || phase === "expired" || phase === "grace" || phase === "trial_expired") {
    label = "Renew Plan";
    onClick = onRenew;
    cls = "bg-emerald-600 hover:bg-emerald-700 text-white";
  } else if (phase === "expiring" || daysRemaining <= 3) {
    label = "Renew Plan";
    onClick = onRenew;
    cls = "bg-emerald-600 hover:bg-emerald-700 text-white";
  } else if (canTrial && phase === "none") {
    label = "Start Free Trial";
    onClick = onTrial;
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
  phase,
  daysRemaining,
  studentsUsed,
  onSelect,
}: {
  plan: Plan;
  isCurrent: boolean;
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
            isPopular
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-slate-900 hover:bg-slate-800 text-white"
          }`}
        >
          {ctaLabel} to {plan.display_name.split(" ")[0]}
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