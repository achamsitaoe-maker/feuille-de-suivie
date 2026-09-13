export interface Revenue {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  timestamp: number;
  userId?: string;
}

export interface DailyTotal {
  date: string;
  total: number;
  count: number;
}

export interface MonthlyStats {
  month: string;
  total: number;
  average: number;
  growth: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  googleId?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  error: string | null;
}

export interface RevenueState {
  revenues: Revenue[];
  isLoading: boolean;
  error: string | null;
  selectedMonth: string;
}

export interface Statistics {
  totalRevenue: number;
  averageDaily: number;
  totalDays: number;
  highestDay: number;
  lowestDay: number;
  growth: number;
  categories: { [key: string]: number };
}