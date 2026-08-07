import { createBrowserRouter } from 'react-router-dom';
import { publicRoutes } from './routes/public';
import { adminRoutes } from './routes/admin';

export const router = createBrowserRouter([
  ...publicRoutes,
  ...adminRoutes
]);
