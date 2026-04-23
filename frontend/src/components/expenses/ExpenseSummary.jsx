import Card from "../ui/Card";

export default function ExpenseSummary({ total, count }) {
  return (
    <Card className="summary-card">
      <div className="summary-grid">
        <div className="summary-item">
          <span className="summary-label">Visible Expenses</span>
          <strong className="summary-value">{count}</strong>
        </div>

        <div className="summary-item">
          <span className="summary-label">Current Total</span>
          <strong className="summary-value">₹{total}</strong>
        </div>
      </div>
    </Card>
  );
}
