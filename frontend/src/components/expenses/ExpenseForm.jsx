import { useState } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Input from "../ui/Input";

export default function ExpenseForm({
  form,
  onChange,
  onSubmit,
  onReset,
  submitting
}) {
  const [amountError, setAmountError] = useState("");

  function handleAmountChange(event) {
    const value = event.target.value;

    if (value !== "" && Number(value) <= 0) {
      setAmountError("Amount must be greater than 0");
    } else {
      setAmountError("");
    }

    onChange(event);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (Number(form.amount) <= 0) {
      setAmountError("Amount must be greater than 0");
      return;
    }

    setAmountError("");

    const success = await onSubmit();

    // clear form after successful submit
    if (success) {
      onReset();
    }
  }

  return (
    <Card>
      <div className="card-header">
        <h2>Add Expense</h2>
        <p>Create a new expense entry and save it to the server.</p>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        {amountError && (
          <div
            style={{
              color: "red",
              fontSize: "12px",
              marginBottom: "-8px"
            }}
          >
            {amountError}
          </div>
        )}

        <Input
          id="amount"
          name="amount"
          label="Amount"
          type="text"
          placeholder="e.g. 250.50"
          value={form.amount}
          onChange={handleAmountChange}
          disabled={submitting}
        />

        <Input
          id="category"
          name="category"
          label="Category"
          type="text"
          placeholder="e.g. Food"
          value={form.category}
          onChange={onChange}
          disabled={submitting}
        />

        <Input
          id="description"
          name="description"
          label="Description"
          type="text"
          placeholder="e.g. Lunch"
          value={form.description}
          onChange={onChange}
          disabled={submitting}
        />

        <Input
          id="date"
          name="date"
          label="Date"
          type="date"
          value={form.date}
          onChange={onChange}
          disabled={submitting}
        />

        <div className="button-row">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Add Expense"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={onReset}
            disabled={submitting}
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}