import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Skeleton from './ui/Skeleton';

export default function ProtectedRoute({ children, role, redirectTo = '/dashboard' }) {
  const { loading, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="route-loading container" aria-label="Loading account">
        <Skeleton height="36px" width="240px" />
        <Skeleton height="180px" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
