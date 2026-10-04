import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import AdminDashboard from './AdminDashboard.tsx'
import { BillingPage, Dashboard, FloorTables, KitchenDisplay, OrdersPage, ReservationsPage, StaffLayout } from './StaffApp.tsx'
import { RestaurantStateProvider } from './state/restaurantState'
import './Polish.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RestaurantStateProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/reception" element={<StaffLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="tables" element={<FloorTables />} />
            <Route path="reservations" element={<ReservationsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="billing" element={<BillingPage />} />
          </Route>
          <Route path="/kitchen" element={<KitchenDisplay />} />
          <Route path="*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </RestaurantStateProvider>
  </StrictMode>,
)
