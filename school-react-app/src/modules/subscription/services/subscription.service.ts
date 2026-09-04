import { serviceRequest } from "@/services/service-client";

export interface Plan {
  id: string;
  name: string;
  display_name: string;
  price: number;
  currency: string;
  student_limit: number;
  features: string[];
  is_custom: boolean;
  popular: boolean;
}

export interface Subscription {
  id: string;
  school_id: string;
  owner_user_id?: string;
  plan_name: string;
  student_limit: number;
  price: number;
  currency: string;
  start_date: string;
  end_date: string;
  status: string;
  is_trial: boolean;
  trial_used: boolean;
  trial_start_date?: string;
  trial_end_date?: string;
  grace_ends_at?: string;
}

export interface ModulePackage {
  id: string;
  name: string;
  rate: number;
  mandatory: boolean;
  modules: string[];
}

export interface PendingPayment {
  id: string;
  school_id: string;
  plan_id: string;
  transaction_id: string;
  amount: number;
  status: string;
  submitted_at: string;
  notes?: string;
  screenshot_url?: string;
}

export interface CurrentSubscription {
  subscription: Subscription | null;
  students_used: number;
  students_limit: number;
  days_remaining: number;
  is_expired: boolean;
  can_trial: boolean;
  selected_packages?: string[];
  available_packages?: ModulePackage[];
  allowed_modules?: Record<string, boolean>;
  package_builder_required?: boolean;
  pending_payment?: PendingPayment | null;
  // ── Backend-derived lifecycle state (render as-is, never invent) ──
  phase?: string;
  payment_status?: "none" | "pending" | "approved";
  next_plan?: string;
  next_plan_start_at?: string;
  grace_ends_at?: string;
  suspends_at?: string;
  renews_at?: string;
  trial_ends_at?: string;
  approved_payment?: PendingPayment | null;
  is_suspended?: boolean;
  in_grace_period?: boolean;
  can_upgrade?: boolean;
  can_renew?: boolean;
}

export interface HistoryEntry {
  id: string;
  plan_name: string;
  student_limit: number;
  amount: number;
  payment_status: string;
  start_date: string;
  end_date: string;
  action: string;
  created_at: string;
}

export function getCurrent() {
  return serviceRequest<CurrentSubscription>("/api/subscription/current");
}

export function getPlans() {
  return serviceRequest<Plan[]>("/api/subscription/plans");
}

export function startTrial(planName?: string) {
  return serviceRequest<Subscription>("/api/subscription/start-trial", {
    method: "POST",
    body: planName ? JSON.stringify({ plan_name: planName }) : undefined,
  });
}

export function updatePackages(selectedPackages: string[]) {
  return serviceRequest<CurrentSubscription>("/api/subscription/packages", {
    method: "POST",
    body: JSON.stringify({ selected_packages: selectedPackages }),
  });
}

export function upgradePlan(planName: string, studentLimit?: number) {
  return serviceRequest<Subscription>("/api/subscription/upgrade", {
    method: "POST",
    body: JSON.stringify({ plan_name: planName, student_limit: studentLimit }),
  });
}

export function getHistory() {
  return serviceRequest<HistoryEntry[]>("/api/subscription/history");
}

export function submitPaymentProof(data: {
  plan_id: string;
  payment_method_id?: string;
  screenshot_url?: string;
  transaction_id: string;
  amount: number;
  notes?: string;
}) {
  return serviceRequest("/api/payment/upload", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
