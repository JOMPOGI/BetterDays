import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type PackageType = 'wedding' | 'prenup' | 'wedding_prenup' | 'wedding_photo' | 'prenup_photo' | null;

interface BookingState {
  selectedPackage: PackageType;
  eventDate: Date | null;
  prenupDate: Date | null;
  quotation: {
    total: number;
    reservation: number;
    balance: number;
  } | null;
  clientDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    eventType: 'wedding' | 'prenup' | null;
    locations: string[];
    notes: string;
  };
  paymentReference: string | null;
}

interface BookingContextType {
  state: BookingState;
  setPackage: (pkg: PackageType) => void;
  setDate: (date: Date) => void;
  setPrenupDate: (date: Date) => void;
  setQuotation: (total: number, reservation: number) => void;
  setClientDetails: (details: Partial<BookingState['clientDetails']>) => void;
  setPaymentReference: (ref: string) => void;
  resetBooking: () => void;
}

const initialState: BookingState = {
  selectedPackage: null,
  eventDate: null,
  prenupDate: null,
  quotation: null,
  clientDetails: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    eventType: null,
    locations: [],
    notes: '',
  },
  paymentReference: null,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>(initialState);

  const setPackage = (pkg: PackageType) => setState(prev => ({ ...prev, selectedPackage: pkg }));
  const setDate = (date: Date) => setState(prev => ({ ...prev, eventDate: date }));
  const setPrenupDate = (date: Date) => setState(prev => ({ ...prev, prenupDate: date }));
  const setQuotation = (total: number, reservation: number) => setState(prev => ({
    ...prev,
    quotation: { total, reservation, balance: total - reservation }
  }));
  const setClientDetails = (details: Partial<BookingState['clientDetails']>) => setState(prev => ({
    ...prev,
    clientDetails: { ...prev.clientDetails, ...details }
  }));
  const setPaymentReference = (ref: string) => setState(prev => ({ ...prev, paymentReference: ref }));
  const resetBooking = () => setState(initialState);

  return (
    <BookingContext.Provider value={{
      state,
      setPackage,
      setDate,
      setPrenupDate,
      setQuotation,
      setClientDetails,
      setPaymentReference,
      resetBooking
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
