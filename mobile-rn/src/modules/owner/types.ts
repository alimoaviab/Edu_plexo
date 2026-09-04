/** Backend payloads for the Owner business modules (shared web + mobile source). */

export interface OwnerSchoolAnalytics {
  school_id: string;
  school_name: string;
  code?: string;
  status?: string;
  students: number;
  teachers: number;
  classes: number;
  attendance_rate: number;
  attendance_records: number;
  revenue: number;
  revenue_30d: number;
  pending: number;
  collection_rate: number;
  new_students_30d: number;
}

export interface OwnerAnalytics {
  per_school: OwnerSchoolAnalytics[];
  totals: {
    schools?: number;
    students: number;
    teachers: number;
    classes: number;
    collected: number;
    pending: number;
    collection_rate: number;
    revenue_30d: number;
  };
}

export interface LedgerItem {
  id: string;
  date: string;
  kind: 'income' | 'expense';
  category: string;
  school_id: string;
  school_name: string;
  reference?: string;
  description: string;
  method?: string;
  debit: number;
  credit: number;
  status: string;
}

export interface OwnerLedger {
  summary: { income: number; expense: number; net: number; income_count: number; expense_count: number };
  items: LedgerItem[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export interface FinanceTrendPoint {
  month: string;
  income: number;
  expense: number;
  net: number;
}

export interface SchoolFinance {
  school_id: string;
  school_name: string;
  collected: number;
  pending: number;
  collection_rate: number;
  expenses: number;
  net_position: number;
}

export interface OwnerFinance {
  summary: { collected: number; pending: number; collection_rate: number; expenses: number; net_position: number };
  trend: FinanceTrendPoint[];
  schools: SchoolFinance[];
}

export interface OwnerBudget {
  id: string;
  school_id?: string;
  school_name: string;
  name: string;
  period_label: string;
  start_date: string;
  end_date: string;
  planned_amount: number;
  notes: string;
  actual_amount: number;
  remaining: number;
  utilization: number;
}

export interface OwnerBudgets {
  available: boolean;
  budgets: OwnerBudget[];
}

export interface OwnerAlert {
  id: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  category: 'financial' | 'academic' | 'operational' | 'subscription';
  title: string;
  message: string;
  school_id?: string;
  school_name?: string;
  metric?: string;
  action: { label: string; href: string };
  created_at: string;
}

export interface OwnerAlerts {
  alerts: OwnerAlert[];
}
