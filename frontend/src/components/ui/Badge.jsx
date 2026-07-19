import Icon from './Icon';

const statusIcons = {
  approved: 'check',
  available: 'check',
  success: 'check',
  'up to date': 'check',
  pending: 'clock',
  unread: 'clock',
  'needs review': 'clock',
  rejected: 'close',
  unavailable: 'close',
  returned: 'returned',
};

export default function Badge({ children, variant = 'neutral', className = '', icon }) {
  const label = typeof children === 'string' ? children.toLowerCase() : '';
  const iconName = icon === false ? null : icon || statusIcons[label];
  return (
    <span className={`badge badge--${variant} ${className}`.trim()}>
      {iconName && <Icon name={iconName} size={12} />}
      {children}
    </span>
  );
}
