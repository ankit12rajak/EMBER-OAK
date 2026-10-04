export interface DailySales {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

export interface CategorySales {
  category: string;
  revenue: number;
  quantity: number;
  percentage: number;
}

export interface ItemSales {
  menuItemId: string;
  name: string;
  category: string;
  quantitySold: number;
  revenue: number;
}

export interface PaymentBreakdown {
  method: string;
  count: number;
  amount: number;
  percentage: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

export interface HourlyDistribution {
  hour: number;
  label: string;
  orders: number;
  revenue: number;
}

export interface OccupancyStats {
  totalTables: number;
  available: number;
  occupied: number;
  reserved: number;
  billing: number;
  unavailable: number;
  occupancyRate: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
  occupancyRate: number;
  todayRevenue: number;
  todayOrders: number;
  pendingOrders: number;
}
