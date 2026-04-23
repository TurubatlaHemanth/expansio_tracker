import { useEffect } from "react";
import AppShell from "./components/layout/AppShell";
import Header from "./components/layout/Header";
import ExpenseForm from "./components/expenses/ExpenseForm";
import ExpenseFilters from "./components/expenses/ExpenseFilters";
import ExpenseSummary from "./components/expenses/ExpenseSummary";
import ExpenseTable from "./components/expenses/ExpenseTable";
import { useExpenses } from "./hooks/useExpenses";

export default function App() {
  const {
    form,
    expenses,
    total,
    filters,
    loadingList,
    submitting,
    listError,
    submitError,
    submitSuccess,
    categoryOptions,
    loadExpenses,
    updateForm,
    updateFilter,
    submitExpense,
    resetForm
  } = useExpenses();

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  function handleFormChange(event) {
    const { name, value } = event.target;
    updateForm(name, value);
  }

  return (
    <AppShell>
      <Header />

      <div className="page-grid">
        <div className="left-column">
          <ExpenseForm
            form={form}
            onChange={handleFormChange}
            onSubmit={submitExpense}
            onReset={resetForm}
            submitting={submitting}
            submitError={submitError}
            submitSuccess={submitSuccess}
          />
        </div>

        <div className="right-column">
          <ExpenseFilters
            category={filters.category}
            sort={filters.sort}
            categories={categoryOptions}
            onCategoryChange={(value) => updateFilter("category", value)}
            onSortChange={(value) => updateFilter("sort", value)}
            onRefresh={loadExpenses}
            loading={loadingList}
          />

          <ExpenseSummary total={total} count={expenses.length} />

          <ExpenseTable
            expenses={expenses}
            loading={loadingList}
            error={listError}
          />
        </div>
      </div>
    </AppShell>
  );
}
