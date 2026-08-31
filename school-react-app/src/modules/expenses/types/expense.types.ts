export type ExpenseCategory =
  | "Electricity"
  | "Rent"
  | "Maintenance"
  | "Stationery"
  | "Transport"
  | "Salaries"
  | "Utilities"
  | "Other";

export type PaymentMethod =
  | "Cash"
  | "Bank Transfer"
  | "Online/Card"
  | "Cheque"
  | "EasyPaisa/JazzCash"
  | "Other";

export interface ExpenseRecord {
  _id: string;
  id?: string;
  school_id: string;
  campus_id?: string;
  academic_year_id: string;
  name: string;
  category: ExpenseCategory | string;
  amount: number;
  currency: string;
  expense_date: string;
  payment_method: PaymentMethod | string;
  description?: string;
  reference_number?: string;
  created_by: string;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseStats {
  total_expenses: number;
  this_month_expenses: number;
  total_entries: number;
  this_month_entries: number;
  total_revenue: number;
  net_profit: number;
}

export interface ExpenseFormInput {
  name: string;
  category: ExpenseCategory | string;
  amount: number | string;
  currency?: string;
  expense_date: string;
  payment_method: PaymentMethod | string;
  description?: string;
  reference_number?: string;
  campus_id?: string;
  academic_year_id?: string;
}

export interface ExpenseFilters {
  search?: string;
  category?: string;
  payment_method?: string;
  start_date?: string;
  end_date?: string;
  academic_year_id?: string;
  page?: number;
  limit?: number;
}

export interface ExpenseListResponse {
  items: ExpenseRecord[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
