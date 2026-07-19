import useNotifications from '../../hooks/useNotifications';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';
import Icon from '../ui/Icon';

export default function AdminNotifications({ onOpenBorrowings, onOpenPurchases, onOpenMessages }) {
  const { notifications, loading } = useNotifications();

  if (loading) {
    return (
      <div className="notification-grid">
        <Skeleton height="112px" />
        <Skeleton height="112px" />
      </div>
    );
  }

  return (
    <div className="notification-grid">
      <Card className="notification-card" onClick={onOpenBorrowings} role="button" tabIndex="0">
        <span className="notification-card__icon" aria-hidden="true">
          <Icon name="borrow" size={21} />
        </span>
        <div>
          <span>Borrow requests</span>
          <strong>{notifications.pendingBorrowRequests}</strong>
          <Badge variant={notifications.pendingBorrowRequests ? 'warning' : 'success'}>
            {notifications.pendingBorrowRequests ? 'Needs review' : 'Up to date'}
          </Badge>
        </div>
      </Card>
      <Card className="notification-card" onClick={onOpenMessages} role="button" tabIndex="0">
        <span className="notification-card__icon" aria-hidden="true">
          <Icon name="message" size={21} />
        </span>
        <div>
          <span>Unread messages</span>
          <strong>{notifications.unreadContactMessages}</strong>
          <Badge variant={notifications.unreadContactMessages ? 'warning' : 'success'}>
            {notifications.unreadContactMessages ? 'Needs review' : 'Up to date'}
          </Badge>
        </div>
      </Card>
      <Card className="notification-card" onClick={onOpenPurchases} role="button" tabIndex="0">
        <span className="notification-card__icon" aria-hidden="true"><Icon name="purchase" size={21} /></span>
        <div>
          <span>Purchase requests</span>
          <strong>{notifications.pendingPurchaseRequests}</strong>
          <Badge variant={notifications.pendingPurchaseRequests ? 'warning' : 'success'}>
            {notifications.pendingPurchaseRequests ? 'Needs review' : 'Up to date'}
          </Badge>
        </div>
      </Card>
    </div>
  );
}
