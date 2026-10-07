import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import { bookingReducer, estadoInicial, type BookingAction, type BookingState } from './bookingReducer';

type BookingContextValue = { state: BookingState; dispatch: Dispatch<BookingAction> };

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, estadoInicial);
  return <BookingContext.Provider value={{ state, dispatch }}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingContextValue {
  const value = useContext(BookingContext);
  if (!value) {
    throw new Error('useBooking debe usarse dentro de BookingProvider');
  }
  return value;
}
