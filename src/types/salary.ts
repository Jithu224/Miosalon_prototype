export interface SalaryProfile {
  staffId: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'daily-wage';
  payStructure: 'fixed-only' | 'fixed-commission' | 'commission-only' | 'daily-wage';
  baseSalary: number;
  payCycle: 'monthly' | 'custom';
  customPeriodStart?: number; // day of month (e.g., 26)
  customPeriodEnd?: number;   // day of month (e.g., 25)
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
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
  status: 'draft' | 'approved' | 'paid';
  calculatedAt: string;
}
