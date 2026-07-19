import { useCallback, useEffect, useMemo, useState } from 'react';
import { borrowingsApi, purchasesApi } from '../api/client';
import DashboardShell from '../components/layout/DashboardShell';
import Alert from '../components/ui/Alert';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import useNotifications from '../hooks/useNotifications';
import { BorrowingsManagement, PurchasesManagement } from './Admin';
import Icon from '../components/ui/Icon';

const emptyPage = { content: [], page: 0, totalPages: 0, totalElements: 0 };

const orderViews = [
  { id: 'all', label: 'All orders', icon: 'orders' },
  { id: 'borrowings', label: 'Borrowing', icon: 'borrow' },
  { id: 'purchases', label: 'Purchases', icon: 'purchase' },
];

export default function Orders() {
  const [activeView, setActiveView] = useState('all');
  const [borrowings, setBorrowings] = useState(emptyPage);
  const [purchases, setPurchases] = useState(emptyPage);
  const [borrowingPage, setBorrowingPage] = useState(0);
  const [purchasePage, setPurchasePage] = useState(0);
  const [borrowingStatus, setBorrowingStatus] = useState('');
  const [purchaseStatus, setPurchaseStatus] = useState('');
  const [borrowingLoading, setBorrowingLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();
  const { notifications, refresh: refreshNotifications } = useNotifications();

  const loadBorrowings = useCallback(async () => {
    setBorrowingLoading(true);
    setError('');
    try {
      setBorrowings(await borrowingsApi.all({
        page: borrowingPage,
        size: 10,
        status: borrowingStatus || undefined,
      }));
    } catch (requestError) {
      setError(requestError.userMessage);
    } finally {
      setBorrowingLoading(false);
    }
  }, [borrowingPage, borrowingStatus]);

  const loadPurchases = useCallback(async () => {
    setPurchaseLoading(true);
    setError('');
    try {
      setPurchases(await purchasesApi.all({
        page: purchasePage,
        size: 10,
        status: purchaseStatus || undefined,
      }));
    } catch (requestError) {
      setError(requestError.userMessage);
    } finally {
      setPurchaseLoading(false);
    }
  }, [purchasePage, purchaseStatus]);

  useEffect(() => {
    if (activeView === 'all' || activeView === 'borrowings') loadBorrowings();
    if (activeView === 'all' || activeView === 'purchases') loadPurchases();
  }, [activeView, loadBorrowings, loadPurchases]);

  const runConfirmedAction = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    try {
      if (confirmAction.type === 'borrowing') {
        await borrowingsApi.updateStatus(confirmAction.order.id, confirmAction.status);
        showToast(`Borrowing order ${confirmAction.status.toLowerCase()}.`, 'success');
        await loadBorrowings();
      } else {
        await purchasesApi.updateStatus(confirmAction.order.id, confirmAction.status);
        showToast(`Purchase order ${confirmAction.status.toLowerCase()}.`, 'success');
        await loadPurchases();
      }
      await refreshNotifications();
      setConfirmAction(null);
    } catch (requestError) {
      showToast(requestError.userMessage, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const dialog = useMemo(() => {
    if (!confirmAction) return null;
    const approving = confirmAction.status === 'APPROVED';
    const returning = confirmAction.status === 'RETURNED';
    const actionLabel = approving ? 'Approve' : returning ? 'Mark returned' : 'Reject';
    const orderLabel = confirmAction.type === 'borrowing' ? 'borrowing order' : 'purchase order';
    return {
      title: `${actionLabel} ${orderLabel}?`,
      message: `${confirmAction.order.bookTitle} for ${confirmAction.order.userName} will be marked as ${confirmAction.status.toLowerCase()}.`,
      label: actionLabel,
      variant: confirmAction.status === 'REJECTED' ? 'danger' : 'primary',
    };
  }, [confirmAction]);

  const pendingTotal = notifications.pendingBorrowRequests + notifications.pendingPurchaseRequests;

  return (
    <DashboardShell
      title="Orders"
      description="Review and manage every borrowing and purchase request in one place."
      hideProfile
      sidebarContent={
        <nav className="dashboard-nav admin-sidebar-nav" aria-label="Order types">
          {orderViews.map((view) => {
            const count = view.id === 'all'
              ? pendingTotal
              : view.id === 'borrowings'
                ? notifications.pendingBorrowRequests
                : notifications.pendingPurchaseRequests;
            return (
              <button
                type="button"
                key={view.id}
                className={activeView === view.id ? 'is-active' : ''}
                onClick={() => {
                  setError('');
                  setActiveView(view.id);
                }}
              >
                <span aria-hidden="true"><Icon name={view.icon} size={18} /></span>
                <span>{view.label}</span>
                {count > 0 && <span className="admin-sidebar-nav__count">{count}</span>}
              </button>
            );
          })}
        </nav>
      }
    >
      {error && (
        <Alert type="error" className="space-bottom">
          {error}
        </Alert>
      )}

      <div className="orders-stack">
        {(activeView === 'all' || activeView === 'borrowings') && (
          <BorrowingsManagement
            borrowings={borrowings}
            loading={borrowingLoading}
            status={borrowingStatus}
            onStatusChange={(value) => {
              setBorrowingPage(0);
              setBorrowingStatus(value);
            }}
            onPageChange={setBorrowingPage}
            onAction={(order, status) => setConfirmAction({ type: 'borrowing', order, status })}
          />
        )}

        {(activeView === 'all' || activeView === 'purchases') && (
          <PurchasesManagement
            purchases={purchases}
            loading={purchaseLoading}
            status={purchaseStatus}
            onStatusChange={(value) => {
              setPurchasePage(0);
              setPurchaseStatus(value);
            }}
            onPageChange={setPurchasePage}
            onAction={(order, status) => setConfirmAction({ type: 'purchase', order, status })}
          />
        )}
      </div>

      <ConfirmDialog
        open={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
        onConfirm={runConfirmedAction}
        loading={actionLoading}
        title={dialog?.title}
        message={dialog?.message}
        confirmLabel={dialog?.label}
        variant={dialog?.variant}
      />
    </DashboardShell>
  );
}
