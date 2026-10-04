export interface DailyRevenueSummary {
  date: string; // YYYY-MM-DD
  revenue: number;
  orders: number;
  averageOrderValue: number;
  dayOfWeek: string; // 'Monday', 'Tuesday', etc.
}

export interface MonthlySummary {
  month: string; // 'Apr 2026', 'May 2026', etc.
  revenue: number;
  orders: number;
  averageOrderValue: number;
  topSellingCategory: string;
}

// Simple seeded random for consistent data
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateDailySummaries(startDateStr: string, endDateStr: string): DailyRevenueSummary[] {
  const summaries: DailyRevenueSummary[] = [];
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let current = new Date(start);
  let dayIndex = 0;

  while (current <= end) {
    const seed = 1000 + dayIndex;
    const dayOfWeekStr = days[current.getDay()];
    
    // Trend factor: 0.0 to 1.0 over 187 days
    // Business growing by up to 25% over 6 months
    const totalDays = 187; // approx
    const trendMultiplier = 1 + (dayIndex / totalDays) * 0.25;

    let baseMinRev = 15000;
    let baseMaxRev = 25000;
    let baseMinOrders = 15;
    let baseMaxOrders = 25;

    if (dayOfWeekStr === 'Friday') {
      baseMinRev = 28000;
      baseMaxRev = 38000;
      baseMinOrders = 25;
      baseMaxOrders = 40;
    } else if (dayOfWeekStr === 'Saturday') {
      baseMinRev = 32000;
      baseMaxRev = 45000;
      baseMinOrders = 25;
      baseMaxOrders = 40;
    } else if (dayOfWeekStr === 'Sunday') {
      baseMinRev = 25000;
      baseMaxRev = 35000;
      baseMinOrders = 20;
      baseMaxOrders = 30;
    }

    const rand1 = seededRandom(seed * 2);
    const rand2 = seededRandom(seed * 3);

    const revenue = Math.round((baseMinRev + rand1 * (baseMaxRev - baseMinRev)) * trendMultiplier);
    const orders = Math.round((baseMinOrders + rand2 * (baseMaxOrders - baseMinOrders)) * trendMultiplier);
    
    // YYYY-MM-DD
    const dateStr = current.toISOString().split('T')[0];
    
    summaries.push({
      date: dateStr,
      revenue,
      orders,
      averageOrderValue: Math.round(revenue / orders),
      dayOfWeek: dayOfWeekStr
    });

    current.setDate(current.getDate() + 1);
    dayIndex++;
  }

  return summaries;
}

export const dailyRevenueSummaries = generateDailySummaries('2026-04-01', '2026-10-04');

function deriveMonthlySummaries(daily: DailyRevenueSummary[]): MonthlySummary[] {
  const monthMap: Record<string, { revenue: number, orders: number, monthName: string }> = {};
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const categories = ["Curries", "Breads", "Starters", "Biryani"];
  
  daily.forEach(d => {
    const [year, month] = d.date.split('-');
    const mIndex = parseInt(month, 10) - 1;
    const key = `${year}-${month}`;
    const mName = `${monthNames[mIndex]} ${year}`;
    
    if (!monthMap[key]) {
      monthMap[key] = { revenue: 0, orders: 0, monthName: mName };
    }
    monthMap[key].revenue += d.revenue;
    monthMap[key].orders += d.orders;
  });

  return Object.keys(monthMap).sort().map((key, index) => {
    const d = monthMap[key];
    const topCat = categories[index % categories.length];
    return {
      month: d.monthName,
      revenue: d.revenue,
      orders: d.orders,
      averageOrderValue: Math.round(d.revenue / d.orders),
      topSellingCategory: topCat
    };
  });
}

export const monthlySummaries = deriveMonthlySummaries(dailyRevenueSummaries);

export const revenueTargets = {
  daily: 25000,
  weekly: 175000,
  monthly: 750000,
};
