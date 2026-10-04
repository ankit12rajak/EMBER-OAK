import type { Order, Reservation, Table } from '../types'
import { menuItems } from '../data/menuData'

export type SalesPeriod = 'today' | '7d' | '30d' | '3m' | '6m'

export interface SalesPoint {
  label: string
  revenue: number
  orders: number
}

export interface RankedItem {
  id: string
  name: string
  units: number
  revenue: number
  percentage: number
}

export interface CategorySummary {
  category: string
  orders: number
  revenue: number
  percentage: number
}

export interface AdminAnalytics {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  todayRevenue: number
  occupancy: number
  occupiedTables: number
  availableTables: number
  reservedTables: number
  totalReservations: number
  weeklySales: SalesPoint[]
  bestSellers: RankedItem[]
  categories: CategorySummary[]
  payments: { method: 'UPI' | 'Card' | 'Cash'; orders: number; revenue: number; percentage: number }[]
  statuses: { status: 'Completed' | 'Preparing' | 'Ready' | 'Cancelled' | 'Pending'; count: number; percentage: number }[]
  mostUsedTables: { table: Table; orders: number; revenue: number }[]
}

const paidOrders = (orders: Order[]) => orders.filter((order) => order.paymentStatus === 'PAID' && order.status !== 'CANCELLED')
const activeOrders = (orders: Order[]) => orders.filter((order) => order.status !== 'CANCELLED')
const dateKey = (date: Date) => date.toISOString().slice(0, 10)
const currencyDay = (createdAt: string) => createdAt.slice(0, 10)
const safePercentage = (value: number, total: number) => total > 0 ? value / total * 100 : 0

function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setUTCDate(result.getUTCDate() + days)
  return result
}

function formatDay(date: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-IN', { timeZone: 'UTC', ...options }).format(date)
}

export function getSalesSeries(orders: Order[], period: SalesPeriod, now = new Date()): SalesPoint[] {
  const lengthByPeriod: Record<SalesPeriod, number> = { today: 1, '7d': 7, '30d': 30, '3m': 90, '6m': 180 }
  const start = addDays(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())), 1 - lengthByPeriod[period])
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const inRange = orders.filter((order) => currencyDay(order.createdAt) >= dateKey(start) && currencyDay(order.createdAt) <= dateKey(end))

  if (period === 'today') {
    return Array.from({ length: 8 }, (_, index) => {
      const hourStart = index * 3
      const bucketOrders = inRange.filter((order) => new Date(order.createdAt).getUTCHours() >= hourStart && new Date(order.createdAt).getUTCHours() < hourStart + 3)
      return {
        label: `${String(hourStart).padStart(2, '0')}:00`,
        revenue: paidOrders(bucketOrders).reduce((sum, order) => sum + order.total, 0),
        orders: activeOrders(bucketOrders).length,
      }
    })
  }

  const chunkSize = period === '3m' ? 7 : 1
  const pointCount = Math.ceil(lengthByPeriod[period] / chunkSize)
  return Array.from({ length: pointCount }, (_, index) => {
    const bucketStart = addDays(start, index * chunkSize)
    const bucketEnd = addDays(bucketStart, chunkSize)
    const bucketOrders = inRange.filter((order) => {
      const day = currencyDay(order.createdAt)
      return day >= dateKey(bucketStart) && day < dateKey(bucketEnd)
    })
    const label = period === '6m'
      ? formatDay(bucketStart, { month: 'short' })
      : period === '3m'
        ? formatDay(bucketStart, { day: 'numeric', month: 'short' })
        : formatDay(bucketStart, { weekday: 'short', day: 'numeric' })
    return {
      label,
      revenue: paidOrders(bucketOrders).reduce((sum, order) => sum + order.total, 0),
      orders: activeOrders(bucketOrders).length,
    }
  })
}

export function getAdminAnalytics(orders: Order[], tables: Table[], reservations: Reservation[], now = new Date()): AdminAnalytics {
  const paid = paidOrders(orders)
  const live = activeOrders(orders)
  const totalRevenue = paid.reduce((sum, order) => sum + order.total, 0)
  const today = dateKey(now)
  const menuById = new Map(menuItems.map((item) => [item.id, item]))
  const itemMap = new Map<string, { name: string; units: number; revenue: number }>()
  const categoryMap = new Map<string, { orders: Set<string>; revenue: number }>()
  const tableMap = new Map<string, { orders: number; revenue: number }>()
  const paymentMap = new Map<'UPI' | 'Card' | 'Cash', { orders: number; revenue: number }>([
    ['UPI', { orders: 0, revenue: 0 }],
    ['Card', { orders: 0, revenue: 0 }],
    ['Cash', { orders: 0, revenue: 0 }],
  ])
  const weekdayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const weekdayMap = new Map(weekdayNames.map((name) => [name, { revenue: 0, orders: 0 }]))

  for (const order of live) {
    const tableSummary = tableMap.get(order.tableId) ?? { orders: 0, revenue: 0 }
    tableSummary.orders += 1
    if (order.paymentStatus === 'PAID') tableSummary.revenue += order.total
    tableMap.set(order.tableId, tableSummary)

    const weekday = weekdayNames[(new Date(`${currencyDay(order.createdAt)}T00:00:00Z`).getUTCDay() + 6) % 7]
    const weekdaySummary = weekdayMap.get(weekday)!
    weekdaySummary.orders += 1
    if (order.paymentStatus === 'PAID') weekdaySummary.revenue += order.total

    const paymentMethod = order.paymentMethod === 'UPI' ? 'UPI'
      : order.paymentMethod === 'Cash' ? 'Cash'
        : order.paymentMethod && ['Card', 'Credit Card', 'Debit Card'].includes(order.paymentMethod) ? 'Card'
          : undefined
    if (paymentMethod && order.paymentStatus === 'PAID') {
      const summary = paymentMap.get(paymentMethod)!
      summary.orders += 1
      summary.revenue += order.total
    }

    for (const item of order.items) {
      const itemSummary = itemMap.get(item.menuItemId) ?? { name: item.name, units: 0, revenue: 0 }
      itemSummary.units += item.quantity
      itemSummary.revenue += item.price * item.quantity
      itemMap.set(item.menuItemId, itemSummary)

      const category = menuById.get(item.menuItemId)?.category ?? 'Other'
      const categorySummary = categoryMap.get(category) ?? { orders: new Set<string>(), revenue: 0 }
      categorySummary.orders.add(order.id)
      categorySummary.revenue += item.price * item.quantity
      categoryMap.set(category, categorySummary)
    }
  }

  const itemRevenue = [...itemMap.values()].reduce((sum, item) => sum + item.revenue, 0)
  const paidRevenue = [...paymentMap.values()].reduce((sum, payment) => sum + payment.revenue, 0)
  const totalTables = tables.filter((table) => table.status !== 'UNAVAILABLE').length
  const occupiedTables = tables.filter((table) => table.status === 'OCCUPIED' || table.status === 'BILLING').length
  const tableById = new Map(tables.map((table) => [table.id, table]))
  const statusCounts: { status: AdminAnalytics['statuses'][number]['status']; count: number }[] = [
    { status: 'Completed', count: orders.filter((order) => order.status === 'COMPLETED' || order.status === 'SERVED').length },
    { status: 'Preparing', count: orders.filter((order) => order.status === 'PREPARING').length },
    { status: 'Ready', count: orders.filter((order) => order.status === 'READY').length },
    { status: 'Cancelled', count: orders.filter((order) => order.status === 'CANCELLED').length },
    { status: 'Pending', count: orders.filter((order) => order.status === 'NEW' || order.status === 'CONFIRMED').length },
  ]

  return {
    totalRevenue,
    totalOrders: orders.length,
    averageOrderValue: paid.length ? totalRevenue / paid.length : 0,
    todayRevenue: paid.filter((order) => currencyDay(order.createdAt) === today).reduce((sum, order) => sum + order.total, 0),
    occupancy: totalTables ? occupiedTables / totalTables * 100 : 0,
    occupiedTables,
    availableTables: tables.filter((table) => table.status === 'AVAILABLE').length,
    reservedTables: tables.filter((table) => table.status === 'RESERVED').length,
    totalReservations: reservations.length,
    weeklySales: weekdayNames.map((day) => ({ label: day, ...weekdayMap.get(day)! })),
    bestSellers: [...itemMap.entries()]
      .map(([id, item]) => ({ id, ...item, percentage: safePercentage(item.revenue, itemRevenue) }))
      .sort((a, b) => b.units - a.units || b.revenue - a.revenue)
      .slice(0, 10),
    categories: [...categoryMap.entries()]
      .map(([category, summary]) => ({ category, orders: summary.orders.size, revenue: summary.revenue, percentage: safePercentage(summary.revenue, itemRevenue) }))
      .sort((a, b) => b.revenue - a.revenue),
    payments: [...paymentMap.entries()].map(([method, summary]) => ({
      method,
      ...summary,
      percentage: safePercentage(summary.revenue, paidRevenue),
    })),
    statuses: statusCounts.map((entry) => ({ ...entry, percentage: safePercentage(entry.count, orders.length) })),
    mostUsedTables: [...tableMap.entries()]
      .map(([id, summary]) => ({ table: tableById.get(id), ...summary }))
      .filter((entry): entry is { table: Table; orders: number; revenue: number } => Boolean(entry.table))
      .sort((a, b) => b.orders - a.orders || b.revenue - a.revenue)
      .slice(0, 5),
  }
}
