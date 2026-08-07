import { RouterProvider } from 'react-router-dom';
import { BookingProvider } from '@/app/providers/BookingContext';
import { router } from './router';

export function App() {
  return (
    <BookingProvider>
      <RouterProvider router={router} />
    </BookingProvider>
  );
}

export default App;
