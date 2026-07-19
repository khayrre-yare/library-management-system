export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`button button--${variant} button--${size} ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="button__spinner" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
}
