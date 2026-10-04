import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useNavigate, useOutletContext, useSearchParams } from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Banknote,
  CalendarDays,
  Check,
  ChefHat,
  CircleDollarSign,
  Clock3,
  ConciergeBell,
  CreditCard,
  LayoutDashboard,
  Leaf,
  Minus,
  Plus,
  ReceiptText,
  Search,
  ShoppingBasket,
  Table2,
  Users,
  UtensilsCrossed,
  WalletCards,
  X,
} from 'lucide-react'
import { customers, menuItems } from './data'
import { useRestaurantState } from './state/useRestaurantState'
import type { MenuItem, Order, OrderItem, OrderStatus, Reservation, ReservationStatus, Table, TableStatus } from './types'
import { calcTax, formatCurrency, formatOrderNumber, generateId } from './utils'
import './StaffApp.css'

type StaffNotice = (message: string, kind?: 'success' | 'error') => void
interface StaffLayoutContext {
  notify: StaffNotice
}

const serviceStatuses: TableStatus[] = ['AVAILABLE', 'RESERVED', 'OCCUPIED', 'BILLING', 'UNAVAILABLE']
const activeStatuses: OrderStatus[] = ['NEW', 'PREPARING', 'READY', 'SERVED']
const reservationStatuses: ReservationStatus[] = ['CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']
const todayKey = () => new Date().toISOString().slice(0, 10)
const money = (value: number) => formatCurrency(value)

function orderSubtotal(items: OrderItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

function statusLabel(status: string) {
  return status.toLowerCase().replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function useStaffNotify() {
  return useOutletContext<StaffLayoutContext>().notify
}

function StaffLayout() {
  const [notice, setNotice] = useState<{ message: string; kind: 'success' | 'error'; id: number } | null>(null)
  const [noticeId, setNoticeId] = useState(0)
  const [serviceDate] = useState(() => new Date())
  const notify: StaffNotice = (message, kind = 'success') => {
    const id = noticeId + 1
    setNoticeId(id)
    setNotice({ message, kind, id })
    window.setTimeout(() => setNotice((current) => current?.id === id ? null : current), 3000)
  }

  return (
    <div className="staff-app">
      <aside className="staff-sidebar">
        <Link className="staff-brand" to="/reception" aria-label="Ember and Oak reception home">
          <span className="staff-brand-mark">E<span>&</span>O</span>
          <span><strong>EMBER &amp; OAK</strong><small>RESTAURANT OPERATIONS</small></span>
        </Link>
        <div className="sidebar-section-label">FRONT OF HOUSE</div>
        <nav className="staff-nav" aria-label="Reception navigation">
          <NavLink to="/reception" end aria-label="Overview"><LayoutDashboard size={17} /><span>Overview</span></NavLink>
          <NavLink to="/reception/tables" aria-label="Floor & tables"><Table2 size={17} /><span>Floor &amp; tables</span></NavLink>
          <NavLink to="/reception/reservations" aria-label="Reservations"><CalendarDays size={17} /><span>Reservations</span></NavLink>
          <NavLink to="/reception/orders" aria-label="Orders"><ShoppingBasket size={17} /><span>Orders</span></NavLink>
          <NavLink to="/reception/billing" aria-label="Billing"><ReceiptText size={17} /><span>Billing</span></NavLink>
        </nav>
        <div className="sidebar-section-label kitchen-nav-label">KITCHEN</div>
        <nav className="staff-nav">
          <NavLink to="/kitchen" aria-label="Kitchen display"><ChefHat size={17} /><span>Kitchen display</span></NavLink>
        </nav>
        <div className="sidebar-section-label kitchen-nav-label">MANAGEMENT</div>
        <nav className="staff-nav">
          <NavLink to="/admin" aria-label="Admin analytics"><LayoutDashboard size={17} /><span>Admin analytics</span></NavLink>
        </nav>
        <div className="sidebar-spacer" />
        <Link to="/" className="staff-site-link"><ArrowLeft size={15} /> Customer website</Link>
        <div className="staff-user">
          <span className="staff-avatar">EO</span>
          <span><strong>Service team</strong><small>Floor operations</small></span>
          <span className="online-indicator" title="Demo session active" />
        </div>
      </aside>
      <div className="staff-main">
        <header className="staff-topbar">
          <div className="breadcrumbs"><span>EMBER &amp; OAK</span><span>/</span><strong>RECEPTION</strong></div>
          <div className="topbar-right"><span className="demo-badge"><span /> DEMO MODE</span><span className="topbar-date">{serviceDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span></div>
        </header>
        <div className="staff-content"><Outlet context={{ notify } satisfies StaffLayoutContext} /></div>
      </div>
      {notice && <div className={`staff-toast ${notice.kind}`} role="status"><span>{notice.kind === 'success' ? <Check size={16} /> : <X size={16} />}</span>{notice.message}<button aria-label="Dismiss notification" onClick={() => setNotice(null)}><X size={14} /></button></div>}
    </div>
  )
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="staff-page-heading"><div><span className="staff-eyebrow">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>
}

function StatCard({ label, value, detail, icon: Icon, tone }: { label: string; value: string | number; detail: string; icon: typeof CircleDollarSign; tone: string }) {
  return <article className="stat-card"><span className={`stat-icon ${tone}`}><Icon size={18} /></span><div className="stat-label">{label}</div><strong className="stat-value">{value}</strong><div className="stat-detail">{detail}</div></article>
}

function Dashboard() {
  const { orders, tables, reservations } = useRestaurantState()
  const navigate = useNavigate()
  const today = todayKey()
  const todayOrders = orders.filter((order) => order.createdAt.slice(0, 10) === today && order.status !== 'CANCELLED')
  const revenue = todayOrders.filter((order) => order.paymentStatus === 'PAID').reduce((sum, order) => sum + order.total, 0)
  const todaysReservations = reservations.filter((reservation) => reservation.date === today && !['CANCELLED', 'NO_SHOW'].includes(reservation.status))
  const occupied = tables.filter((table) => table.status === 'OCCUPIED').length
  const available = tables.filter((table) => table.status === 'AVAILABLE').length
  const kitchenOrders = orders.filter((order) => ['NEW', 'PREPARING', 'READY'].includes(order.status)).length
  const recentOrders = [...orders].filter((order) => order.status !== 'CANCELLED').sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)

  return (
    <>
      <PageHeading eyebrow="Sunday service · Live floor" title="Good evening." description="Your front-of-house overview, at a glance." action={<button className="staff-button staff-button-dark" onClick={() => navigate('/reception/orders')}><Plus size={16} /> New order</button>} />
      <div className="stats-grid">
        <StatCard label="Today's revenue" value={money(revenue)} detail="Paid orders · today" icon={CircleDollarSign} tone="gold" />
        <StatCard label="Today's orders" value={todayOrders.length} detail={`${todayOrders.filter((order) => order.status === 'COMPLETED').length} completed`} icon={ShoppingBasket} tone="blue" />
        <StatCard label="Reservations today" value={todaysReservations.length} detail="Confirmed & seated" icon={CalendarDays} tone="violet" />
        <StatCard label="Tables occupied" value={`${occupied} / ${tables.length}`} detail="Currently in service" icon={Users} tone="green" />
        <StatCard label="Tables available" value={available} detail="Ready to welcome guests" icon={Table2} tone="mint" />
        <StatCard label="Pending kitchen" value={kitchenOrders} detail="Awaiting preparation or pickup" icon={ChefHat} tone="orange" />
      </div>
      <div className="dashboard-grid">
        <section className="panel recent-orders-panel">
          <div className="panel-heading"><div><span className="staff-eyebrow">Just passing through</span><h2>Recent orders</h2></div><button className="staff-link" onClick={() => navigate('/reception/orders')}>All orders <ArrowRight size={14} /></button></div>
          <div className="data-table-wrap"><table className="staff-table"><thead><tr><th>ORDER</th><th>TABLE</th><th>GUEST</th><th>STATUS</th><th>TOTAL</th></tr></thead><tbody>{recentOrders.map((order) => <tr key={order.id}><td><strong>{formatOrderNumber(order.orderNumber)}</strong></td><td>Table {tables.find((table) => table.id === order.tableId)?.tableNumber ?? '—'}</td><td>{customers.find((customer) => customer.id === order.customerId)?.name ?? 'Walk-in guest'}</td><td><StatusBadge status={order.status} /></td><td>{money(order.total)}</td></tr>)}</tbody></table></div>
        </section>
        <section className="panel service-panel">
          <div className="panel-heading"><div><span className="staff-eyebrow">Your room, right now</span><h2>Floor pulse</h2></div><button className="icon-action" aria-label="Open floor plan" onClick={() => navigate('/reception/tables')}><ArrowDownRight size={16} /></button></div>
          <div className="floor-pulse"><div className="pulse-ring"><strong>{Math.round(occupied / Math.max(1, tables.length) * 100)}<small>%</small></strong><span>occupancy</span></div><div className="pulse-legend">{serviceStatuses.map((status) => <div key={status}><i className={`status-dot ${status.toLowerCase()}`} /><span>{statusLabel(status)}</span><strong>{tables.filter((table) => table.status === status).length}</strong></div>)}</div></div>
          <button className="panel-footer-link" onClick={() => navigate('/reception/tables')}>Open floor plan <ArrowRight size={14} /></button>
        </section>
      </div>
      <div className="demo-note"><span className="demo-note-icon"><Clock3 size={16} /></span><p><strong>Static demo data</strong><br />Changes made in Reception and Kitchen are shared in this browser session only.</p><Link to="/kitchen">Open kitchen display <ArrowRight size={14} /></Link></div>
    </>
  )
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`status-badge ${status.toLowerCase()}`}>{statusLabel(status)}</span>
}

function FloorTables() {
  const { tables, setTables, reservations, setReservations, orders } = useRestaurantState()
  const notify = useStaffNotify()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Table | null>(null)
  const [reservationId, setReservationId] = useState('')
  const occupied = tables.filter((table) => table.status === 'OCCUPIED').length
  const spaces = ['Indoor', 'Outdoor', 'Private Dining', 'Bar Area'] as const
  const currentTable = selected ? tables.find((table) => table.id === selected.id) ?? selected : null
  const linkedOrder = currentTable && currentTable.currentOrderId
    ? orders.find((order) => order.id === currentTable.currentOrderId && order.status !== 'COMPLETED')
    : currentTable && orders.find((order) => order.tableId === currentTable.id && activeStatuses.includes(order.status))
  const assignableReservations = reservations.filter((reservation) => reservation.status === 'CONFIRMED')
  const selectedReservation = reservations.find((reservation) => reservation.id === reservationId)
  const tableHasActiveOrder = currentTable && orders.some((order) => order.tableId === currentTable.id && activeStatuses.includes(order.status))
  const canSeatReservation = Boolean(
    currentTable &&
    selectedReservation &&
    !tableHasActiveOrder &&
    (currentTable.status === 'AVAILABLE' ||
      (currentTable.status === 'RESERVED' &&
        (currentTable.currentReservationId === selectedReservation.id || selectedReservation.tableId === currentTable.id))),
  )

  const updateTable = (tableId: string, updates: Partial<Table>) => {
    setTables((current) => current.map((table) => table.id === tableId ? { ...table, ...updates } : table))
    setSelected((current) => current?.id === tableId ? { ...current, ...updates } : current)
  }

  const openTable = () => {
    if (!currentTable) return
    if (currentTable.status === 'UNAVAILABLE' || currentTable.status === 'BILLING') {
      notify(`Table ${currentTable.tableNumber} cannot be opened right now.`, 'error')
      return
    }
    updateTable(currentTable.id, { status: 'OCCUPIED' })
    notify(`Table ${currentTable.tableNumber} is now open.`)
  }

  const assignReservation = () => {
    const reservation = selectedReservation
    if (!currentTable || !reservation || !canSeatReservation) {
      notify('Choose a confirmed reservation and a table without active service.', 'error')
      return
    }
    setReservations((current) => current.map((candidate) => candidate.id === reservation.id ? { ...candidate, tableId: currentTable.id, tableNumber: currentTable.tableNumber, status: 'SEATED' } : candidate))
    setTables((current) => current.map((table) => {
      if (table.id === currentTable.id) return { ...table, status: 'OCCUPIED', currentReservationId: reservation.id }
      if (table.id !== reservation.tableId || reservation.tableId === currentTable.id) return table
      const hasOtherReservation = reservations.some((candidate) => candidate.id !== reservation.id && candidate.tableId === table.id && ['CONFIRMED', 'SEATED'].includes(candidate.status))
      const hasActiveOrder = orders.some((order) => order.tableId === table.id && activeStatuses.includes(order.status))
      return table.status === 'RESERVED' && !hasOtherReservation && !hasActiveOrder
        ? { ...table, status: 'AVAILABLE', currentReservationId: undefined }
        : table
    }))
    setSelected((current) => current?.id === currentTable.id ? { ...current, status: 'OCCUPIED', currentReservationId: reservation.id } : current)
    setReservationId('')
    notify(`${reservation.customerName} seated at Table ${currentTable.tableNumber}.`)
  }

  const createOrderForTable = () => {
    if (!currentTable) return
    if (currentTable.status === 'UNAVAILABLE' || currentTable.status === 'BILLING') {
      notify(`Table ${currentTable.tableNumber} is not accepting a new order.`, 'error')
      return
    }
    navigate(`/reception/orders?tableId=${currentTable.id}`)
  }

  return (
    <>
      <PageHeading eyebrow="Front of house · Floor plan" title="The room." description="Tap any table to see its details and take action." action={<div className="floor-summary"><span><i className="status-dot occupied" /> {occupied} in service</span><span><i className="status-dot available" /> {tables.length - occupied} other tables</span></div>} />
      <div className="status-legend">{serviceStatuses.map((status) => <span key={status}><i className={`status-dot ${status.toLowerCase()}`} />{statusLabel(status)}</span>)}</div>
      <div className="floor-layout">
        {spaces.map((space) => {
          const spaceTables = tables.filter((table) => table.location === space)
          if (spaceTables.length === 0) return null
          return <section className={`floor-zone zone-${space.toLowerCase().replaceAll(' ', '-')}`} key={space}>
            <div className="zone-heading"><span className="zone-marker" /><div><span className="staff-eyebrow">DINING ROOM</span><h2>{space}</h2></div><span className="zone-count">{spaceTables.length} tables</span></div>
            <div className={`table-grid ${space === 'Private Dining' ? 'private-grid' : ''}`}>
              {spaceTables.map((table) => <button key={table.id} className={`floor-table ${table.status.toLowerCase()} ${table.capacity >= 8 ? 'large-table' : ''} ${selected?.id === table.id ? 'table-selected' : ''}`} onClick={() => { setSelected(table); setReservationId('') }} aria-label={`Table ${table.tableNumber}, ${statusLabel(table.status)}, seats ${table.capacity}`}>
                <span className="table-number">{String(table.tableNumber).padStart(2, '0')}</span><span className="table-capacity"><Users size={11} /> {table.capacity}</span><span className="table-status-text">{statusLabel(table.status)}</span>
                <span className="table-seat seat-top" /><span className="table-seat seat-bottom" /><span className="table-seat seat-left" /><span className="table-seat seat-right" />
              </button>)}
            </div>
          </section>
        })}
        <div className="floor-aisle"><span>THE PASS</span><i /><span>HOST STAND</span></div>
      </div>
      {currentTable && <div className="detail-scrim staff-detail-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null) }}>
        <aside className="table-detail-panel" role="dialog" aria-modal="true" aria-label={`Table ${currentTable.tableNumber} details`}>
          <div className="table-detail-top"><span className="staff-eyebrow">{currentTable.location} · {currentTable.capacity} seats</span><button className="icon-action" aria-label="Close table details" onClick={() => setSelected(null)}><X size={17} /></button></div>
          <div className="table-detail-title"><span className={`detail-table-shape ${currentTable.status.toLowerCase()}`}><Table2 size={23} /></span><div><h2>Table {currentTable.tableNumber}</h2><StatusBadge status={currentTable.status} /></div></div>
          <div className="detail-section"><span className="staff-eyebrow">CURRENT SERVICE</span>
            {linkedOrder ? <div className="linked-order"><div><strong>{formatOrderNumber(linkedOrder.orderNumber)}</strong><StatusBadge status={linkedOrder.status} /></div><p>{linkedOrder.items.map((item) => `${item.quantity} × ${item.name}`).join(', ')}</p><strong>{money(linkedOrder.total)}</strong><button className="staff-link" onClick={() => navigate(`/reception/orders?orderId=${linkedOrder.id}`)}>View order <ArrowRight size={13} /></button></div>
              : <p className="empty-detail-copy">There is no active order at this table.</p>}
          </div>
          <div className="detail-section"><span className="staff-eyebrow">ASSIGN RESERVATION</span>
            {assignableReservations.length > 0 ? <><select className="staff-select" value={reservationId} onChange={(event) => setReservationId(event.target.value)}><option value="">Choose a confirmed reservation…</option>{assignableReservations.map((reservation) => <option value={reservation.id} key={reservation.id}>{reservation.customerName} · {reservation.guests} guests · {reservation.time}</option>)}</select><button className="staff-button staff-button-light full-width" disabled={!reservationId || !canSeatReservation} onClick={assignReservation}><Users size={15} /> Seat reservation here</button></>
              : <p className="empty-detail-copy">No confirmed reservations are waiting.</p>}
          </div>
          <div className="table-detail-actions">
            <button className="staff-button staff-button-dark full-width" disabled={currentTable.status === 'UNAVAILABLE' || currentTable.status === 'BILLING'} onClick={openTable}><ConciergeBell size={16} /> Open table</button>
            <button className="staff-button staff-button-primary full-width" disabled={currentTable.status === 'UNAVAILABLE' || currentTable.status === 'BILLING'} onClick={createOrderForTable}><Plus size={16} /> Add order</button>
            {linkedOrder && <button className="staff-button staff-button-light full-width" onClick={() => navigate(`/reception/billing?orderId=${linkedOrder.id}`)}><ReceiptText size={15} /> Generate bill</button>}
            {linkedOrder && <button className="staff-button staff-button-quiet full-width" onClick={() => navigate(`/reception/orders?orderId=${linkedOrder.id}`)}>View order details <ArrowRight size={15} /></button>}
          </div>
        </aside>
      </div>}
    </>
  )
}

function ReservationsPage() {
  const { reservations, setReservations, tables, setTables, orders } = useRestaurantState()
  const notify = useStaffNotify()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [showNewForm, setShowNewForm] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]?.id ?? '')
  const [newDate, setNewDate] = useState(todayKey())
  const [newTime, setNewTime] = useState('19:00')
  const [newGuests, setNewGuests] = useState(2)
  const [newTable, setNewTable] = useState('')
  const [showAll, setShowAll] = useState(false)
  const todayReservations = reservations.filter((reservation) => reservation.date === todayKey())
  const filtered = useMemo(() => reservations.filter((reservation) => {
    const textMatch = `${reservation.customerName} ${reservation.customerPhone} Table ${reservation.tableNumber}`.toLowerCase().includes(query.trim().toLowerCase())
    return textMatch && (filter === 'ALL' || reservation.status === filter) && (showAll || reservation.date === todayKey())
  }).sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)), [filter, query, reservations, showAll])
  const suitableTables = tables.filter((table) =>
    table.capacity >= newGuests &&
    table.status === 'AVAILABLE' &&
    !orders.some((order) => order.tableId === table.id && activeStatuses.includes(order.status)),
  )

  const changeStatus = (reservation: Reservation, status: ReservationStatus) => {
    setReservations((current) => current.map((candidate) => candidate.id === reservation.id ? { ...candidate, status } : candidate))
    if (status === 'SEATED') {
      setTables((current) => current.map((table) => table.id === reservation.tableId ? { ...table, status: 'OCCUPIED', currentReservationId: reservation.id } : table))
    } else if (['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(status)) {
      setTables((current) => current.map((table) => table.id === reservation.tableId && table.currentReservationId === reservation.id ? { ...table, status: 'AVAILABLE', currentReservationId: undefined } : table))
    }
    notify(`${reservation.customerName}'s reservation marked ${statusLabel(status).toLowerCase()}.`)
  }

  const addReservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const customer = customers.find((candidate) => candidate.id === selectedCustomer)
    const table = tables.find((candidate) => candidate.id === newTable)
    if (!customer || !table) {
      notify('Choose a guest and available table first.', 'error')
      return
    }
    const reservation: Reservation = {
      id: generateId('res'),
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      tableId: table.id,
      tableNumber: table.tableNumber,
      date: newDate,
      time: newTime,
      guests: newGuests,
      status: 'CONFIRMED',
      specialRequests: String(form.get('request') ?? '').trim() || undefined,
      createdAt: new Date().toISOString(),
    }
    setReservations((current) => [reservation, ...current])
    setTables((current) => current.map((candidate) => candidate.id === table.id ? { ...candidate, status: 'RESERVED', currentReservationId: reservation.id } : candidate))
    setShowNewForm(false)
    setNewTable('')
    notify(`Reservation for ${customer.name} added.`)
  }

  return <>
    <PageHeading eyebrow="Front of house · Guest book" title="Reservations." description={`${todayReservations.length} reservations on the book for today.`} action={<button className="staff-button staff-button-dark" onClick={() => setShowNewForm((visible) => !visible)}><Plus size={16} /> New reservation</button>} />
    <div className="reservation-summary-row"><div className="reservation-summary-card"><CalendarDays size={18} /><span>Today</span><strong>{todayReservations.length}</strong></div><div className="reservation-summary-card"><Check size={18} /><span>Confirmed</span><strong>{todayReservations.filter((item) => item.status === 'CONFIRMED').length}</strong></div><div className="reservation-summary-card"><ConciergeBell size={18} /><span>Seated</span><strong>{todayReservations.filter((item) => item.status === 'SEATED').length}</strong></div><div className="reservation-summary-card"><Users size={18} /><span>Today's guests</span><strong>{todayReservations.filter((item) => !['CANCELLED', 'NO_SHOW'].includes(item.status)).reduce((sum, item) => sum + item.guests, 0)}</strong></div></div>
    {showNewForm && <form className="panel new-reservation-form" onSubmit={addReservation}>
      <div className="panel-heading"><div><span className="staff-eyebrow">MAKE A PLACE</span><h2>New reservation</h2></div><button type="button" className="icon-action" aria-label="Close reservation form" onClick={() => setShowNewForm(false)}><X size={16} /></button></div>
      <div className="reservation-form-grid">
        <label>Guest<select required value={selectedCustomer} onChange={(event) => setSelectedCustomer(event.target.value)}>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} · {customer.phone}</option>)}</select></label>
        <label>Date<input type="date" min={todayKey()} required value={newDate} onChange={(event) => { setNewDate(event.target.value); setNewTable('') }} /></label>
        <label>Time<input type="time" required value={newTime} onChange={(event) => setNewTime(event.target.value)} /></label>
        <label>Guests<select value={newGuests} onChange={(event) => { setNewGuests(Number(event.target.value)); setNewTable('') }}>{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => <option value={count} key={count}>{count} guests</option>)}</select></label>
        <label>Available table<select required value={newTable} onChange={(event) => setNewTable(event.target.value)}><option value="">Select a table…</option>{suitableTables.map((table) => <option key={table.id} value={table.id}>Table {table.tableNumber} · {table.capacity} seats · {table.location}</option>)}</select></label>
        <label>Special request<input name="request" placeholder="Optional note for the team" /></label>
      </div>
      {suitableTables.length === 0 && <p className="form-hint warning">No available tables fit this party. Adjust the guest count or free a table.</p>}
      <button className="staff-button staff-button-primary" type="submit" disabled={!newTable || suitableTables.length === 0}><Check size={15} /> Confirm reservation</button>
    </form>}
    <section className="panel reservations-panel">
      <div className="panel-heading reservation-controls">
        <div><span className="staff-eyebrow">THE GUEST BOOK</span><h2>{showAll ? 'All reservations' : "Today's reservations"}</h2></div>
        <div className="table-toolbar"><label className="staff-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a guest…" /></label><select className="filter-select" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="ALL">All statuses</option>{reservationStatuses.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}</select><button className="staff-button staff-button-quiet" onClick={() => setShowAll((value) => !value)}>{showAll ? "Today's only" : 'All dates'}</button></div>
      </div>
      <div className="data-table-wrap"><table className="staff-table reservation-table"><thead><tr><th>GUEST</th><th>DATE &amp; TIME</th><th>PARTY</th><th>TABLE</th><th>STATUS</th><th>SPECIAL REQUEST</th><th>ACTION</th></tr></thead><tbody>{filtered.map((reservation) => <tr key={reservation.id}><td><strong>{reservation.customerName}</strong><small>{reservation.customerPhone}</small></td><td>{reservation.date}<small>{reservation.time}</small></td><td>{reservation.guests} guests</td><td>Table {reservation.tableNumber}</td><td><StatusBadge status={reservation.status} /></td><td>{reservation.specialRequests || <span className="muted-cell">—</span>}</td><td><select aria-label={`Change status for ${reservation.customerName}`} className="row-action-select" value={reservation.status} onChange={(event) => changeStatus(reservation, event.target.value as ReservationStatus)}>{reservationStatuses.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}</select></td></tr>)}</tbody></table>
      {filtered.length === 0 && <div className="staff-empty"><CalendarDays size={23} /><strong>No matching reservations</strong><span>Try a different search, status, or date range.</span></div>}</div>
    </section>
  </>
}

function OrdersPage() {
  const { orders, setOrders, tables, setTables } = useRestaurantState()
  const notify = useStaffNotify()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const requestedOrderId = params.get('orderId')
  const initialTableId = params.get('tableId') ?? ''
  const [tableId, setTableId] = useState(initialTableId)
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? '')
  const [menuQuery, setMenuQuery] = useState('')
  const [draftItems, setDraftItems] = useState<OrderItem[]>([])
  const [note, setNote] = useState('')
  const [activeOrderId, setActiveOrderId] = useState(requestedOrderId)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [showAllOrders, setShowAllOrders] = useState(false)
  const activeOrder = orders.find((order) => order.id === activeOrderId)
  const itemCategories = ['All', ...new Set(menuItems.map((item) => item.category))]
  const filteredMenu = menuItems.filter((item) =>
    item.available &&
    (categoryFilter === 'All' || item.category === categoryFilter) &&
    `${item.name} ${item.description}`.toLowerCase().includes(menuQuery.trim().toLowerCase()),
  )
  const openOrders = orders.filter((order) => !['COMPLETED', 'CANCELLED'].includes(order.status)).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const listedOrders = showAllOrders ? [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : openOrders
  const draftSubtotal = orderSubtotal(draftItems)
  const draftTax = calcTax(draftSubtotal)

  const addFood = (item: MenuItem) => {
    setDraftItems((current) => {
      const existing = current.find((entry) => entry.menuItemId === item.id)
      if (existing) return current.map((entry) => entry.menuItemId === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry)
      return [...current, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }]
    })
  }
  const updateFood = (itemId: string, change: number) => {
    setDraftItems((current) => current.map((item) => item.menuItemId === itemId ? { ...item, quantity: item.quantity + change } : item).filter((item) => item.quantity > 0))
  }
  const updateExistingFood = (order: Order, itemId: string, change: number) => {
    const items = order.items.map((item) => item.menuItemId === itemId ? { ...item, quantity: item.quantity + change } : item).filter((item) => item.quantity > 0)
    if (items.length === 0) {
      notify('An active order must contain at least one item.', 'error')
      return
    }
    const subtotal = orderSubtotal(items)
    const tax = calcTax(subtotal)
    setOrders((current) => current.map((candidate) => candidate.id === order.id ? { ...candidate, items, subtotal, tax, total: subtotal + tax } : candidate))
    notify('Order items updated.')
  }
  const sendToKitchen = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const table = tables.find((candidate) => candidate.id === tableId)
    const customer = customers.find((candidate) => candidate.id === customerId)
    if (!table || !customer || draftItems.length === 0) {
      notify('Choose a table, a guest, and at least one dish.', 'error')
      return
    }
    if (table.status === 'UNAVAILABLE' || table.status === 'BILLING') {
      notify(`Table ${table.tableNumber} cannot accept an order right now.`, 'error')
      return
    }
    const subtotal = orderSubtotal(draftItems)
    const tax = calcTax(subtotal)
    const order: Order = {
      id: generateId('ord'),
      orderNumber: Math.max(orders.reduce((max, candidate) => Math.max(max, candidate.orderNumber), 1000) + 1, 1001),
      tableId: table.id,
      customerId: customer.id,
      items: draftItems,
      subtotal,
      tax,
      discount: 0,
      total: subtotal + tax,
      paymentStatus: 'PENDING',
      status: 'NEW',
      createdAt: new Date().toISOString(),
      notes: note.trim() || undefined,
    }
    setOrders((current) => [order, ...current])
    setTables((current) => current.map((candidate) => candidate.id === table.id ? { ...candidate, status: 'OCCUPIED', currentOrderId: order.id } : candidate))
    setDraftItems([])
    setNote('')
    setActiveOrderId(order.id)
    setParams({ orderId: order.id })
    notify(`${formatOrderNumber(order.orderNumber)} sent to the kitchen.`)
  }

  return <>
    <PageHeading eyebrow="Front of house · Point of sale" title="Orders." description="Build an order, send it to the kitchen, and keep the room moving." action={<button className="staff-button staff-button-quiet" onClick={() => navigate('/reception/tables')}><Table2 size={15} /> Floor plan</button>} />
    <div className="pos-layout">
      <section className="panel pos-builder">
        <div className="panel-heading"><div><span className="staff-eyebrow">NEW TICKET</span><h2>Build an order</h2></div><span className="ticket-state"><i /> Draft</span></div>
        <form onSubmit={sendToKitchen}>
          <div className="pos-select-row">
            <label>Table<select required value={tableId} onChange={(event) => setTableId(event.target.value)}><option value="">Choose a table…</option>{tables.filter((table) => table.status !== 'UNAVAILABLE' && table.status !== 'BILLING').map((table) => <option key={table.id} value={table.id}>Table {table.tableNumber} · {table.location} · {table.capacity} seats</option>)}</select></label>
            <label>Guest<select required value={customerId} onChange={(event) => setCustomerId(event.target.value)}>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select></label>
          </div>
          <div className="menu-pick-heading"><div><span className="staff-eyebrow">THE MENU</span><h3>Add dishes</h3></div><label className="staff-search"><Search size={14} /><input value={menuQuery} onChange={(event) => setMenuQuery(event.target.value)} placeholder="Search dishes…" /></label></div>
          <div className="pos-category-tabs">{itemCategories.map((category) => <button type="button" className={categoryFilter === category ? 'active' : ''} onClick={() => setCategoryFilter(category)} key={category}>{category}</button>)}</div>
          <div className="menu-pick-list">{filteredMenu.map((item) => {
            const count = draftItems.find((draft) => draft.menuItemId === item.id)?.quantity ?? 0
            return <div className="menu-pick-row" key={item.id}><span className="menu-pick-veg">{item.vegetarian ? <Leaf size={13} /> : <UtensilsCrossed size={13} />}</span><span className="menu-pick-copy"><strong>{item.name}</strong><small>{item.category} {item.bestseller ? '· House favourite' : ''}</small></span><span className="menu-pick-price">{money(item.price)}</span><button className={`menu-pick-add ${count ? 'added' : ''}`} type="button" onClick={() => addFood(item)} aria-label={`Add ${item.name}${count ? `, ${count} in order` : ''}`}>{count > 0 ? <><Check size={13} /> {count}</> : <Plus size={14} />}</button></div>
          })}{filteredMenu.length === 0 && <div className="menu-list-empty">No available dishes match your search.</div>}</div>
          {draftItems.length > 0 && <div className="draft-items"><div className="draft-items-header"><span className="staff-eyebrow">THIS TICKET</span><strong>{draftItems.reduce((sum, item) => sum + item.quantity, 0)} items</strong></div>{draftItems.map((item) => <div className="draft-item-row" key={item.menuItemId}><span>{item.name}</span><div className="quantity-stepper"><button type="button" aria-label={`Remove one ${item.name}`} onClick={() => updateFood(item.menuItemId, -1)}><Minus size={12} /></button><strong>{item.quantity}</strong><button type="button" aria-label={`Add one ${item.name}`} onClick={() => updateFood(item.menuItemId, 1)}><Plus size={12} /></button></div><strong>{money(item.price * item.quantity)}</strong><button className="remove-draft" type="button" aria-label={`Remove ${item.name}`} onClick={() => setDraftItems((current) => current.filter((entry) => entry.menuItemId !== item.menuItemId))}><X size={14} /></button></div>)}</div>}
          <label className="notes-field">Kitchen notes<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Allergies, no onion, sauce on the side…" rows={2} /></label>
          <div className="draft-totals"><div><span>Subtotal</span><strong>{money(draftSubtotal)}</strong></div><div><span>Tax · GST 5%</span><strong>{money(draftTax)}</strong></div><div className="draft-total"><span>Total</span><strong>{money(draftSubtotal + draftTax)}</strong></div></div>
          <button type="submit" className="staff-button staff-button-primary send-kitchen-button" disabled={!tableId || draftItems.length === 0}><ChefHat size={16} /> Send to kitchen <ArrowRight size={15} /></button>
        </form>
      </section>
      <section className="panel open-tickets">
        <div className="panel-heading"><div><span className="staff-eyebrow">{showAllOrders ? 'ORDER HISTORY' : 'ACTIVE SERVICE'}</span><h2>{showAllOrders ? 'All tickets' : 'Open tickets'}</h2></div><button className="staff-button staff-button-quiet small-button" onClick={() => setShowAllOrders((value) => !value)}>{showAllOrders ? 'Active only' : 'Show all'}</button></div>
        <div className="open-ticket-list">{listedOrders.slice(0, 35).map((order) => {
          const table = tables.find((candidate) => candidate.id === order.tableId)
          const customer = customers.find((candidate) => candidate.id === order.customerId)
          return <button className={`open-ticket ${activeOrderId === order.id ? 'selected' : ''}`} key={order.id} onClick={() => { setActiveOrderId(order.id); setParams({ orderId: order.id }) }}>
            <span className="ticket-table"><Table2 size={14} />{table?.tableNumber ?? '—'}</span><span className="ticket-copy"><strong>{formatOrderNumber(order.orderNumber)} <small>{customer?.name ?? 'Guest'}</small></strong><span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items · {money(order.total)}</span></span><StatusBadge status={order.status} />
          </button>
        })}{listedOrders.length === 0 && <div className="staff-empty"><ShoppingBasket size={22} /><strong>No open orders</strong><span>Build a new ticket and send it to the kitchen.</span></div>}</div>
        {activeOrder && <div className="selected-ticket">
          <div className="selected-ticket-title"><span className="staff-eyebrow">TICKET DETAILS</span><strong>{formatOrderNumber(activeOrder.orderNumber)}</strong></div>
          <div className="selected-ticket-meta"><span>Table {tables.find((table) => table.id === activeOrder.tableId)?.tableNumber}</span><span>{customers.find((customer) => customer.id === activeOrder.customerId)?.name ?? 'Guest'}</span></div>
          <div className="existing-ticket-items">{activeOrder.items.map((item) => <div key={item.menuItemId}><span>{item.quantity} × {item.name}</span><span>{money(item.price * item.quantity)}</span><div className="quantity-stepper"><button aria-label={`Remove one ${item.name} from ticket`} onClick={() => updateExistingFood(activeOrder, item.menuItemId, -1)}><Minus size={11} /></button><strong>{item.quantity}</strong><button aria-label={`Add one ${item.name} to ticket`} onClick={() => updateExistingFood(activeOrder, item.menuItemId, 1)}><Plus size={11} /></button></div></div>)}</div>
          {activeOrder.notes && <p className="ticket-note"><strong>Kitchen note:</strong> {activeOrder.notes}</p>}
          <div className="ticket-total"><span>Total</span><strong>{money(activeOrder.total)}</strong></div>
          {activeOrder.paymentStatus !== 'PAID' && activeOrder.status !== 'CANCELLED' && <button className="staff-button staff-button-light full-width" onClick={() => navigate(`/reception/billing?orderId=${activeOrder.id}`)}><ReceiptText size={15} /> Generate bill</button>}
        </div>}
      </section>
    </div>
  </>
}

function BillingPage() {
  const { orders, setOrders, tables, setTables } = useRestaurantState()
  const notify = useStaffNotify()
  const [searchParams, setSearchParams] = useSearchParams()
  const [discountInput, setDiscountInput] = useState('0')
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'UPI'>('UPI')
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paidOrder, setPaidOrder] = useState<Order | null>(null)
  const selectedId = searchParams.get('orderId')
  const unpaidOrders = orders.filter((order) => order.paymentStatus !== 'PAID' && order.status !== 'CANCELLED').sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const selectedOrder = orders.find((order) => order.id === selectedId && order.paymentStatus !== 'PAID') ?? unpaidOrders[0]
  const subtotal = selectedOrder ? orderSubtotal(selectedOrder.items) : 0
  const discountPercent = Math.min(100, Math.max(0, Number(discountInput) || 0))
  const discount = subtotal * discountPercent / 100
  const tax = calcTax(subtotal - discount)
  const total = subtotal - discount + tax

  const payOrder = () => {
    if (!selectedOrder || paymentLoading) return
    setPaymentLoading(true)
    window.setTimeout(() => {
      const completedOrder: Order = {
        ...selectedOrder,
        subtotal,
        discount,
        tax,
        total,
        paymentMethod,
        paymentStatus: 'PAID',
        status: 'COMPLETED',
        completedAt: new Date().toISOString(),
      }
      setOrders((current) => current.map((order) => order.id === completedOrder.id ? completedOrder : order))
      setTables((current) => current.map((table) => table.id === completedOrder.tableId ? { ...table, status: 'AVAILABLE', currentOrderId: undefined, currentReservationId: undefined } : table))
      setPaidOrder(completedOrder)
      setPaymentLoading(false)
      setSearchParams({})
      notify(`Payment of ${money(completedOrder.total)} recorded by ${paymentMethod}.`)
    }, 700)
  }

  if (paidOrder) return <section className="payment-success panel"><div className="payment-confetti"><span>✦</span><span>✧</span><span>✳</span><span>✦</span><span>✧</span></div><div className="payment-success-mark"><Check size={31} /></div><span className="staff-eyebrow">ALL SETTLED</span><h1>Thank you.</h1><p>{formatOrderNumber(paidOrder.orderNumber)} is paid and the table is ready for its next guests.</p><div className="success-total">{money(paidOrder.total)}</div><div className="success-meta"><span>{paymentMethod} payment</span><span>Table {tables.find((table) => table.id === paidOrder.tableId)?.tableNumber}</span></div><button className="staff-button staff-button-dark" onClick={() => setPaidOrder(null)}><ReceiptText size={15} /> Take next payment</button></section>

  return <>
    <PageHeading eyebrow="Front of house · Checkout" title="Billing." description="A clear bill, an easy finish, a table ready for what comes next." />
    {unpaidOrders.length === 0 ? <section className="panel no-bills"><span className="no-bills-icon"><Check size={22} /></span><h2>All settled for now.</h2><p>There are no unpaid tickets waiting for payment.</p><Link className="staff-button staff-button-primary" to="/reception/orders"><Plus size={15} /> Start a new order</Link></section> : <div className="billing-layout">
      <section className="panel bill-order-picker"><div className="panel-heading"><div><span className="staff-eyebrow">READY FOR CHECKOUT</span><h2>Unpaid orders</h2></div><span className="bill-count">{unpaidOrders.length}</span></div><div className="bill-order-list">{unpaidOrders.map((order) => {
        const table = tables.find((candidate) => candidate.id === order.tableId)
        const guest = customers.find((candidate) => candidate.id === order.customerId)
        return <button key={order.id} className={`bill-order-option ${selectedOrder?.id === order.id ? 'selected' : ''}`} onClick={() => setSearchParams({ orderId: order.id })}><span className="bill-order-table">T{table?.tableNumber ?? '—'}</span><span><strong>{formatOrderNumber(order.orderNumber)} · {guest?.name ?? 'Guest'}</strong><small>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items · {statusLabel(order.status)}</small></span><strong>{money(order.total)}</strong></button>
      })}</div></section>
      {selectedOrder ? <section className="panel bill-paper">
        <div className="bill-paper-header"><span className="staff-eyebrow">EMBER &amp; OAK · BILL</span><h2>Settle <em>the table.</em></h2><div className="bill-meta"><span>{formatOrderNumber(selectedOrder.orderNumber)}</span><span>Table {tables.find((table) => table.id === selectedOrder.tableId)?.tableNumber}</span><span>{customers.find((customer) => customer.id === selectedOrder.customerId)?.name ?? 'Guest'}</span></div></div>
        <div className="bill-lines"><div className="bill-line bill-column-head"><span>ITEM</span><span>QTY</span><span>PRICE</span><span>AMOUNT</span></div>{selectedOrder.items.map((item) => <div className="bill-line" key={item.menuItemId}><span>{item.name}</span><span>{item.quantity}</span><span>{money(item.price)}</span><strong>{money(item.price * item.quantity)}</strong></div>)}</div>
        {selectedOrder.notes && <div className="bill-notes"><span>Kitchen note</span><p>{selectedOrder.notes}</p></div>}
        <div className="bill-calculations"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><label><span>Discount</span><span className="discount-input-wrap"><input aria-label="Discount percentage" type="number" min="0" max="100" step="1" value={discountInput} onChange={(event) => setDiscountInput(event.target.value)} /><span>%</span><strong>− {money(discount)}</strong></span></label><div><span>GST · 5%</span><strong>{money(tax)}</strong></div><div className="bill-grand-total"><span>Amount due</span><strong>{money(total)}</strong></div></div>
        <div className="payment-section"><span className="staff-eyebrow">PAYMENT METHOD · SIMULATED</span><div className="payment-methods">{(['Cash', 'Card', 'UPI'] as const).map((method) => {
          const Icon = method === 'Cash' ? Banknote : method === 'Card' ? CreditCard : WalletCards
          return <button key={method} className={`payment-method ${paymentMethod === method ? 'selected' : ''}`} onClick={() => setPaymentMethod(method)}><Icon size={18} /><span>{method}</span></button>
        })}</div><button className="staff-button staff-button-primary pay-button" disabled={paymentLoading || total < 0} onClick={payOrder}>{paymentLoading ? <><span className="small-spinner" /> Processing payment…</> : <><Check size={16} /> Complete payment · {money(total)}</>}</button><p>Demo only — no real payment is collected.</p></div>
      </section> : <section className="panel bill-empty"><ReceiptText size={22} /><span>Select an order to review its bill.</span></section>}
    </div>}
  </>
}

function KitchenDisplay() {
  const { orders, setOrders, tables } = useRestaurantState()
  const [clock, setClock] = useState(() => Date.now())
  const [notice, setNotice] = useState('')
  const [soundOn, setSoundOn] = useState(false)
  useEffect(() => {
    const interval = window.setInterval(() => setClock(Date.now()), 30000)
    return () => window.clearInterval(interval)
  }, [])
  const notify = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2500)
  }
  const stages: OrderStatus[] = ['NEW', 'PREPARING', 'READY', 'SERVED']
  const kitchenOrders = orders.filter((order) => stages.includes(order.status)).sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  const stageLabels: Record<string, string> = { NEW: 'New tickets', PREPARING: 'On the line', READY: 'Ready to run', SERVED: 'At the table' }
  const moveOrder = (order: Order) => {
    const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = { NEW: 'PREPARING', PREPARING: 'READY', READY: 'SERVED' }
    const next = nextStatus[order.status]
    if (!next) return
    setOrders((current) => current.map((candidate) => candidate.id === order.id ? { ...candidate, status: next } : candidate))
    notify(`${formatOrderNumber(order.orderNumber)} moved to ${next.toLowerCase()}.`)
  }
  const elapsed = (createdAt: string) => {
    const mins = Math.max(0, Math.floor((clock - new Date(createdAt).getTime()) / 60000))
    return mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m`
  }

  return <div className="kitchen-display">
    <header className="kitchen-topbar"><Link className="kitchen-brand" to="/reception"><span className="kitchen-logo"><ChefHat size={19} /></span><span><strong>EMBER &amp; OAK</strong><small>KITCHEN DISPLAY</small></span></Link><div className="kitchen-top-right"><span className="kitchen-shift"><i /> SERVICE IN PROGRESS</span><span className="kitchen-clock">{new Date(clock).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span><button className={`kitchen-sound ${soundOn ? 'enabled' : ''}`} onClick={() => setSoundOn((enabled) => !enabled)} aria-pressed={soundOn} title="Toggle new ticket sound"><span>{soundOn ? 'SOUND ON' : 'SOUND OFF'}</span></button></div></header>
    <main className="kitchen-content">
      <div className="kitchen-heading"><div><span className="kitchen-eyebrow">THE PASS · DINNER SERVICE</span><h1>On the line<span>.</span></h1><p>One good plate at a time. Keep the rhythm.</p></div><div className="kitchen-summary"><div><strong>{kitchenOrders.length}</strong><span>active tickets</span></div><div><strong>{kitchenOrders.filter((order) => order.status === 'NEW').length}</strong><span>new to start</span></div><div><strong>{kitchenOrders.filter((order) => order.status === 'READY').length}</strong><span>ready to run</span></div></div></div>
      <div className="kitchen-board">{stages.map((stage) => {
        const stageOrders = kitchenOrders.filter((order) => order.status === stage)
        return <section className={`kitchen-column ${stage.toLowerCase()}`} key={stage}>
          <div className="kitchen-column-heading"><div className="kitchen-column-title"><i className={`kitchen-stage-dot ${stage.toLowerCase()}`} /><h2>{stageLabels[stage]}</h2></div><span className="kitchen-count">{String(stageOrders.length).padStart(2, '0')}</span></div>
          <div className="kitchen-ticket-list">{stageOrders.map((order) => {
            const table = tables.find((candidate) => candidate.id === order.tableId)
            return <article className="kitchen-ticket" key={order.id}>
              <div className="kitchen-ticket-head"><span>#{order.orderNumber}</span><StatusBadge status={order.status} /></div>
              <div className="kitchen-ticket-table"><Table2 size={15} /><strong>Table {table?.tableNumber ?? '—'}</strong><span>{customers.find((customer) => customer.id === order.customerId)?.name ?? 'Guest'}</span></div>
              <div className="kitchen-ticket-items">{order.items.map((item) => <div className="kitchen-ticket-item" key={item.menuItemId}><span className="kitchen-qty">{String(item.quantity).padStart(2, '0')}</span><span>{item.name}</span>{menuItems.find((menuItem) => menuItem.id === item.menuItemId)?.vegetarian && <Leaf size={13} className="kitchen-veg" />}</div>)}</div>
              {order.notes && <div className="kitchen-ticket-note"><span>NOTE</span><p>{order.notes}</p></div>}
              <div className="kitchen-ticket-foot"><span className={`elapsed-time ${elapsed(order.createdAt).startsWith('1h') || elapsed(order.createdAt).startsWith('2h') ? 'slow' : ''}`}><Clock3 size={13} /> {elapsed(order.createdAt)}</span><span>{order.items.length} {order.items.length === 1 ? 'dish' : 'dishes'}</span></div>
              {stage !== 'SERVED' && <button className={`kitchen-action ${stage.toLowerCase()}`} onClick={() => moveOrder(order)}>{stage === 'NEW' ? 'START PREPARING' : stage === 'PREPARING' ? 'MARK READY' : 'MARK SERVED'}<ArrowRight size={14} /></button>}
              {stage === 'SERVED' && <div className="served-label"><Check size={14} /> DELIVERED TO TABLE</div>}
            </article>
          })}{stageOrders.length === 0 && <div className="kitchen-column-empty"><span>All clear</span><i>Nothing here right now.</i></div>}</div>
        </section>
      })}</div>
    </main>
    <footer className="kitchen-footer"><span><span className="kitchen-live-dot" /> DEMO · LIVE STATE SHARED WITH RECEPTION</span><Link to="/reception">Back to reception <ArrowRight size={14} /></Link></footer>
    {notice && <div className="kitchen-toast" role="status"><Check size={16} /> {notice}</div>}
  </div>
}

export { BillingPage, Dashboard, FloorTables, KitchenDisplay, OrdersPage, ReservationsPage, StaffLayout }
