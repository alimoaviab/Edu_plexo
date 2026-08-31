import { SchoolShell } from "@/layouts/SchoolShell";
import { ExpenseListPage } from "@/modules/expenses/components/ExpenseListPage";

export function ExpenseManagerPage() {
  return (
    <SchoolShell eyebrow="Finance" title="Expense Manager">
      <ExpenseListPage />
    </SchoolShell>
  );
}

export default ExpenseManagerPage;
