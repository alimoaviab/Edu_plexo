/**
 * Subscription types for mobile app — matching backend-go and school-react-app.
 */

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
}

export interface ModulePackage {
  id: string;
  name: string;
  rate: number;
  mandatory: boolean;
  modules: string[];
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
  // ── Backend-derived lifecycle state (render as-is, never invent) ──
  phase?: string;
  payment_status?: 'none' | 'pending' | 'approved';
  next_plan?: string;
  next_plan_start_at?: string;
  grace_ends_at?: string;
  suspends_at?: string;
  renews_at?: string;
  trial_ends_at?: string;
  is_suspended?: boolean;
  in_grace_period?: boolean;
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

export interface PaymentProofPayload {
  plan_id: string;
  payment_method_id?: string;
  screenshot_url?: string;
  transaction_id: string;
  amount: number;
  notes?: string;
}

export interface BankAccount {
  id: string;
  bank: string;
  type: string;
  color: string;
  icon: string;
  rows: { label: string; value: string; highlight?: boolean }[];
}
