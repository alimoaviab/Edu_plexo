import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTenantContext } from "@/hooks/useTenantContext";
import { showToast } from "@/utils/toast";
import {
  ExpenseFilters,
  ExpenseFormInput,
  ExpenseRecord,
  ExpenseStats,
  ExpenseListResponse,
} from "../types/expense.types";
import * as expenseService from "../services/expense.service";

export function useExpenses(filters: ExpenseFilters = {}) {
  const queryClient = useQueryClient();
  const { schoolId, academicYearId } = useTenantContext();

  const queryFilters: ExpenseFilters = {
    ...filters,
    academic_year_id: filters.academic_year_id || academicYearId,
  };

  // 1. Fetch Expenses List
  const listQuery = useQuery<ExpenseListResponse>({
    queryKey: ["expenses", "list", schoolId, queryFilters],
    queryFn: async () => {
      const res = await expenseService.listExpenses(queryFilters);
      if (!res.ok) {
        throw new Error(res.error?.message || "Failed to load expenses");
      }
      return res.data!;
    },
    enabled: !!schoolId,
    staleTime: 30 * 1000,
  });

  // 2. Fetch Expenses Stats & Profit Summary
  const statsQuery = useQuery<ExpenseStats>({
    queryKey: ["expenses", "stats", schoolId, queryFilters.academic_year_id],
    queryFn: async () => {
      const res = await expenseService.getExpenseStats(queryFilters.academic_year_id);
      if (!res.ok) {
        throw new Error(res.error?.message || "Failed to load expense statistics");
      }
      return res.data!;
    },
    enabled: !!schoolId,
    staleTime: 30 * 1000,
  });

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard", "composite"] });
  };

  // 3. Create Expense Mutation
  const createMutation = useMutation({
    mutationFn: async (input: ExpenseFormInput) => {
      const res = await expenseService.createExpense({
        ...input,
        academic_year_id: input.academic_year_id || academicYearId,
      });
      if (!res.ok) {
        throw new Error(res.error?.message || "Failed to create expense");
      }
      return res.data!;
    },
    onSuccess: () => {
      showToast("Expense recorded successfully.", "success");
      invalidateQueries();
    },
    onError: (err: Error) => {
      showToast(err.message || "Failed to create expense", "error");
    },
  });

  // 4. Update Expense Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<ExpenseFormInput> }) => {
      const res = await expenseService.updateExpense(id, input);
      if (!res.ok) {
        throw new Error(res.error?.message || "Failed to update expense");
      }
      return res.data!;
    },
    onSuccess: () => {
      showToast("Expense updated successfully.", "success");
      invalidateQueries();
    },
    onError: (err: Error) => {
      showToast(err.message || "Failed to update expense", "error");
    },
  });

  // 5. Delete Expense Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await expenseService.deleteExpense(id);
      if (!res.ok) {
        throw new Error(res.error?.message || "Failed to delete expense");
      }
      return res.data!;
    },
    onSuccess: () => {
      showToast("Expense deleted successfully.", "success");
      invalidateQueries();
    },
    onError: (err: Error) => {
      showToast(err.message || "Failed to delete expense", "error");
    },
  });

  return {
    expenses: listQuery.data?.items || [],
    total: listQuery.data?.total || 0,
    page: listQuery.data?.page || 1,
    limit: listQuery.data?.limit || 20,
    totalPages: listQuery.data?.total_pages || 1,
    stats: statsQuery.data,
    isLoading: listQuery.isLoading || statsQuery.isLoading,
    isFetching: listQuery.isFetching,
    isError: listQuery.isError || statsQuery.isError,
    error: listQuery.error || statsQuery.error,
    refetch: () => {
      listQuery.refetch();
      statsQuery.refetch();
    },
    createExpense: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateExpense: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteExpense: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
