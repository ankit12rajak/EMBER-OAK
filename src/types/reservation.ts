export type ReservationStatus = 'CONFIRMED' | 'SEATED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Reservation {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  tableId: string;
  tableNumber: number;
  date: string;
  time: string;
  guests: number;
  status: ReservationStatus;
  customerEmail?: string;
  specialRequests?: string;
  createdAt?: string;
}
