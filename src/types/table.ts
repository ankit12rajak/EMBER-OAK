export type TableStatus = 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'BILLING' | 'UNAVAILABLE';
export type TableLocation = 'Indoor' | 'Outdoor' | 'Private Dining' | 'Bar Area';

export interface Table {
  id: string;
  tableNumber: number;
  capacity: number;
  status: TableStatus;
  location: TableLocation;
  currentOrderId?: string;
  currentReservationId?: string;
}
