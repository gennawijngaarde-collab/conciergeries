import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) {
    const redirect = encodeURIComponent(location.pathname + location.search + location.hash);
    return <Navigate to={`/compte?redirect=${redirect}`} replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

