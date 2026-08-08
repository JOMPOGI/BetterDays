import { RouterProvider } from 'react-router-dom';
import { BookingProvider } from '@/app/providers/BookingContext';
import { ToastProvider } from '@/components/ui/Toast/ToastContext';
import { router } from './router';

export function App() {
  return (
    <ToastProvider>
      <BookingProvider>
        <RouterProvider router={router} />
      </BookingProvider>
    </ToastProvider>
  );
}

export default App;
