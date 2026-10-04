import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CalendarDays,
  ChartNoAxesCombined,
  ChefHat,
  CircleDollarSign,
  Clock3,
  CreditCard,
  LayoutDashboard,
  ShoppingBag,
  Table2,
  Users,
  WalletCards,
} from 'lucide-react'
import { formatCurrency } from './utils'
import { getAdminAnalytics, getSalesSeries, type SalesPeriod } from './utils/adminAnalytics'
import { useRestaurantState } from './state/useRestaurantState'
import './AdminDashboard.css'

const money = (amount: number) => formatCurrency(amount)
const compactMoney = (amount: number) => amount >= 100000
  ? `₹${(amount / 100000).toFixed(1)}L`
  : amount >= 1000 ? `₹${(amount / 1000).toFixed(1)}k` : money(amount)
const periods: { key: SalesPeriod; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: '7 days' },
  { key: '30d', label: '30 days' },
  { key: '3m', label: '3 months' },
  { key: '6m', label: '6 months' },
]
const statusColors: Record<string, string> = {
  Completed: '#3e806d',
  Preparing: '#c99c50',
  Ready: '#6682b1',
  Cancelled: '#ba7168',
  Pending: '#a39b8c',
}

function AdminTooltip({ active, payload, label }: { active?: boolean; payload?: { dataKey?: string; value?: number; color?: string; name?: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return <div className="admin-chart-tooltip"><strong>{label}</strong>{payload.map((item) => <div key={item.dataKey}><i style={{ background: item.color }} />{item.name}<b>{item.dataKey === 'revenue' ? money(item.value ?? 0) : item.value}</b></div>)}</div>
}

function KpiCard({ title, value, detail, icon: Icon, tone }: { title: string; value: string; detail: string; icon: typeof CircleDollarSign; tone: string }) {
  return <article className="admin-kpi">
    <div className={`admin-kpi-icon ${tone}`}><Icon size={18} strokeWidth={1.8} /></div>
    <span className="admin-kpi-title">{title}</span>
    <strong>{value}</strong>
    <span className="admin-kpi-detail">{detail}</span>
  </article>
}

function PanelTitle({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return <div className="admin-panel-title"><div><span>{eyebrow}</span><h2>{title}</h2></div>{action}</div>
}

export default function AdminDashboard() {
  const { orders, tables, reservations } = useRestaurantState()
  const [period, setPeriod] = useState<SalesPeriod>('30d')
  const [rankingSize, setRankingSize] = useState<5 | 10>(5)
  const analytics = useMemo(() => getAdminAnalytics(orders, tables, reservations), [orders, tables, reservations])
  const salesSeries = useMemo(() => getSalesSeries(orders, period), [orders, period])
  const itemRows = analytics.bestSellers.slice(0, rankingSize)
  const paymentIcons = { UPI: WalletCards, Card: CreditCard, Cash: Banknote }
  const [now] = useState(() => new Date())

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <Link to="/admin" className="admin-brand"><span className="admin-brand-mark">E<span>&amp;</span>O</span><span><strong>EMBER &amp; OAK</strong><small>ADMINISTRATION</small></span></Link>
      <span className="admin-nav-label">MANAGEMENT</span>
      <nav className="admin-nav"><Link className="active" to="/admin"><LayoutDashboard size={17} /> Analytics overview</Link><Link to="/reception"><Users size={17} /> Reception &amp; POS</Link><Link to="/kitchen"><ChefHat size={17} /> Kitchen display</Link></nav>
      <div className="admin-sidebar-bottom"><span className="admin-live-dot" /> DEMO · SESSION DATA</div>
    </aside>

    <main className="admin-main">
      <header className="admin-topbar"><div><span>EMBER &amp; OAK</span><i>/</i><strong>ADMIN ANALYTICS</strong></div><div><span className="admin-demo-pill"><i /> LIVE DEMO</span><span className="admin-date">{now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span></div></header>
      <div className="admin-content">
        <section className="admin-welcome">
          <div><span className="admin-eyebrow"><ChartNoAxesCombined size={14} /> YOUR RESTAURANT, IN FOCUS</span><h1>Good evening<span>.</span></h1><p>A considered view of service, sales, and the stories behind every table.</p></div>
          <Link to="/reception" className="admin-outline-link"><ArrowLeft size={15} /> Back to reception</Link>
        </section>

        <section className="admin-kpis" aria-label="Restaurant key performance indicators">
          <KpiCard title="Total revenue" value={money(analytics.totalRevenue)} detail="From paid orders" icon={CircleDollarSign} tone="gold" />
          <KpiCard title="Total orders" value={analytics.totalOrders.toLocaleString('en-IN')} detail="All recorded tickets" icon={ShoppingBag} tone="blue" />
          <KpiCard title="Average order value" value={money(analytics.averageOrderValue)} detail="Per paid order" icon={ChartNoAxesCombined} tone="violet" />
          <KpiCard title="Today's revenue" value={money(analytics.todayRevenue)} detail="Paid orders · today" icon={CalendarDays} tone="green" />
          <KpiCard title="Table occupancy" value={`${Math.round(analytics.occupancy)}%`} detail={`${analytics.occupiedTables} tables in service`} icon={Table2} tone="rose" />
          <KpiCard title="Reservations" value={analytics.totalReservations.toLocaleString('en-IN')} detail="Across the guest book" icon={Users} tone="sand" />
        </section>

        <section className="admin-panel admin-sales-panel">
          <PanelTitle eyebrow="THE BIG PICTURE" title="Sales, over time" action={<div className="admin-period-tabs" role="group" aria-label="Sales chart time range">{periods.map((item) => <button key={item.key} className={period === item.key ? 'selected' : ''} onClick={() => setPeriod(item.key)} aria-pressed={period === item.key}>{item.label}</button>)}</div>} />
          <div className="admin-chart-summary"><div><span>Revenue in period</span><strong>{money(salesSeries.reduce((sum, point) => sum + point.revenue, 0))}</strong></div><i /><div><span>Orders in period</span><strong>{salesSeries.reduce((sum, point) => sum + point.orders, 0).toLocaleString('en-IN')}</strong></div><div className="chart-legend"><span><i className="legend-revenue" /> Revenue</span><span><i className="legend-orders" /> Orders</span></div></div>
          <div className="admin-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={salesSeries} margin={{ top: 10, right: 6, left: 0, bottom: 0 }}>
                <defs><linearGradient id="adminRevenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c99c50" stopOpacity={0.23} /><stop offset="95%" stopColor="#c99c50" stopOpacity={0.015} /></linearGradient></defs>
                <CartesianGrid vertical={false} stroke="#ece9e2" strokeDasharray="3 5" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#8d8a83', fontSize: 10 }} minTickGap={22} />
                <YAxis yAxisId="revenue" axisLine={false} tickLine={false} tick={{ fill: '#8d8a83', fontSize: 10 }} tickFormatter={compactMoney} width={52} />
                <YAxis yAxisId="orders" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#8d8a83', fontSize: 10 }} allowDecimals={false} width={28} />
                <Tooltip content={<AdminTooltip />} />
                <Area yAxisId="revenue" type="monotone" dataKey="revenue" name="Revenue" stroke="#bd8b3e" strokeWidth={2.5} fill="url(#adminRevenueFill)" activeDot={{ r: 4, strokeWidth: 0 }} />
                <Line yAxisId="orders" type="monotone" dataKey="orders" name="Orders" stroke="#607b91" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="admin-grid admin-grid-even">
          <section className="admin-panel">
            <PanelTitle eyebrow="A WEEK AT A GLANCE" title="Day-wise sales" />
            <div className="weekday-chart-wrap"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={analytics.weeklySales} margin={{ top: 12, right: 0, left: -10, bottom: 0 }}><CartesianGrid vertical={false} stroke="#ece9e2" strokeDasharray="3 5" /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#89867e', fontSize: 10 }} /><YAxis yAxisId="revenue" axisLine={false} tickLine={false} tick={{ fill: '#89867e', fontSize: 9 }} tickFormatter={compactMoney} width={53} /><YAxis yAxisId="orders" orientation="right" hide /><Tooltip content={<AdminTooltip />} /><Area yAxisId="revenue" type="monotone" dataKey="revenue" name="Revenue" stroke="#bd8b3e" fill="url(#adminRevenueFill)" /><Line yAxisId="orders" type="monotone" dataKey="orders" name="Orders" stroke="#607b91" strokeWidth={2} dot={{ r: 3, fill: '#607b91' }} /></ComposedChart></ResponsiveContainer></div>
            <div className="weekday-list">{analytics.weeklySales.map((day) => <div key={day.label}><span>{day.label}</span><strong>{money(day.revenue)}</strong><small>{day.orders} orders</small></div>)}</div>
          </section>

          <section className="admin-panel">
            <PanelTitle eyebrow="THE CROWD FAVOURITES" title="Best-selling dishes" action={<div className="admin-toggle-tabs"><button className={rankingSize === 5 ? 'selected' : ''} onClick={() => setRankingSize(5)}>Top 5</button><button className={rankingSize === 10 ? 'selected' : ''} onClick={() => setRankingSize(10)}>Top 10</button></div>} />
            <div className="admin-data-table-wrap"><table className="admin-data-table"><thead><tr><th>RANK · FOOD</th><th>UNITS</th><th>REVENUE</th><th>SHARE</th></tr></thead><tbody>{itemRows.map((item, index) => <tr key={item.id}><td><span className={`rank-number ${index < 3 ? 'top-rank' : ''}`}>{String(index + 1).padStart(2, '0')}</span><strong>{item.name}</strong></td><td>{item.units}</td><td>{money(item.revenue)}</td><td><div className="share-cell"><span><i style={{ width: `${Math.max(3, item.percentage)}%` }} /></span><small>{item.percentage.toFixed(1)}%</small></div></td></tr>)}</tbody></table>{itemRows.length === 0 && <p className="admin-empty">Dish sales will appear as orders are recorded.</p>}</div>
          </section>
        </div>

        <div className="admin-grid admin-grid-three">
          <section className="admin-panel">
            <PanelTitle eyebrow="WHAT'S ON THE MENU" title="Category mix" />
            <div className="category-list">{analytics.categories.map((category, index) => <div className="category-row" key={category.category}><span className={`category-swatch swatch-${index % 6}`} /><div className="category-main"><div><strong>{category.category}</strong><small>{category.orders} orders</small></div><strong>{money(category.revenue)}</strong></div><div className="category-progress"><i style={{ width: `${category.percentage}%` }} /></div><span className="category-percent">{category.percentage.toFixed(1)}%</span></div>)}{analytics.categories.length === 0 && <p className="admin-empty">No category sales yet.</p>}</div>
          </section>

          <section className="admin-panel">
            <PanelTitle eyebrow="HOW GUESTS PAY" title="Payment methods" />
            <div className="payment-list">{analytics.payments.map((payment) => {
              const Icon = paymentIcons[payment.method]
              return <div className="payment-row" key={payment.method}><span className={`payment-icon ${payment.method.toLowerCase()}`}><Icon size={17} /></span><div><strong>{payment.method}</strong><small>{payment.orders} paid orders</small></div><div className="payment-value"><strong>{money(payment.revenue)}</strong><small>{payment.percentage.toFixed(1)}%</small></div></div>
            })}</div>
            <p className="panel-footnote">Card includes credit and debit card payments.</p>
          </section>

          <section className="admin-panel">
            <PanelTitle eyebrow="SERVICE FLOW" title="Order status" />
            <div className="status-list">{analytics.statuses.map((entry) => <div className="status-row" key={entry.status}><span><i style={{ background: statusColors[entry.status] }} />{entry.status}</span><strong>{entry.count}</strong><div className="status-progress"><i style={{ width: `${entry.percentage}%`, background: statusColors[entry.status] }} /></div><small>{entry.percentage.toFixed(1)}%</small></div>)}</div>
            <p className="panel-footnote">New and confirmed tickets are grouped as pending.</p>
          </section>
        </div>

        <div className="admin-grid admin-grid-table">
          <section className="admin-panel">
            <PanelTitle eyebrow="THE ROOM" title="Table analytics" action={<Link to="/reception/tables" className="admin-text-link">Open floor plan <ArrowRight size={13} /></Link>} />
            <div className="table-kpi-row"><div><span>Occupancy</span><strong>{Math.round(analytics.occupancy)}<small>%</small></strong><div className="occupancy-bar"><i style={{ width: `${analytics.occupancy}%` }} /></div><small>{analytics.occupiedTables} of {tables.filter((table) => table.status !== 'UNAVAILABLE').length} tables in use</small></div><div><span>Available</span><strong>{analytics.availableTables}</strong><small>Ready for guests</small></div><div><span>Reserved</span><strong>{analytics.reservedTables}</strong><small>Held for reservations</small></div></div>
          </section>
          <section className="admin-panel most-used-panel">
            <PanelTitle eyebrow="REPEAT STOPS" title="Most-used tables" />
            <div className="most-used-list">{analytics.mostUsedTables.map((entry, index) => <div className="most-used-row" key={entry.table.id}><span className="table-rank">{index + 1}</span><span className="table-token"><Table2 size={14} /> Table {entry.table.tableNumber}</span><span>{entry.table.location}</span><strong>{entry.orders} orders</strong><small>{money(entry.revenue)}</small></div>)}{analytics.mostUsedTables.length === 0 && <p className="admin-empty">Table usage will appear as orders are recorded.</p>}</div>
          </section>
        </div>

        <footer className="admin-footer"><span><i className="admin-live-dot" /> Calculated from current mock orders and session state</span><span><Clock3 size={13} /> Updates as Reception changes during this session</span><Link to="/reception">Reception &amp; POS <ArrowRight size={13} /></Link></footer>
      </div>
    </main>
  </div>
}
