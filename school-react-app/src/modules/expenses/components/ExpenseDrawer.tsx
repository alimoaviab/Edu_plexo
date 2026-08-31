import { useEffect, useState, type FormEvent } from "react";
import { Drawer, Button, Input, Select, LoadingButton } from "@/components/ui";
import { AppIcon } from "shared/ui/AppIcon";
import {
  ExpenseCategory,
  ExpenseFormInput,
  ExpenseRecord,
  PaymentMethod,
} from "../types/expense.types";

interface ExpenseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: ExpenseFormInput) => Promise<any>;
  initialData?: ExpenseRecord | null;
  isLoading?: boolean;
}

const CATEGORY_OPTIONS: { label: string; value: ExpenseCategory }[] = [
  { label: "Electricity", value: "Electricity" },
  { label: "Rent", value: "Rent" },
  { label: "Maintenance", value: "Maintenance" },
  { label: "Stationery", value: "Stationery" },
  { label: "Transport", value: "Transport" },
  { label: "Salaries", value: "Salaries" },
  { label: "Utilities", value: "Utilities" },
  { label: "Other", value: "Other" },
];

const PAYMENT_METHOD_OPTIONS: { label: string; value: PaymentMethod }[] = [
  { label: "Cash", value: "Cash" },
  { label: "Bank Transfer", value: "Bank Transfer" },
  { label: "Online/Card", value: "Online/Card" },
  { label: "Cheque", value: "Cheque" },
  { label: "EasyPaisa/JazzCash", value: "EasyPaisa/JazzCash" },
  { label: "Other", value: "Other" },
];

export function ExpenseDrawer({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: ExpenseDrawerProps) {
  const isEditing = !!initialData;

  const [form, setForm] = useState<ExpenseFormInput>({
    name: "",
    category: "Electricity",
    amount: "",
    expense_date: new Date().toISOString().split("T")[0],
    payment_method: "Cash",
    description: "",
    reference_number: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        category: (initialData.category as ExpenseCategory) || "Electricity",
        amount: String(initialData.amount || ""),
        expense_date: initialData.expense_date
          ? new Date(initialData.expense_date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        payment_method: (initialData.payment_method as PaymentMethod) || "Cash",
        description: initialData.description || "",
        reference_number: initialData.reference_number || "",
      });
    } else {
      setForm({
        name: "",
        category: "Electricity",
        amount: "",
        expense_date: new Date().toISOString().split("T")[0],
        payment_method: "Cash",
        description: "",
        reference_number: "",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) {
      errs.name = "Expense name is required";
    }
    if (!form.category) {
      errs.category = "Please select a category";
    }
    const numAmount = Number(form.amount);
    if (!form.amount || isNaN(numAmount) || numAmount <= 0) {
      errs.amount = "Please enter a valid amount greater than 0";
    }
    if (!form.expense_date) {
      errs.expense_date = "Expense date is required";
    }
    if (!form.payment_method) {
      errs.payment_method = "Please select a payment method";
    }
    // Reference and description are completely optional
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit(form);
      onClose();
    } catch {
      // Error handled by parent / hook
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} width="max-w-lg">
      <form
        onSubmit={handleSubmit}
        className="flex h-full max-h-screen flex-col bg-white overflow-hidden select-none"
      >
        {/* Drawer Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm border border-blue-100">
              <AppIcon name="receipt_long" size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {isEditing ? "Edit Expense" : "Create Expense"}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                {isEditing
                  ? "Update expense details and recalculated profit."
                  : "Add school expenditure to adjust ledger balances."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <AppIcon name="close" size={18} />
          </button>
        </div>

        {/* Drawer Form Fields (Scrollable body) */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Expense Name */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Expense Name <span className="text-rose-500">*</span>
            </label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Monthly Electricity Bill, Campus Maintenance..."
              error={errors.name}
            />
          </div>

          {/* Category & Payment Method Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <Select
                value={form.category}
                options={CATEGORY_OPTIONS}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                error={errors.category}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Payment Method <span className="text-rose-500">*</span>
              </label>
              <Select
                value={form.payment_method}
                options={PAYMENT_METHOD_OPTIONS}
                onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                error={errors.payment_method}
              />
            </div>
          </div>

          {/* Amount & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Amount (PKR) <span className="text-rose-500">*</span>
              </label>
              <Input
                type="number"
                min="1"
                step="any"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
                error={errors.amount}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Expense Date <span className="text-rose-500">*</span>
              </label>
              <Input
                type="date"
                value={form.expense_date}
                onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
                error={errors.expense_date}
              />
            </div>
          </div>

          {/* Reference / Invoice Number (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-slate-700">
                Reference / Invoice Number
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Optional</span>
            </div>
            <Input
              value={form.reference_number}
              onChange={(e) => setForm({ ...form, reference_number: e.target.value })}
              placeholder="e.g. INV-2026-099, CHQ-4458..."
            />
          </div>

          {/* Description / Notes (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-slate-700">
                Description / Notes
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Optional</span>
            </div>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Additional details regarding this expenditure..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Drawer Footer (Fixed at bottom) */}
        <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 z-20">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            {isEditing ? "Save Changes" : "Create Expense"}
          </LoadingButton>
        </div>
      </form>
    </Drawer>
  );
}
