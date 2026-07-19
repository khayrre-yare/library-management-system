import Icon from './Icon';

const legacyIcons = {
  '▤': 'books',
  '$': 'purchase',
  '◷': 'clock',
  '✉': 'message',
  '▱': 'cart',
  '⌕': 'search',
  '⌁': 'inbox',
};

export default function EmptyState({
  title,
  message,
  action,
  icon = '⌁',
  compact = false,
}) {
  return (
    <div className={`empty-state ${compact ? 'empty-state--compact' : ''}`}>
      <div className="empty-state__icon" aria-hidden="true">
        <Icon name={legacyIcons[icon] || icon} size={27} />
      </div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
