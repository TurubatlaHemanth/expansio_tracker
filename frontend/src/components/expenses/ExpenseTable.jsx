import Card from "../ui/Card";
import Message from "../ui/Message";
import Spinner from "../ui/Spinner";
import { useEffect, useState } from "react";

export default function ExpenseTable({ expenses, loading, error }) {
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const hasNegativeAmount = expenses.some(
      (expense) => Number(expense.amount) < 0
    );

    if (hasNegativeAmount) {
      const message = "Negative amount is not allowed.";

      alert.message(message);

      // console log on change
      console.error(message);
    } else {
      setValidationError("");
    }
  }, [expenses]);

  return (
    <Card>
      <div className="card-header">
        <h2>Expense List</h2>
        <p>Expenses retrieved from the backend API.</p>
      </div>

      {/* <Message type="error">{error}</Message>

      <Message type="error">{validationError}</Message> */}

      {loading ? (
        <Spinner label="Loading expenses..." />
      ) : (
        <div className="table-wrap">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-cell">
                    No expenses found.
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.date}</td>
                    <td>{expense.category}</td>
                    <td>{expense.description}</td>
                    <td className="text-right">
                      ₹{expense.amount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}