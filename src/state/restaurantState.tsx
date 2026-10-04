import { useMemo, useState, type ReactNode } from 'react'
import { orders as seedOrders, reservations as seedReservations, tables as seedTables } from '../data'
import { RestaurantStateContext } from './restaurantStateContext'

export function RestaurantStateProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState(seedOrders)
  const [tables, setTables] = useState(seedTables)
  const [reservations, setReservations] = useState(seedReservations)
  const value = useMemo(
    () => ({ orders, setOrders, tables, setTables, reservations, setReservations }),
    [orders, tables, reservations],
  )

  return <RestaurantStateContext.Provider value={value}>{children}</RestaurantStateContext.Provider>
}
