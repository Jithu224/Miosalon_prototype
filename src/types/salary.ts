export interface CommissionTier {
  minRevenue: number;
  maxRevenue: number; // use Infinity or 999999999 for "and above"
  rate: number; // percentage
}

export interface CommissionProfile {
  id: string;
  name: string; // e.g., "Senior Stylist Plan", "Junior Plan"
  type: 'flat-percentage' | 'flat-fixed' | 'tiered-slab' | 'tiered-highest';
  flatRate?: number; // for flat types
  tiers?: CommissionTier[]; // for tiered types
  includeProducts: boolean;
  includeTips: boolean;
}

export interface SalaryProfile {
  staffId: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'daily-wage';
  payStructure: 'fixed-only' | 'fixed-commission' | 'commission-only' | 'daily-wage';
  baseSalary: number;
  payCycle: 'monthly' | 'daily' | 'weekly' | 'custom';
  customPeriodStart?: number;  // day of month (e.g., 26)
  customPeriodEnd?: number;    // day of month (e.g., 25)
  customStartDate?: string;   // full date "2026-04-26" for calendar picker
  customEndDate?: string;     // full date "2026-05-25" for calendar picker
  weeklyPayDay?: number;      // 0=Sunday, 1=Monday ... 6=Saturday
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  commissionProfileId?: string;
}

export interface SalaryAdvance {
  id: string;
  staffId: string;
  amount: number;
  date: string;
  reason?: string;
  deducted: number;
  status: 'pending' | 'partial' | 'recovered';
}

export interface IncentiveRule {
  id: string;
  staffId: string;
  type: 'attendance-bonus' | 'target-bonus' | 'custom';
  label: string;
  amount: number;
  condition?: string;
}

export interface CustomDeduction {
  id: string;
  staffId: string;
  month: string; // "2026-04"
  label: string;
  amount: number;
}

export interface AttendanceEntry {
  staffId: string;
  month: string; // "2026-04"
  totalWorkingDays: number;
  daysPresent: number;
  daysAbsent: number;
  halfDays: number;
  absentDates?: string[];   // ["2026-04-03", "2026-04-18"] — specific dates picked via calendar
  halfDayDates?: string[];  // ["2026-04-12"] — dates marked as half-day
}

export interface SalaryEarning {
  label: string;
  amount: number;
}

export interface SalaryDeduction {
  label: string;
  amount: number;
}

export interface SalaryRecord {
  id: string;
  staffId: string;
  month: string; // "2026-04"
  baseSalary: number;
  commission: number;
  incentives: SalaryEarning[];
  tips: number;
  grossSalary: number;
  deductions: SalaryDeduction[];
  totalDeductions: number;
  netSalary: number;
  status: 'draft' | 'submitted' | 'approved' | 'paid';
  calculatedAt: string;
}
