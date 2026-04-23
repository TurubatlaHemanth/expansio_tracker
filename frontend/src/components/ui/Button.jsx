export default function Button({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  onClick,
  className = ""
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn btn--${variant} ${className}`.trim()}
    >
      {children}
    </button>
  );
}
