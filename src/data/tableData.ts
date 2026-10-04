import type { Table } from '../types';

export const tables: Table[] = [
  { id: 't1', tableNumber: 1, capacity: 2, location: 'Indoor', status: 'AVAILABLE' },
  { id: 't2', tableNumber: 2, capacity: 2, location: 'Indoor', status: 'OCCUPIED' },
  { id: 't3', tableNumber: 3, capacity: 2, location: 'Indoor', status: 'AVAILABLE' },
  { id: 't4', tableNumber: 4, capacity: 2, location: 'Indoor', status: 'RESERVED' },
  
  { id: 't5', tableNumber: 5, capacity: 4, location: 'Indoor', status: 'AVAILABLE' },
  { id: 't6', tableNumber: 6, capacity: 4, location: 'Indoor', status: 'OCCUPIED' },
  { id: 't7', tableNumber: 7, capacity: 4, location: 'Indoor', status: 'BILLING' },
  { id: 't8', tableNumber: 8, capacity: 4, location: 'Indoor', status: 'RESERVED' },
  
  { id: 't9', tableNumber: 9, capacity: 4, location: 'Outdoor', status: 'AVAILABLE' },
  { id: 't10', tableNumber: 10, capacity: 4, location: 'Outdoor', status: 'OCCUPIED' },
  
  { id: 't11', tableNumber: 11, capacity: 6, location: 'Indoor', status: 'AVAILABLE' },
  { id: 't12', tableNumber: 12, capacity: 6, location: 'Indoor', status: 'UNAVAILABLE' },
  
  { id: 't13', tableNumber: 13, capacity: 6, location: 'Outdoor', status: 'AVAILABLE' },
  { id: 't14', tableNumber: 14, capacity: 6, location: 'Outdoor', status: 'RESERVED' },
  
  { id: 't15', tableNumber: 15, capacity: 8, location: 'Indoor', status: 'AVAILABLE' },
  { id: 't16', tableNumber: 16, capacity: 8, location: 'Indoor', status: 'OCCUPIED' },
  
  { id: 't17', tableNumber: 17, capacity: 8, location: 'Private Dining', status: 'OCCUPIED' },
  { id: 't18', tableNumber: 18, capacity: 10, location: 'Private Dining', status: 'AVAILABLE' }
];
