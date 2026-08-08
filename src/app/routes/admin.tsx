import type { RouteObject } from 'react-router-dom';
import { Login } from '@/features/admin/authentication/Login';
import { ProtectedRoute } from '@/features/admin/authentication/ProtectedRoute';
import { AdminLayout } from '@/app/layouts/AdminLayout';
import { AdminDashboard } from '@/features/admin/dashboard/AdminDashboard';
import { Calendar } from '@/features/admin/calendar/Calendar';
import { ClientsList } from '@/features/admin/clients/ClientsList';
import { ClientProfile } from '@/features/admin/clients/ClientProfile';
import { Payments } from '@/features/admin/payments/Payments';
import { Settings } from '@/features/admin/settings/Settings';
import { Navigate } from 'react-router-dom';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin/login',
    element: <Login />
  },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/admin/home" replace />
          },
          {
            path: 'home',
            element: <AdminDashboard />
          },
          {
            path: 'schedule',
            element: <Calendar />
          },
          {
            path: 'calendar',
            element: <Navigate to="/admin/schedule" replace />
          },
          {
            path: 'projects',
            element: <ClientsList />
          },
          {
            path: 'projects/:id',
            element: <ClientProfile />
          },
          {
            path: 'payments',
            element: <Payments />
          },
          {
            path: 'settings',
            element: <Settings />
          }
        ]
      }
    ]
  }
];
