import Icon from './Icon';

export default function Alert({ children, type = 'info', title, className = '' }) {
  return (
    <div className={`alert alert--${type} ${className}`.trim()} role="alert">
      <span className="alert__icon" aria-hidden="true">
        <Icon name={type === 'success' ? 'check' : type === 'error' ? 'alert' : 'info'} size={14} />
      </span>
      <div>
        {title && <strong className="alert__title">{title}</strong>}
        <div className="alert__content">{children}</div>
      </div>
    </div>
  );
}
