import { SalaryProfile, AttendanceEntry, IncentiveRule, SalaryAdvance, CustomDeduction, SalaryEarning, SalaryDeduction } from '@/types/salary';

// Calculate commission from invoices for a staff member in a given month
export function calculateCommission(
  staffCommissionType: string,
  staffCommissionRate: number,
  invoiceRevenue: number,
  invoiceCount: number
): number {
  if (staffCommissionType === 'percentage') {
    return Math.round(invoiceRevenue * (staffCommissionRate / 100));
  }
  if (staffCommissionType === 'fixed') {
    return staffCommissionRate * invoiceCount;
  }
  return 0;
}

// Calculate pro-rata base salary for mid-month joiners
export function calculateProRataBase(
  baseSalary: number,
  joinDate: string,
  month: string,
  totalWorkingDays: number
): number {
  const [year, m] = month.split('-').map(Number);
  const monthStart = new Date(year, m - 1, 1);
  const monthEnd = new Date(year, m, 0);
  const join = new Date(joinDate);

  if (join <= monthStart) return baseSalary; // joined before this month
  if (join > monthEnd) return 0; // joins after this month

  // Pro-rata: days from join to month end
  const daysInMonth = monthEnd.getDate();
  const daysWorked = daysInMonth - join.getDate() + 1;
  return Math.round(baseSalary * (daysWorked / totalWorkingDays));
}

// Calculate attendance deduction
export function calculateAttendanceDeduction(
  baseSalary: number,
  attendance: AttendanceEntry
): number {
  if (attendance.totalWorkingDays === 0) return 0;
  const perDayRate = baseSalary / attendance.totalWorkingDays;
  return Math.round(perDayRate * attendance.daysAbsent + perDayRate * attendance.halfDays * 0.5);
}

// Calculate qualifying incentives
export function calculateIncentives(
  rules: IncentiveRule[],
  attendance: AttendanceEntry | undefined,
  totalRevenue: number
): SalaryEarning[] {
  return rules
    .filter((rule) => {
      if (rule.type === 'attendance-bonus') {
        return attendance ? attendance.daysAbsent === 0 : false;
      }
      if (rule.type === 'target-bonus' && rule.condition) {
        const match = rule.condition.match(/revenue\s*>\s*(\d+)/);
        if (match) return totalRevenue > Number(match[1]);
      }
      return true; // custom bonuses always apply
    })
    .map((rule) => ({ label: rule.label, amount: rule.amount }));
}

// Calculate advance recovery amount
export function calculateAdvanceRecovery(
  pendingAdvances: SalaryAdvance[],
  maxRecovery?: number // optional cap
): { totalRecovery: number; advances: { id: string; amount: number }[] } {
  let remaining = maxRecovery ?? Infinity;
  const advances: { id: string; amount: number }[] = [];

  for (const adv of pendingAdvances) {
    const outstanding = adv.amount - adv.deducted;
    if (outstanding <= 0) continue;
    const recovery = Math.min(outstanding, remaining);
    if (recovery > 0) {
      advances.push({ id: adv.id, amount: recovery });
      remaining -= recovery;
    }
    if (remaining <= 0) break;
  }

  return { totalRecovery: advances.reduce((s, a) => s + a.amount, 0), advances };
}

// Full salary calculation
export function calculateFullSalary(params: {
  profile: SalaryProfile;
  commissionType: string;
  commissionRate: number;
  joinDate: string;
  month: string;
  invoiceRevenue: number;
  invoiceCount: number;
  tips: number;
  attendance: AttendanceEntry | undefined;
  incentiveRules: IncentiveRule[];
  pendingAdvances: SalaryAdvance[];
  customDeductions: CustomDeduction[];
}): {
  baseSalary: number;
  commission: number;
  incentives: SalaryEarning[];
  tips: number;
  grossSalary: number;
  deductions: SalaryDeduction[];
  totalDeductions: number;
  netSalary: number;
} {
  const { profile, commissionType, commissionRate, joinDate, month, invoiceRevenue, invoiceCount, tips, attendance, incentiveRules, pendingAdvances, customDeductions } = params;

  const totalWorkingDays = attendance?.totalWorkingDays || 26;

  // Earnings
  const baseSalary = profile.payStructure === 'commission-only' ? 0 : calculateProRataBase(profile.baseSalary, joinDate, month, totalWorkingDays);
  const commission = profile.payStructure === 'fixed-only' ? 0 : calculateCommission(commissionType, commissionRate, invoiceRevenue, invoiceCount);
  const incentives = calculateIncentives(incentiveRules, attendance, invoiceRevenue);
  const totalIncentives = incentives.reduce((s, i) => s + i.amount, 0);
  const grossSalary = baseSalary + commission + totalIncentives + tips;

  // Deductions
  const deductions: SalaryDeduction[] = [];

  // Advance recovery
  const { totalRecovery } = calculateAdvanceRecovery(pendingAdvances);
  if (totalRecovery > 0) deductions.push({ label: 'Salary Advance Recovery', amount: totalRecovery });

  // Attendance deduction
  if (attendance && attendance.daysAbsent > 0) {
    const attDeduction = calculateAttendanceDeduction(baseSalary, attendance);
    if (attDeduction > 0) deductions.push({ label: `Absent Days (${attendance.daysAbsent} days)`, amount: attDeduction });
  }
  if (attendance && attendance.halfDays > 0) {
    // Already included in attendance deduction above, just for transparency
  }

  // Custom deductions
  for (const cd of customDeductions) {
    deductions.push({ label: cd.label, amount: cd.amount });
  }

  const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
  const netSalary = Math.max(0, grossSalary - totalDeductions);

  return { baseSalary, commission, incentives, tips, grossSalary, deductions, totalDeductions, netSalary };
}
