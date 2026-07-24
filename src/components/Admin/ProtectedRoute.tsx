import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
  const isAuthenticated = localStorage.getItem('mock_admin_auth') === 'true';

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
