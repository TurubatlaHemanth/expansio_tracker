export default function Input({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  disabled = false
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}
