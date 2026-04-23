export default function Spinner({ label = "Loading..." }) {
  return (
    <div className="spinner-wrap" aria-live="polite" aria-busy="true">
      <div className="spinner" />
      <span>{label}</span>
    </div>
  );
}
