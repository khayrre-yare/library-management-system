import { useCallback, useEffect, useState } from 'react';
import { dashboardApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

const emptyNotifications = {
  pendingBorrowRequests: 0,
  pendingPurchaseRequests: 0,
  unreadContactMessages: 0,
};

export default function useNotifications() {
  const { isAdmin } = useAuth();
  const [notifications, setNotifications] = useState(emptyNotifications);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAdmin) {
      setNotifications(emptyNotifications);
      return;
    }

    setLoading(true);
    try {
      setNotifications(await dashboardApi.notifications());
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return undefined;
    refresh().catch(() => undefined);
    const interval = window.setInterval(() => refresh().catch(() => undefined), 5000);
    return () => window.clearInterval(interval);
  }, [isAdmin, refresh]);

  return { notifications, loading, refresh };
}
