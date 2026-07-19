import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, hint, id, className = '', required, ...props },
  ref,
) {
  const inputId = id || props.name;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className={`field ${className}`.trim()}>
      {label && (
        <label className="field__label" htmlFor={inputId}>
          {label}
          {required && <span className="field__required"> *</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`field__control ${error ? 'field__control--error' : ''}`}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        required={required}
        {...props}
      />
      {error ? (
        <span id={`${inputId}-error`} className="field__error">
          {error}
        </span>
      ) : hint ? (
        <span id={`${inputId}-hint`} className="field__hint">
          {hint}
        </span>
      ) : null}
    </div>
  );
});

export default Input;
