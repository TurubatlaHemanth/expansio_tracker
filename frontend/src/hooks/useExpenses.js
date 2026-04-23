import { useCallback, useMemo, useRef, useState } from "react";
import { createExpense, getExpenses } from "../api/expenses";

const initialForm = {
  amount: "",
  category: "",
  description: "",
  date: ""
};

export function useExpenses() {
  const [form, setForm] = useState(initialForm);

  // filtered expenses shown in table
  const [expenses, setExpenses] = useState([]);

  // stores every category ever loaded
  const [allCategories, setAllCategories] = useState([]);

  const [total, setTotal] = useState("0.00");

  const [filters, setFilters] = useState({
    category: "",
    sort: "date_desc"
  });

  const [loadingList, setLoadingList] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [listError, setListError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const pendingIdempotencyKeyRef = useRef(null);

  // dropdown categories (always full list)
  const categoryOptions = useMemo(() => {
    return [...new Set(allCategories)].sort((a, b) =>
      a.localeCompare(b)
    );
  }, [allCategories]);

  const loadExpenses = useCallback(async () => {
    setLoadingList(true);
    setListError("");

    try {
      const data = await getExpenses(filters);

      const fetchedExpenses = Array.isArray(data.expenses)
        ? data.expenses
        : [];

      setExpenses(fetchedExpenses);
      setTotal(data.total || "0.00");

      // merge categories so dropdown keeps all options
      const categories = fetchedExpenses
        .map((expense) => expense.category)
        .filter(Boolean)
        .map((category) => category.trim());

      setAllCategories((prev) => {
        const merged = new Set([...prev, ...categories]);
        return [...merged];
      });
    } catch (error) {
      setListError(error.message || "Failed to load expenses");
    } finally {
      setLoadingList(false);
    }
  }, [filters]);

  function updateForm(name, value) {
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function updateFilter(name, value) {
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function validateForm() {
    const errors = [];

    if (!form.amount.trim()) {
      errors.push("Amount is required");
    } else if (!/^\d+(\.\d{1,2})?$/.test(form.amount.trim())) {
      errors.push(
        "Amount must be a valid non-negative number with up to 2 decimal places"
      );
    }

    if (!form.category.trim()) {
      errors.push("Category is required");
    }

    if (!form.description.trim()) {
      errors.push("Description is required");
    }

    if (!form.date.trim()) {
      errors.push("Date is required");
    }

    return errors;
  }

  async function submitExpense() {
    if (submitting) return false;

    setSubmitError("");
    setSubmitSuccess("");

    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      setSubmitError(validationErrors.join(", "));
      return false;
    }

    const payload = {
      amount: form.amount.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      date: form.date
    };

    if (!pendingIdempotencyKeyRef.current) {
      pendingIdempotencyKeyRef.current = crypto.randomUUID();
    }

    try {
      setSubmitting(true);

      const result = await createExpense(
        payload,
        pendingIdempotencyKeyRef.current
      );

      setSubmitSuccess(
        result.idempotentReplay
          ? "Duplicate retry detected. Existing expense returned."
          : "Expense added successfully."
      );

      setForm(initialForm);
      pendingIdempotencyKeyRef.current = null;

      await loadExpenses();

      return true;
    } catch (error) {
      setSubmitError(error.message || "Failed to create expense");
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setForm(initialForm);
    setSubmitError("");
    setSubmitSuccess("");
    pendingIdempotencyKeyRef.current = null;
  }

  return {
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
  };
}