import type { Order, MenuItem } from '../types';
import type { 
  DailySales, CategorySales, ItemSales, PaymentBreakdown, 
  MonthlyRevenue, HourlyDistribution, OccupancyStats, 
  StatusDistribution, DashboardStats, Table 
} from '../types';

export function calcTotalRevenue(orders: Order[]): number {
  return orders
    .filter(o => o.status === 'COMPLETED')
    .reduce((sum, o) => sum + o.total, 0);
}

export function calcTotalOrders(orders: Order[]): number {
  return orders.filter(o => o.status === 'COMPLETED').length;
}

export function calcAverageOrderValue(orders: Order[]): number {
  const completedOrders = orders.filter(o => o.status === 'COMPLETED');
  if (completedOrders.length === 0) return 0;
  const totalRev = completedOrders.reduce((sum, o) => sum + o.total, 0);
  return totalRev / completedOrders.length;
}

export function calcBestSellingItems(orders: Order[], limit: number = 5): ItemSales[] {
  const itemMap = new Map<string, { name: string, quantity: number, revenue: number, category: string }>();

  orders.filter(o => o.status === 'COMPLETED').forEach(order => {
    order.items.forEach(item => {
      const existing = itemMap.get(item.menuItemId) || { name: item.name, quantity: 0, revenue: 0, category: 'Unknown' };
      itemMap.set(item.menuItemId, {
        name: item.name,
        category: existing.category, // We'll patch this later since we don't pass menuItems here in original signature, but we can return 'Unknown'
        quantity: existing.quantity + item.quantity,
        revenue: existing.revenue + (item.price * item.quantity)
      });
    });
  });

  return Array.from(itemMap.entries())
    .map(([menuItemId, data]) => ({ 
      menuItemId,
      name: data.name,
      category: data.category,
      quantitySold: data.quantity,
      revenue: data.revenue
    }))
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, limit);
}

export function calcCategorySales(orders: Order[], menuItems: MenuItem[]): CategorySales[] {
  const categoryMap = new Map<string, { revenue: number, quantity: number }>();
  const itemCategoryMap = new Map(menuItems.map(m => [m.id, m.category]));
  let totalRevenue = 0;

  orders.filter(o => o.status === 'COMPLETED').forEach(order => {
    order.items.forEach(item => {
      const category = itemCategoryMap.get(item.menuItemId) || 'Unknown';
      const existing = categoryMap.get(category) || { revenue: 0, quantity: 0 };
      const itemRev = item.price * item.quantity;
      categoryMap.set(category, {
        revenue: existing.revenue + itemRev,
        quantity: existing.quantity + item.quantity
      });
      totalRevenue += itemRev;
    });
  });

  return Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    revenue: data.revenue,
    quantity: data.quantity,
    percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0
  })).sort((a, b) => b.revenue - a.revenue);
}

export function calcDailySales(orders: Order[], days: number): DailySales[] {
  const salesMap = new Map<string, { revenue: number, orders: number }>();
  
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    salesMap.set(d.toISOString().split('T')[0], { revenue: 0, orders: 0 });
  }

  orders.filter(o => o.status === 'COMPLETED').forEach(order => {
    const dateStr = order.createdAt.split('T')[0];
    if (salesMap.has(dateStr)) {
      const existing = salesMap.get(dateStr)!;
      salesMap.set(dateStr, {
        revenue: existing.revenue + order.total,
        orders: existing.orders + 1
      });
    }
  });

  return Array.from(salesMap.entries()).map(([date, data]) => ({
    date,
    revenue: data.revenue,
    orders: data.orders,
    averageOrderValue: data.orders > 0 ? data.revenue / data.orders : 0
  }));
}

export function calcPaymentBreakdown(orders: Order[]): PaymentBreakdown[] {
  const paymentMap = new Map<string, { count: number, amount: number }>();
  let totalAmount = 0;

  orders.filter(o => o.paymentStatus === 'PAID').forEach(order => {
    const method = order.paymentMethod || 'UNKNOWN';
    const existing = paymentMap.get(method) || { count: 0, amount: 0 };
    paymentMap.set(method, {
      count: existing.count + 1,
      amount: existing.amount + order.total
    });
    totalAmount += order.total;
  });

  return Array.from(paymentMap.entries()).map(([method, data]) => ({
    method,
    count: data.count,
    amount: data.amount,
    percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0
  })).sort((a, b) => b.amount - a.amount);
}

export function calcTableOccupancy(tables: Table[]): OccupancyStats {
  const stats = {
    totalTables: tables.length,
    available: 0,
    occupied: 0,
    reserved: 0,
    billing: 0,
    unavailable: 0,
    occupancyRate: 0
  };

  tables.forEach(t => {
    if (t.status === 'AVAILABLE') stats.available++;
    else if (t.status === 'OCCUPIED') stats.occupied++;
    else if (t.status === 'RESERVED') stats.reserved++;
    else if (t.status === 'BILLING') stats.billing++;
    else if (t.status === 'UNAVAILABLE') stats.unavailable++;
  });

  if (stats.totalTables > 0) {
    stats.occupancyRate = (stats.occupied / stats.totalTables) * 100;
  }

  return stats;
}

export function calcOrderStatusDistribution(orders: Order[]): StatusDistribution[] {
  const statusMap = new Map<string, number>();

  orders.forEach(order => {
    statusMap.set(order.status, (statusMap.get(order.status) || 0) + 1);
  });

  return Array.from(statusMap.entries()).map(([status, count]) => ({
    status,
    count,
    percentage: orders.length > 0 ? (count / orders.length) * 100 : 0
  }));
}

export function calcRevenueByMonth(orders: Order[], months: number = 12): MonthlyRevenue[] {
  const monthlyMap = new Map<string, { revenue: number, orders: number }>();
  
  const today = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthlyMap.set(monthKey, { revenue: 0, orders: 0 });
  }

  orders.filter(o => o.status === 'COMPLETED').forEach(order => {
    const d = new Date(order.createdAt);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (monthlyMap.has(monthKey)) {
      const existing = monthlyMap.get(monthKey)!;
      monthlyMap.set(monthKey, {
        revenue: existing.revenue + order.total,
        orders: existing.orders + 1
      });
    }
  });

  return Array.from(monthlyMap.entries()).map(([month, data]) => ({
    month,
    revenue: data.revenue,
    orders: data.orders,
    averageOrderValue: data.orders > 0 ? data.revenue / data.orders : 0
  }));
}

export function calcPeakHours(orders: Order[]): HourlyDistribution[] {
  const hourlyMap = new Map<number, { orders: number, revenue: number }>();
  
  for (let i = 0; i < 24; i++) {
    hourlyMap.set(i, { orders: 0, revenue: 0 });
  }

  orders.filter(o => o.status === 'COMPLETED').forEach(order => {
    const hour = new Date(order.createdAt).getHours();
    const existing = hourlyMap.get(hour)!;
    hourlyMap.set(hour, {
      orders: existing.orders + 1,
      revenue: existing.revenue + order.total
    });
  });

  return Array.from(hourlyMap.entries()).map(([hour, data]) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return {
      hour,
      label: `${displayHour} ${ampm}`,
      orders: data.orders,
      revenue: data.revenue
    };
  }).sort((a, b) => a.hour - b.hour);
}

export function calcTodayStats(orders: Order[]): { revenue: number; orders: number; averageOrderValue: number } {
  const todayDate = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.createdAt.startsWith(todayDate));
  
  const revenue = calcTotalRevenue(todayOrders);
  const completedOrders = calcTotalOrders(todayOrders);
  const averageOrderValue = calcAverageOrderValue(todayOrders);

  return { revenue, orders: completedOrders, averageOrderValue };
}

export function calcDashboardStats(orders: Order[], tables: Table[], customers: { length: number }): DashboardStats {
  const todayDate = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.createdAt.startsWith(todayDate));
  
  return {
    totalRevenue: calcTotalRevenue(orders),
    totalOrders: calcTotalOrders(orders),
    averageOrderValue: calcAverageOrderValue(orders),
    totalCustomers: customers.length,
    occupancyRate: calcTableOccupancy(tables).occupancyRate,
    todayRevenue: calcTotalRevenue(todayOrders),
    todayOrders: calcTotalOrders(todayOrders),
    pendingOrders: orders.filter(o => !['COMPLETED', 'CANCELLED'].includes(o.status)).length
  };
}

export function calcRevenueTrend(orders: Order[], periodDays: number): { current: number; previous: number; percentChange: number; isPositive: boolean } {
  const now = new Date();
  const currentStart = new Date(now);
  currentStart.setDate(currentStart.getDate() - periodDays);
  
  const prevStart = new Date(currentStart);
  prevStart.setDate(prevStart.getDate() - periodDays);

  const currentOrders = getOrdersByDateRange(orders, currentStart.toISOString(), now.toISOString());
  const prevOrders = getOrdersByDateRange(orders, prevStart.toISOString(), currentStart.toISOString());

  const current = calcTotalRevenue(currentOrders);
  const previous = calcTotalRevenue(prevOrders);
  
  let percentChange = 0;
  if (previous > 0) {
    percentChange = ((current - previous) / previous) * 100;
  } else if (current > 0) {
    percentChange = 100;
  }

  return {
    current,
    previous,
    percentChange: Math.abs(percentChange),
    isPositive: current >= previous
  };
}

export function getOrdersByDateRange(orders: Order[], startDate: string, endDate: string): Order[] {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  
  return orders.filter(order => {
    const time = new Date(order.createdAt).getTime();
    return time >= start && time <= end;
  });
}

export function getActiveOrders(orders: Order[]): Order[] {
  return orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
}
