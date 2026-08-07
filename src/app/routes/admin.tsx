import type { RouteObject } from 'react-router-dom';
import { Login } from '@/features/admin/authentication/Login';
import { ProtectedRoute } from '@/features/admin/authentication/ProtectedRoute';
import { AdminLayout } from '@/app/layouts/AdminLayout';
import { Calendar } from '@/features/admin/calendar/Calendar';
import { Clients as ProjectsDashboard } from '@/features/admin/projects/ProjectsDashboard';
import { Inquiries as InquiriesDashboard } from '@/features/admin/inquiries/InquiriesDashboard';
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
            element: <Navigate to="/admin/schedule" replace />
          },
          {
            path: 'schedule',
            element: <Calendar />
          },
          {
            path: 'inquiries',
            element: <InquiriesDashboard />
          },
          {
            path: 'clients', // Intentionally mapping clients path to ProjectsDashboard for backwards compat
            element: <ProjectsDashboard />
          },
          {
            path: 'projects',
            element: <ProjectsDashboard />
          }
        ]
      }
    ]
  }
];
