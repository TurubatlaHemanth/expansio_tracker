export default function Header() {
  const appTitle = import.meta.env.VITE_APP_TITLE || "Expense Tracker";

  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">Personal Finance</p>
        <h1>{appTitle}</h1>
        <p className="page-subtitle">
          Record expenses, review spending, and handle real-world retries safely.
        </p>
      </div>
    </header>
  );
}
