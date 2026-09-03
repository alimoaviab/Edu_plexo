/**
 * SubscriptionPage — Executive institutional subscription & billing management.
 *
 * Sections:
 *   1. Executive Header & Quick Actions
 *   2. Active Tier & Student Capacity Analytics
 *   3. Modern Pricing Cards (Starter, Growth [Hero], Premium, Enterprise)
 *   4. Detailed Subscription & Billing History
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SchoolShell } from "@/layouts/SchoolShell";
import { CurrentPlanCard } from "@/components/subscription/CurrentPlanCard";
import { useSubscription } from "../hooks/useSubscription";
import type { Plan } from "../services/subscription.service";
import { AppIcon } from "shared/ui/AppIcon";

export function SubscriptionPage() {
  const {
    current,
    plans,
    history,
    isLoading,
    startTrial,
    upgradePlan,
    isUpgrading,
    isStartingTrial,
  } = useSubscription();

  const navigate = useNavigate();

  if (isLoading && current === undefined && plans.length === 0) {
    return <SubscriptionSkeleton />;
  }

  const sub = current?.subscription;
  const studentsUsed = current?.students_used ?? 0;
  const studentLimit = sub?.student_limit || 0;
  const percentUsed = studentLimit > 0 ? Math.min(100, Math.round((studentsUsed / studentLimit) * 100)) : 0;
  const slotsRemaining = studentLimit > 0 ? Math.max(0, studentLimit - studentsUsed) : 0;

  const defaultPlans: Plan[] = [
    {
      id: "plan_starter",
      name: "plan_starter",
      display_name: "Starter Plan",
      price: 4000,
      currency: "PKR",
      student_limit: 200,
      features: [
        "All Standard ERP Modules",
        "Unlimited Teacher Accounts",
        "Parent & Student Mobile Portals",
        "Attendance & Examination Suite",
        "Standard Email Support",
      ],
      is_custom: false,
      popular: false,
    },
    {
      id: "plan_growth",
      name: "plan_growth",
      display_name: "Growth Plan",
      price: 8000,
      currency: "PKR",
      student_limit: 500,
      features: [
        "Everything in Starter Plan",
        "SMS & Push Notification Gateway",
        "Advanced Analytics & Marksheets",
        "Fee Vouchers & Online Collections",
        "Priority 24/7 Technical Support",
      ],
      is_custom: false,
      popular: true,
    },
    {
      id: "plan_premium",
      name: "plan_premium",
      display_name: "Premium Plan",
      price: 15000,
      currency: "PKR",
      student_limit: 800,
      features: [
        "Everything in Growth Plan",
        "Multi-Branch & Campus Management",
        "Complete Staff HR & Payroll Suite",
        "Custom ID Cards & Certificates",
        "Dedicated Account Specialist",
      ],
      is_custom: false,
      popular: false,
    },
  ];

  const displayPlans = (plans && plans.length > 0 ? plans : defaultPlans).filter(
    (p) => !p.is_custom && p.name !== "plan_custom" && p.id !== "plan_custom"
  );

  const seen = new Set<string>();
  const deduped = history.filter((entry) => {
    const key = `${entry.action}::${entry.plan_name}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const rolePrefix = window.location.pathname.startsWith("/admin") ? "/admin" : "/owner";

  return (
    <SchoolShell eyebrow="Owner Portal" title="Subscription & Billing">
      <div className="max-w-7xl mx-auto space-y-10 pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-700">
                Billing & Licensing
              </span>
              <span className="text-xs font-semibold text-slate-400">· Multi-Campus ERP</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Subscription & Billing
            </h1>
            <p className="mt-1 text-sm text-slate-500 font-medium max-w-2xl">
              Oversee your institution's active licensing tier, allocate student capacity across branches, and manage renewal invoices.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate(`${rolePrefix}/subscription/custom`)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition shadow-sm flex items-center gap-2"
            >
              <AppIcon name="Sliders" size={14} />
              <span>Customize Modules</span>
            </button>
            <a
              href="mailto:billing@eduplexo.com"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm shadow-blue-600/20 flex items-center gap-2"
            >
              <AppIcon name="Headphones" size={14} />
              <span>Contact Support</span>
            </a>
          </div>
        </div>

        {/* Top Analytics / Current Plan & Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Active Plan Card */}
          <div className="lg:col-span-2">
            <CurrentPlanCard subscription={sub ?? null} studentsUsed={studentsUsed} />
          </div>

          {/* Student Seat Utilization Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <AppIcon name="Users" size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                      Student Capacity
                    </h3>
                    <span className="text-xs font-semibold text-slate-700">Seat Utilization</span>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    percentUsed >= 90
                      ? "bg-rose-100 text-rose-700"
                      : percentUsed >= 70
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {percentUsed}% Used
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight tabular-nums">
                  {studentsUsed.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-slate-400">
                  / {studentLimit > 0 ? studentLimit.toLocaleString() : "—"} enrolled students
                </span>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-3 mb-3 p-0.5 border border-slate-200/50">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${
                    !sub
                      ? "bg-slate-300"
                      : percentUsed >= 95
                      ? "bg-rose-500"
                      : percentUsed >= 75
                      ? "bg-amber-500"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600"
                  }`}
                  style={{ width: `${Math.max(4, Math.min(100, percentUsed))}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-medium text-slate-500 pt-1">
                <span>{slotsRemaining.toLocaleString()} seats available</span>
                <span>{percentUsed >= 90 ? "Upgrade recommended" : "Capacity optimal"}</span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Need higher limit?</span>
              <button
                onClick={() => {
                  const pricingSection = document.getElementById("pricing-cards-section");
                  if (pricingSection) pricingSection.scrollIntoView({ behavior: "smooth" });
                }}
                className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View Upgrade Plans</span>
                <AppIcon name="ArrowDown" size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Pending Payment Verification Banner */}
        {current?.pending_payment && (
          <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/5 border border-amber-300 text-amber-900 rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <AppIcon name="Clock" size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-amber-900">
                    Payment Proof Under Review
                  </h3>
                  <p className="text-xs text-amber-700 font-medium">
                    Reference: <span className="font-mono font-bold select-all bg-white/70 px-1.5 py-0.5 rounded border border-amber-200">{current.pending_payment.transaction_id}</span>
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-200/80 text-amber-900 border border-amber-300 shrink-0">
                Pending Approval
              </span>
            </div>

            <p className="text-xs text-amber-800 leading-relaxed">
              Your manual transfer proof for <strong>Rs. {current.pending_payment.amount.toLocaleString()}</strong> has been recorded and queued for finance verification. Once approved by Super Admin, your upgraded plan will become active immediately.
            </p>

            <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-amber-900 font-medium">
                <span>Payment not approved yet? Contact official billing support:</span>
                <a
                  href="tel:+923064944326"
                  className="font-bold text-blue-700 hover:text-blue-800 underline flex items-center gap-1"
                >
                  <AppIcon name="Phone" size={12} />
                  <span>+92 306 4944326</span>
                </a>
              </div>
              <a
                href="https://wa.me/923064944326"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
              >
                <AppIcon name="MessageSquare" size={13} />
                <span>WhatsApp Support</span>
              </a>
            </div>
          </div>
        )}

        {/* Pricing Cards Section */}
        <div id="pricing-cards-section" className="space-y-6 pt-4">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Choose the Right Plan for Your School
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Scale your school's student limit anytime with zero interruption. All plans include full access to the academic engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-4 max-w-6xl mx-auto">
            {displayPlans.map((plan) => {
              return (
                <PricingCard
                  key={plan.id || plan.name}
                  plan={plan}
                  isCurrentPlan={
                    Boolean(
                      sub &&
                      (sub.status === "active" || (!sub.is_trial && sub.status !== "expired")) &&
                      !sub.is_trial &&
                      sub.plan_name !== "trial" &&
                      (() => {
                        const s = (sub.plan_name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
                        const pName = (plan.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
                        const pId = (plan.id || "").toLowerCase().replace(/[^a-z0-9]/g, "");
                        const pDisplay = (plan.display_name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
                        return (
                          s === pName ||
                          s === pId ||
                          s === pDisplay ||
                          s.replace(/^plan/, "") === pName.replace(/^plan/, "") ||
                          s.replace(/^plan/, "") === pId.replace(/^plan/, "") ||
                          s.replace(/^plan/, "") === pDisplay.replace(/^plan/, "") ||
                          (s.includes("premium") && (pName.includes("premium") || pDisplay.includes("premium"))) ||
                          (s.includes("growth") && (pName.includes("growth") || pDisplay.includes("growth"))) ||
                          (s.includes("starter") && (pName.includes("starter") || pDisplay.includes("starter")))
                        );
                      })()
                    )
                  }
                  canTrial={false}
                  onStartTrial={async () => {
                    await startTrial(plan.name);
                    navigate(`${rolePrefix}/dashboard`);
                  }}
                  onUpgrade={() => navigate(`${rolePrefix}/subscription/payment`, { state: { plan } })}
                  isUpgrading={isUpgrading}
                  isStartingTrial={isStartingTrial}
                  sub={sub}
                />
              );
            })}
          </div>
        </div>

        {/* History Table */}
        {deduped.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm space-y-0">
            <div className="px-6 py-5 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Subscription & Billing History
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Complete ledger of license activations, tier upgrades, and automated invoices.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                {deduped.length} Record{deduped.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6 font-bold">Plan / Package</th>
                    <th className="py-3.5 px-4 font-bold">Transaction Type</th>
                    <th className="py-3.5 px-4 font-bold">Amount</th>
                    <th className="py-3.5 px-4 font-bold">Billing Cycle</th>
                    <th className="py-3.5 px-6 font-bold text-right">Payment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deduped.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <AppIcon name="ShieldCheck" size={14} />
                        </div>
                        <span>{planDisplayName(entry.plan_name)}</span>
                      </td>
                      <td className="py-4 px-4 text-xs font-semibold text-slate-600 capitalize">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {entry.action.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-extrabold text-slate-900 tabular-nums">
                        {entry.amount > 0 ? `PKR ${entry.amount.toLocaleString()}` : "Free (Trial)"}
                      </td>
                      <td className="py-4 px-4 text-xs font-medium text-slate-500">
                        {new Date(entry.start_date).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                        {" — "}
                        {new Date(entry.end_date).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            entry.payment_status === "paid"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          <AppIcon name={entry.payment_status === "paid" ? "CheckCircle" : "Clock"} size={12} />
                          <span className="capitalize">{entry.payment_status}</span>
                        </span>
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

// ─── Pricing Card Component ──────────────────────────────────────────────

interface PricingCardProps {
  plan: Plan;
  isCurrentPlan: boolean;
  canTrial: boolean;
  onStartTrial: () => void;
  onUpgrade: () => void;
  isUpgrading: boolean;
  isStartingTrial: boolean;
  sub: any;
}

function PricingCard({
  plan,
  isCurrentPlan,
  canTrial,
  onStartTrial,
  onUpgrade,
  isUpgrading,
  isStartingTrial,
  sub,
}: PricingCardProps) {
  const isPopular =
    plan.popular ||
    plan.name === "plan_growth" ||
    plan.name === "growth" ||
    plan.display_name?.toLowerCase().includes("growth");

  const daysRemaining = sub?.end_date 
    ? Math.ceil((new Date(sub.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 14;
  const isRenewalDue = daysRemaining <= 0;

  return (
    <div
      className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
        isPopular
          ? "bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white border-2 border-blue-500 shadow-2xl shadow-blue-950/40 lg:-translate-y-2.5 ring-2 ring-blue-500/40 z-10"
          : "bg-white border border-slate-200/90 text-slate-900 shadow-sm hover:border-slate-300 hover:-translate-y-1"
      } ${
        isCurrentPlan
          ? isRenewalDue
            ? "ring-2 ring-rose-500 border-rose-500 shadow-xl shadow-rose-500/10"
            : "ring-2 ring-emerald-500 border-emerald-500 shadow-xl shadow-emerald-500/10"
          : ""
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-black tracking-widest uppercase px-4 py-1 rounded-full shadow-lg shadow-blue-600/40 border border-white/20">
            <AppIcon name="Sparkles" size={12} className="text-yellow-300" />
            <span>Most Popular</span>
          </span>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-3.5 right-4 z-20">
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg ${
              isRenewalDue
                ? "bg-rose-600 text-white shadow-rose-600/30 border border-rose-400"
                : "bg-emerald-600 text-white shadow-emerald-600/30 border border-emerald-400"
            }`}
          >
            <AppIcon name={isRenewalDue ? "AlertTriangle" : "Check"} size={12} />
            <span>{isRenewalDue ? "Renewal Due" : `Active Plan (${daysRemaining}d left)`}</span>
          </span>
        </div>
      )}

      {/* Card Header & Price */}
      <div>
        <div className="text-center pt-2">
          {/* CRITICAL: For Growth Plan (isPopular), text is pure WHITE */}
          <h3
            className={`text-xl font-black tracking-tight ${
              isPopular ? "text-white" : "text-slate-900"
            }`}
          >
            {plan.display_name}
          </h3>

          <div className="mt-4 flex items-baseline justify-center">
            <span
              className={`text-4xl font-black tracking-tight ${
                isPopular ? "text-white" : "text-slate-900"
              }`}
            >
              PKR {plan.price.toLocaleString()}
            </span>
            <span
              className={`text-xs font-semibold ml-1.5 ${
                isPopular ? "text-blue-200/90" : "text-slate-400"
              }`}
            >
              /month
            </span>
          </div>

          <div
            className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              isPopular
                ? "bg-white/10 text-blue-200 border border-white/15"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            <AppIcon name="Users" size={13} className={isPopular ? "text-blue-300" : "text-slate-500"} />
            <span>
              Up to <strong className={isPopular ? "text-white" : "text-slate-900"}>{plan.student_limit}+</strong> students
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className={`my-6 h-px ${isPopular ? "bg-white/10" : "bg-slate-100"}`} />

        {/* Features List */}
        <ul className="space-y-3.5">
          {(plan.features || []).map((feature, i) => (
            <li
              key={i}
              className={`flex items-start gap-3 text-xs sm:text-sm font-medium leading-snug ${
                isPopular ? "text-slate-200" : "text-slate-600"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${
                  isPopular
                    ? "bg-blue-500/25 text-blue-300 border border-blue-400/40"
                    : "bg-blue-50 text-blue-600 border border-blue-100"
                }`}
              >
                <AppIcon name="Check" size={12} className={isPopular ? "text-blue-300" : "text-blue-600"} />
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button */}
      <div className="mt-8 pt-2">
        {isCurrentPlan ? (
          isRenewalDue ? (
            <button
              onClick={onUpgrade}
              disabled={isUpgrading}
              className="w-full py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
            >
              <AppIcon name="RefreshCw" size={16} />
              <span>Renew Plan Now</span>
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm cursor-default border-2 border-emerald-500 bg-emerald-50 text-emerald-700 flex items-center justify-center gap-2 shadow-sm"
            >
              <AppIcon name="CheckCircle" size={16} className="text-emerald-600" />
              <span>Active Plan</span>
            </button>
          )
        ) : canTrial ? (
          <button
            onClick={onStartTrial}
            disabled={isStartingTrial}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <AppIcon name="Gift" size={16} />
            <span>{isStartingTrial ? "Activating..." : "Start 14-Day Free Trial"}</span>
          </button>
        ) : isPopular ? (
          <button
            onClick={onUpgrade}
            disabled={isUpgrading}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-xl shadow-blue-600/40 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <AppIcon name="Zap" size={16} />
            <span>
              {isUpgrading
                ? "Processing..."
                : sub?.status === "expired" || sub?.status === "cancelled"
                ? "Renew Growth Plan"
                : "Upgrade to Growth Plan"}
            </span>
          </button>
        ) : (
          <button
            onClick={onUpgrade}
            disabled={isUpgrading}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>
              {isUpgrading
                ? "Processing..."
                : sub?.status === "expired" || sub?.status === "cancelled"
                ? "Renew Plan"
                : "Upgrade Plan"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────

function SubscriptionSkeleton() {
  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto animate-pulse">
      <div className="h-10 w-72 bg-slate-200 rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-44 bg-slate-100 rounded-2xl" />
        <div className="h-44 bg-slate-100 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-96 bg-slate-100 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────

function planDisplayName(name: string): string {
  if (name === "trial" || name === "free_trial") return "14-Day Free Trial";
  const map: Record<string, string> = {
    plan_starter: "Starter Plan",
    starter: "Starter Plan",
    plan_growth: "Growth Plan",
    growth: "Growth Plan",
    plan_basic: "Basic Plan",
    basic: "Basic Plan",
    plan_standard: "Standard Plan",
    standard: "Standard Plan",
    plan_premium: "Premium Plan",
    premium: "Premium Plan",
    plan_enterprise: "Enterprise Plan",
    enterprise: "Enterprise Plan",
    plan_custom: "Custom Plan",
    custom: "Custom Plan",
  };
  if (map[name]) return map[name];
  if (name && name.includes(",")) return "Custom Built Plan";
  if (name) return name.charAt(0).toUpperCase() + name.slice(1);
  return "Standard License";
}

export { SubscriptionPage as AdminSubscriptionPage };
