import { serviceRequest } from "@/services/service-client";
import {
  ExpenseRecord,
  ExpenseStats,
  ExpenseFormInput,
  ExpenseFilters,
  ExpenseListResponse,
} from "../types/expense.types";

export function listExpenses(filters?: ExpenseFilters) {
  const params = new URLSearchParams();
  if (filters?.search) params.set("search", filters.search);
  if (filters?.category && filters.category !== "all") params.set("category", filters.category);
  if (filters?.payment_method && filters.payment_method !== "all") {
    params.set("payment_method", filters.payment_method);
  }
  if (filters?.start_date) params.set("start_date", filters.start_date);
  if (filters?.end_date) params.set("end_date", filters.end_date);
  if (filters?.academic_year_id) params.set("academic_year_id", filters.academic_year_id);
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.limit) params.set("limit", String(filters.limit));

  const query = params.toString();
  return serviceRequest<ExpenseListResponse>(`/api/expenses${query ? `?${query}` : ""}`);
}

export function getExpenseStats(academicYearId?: string) {
  const params = new URLSearchParams();
  if (academicYearId) params.set("academic_year_id", academicYearId);
  const query = params.toString();
  return serviceRequest<ExpenseStats>(`/api/expenses/stats${query ? `?${query}` : ""}`);
}

export function getExpenseById(id: string) {
  return serviceRequest<ExpenseRecord>(`/api/expenses/${id}`);
}

export function createExpense(input: ExpenseFormInput) {
  return serviceRequest<ExpenseRecord>("/api/expenses", {
    method: "POST",
    body: JSON.stringify({
      ...input,
      amount: Number(input.amount),
    }),
  });
}

export function updateExpense(id: string, input: Partial<ExpenseFormInput>) {
  return serviceRequest<ExpenseRecord>(`/api/expenses/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      ...input,
      amount: input.amount !== undefined ? Number(input.amount) : undefined,
    }),
  });
}

export function deleteExpense(id: string) {
  return serviceRequest<{ success: boolean; id: string }>(`/api/expenses/${id}`, {
    method: "DELETE",
  });
}
