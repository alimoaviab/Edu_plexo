/**
 * SubscriptionPage — Complete subscription management UI.
 *
 * Sections:
 *   1. Current Plan Card (status, usage, expiry)
 *   2. Usage Progress Bar
 *   3. Pricing Cards (Starter, Growth, Custom)
 *   4. Subscription History
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SchoolShell } from "@/layouts/SchoolShell";
import * as service from "../services/subscription.service";
import { CurrentPlanCard } from "@/components/subscription/CurrentPlanCard";

import { useSubscription } from "../hooks/useSubscription";
import type { Plan } from "../services/subscription.service";

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

  if (isLoading) {
    return <SubscriptionSkeleton />;
  }

  const sub = current?.subscription;
  const studentsUsed = current?.students_used ?? 0;

  const defaultPlans: Plan[] = [
    { id: "plan_basic", name: "basic", display_name: "Basic Plan", price: 4000, currency: "PKR", student_limit: 100, features: ["All Premium Modules Included", "Unlimited Teacher Accounts", "Parent & Student Portals", "Complete Academic Suite", "Standard Support"], is_custom: false, popular: false },
    { id: "plan_standard", name: "standard", display_name: "Standard Plan", price: 8000, currency: "PKR", student_limit: 300, features: ["All Premium Modules Included", "Unlimited Teacher Accounts", "Parent & Student Portals", "Complete Academic Suite", "Priority Support"], is_custom: false, popular: true },
    { id: "plan_premium", name: "premium", display_name: "Premium Plan", price: 15000, currency: "PKR", student_limit: 800, features: ["All Premium Modules Included", "Unlimited Teacher Accounts", "Parent & Student Portals", "Complete Academic Suite", "Dedicated Support"], is_custom: false, popular: false },
    { id: "plan_enterprise", name: "enterprise", display_name: "Enterprise Plan", price: 30000, currency: "PKR", student_limit: 2000, features: ["Custom Integrations", "Enterprise Features", "Custom Student Limit", "Priority Setup"], is_custom: true, popular: false },
  ];

  const displayPlans = plans && plans.length > 0 ? plans : defaultPlans;

  const seen = new Set<string>();
  const deduped = history.filter((entry) => {
    const key = `${entry.action}::${entry.plan_name}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <SchoolShell>
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Subscription & Billing</h1>
          <p className="mt-2 text-gray-600">Manage your school's subscription plan and student limits</p>
        </div>


        {/* Current Plan & Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CurrentPlanCard subscription={sub ?? null} studentsUsed={studentsUsed} />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-center">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Student Usage</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-gray-900">{studentsUsed}</span>
              <span className="text-gray-500">/ {sub?.student_limit || 0} students</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${!sub ? "bg-gray-200" :
                  studentsUsed >= sub.student_limit ? "bg-red-500" :
                    studentsUsed >= sub.student_limit * 0.8 ? "bg-yellow-500" :
                      "bg-green-500"
                  }`}
                style={{ width: `${Math.min(100, sub ? (studentsUsed / sub.student_limit) * 100 : 0)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-medium">
              <span>{sub ? Math.round((studentsUsed / sub.student_limit) * 100) : 0}% used</span>
              <span>{sub ? Math.max(0, sub.student_limit - studentsUsed) : 0} slots remaining</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayPlans.map((plan) => (
              <PricingCard
                key={plan.name}
                plan={plan}
                isCurrentPlan={sub?.plan_name === plan.name}
                canTrial={current?.can_trial ?? false}
                onStartTrial={async () => {
                  await startTrial(plan.name);
                  navigate("/admin/dashboard");
                }}
                onUpgrade={() => navigate("/admin/subscription/payment", { state: { plan } })}
                onManualSubscribe={() => navigate("/admin/subscription/custom")}
                isUpgrading={isUpgrading}
                isStartingTrial={isStartingTrial}
                sub={sub}
              />
            ))}
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (() => {
          return (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Subscription History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 border-b border-gray-200 uppercase text-xs">
                    <tr>
                      <th className="text-left py-3 px-2 text-gray-500 font-medium">Plan</th>
                      <th className="text-left py-3 px-2 text-gray-500 font-medium">Action</th>
                      <th className="text-left py-3 px-2 text-gray-500 font-medium">Amount</th>
                      <th className="text-left py-3 px-2 text-gray-500 font-medium">Period</th>
                      <th className="text-left py-3 px-2 text-gray-500 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deduped.map((entry) => (
                      <tr key={entry.id} className="border-b border-gray-50">
                        <td className="py-3 px-2 font-medium text-gray-900">{planDisplayName(entry.plan_name)}</td>
                        <td className="py-3 px-2 capitalize text-gray-600">{entry.action.replace(/_/g, " ")}</td>
                        <td className="py-3 px-2 text-gray-600">
                          {entry.amount > 0 ? `PKR ${entry.amount.toLocaleString()}` : "Free"}
                        </td>
                        <td className="py-3 px-2 text-gray-500 text-xs">
                          {new Date(entry.start_date).toLocaleDateString()} — {new Date(entry.end_date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${entry.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                            }`}>
                            {entry.payment_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}
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
  onManualSubscribe: () => void;
  isUpgrading: boolean;
  isStartingTrial: boolean;
  sub: any;
}

function PricingCard({ plan, isCurrentPlan, canTrial, onStartTrial, onUpgrade, onManualSubscribe, isUpgrading, isStartingTrial, sub }: PricingCardProps) {
  return (
    <div className={`relative bg-white rounded-2xl border-2 p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${plan.popular ? "border-blue-500 shadow-md" : "border-gray-200"
      } ${isCurrentPlan ? "ring-2 ring-blue-200" : ""}`}>
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Current
          </span>
        </div>
      )}

      <div className="text-center pt-2">
        <h3 className="text-lg font-bold text-gray-900">{plan.display_name}</h3>
        <div className="mt-4">
          {plan.is_custom ? (
            <div className="text-3xl font-bold text-gray-900">Custom Modules</div>
          ) : (
            <>
              <span className="text-4xl font-bold text-gray-900">
                {plan.price.toLocaleString()}
              </span>
              <span className="text-gray-500 text-sm ml-1">PKR/month</span>
            </>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Up to <span className="font-semibold text-gray-700">{plan.student_limit}+</span> students
        </p>
      </div>

      {/* Features */}
      <ul className="mt-6 space-y-3">
        {(plan.features || []).map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
            <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      {/* Action Button */}
      <div className="mt-8">
        {plan.is_custom ? (
          <button
            onClick={onManualSubscribe}
            className="w-full py-3 px-4 rounded-xl font-medium border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition"
          >
            Build Your Own Plan
          </button>
        ) : isCurrentPlan ? (
          <button disabled className="w-full py-3 px-4 rounded-xl font-medium bg-gray-100 text-gray-400 cursor-not-allowed">
            Current Plan
          </button>
        ) : canTrial && !plan.is_custom ? (
          <button
            onClick={onStartTrial}
            disabled={isStartingTrial}
            className="w-full py-3 px-4 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isStartingTrial ? "Starting..." : "🎁 Start Free Trial"}
          </button>
        ) : (
          <button
            onClick={onUpgrade}
            disabled={isUpgrading}
            className={`w-full py-3 px-4 rounded-xl font-medium transition disabled:opacity-50 ${plan.popular
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
          >
            {isUpgrading ? "Upgrading..." : (sub?.status === "expired" || sub?.status === "cancelled" ? "Renew Subscription" : "Upgrade Plan")}
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
      <div className="h-8 w-64 bg-gray-200 rounded" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 h-48" />
        <div className="bg-white rounded-2xl border border-gray-200 p-6 h-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 h-96" />
        ))}
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────

function planDisplayName(name: string): string {
  const map: Record<string, string> = {
    basic: "Basic Plan",
    standard: "Standard Plan",
    premium: "Premium Plan",
    enterprise: "Enterprise Plan",
  };
  if (map[name]) return map[name];
  // If name is an encoded package string (comma-separated modules like "academic,learning,...")
  // show a friendly label instead of the raw string
  if (name && name.includes(",")) return "Custom Built Plan";
  if (name) return name.charAt(0).toUpperCase() + name.slice(1);
  return "—";
}

export { SubscriptionPage as AdminSubscriptionPage };
