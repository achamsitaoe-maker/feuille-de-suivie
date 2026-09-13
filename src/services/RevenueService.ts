import { Revenue, DailyTotal, MonthlyStats, Statistics } from '../types';
import moment from 'moment';

class RevenueService {
  /**
   * Calculate daily totals
   */
  static getDailyTotals(revenues: Revenue[]): DailyTotal[] {
    const dailyMap = new Map<string, { total: number; count: number }>();

    revenues.forEach((revenue) => {
      const date = revenue.date;
      const existing = dailyMap.get(date) || { total: 0, count: 0 };
      existing.total += revenue.amount;
      existing.count += 1;
      dailyMap.set(date, existing);
    });

    return Array.from(dailyMap.entries())
      .map(([date, data]) => ({
        date,
        total: data.total,
        count: data.count,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  /**
   * Calculate monthly statistics
   */
  static getMonthlyStats(revenues: Revenue[]): MonthlyStats[] {
    const monthlyMap = new Map<string, { total: number; days: Set<string> }>();

    revenues.forEach((revenue) => {
      const month = revenue.date.slice(0, 7);
      const existing = monthlyMap.get(month) || { total: 0, days: new Set() };
      existing.total += revenue.amount;
      existing.days.add(revenue.date);
      monthlyMap.set(month, existing);
    });

    const stats = Array.from(monthlyMap.entries())
      .map(([month, data]) => {
        const average = data.days.size > 0 ? data.total / data.days.size : 0;
        return {
          month,
          total: data.total,
          average,
          growth: 0,
        };
      })
      .sort((a, b) => a.month.localeCompare(b.month));

    // Calculate growth
    for (let i = 1; i < stats.length; i++) {
      const prev = stats[i - 1].total;
      const current = stats[i].total;
      stats[i].growth = prev > 0 ? ((current - prev) / prev) * 100 : 0;
    }

    return stats;
  }

  /**
   * Calculate overall statistics
   */
  static calculateStatistics(revenues: Revenue[]): Statistics {
    if (revenues.length === 0) {
      return {
        totalRevenue: 0,
        averageDaily: 0,
        totalDays: 0,
        highestDay: 0,
        lowestDay: 0,
        growth: 0,
        categories: {},
      };
    }

    const dailyTotals = this.getDailyTotals(revenues);
    const totalRevenue = dailyTotals.reduce((sum, day) => sum + day.total, 0);
    const totalDays = dailyTotals.length;
    const averageDaily = totalDays > 0 ? totalRevenue / totalDays : 0;

    const amounts = dailyTotals.map((d) => d.total);
    const highestDay = Math.max(...amounts);
    const lowestDay = Math.min(...amounts);

    // Calculate growth (first half vs second half)
    const midPoint = Math.floor(dailyTotals.length / 2);
    const firstHalf = dailyTotals.slice(0, midPoint);
    const secondHalf = dailyTotals.slice(midPoint);

    const firstHalfTotal = firstHalf.reduce((sum, day) => sum + day.total, 0);
    const secondHalfTotal = secondHalf.reduce((sum, day) => sum + day.total, 0);
    const growth =
      firstHalfTotal > 0
        ? ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100
        : 0;

    // Calculate categories
    const categories: { [key: string]: number } = {};
    revenues.forEach((revenue) => {
      categories[revenue.category] =
        (categories[revenue.category] || 0) + revenue.amount;
    });

    return {
      totalRevenue,
      averageDaily,
      totalDays,
      highestDay,
      lowestDay,
      growth,
      categories,
    };
  }

  /**
   * Get revenues for a specific month
   */
  static getRevenuesByMonth(revenues: Revenue[], month: string): Revenue[] {
    return revenues.filter((r) => r.date.startsWith(month));
  }

  /**
   * Export data as CSV
   */
  static exportAsCSV(revenues: Revenue[]): string {
    const headers = ['Date', 'Montant', 'Catégorie', 'Description'];
    const rows = revenues.map((r) => [
      r.date,
      r.amount.toString(),
      r.category,
      r.description,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    return csvContent;
  }
}

export default RevenueService;