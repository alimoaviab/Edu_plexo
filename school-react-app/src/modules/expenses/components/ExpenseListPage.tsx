import { useMemo, useState } from "react";
import {
  PageHeader,
  Button,
  DataTable,
  DataTableColumn,
  RowAction,
  Badge,
  EmptyState,
  TableSkeleton,
  StatCardGrid,
  StatCardGridItem,
  ConfirmModal,
  Select,
  Pagination,
} from "@/components/ui";
import { AppIcon } from "shared/ui/AppIcon";
import { useExpenses } from "../hooks/useExpenses";
import { ExpenseRecord, ExpenseFormInput } from "../types/expense.types";
import { ExpenseDrawer } from "./ExpenseDrawer";

const CATEGORY_COLORS: Record<string, string> = {
  Electricity: "bg-amber-50 text-amber-700 border-amber-200",
  Rent: "bg-purple-50 text-purple-700 border-purple-200",
  Maintenance: "bg-blue-50 text-blue-700 border-blue-200",
  Stationery: "bg-teal-50 text-teal-700 border-teal-200",
  Transport: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Salaries: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Utilities: "bg-orange-50 text-orange-700 border-orange-200",
  Other: "bg-slate-100 text-slate-700 border-slate-200",
};

const CATEGORY_FILTER_OPTIONS = [
  { label: "All Categories", value: "all" },
  { label: "Electricity", value: "Electricity" },
  { label: "Rent", value: "Rent" },
  { label: "Maintenance", value: "Maintenance" },
  { label: "Stationery", value: "Stationery" },
  { label: "Transport", value: "Transport" },
  { label: "Salaries", value: "Salaries" },
  { label: "Utilities", value: "Utilities" },
  { label: "Other", value: "Other" },
];

const PAYMENT_FILTER_OPTIONS = [
  { label: "All Payment Methods", value: "all" },
  { label: "Cash", value: "Cash" },
  { label: "Bank Transfer", value: "Bank Transfer" },
  { label: "Online/Card", value: "Online/Card" },
  { label: "Cheque", value: "Cheque" },
  { label: "EasyPaisa/JazzCash", value: "EasyPaisa/JazzCash" },
  { label: "Other", value: "Other" },
];

export function ExpenseListPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseRecord | null>(null);

  // Delete modal state
  const [deletingExpense, setDeletingExpense] = useState<ExpenseRecord | null>(null);

  const {
    expenses,
    total,
    totalPages,
    stats,
    isLoading,
    createExpense,
    isCreating,
    updateExpense,
    isUpdating,
    deleteExpense,
    isDeleting,
  } = useExpenses({
    search,
    category,
    payment_method: paymentMethod,
    start_date: startDate,
    end_date: endDate,
    page,
    limit: 20,
  });

  const statItems: StatCardGridItem[] = useMemo(() => {
    return [
      {
        label: "Total Expenses",
        value: `PKR ${(stats?.total_expenses ?? 0).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        icon: "receipt_long",
        accent: "rose",
      },
      {
        label: "This Month",
        value: `PKR ${(stats?.this_month_expenses ?? 0).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        icon: "calendar_month",
        accent: "amber",
      },
      {
        label: "Expense Entries",
        value: String(stats?.total_entries ?? 0),
        icon: "assignment",
        accent: "blue",
      },
      {
        label: "This Month Entries",
        value: String(stats?.this_month_entries ?? 0),
        icon: "event_available",
        accent: "emerald",
      },
    ];
  }, [stats]);

  const handleOpenCreate = () => {
    setEditingExpense(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (record: ExpenseRecord) => {
    setEditingExpense(record);
    setIsDrawerOpen(true);
  };

  const handleDrawerSubmit = async (input: ExpenseFormInput) => {
    if (editingExpense) {
      await updateExpense({ id: editingExpense._id || editingExpense.id || "", input });
    } else {
      await createExpense(input);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingExpense) {
      await deleteExpense(deletingExpense._id || deletingExpense.id || "");
      setDeletingExpense(null);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setPaymentMethod("all");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    category !== "all" ||
    paymentMethod !== "all" ||
    startDate !== "" ||
    endDate !== "";

  const columns: DataTableColumn<ExpenseRecord>[] = useMemo(
    () => [
      {
        key: "expense",
        label: "Expense",
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold">
              <AppIcon name="receipt" size={16} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 leading-tight truncate">{row.name}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium truncate mt-0.5">
                {row.reference_number && (
                  <span className="font-mono text-slate-500 font-semibold">
                    #{row.reference_number}
                  </span>
                )}
                {row.reference_number && row.description && <span>&bull;</span>}
                {row.description && <span className="truncate">{row.description}</span>}
              </div>
            </div>
          </div>
        ),
      },
      {
        key: "category",
        label: "Category",
        render: (row) => {
          const colorClass = CATEGORY_COLORS[row.category] || CATEGORY_COLORS.Other;
          return (
            <Badge
              variant="secondary"
              className={`text-[10px] font-bold border px-2 py-0.5 capitalize ${colorClass}`}
            >
              {row.category}
            </Badge>
          );
        },
      },
      {
        key: "amount",
        label: "Amount",
        render: (row) => (
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-xs tabular-nums">
              PKR {Number(row.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        ),
      },
      {
        key: "date",
        label: "Date",
        render: (row) => (
          <span className="text-[11px] font-medium text-slate-600">
            {row.expense_date ? new Date(row.expense_date).toLocaleDateString() : "—"}
          </span>
        ),
      },
      {
        key: "payment_method",
        label: "Payment Method",
        render: (row) => (
          <span className="text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
            {row.payment_method || "Cash"}
          </span>
        ),
      },
      {
        key: "created_by",
        label: "Added By",
        render: (row) => (
          <span className="text-[10px] text-slate-500 font-medium truncate">
            {row.created_by_name || row.created_by || "Admin"}
          </span>
        ),
      },
    ],
    []
  );

  const rowActions: RowAction<ExpenseRecord>[] = useMemo(
    () => [
      {
        label: "Edit",
        icon: "edit",
        onClick: (row) => handleOpenEdit(row),
      },
      {
        label: "Delete",
        icon: "delete",
        variant: "danger",
        onClick: (row) => setDeletingExpense(row),
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      {/* 1. Page Header */}
      <PageHeader
        title="Expense Manager"
        description="Track, categorize, and reconcile school expenditures with real-time profit calculations."
        actions={
          <Button variant="primary" onClick={handleOpenCreate} className="gap-1.5">
            <AppIcon name="add" size={16} />
            <span>Create Expense</span>
          </Button>
        }
      />

      {/* 2. Stat Cards */}
      <StatCardGrid items={statItems} />

      {/* 3. Search & Filter Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm space-y-3">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <AppIcon name="search" size={16} />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search expense name, category, description..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <Select
              value={category}
              options={CATEGORY_FILTER_OPTIONS}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Payment Method Filter */}
          <div>
            <Select
              value={paymentMethod}
              options={PAYMENT_FILTER_OPTIONS}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Date Range Group */}
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              title="From Date"
            />
            <span className="text-slate-400 text-xs font-bold">&ndash;</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              title="To Date"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
            <span>
              Showing filtered results ({total} {total === 1 ? "expense" : "expenses"} found)
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              <AppIcon name="close" size={12} />
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* 4. Table & Pagination */}
      {isLoading ? (
        <TableSkeleton />
      ) : expenses.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <EmptyState
            title="No expenses found"
            description={
              hasActiveFilters
                ? "No expense records matched the selected filters. Try broadening your search or date range."
                : "No expense records entered yet. Create your first expense to begin tracking school expenditures."
            }
            action={{
              label: "Create Expense",
              onClick: handleOpenCreate,
              icon: "add",
            }}
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <DataTable<ExpenseRecord>
              columns={columns}
              rows={expenses}
              rowActions={rowActions}
              rowKey={(row) => row._id || row.id || ""}
            />
          </div>

          {totalPages > 1 && (
            <div className="flex justify-end pt-2">
              <Pagination
                page={page}
                pages={totalPages}
                total={total}
                limit={20}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </div>
      )}

      {/* 5. Create / Edit Expense Drawer */}
      <ExpenseDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleDrawerSubmit}
        initialData={editingExpense}
        isLoading={isCreating || isUpdating}
      />

      {/* 6. Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingExpense}
        title="Delete Expense Record"
        message={
          deletingExpense
            ? `Are you sure you want to delete "${deletingExpense.name}" (PKR ${Number(
                deletingExpense.amount
              ).toLocaleString()})? Deleting this expense will remove it from the financial calculation and update the calculated profit.`
            : "Are you sure you want to delete this expense record?"
        }
        confirmLabel="Delete Expense"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingExpense(null)}
      />
    </div>
  );
}
