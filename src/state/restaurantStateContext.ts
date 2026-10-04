import { createContext, type Dispatch, type SetStateAction } from 'react'
import type { Order, Reservation, Table } from '../types'

export interface RestaurantStateValue {
  orders: Order[]
  setOrders: Dispatch<SetStateAction<Order[]>>
  tables: Table[]
  setTables: Dispatch<SetStateAction<Table[]>>
  reservations: Reservation[]
  setReservations: Dispatch<SetStateAction<Reservation[]>>
}

export const RestaurantStateContext = createContext<RestaurantStateValue | null>(null)
