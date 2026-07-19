export default function Select({
  label,
  error,
  id,
  children,
  className = '',
  required,
  ...props
}) {
  const selectId = id || props.name;

  return (
    <div className={`field ${className}`.trim()}>
      {label && (
        <label className="field__label" htmlFor={selectId}>
          {label}
          {required && <span className="field__required"> *</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`field__control field__select ${error ? 'field__control--error' : ''}`}
        aria-invalid={Boolean(error)}
        required={required}
        {...props}
      >
        {children}
      </select>
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}
