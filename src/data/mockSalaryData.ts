import { SalaryProfile, SalaryAdvance, IncentiveRule, AttendanceEntry, CustomDeduction, SalaryRecord, CommissionProfile } from '@/types/salary';

// ── Salary Profiles ────────────────────────────────────────────────────────────
export const mockSalaryProfiles: SalaryProfile[] = [
  {
    staffId: 'staff-1', // Ravi Kumar, stylist
    employmentType: 'full-time',
    payStructure: 'fixed-commission',
    baseSalary: 12000,
    payCycle: 'monthly',
  },
  {
    staffId: 'staff-2', // Priya Sharma, stylist
    employmentType: 'full-time',
    payStructure: 'fixed-commission',
    baseSalary: 15000,
    payCycle: 'monthly',
  },
  {
    staffId: 'staff-3', // Amit Patel, stylist
    employmentType: 'full-time',
    payStructure: 'fixed-commission',
    baseSalary: 10000,
    payCycle: 'monthly',
  },
  {
    staffId: 'staff-4', // Sneha Reddy, therapist
    employmentType: 'full-time',
    payStructure: 'fixed-commission',
    baseSalary: 12000,
    payCycle: 'monthly',
  },
  {
    staffId: 'staff-5', // Neha Gupta, stylist
    employmentType: 'full-time',
    payStructure: 'fixed-commission',
    baseSalary: 10000,
    payCycle: 'monthly',
  },
  {
    staffId: 'staff-6', // Deepak Singh, therapist
    employmentType: 'full-time',
    payStructure: 'fixed-commission',
    baseSalary: 14000,
    payCycle: 'monthly',
  },
  {
    staffId: 'staff-7', // Arun Mehta, manager
    employmentType: 'full-time',
    payStructure: 'fixed-only',
    baseSalary: 25000,
    payCycle: 'monthly',
  },
  {
    staffId: 'staff-8', // Kavita Joshi, receptionist
    employmentType: 'full-time',
    payStructure: 'fixed-only',
    baseSalary: 12000,
    payCycle: 'monthly',
  },
];

// ── Salary Advances ────────────────────────────────────────────────────────────
export const mockAdvances: SalaryAdvance[] = [
  {
    id: 'adv-1',
    staffId: 'staff-1', // Ravi
    amount: 5000,
    date: '2026-03-15',
    reason: 'Personal emergency',
    deducted: 2000,
    status: 'partial',
  },
  {
    id: 'adv-2',
    staffId: 'staff-3', // Amit
    amount: 2000,
    date: '2026-03-20',
    reason: 'Medical expense',
    deducted: 2000,
    status: 'recovered',
  },
  {
    id: 'adv-3',
    staffId: 'staff-4', // Sneha
    amount: 3000,
    date: '2026-04-02',
    reason: 'Family function',
    deducted: 0,
    status: 'pending',
  },
  {
    id: 'adv-4',
    staffId: 'staff-6', // Deepak
    amount: 4000,
    date: '2026-03-25',
    reason: 'Rent advance',
    deducted: 1000,
    status: 'partial',
  },
  {
    id: 'adv-5',
    staffId: 'staff-5', // Neha
    amount: 1500,
    date: '2026-04-05',
    reason: 'Travel expense',
    deducted: 0,
    status: 'pending',
  },
  {
    id: 'adv-6',
    staffId: 'staff-8', // Kavita
    amount: 2000,
    date: '2026-03-10',
    reason: 'Personal',
    deducted: 2000,
    status: 'recovered',
  },
];

// ── Incentive Rules ────────────────────────────────────────────────────────────
export const mockIncentiveRules: IncentiveRule[] = [
  // Ravi
  {
    id: 'inc-1',
    staffId: 'staff-1',
    type: 'attendance-bonus',
    label: 'Attendance Bonus',
    amount: 1000,
    condition: 'zero absences',
  },
  {
    id: 'inc-2',
    staffId: 'staff-1',
    type: 'custom',
    label: 'Festival Bonus',
    amount: 500,
  },
  // Priya
  {
    id: 'inc-3',
    staffId: 'staff-2',
    type: 'attendance-bonus',
    label: 'Attendance Bonus',
    amount: 1000,
    condition: 'zero absences',
  },
  {
    id: 'inc-4',
    staffId: 'staff-2',
    type: 'target-bonus',
    label: 'Target Bonus',
    amount: 2000,
    condition: 'revenue > 50000',
  },
  // Amit
  {
    id: 'inc-5',
    staffId: 'staff-3',
    type: 'attendance-bonus',
    label: 'Attendance Bonus',
    amount: 500,
    condition: 'zero absences',
  },
  // Sneha
  {
    id: 'inc-6',
    staffId: 'staff-4',
    type: 'attendance-bonus',
    label: 'Attendance Bonus',
    amount: 1000,
    condition: 'zero absences',
  },
  // Deepak
  {
    id: 'inc-7',
    staffId: 'staff-6',
    type: 'attendance-bonus',
    label: 'Attendance Bonus',
    amount: 1000,
    condition: 'zero absences',
  },
  {
    id: 'inc-8',
    staffId: 'staff-6',
    type: 'custom',
    label: 'Festival Bonus',
    amount: 500,
  },
  // Neha
  {
    id: 'inc-9',
    staffId: 'staff-5',
    type: 'attendance-bonus',
    label: 'Attendance Bonus',
    amount: 500,
    condition: 'zero absences',
  },
];

// ── Attendance Entries (April 2026) ────────────────────────────────────────────
export const mockAttendance: AttendanceEntry[] = [
  { staffId: 'staff-1', month: '2026-04', totalWorkingDays: 26, daysPresent: 24, daysAbsent: 2, halfDays: 0 },
  { staffId: 'staff-2', month: '2026-04', totalWorkingDays: 26, daysPresent: 26, daysAbsent: 0, halfDays: 0 },
  { staffId: 'staff-3', month: '2026-04', totalWorkingDays: 26, daysPresent: 25, daysAbsent: 1, halfDays: 0 },
  { staffId: 'staff-4', month: '2026-04', totalWorkingDays: 26, daysPresent: 24, daysAbsent: 1, halfDays: 2 },
  { staffId: 'staff-5', month: '2026-04', totalWorkingDays: 26, daysPresent: 23, daysAbsent: 2, halfDays: 1 },
  { staffId: 'staff-6', month: '2026-04', totalWorkingDays: 26, daysPresent: 26, daysAbsent: 0, halfDays: 0 },
  { staffId: 'staff-7', month: '2026-04', totalWorkingDays: 26, daysPresent: 26, daysAbsent: 0, halfDays: 0 },
  { staffId: 'staff-8', month: '2026-04', totalWorkingDays: 26, daysPresent: 25, daysAbsent: 1, halfDays: 0 },
];

// ── Custom Deductions (April 2026) ─────────────────────────────────────────────
export const mockCustomDeductions: CustomDeduction[] = [
  { id: 'ded-1', staffId: 'staff-1', month: '2026-04', label: 'Late Penalty', amount: 200 },
  { id: 'ded-2', staffId: 'staff-1', month: '2026-04', label: 'Product Breakage', amount: 500 },
  { id: 'ded-3', staffId: 'staff-1', month: '2026-04', label: 'PF (Employee)', amount: 1440 },
  { id: 'ded-4', staffId: 'staff-2', month: '2026-04', label: 'PF (Employee)', amount: 1800 },
  { id: 'ded-5', staffId: 'staff-4', month: '2026-04', label: 'Uniform', amount: 300 },
  { id: 'ded-6', staffId: 'staff-6', month: '2026-04', label: 'PF (Employee)', amount: 1680 },
];

// ── Salary Records (March 2026 — previous month, already processed & paid) ────
export const mockSalaryRecords: SalaryRecord[] = [
  {
    id: 'sal-202603-1',
    staffId: 'staff-1',
    month: '2026-03',
    baseSalary: 12000,
    commission: 18000,
    incentives: [{ label: 'Festival Bonus', amount: 1000 }, { label: 'Attendance Bonus', amount: 1000 }],
    tips: 1200,
    grossSalary: 33200,
    deductions: [
      { label: 'Salary Advance Recovery', amount: 2000 },
      { label: 'Absent Days (1 day)', amount: 462 },
      { label: 'PF (Employee)', amount: 1440 },
      { label: 'Late Penalty', amount: 200 },
    ],
    totalDeductions: 4102,
    netSalary: 29098,
    status: 'paid',
    calculatedAt: '2026-03-28T10:00:00Z',
  },
  {
    id: 'sal-202603-2',
    staffId: 'staff-2',
    month: '2026-03',
    baseSalary: 15000,
    commission: 22000,
    incentives: [
      { label: 'Attendance Bonus', amount: 1000 },
      { label: 'Target Bonus', amount: 2000 },
    ],
    tips: 1800,
    grossSalary: 41800,
    deductions: [
      { label: 'PF (Employee)', amount: 1800 },
    ],
    totalDeductions: 1800,
    netSalary: 40000,
    status: 'paid',
    calculatedAt: '2026-03-28T10:00:00Z',
  },
  {
    id: 'sal-202603-3',
    staffId: 'staff-3',
    month: '2026-03',
    baseSalary: 10000,
    commission: 12500,
    incentives: [{ label: 'Attendance Bonus', amount: 500 }],
    tips: 600,
    grossSalary: 23600,
    deductions: [
      { label: 'Salary Advance Recovery', amount: 2000 },
    ],
    totalDeductions: 2000,
    netSalary: 21600,
    status: 'paid',
    calculatedAt: '2026-03-28T10:00:00Z',
  },
  {
    id: 'sal-202603-4',
    staffId: 'staff-4',
    month: '2026-03',
    baseSalary: 12000,
    commission: 15800,
    incentives: [{ label: 'Attendance Bonus', amount: 1000 }],
    tips: 950,
    grossSalary: 29750,
    deductions: [
      { label: 'Uniform', amount: 300 },
      { label: 'Absent Days (1 day)', amount: 462 },
    ],
    totalDeductions: 762,
    netSalary: 28988,
    status: 'paid',
    calculatedAt: '2026-03-28T10:00:00Z',
  },
  {
    id: 'sal-202603-5',
    staffId: 'staff-5',
    month: '2026-03',
    baseSalary: 10000,
    commission: 9800,
    incentives: [],
    tips: 400,
    grossSalary: 20200,
    deductions: [
      { label: 'Absent Days (3 days)', amount: 1154 },
    ],
    totalDeductions: 1154,
    netSalary: 19046,
    status: 'paid',
    calculatedAt: '2026-03-28T10:00:00Z',
  },
  {
    id: 'sal-202603-6',
    staffId: 'staff-6',
    month: '2026-03',
    baseSalary: 14000,
    commission: 17500,
    incentives: [
      { label: 'Attendance Bonus', amount: 1000 },
      { label: 'Festival Bonus', amount: 500 },
    ],
    tips: 1100,
    grossSalary: 34100,
    deductions: [
      { label: 'Salary Advance Recovery', amount: 1000 },
      { label: 'PF (Employee)', amount: 1680 },
    ],
    totalDeductions: 2680,
    netSalary: 31420,
    status: 'paid',
    calculatedAt: '2026-03-28T10:00:00Z',
  },
  {
    id: 'sal-202603-7',
    staffId: 'staff-7',
    month: '2026-03',
    baseSalary: 25000,
    commission: 0,
    incentives: [],
    tips: 0,
    grossSalary: 25000,
    deductions: [],
    totalDeductions: 0,
    netSalary: 25000,
    status: 'paid',
    calculatedAt: '2026-03-28T10:00:00Z',
  },
  {
    id: 'sal-202603-8',
    staffId: 'staff-8',
    month: '2026-03',
    baseSalary: 12000,
    commission: 0,
    incentives: [],
    tips: 0,
    grossSalary: 12000,
    deductions: [
      { label: 'Salary Advance Recovery', amount: 2000 },
    ],
    totalDeductions: 2000,
    netSalary: 10000,
    status: 'paid',
    calculatedAt: '2026-03-28T10:00:00Z',
  },
];

// ── Commission Profiles ───────────────────────────────────────────────────────
export const mockCommissionProfiles: CommissionProfile[] = [
  {
    id: 'cp-1',
    name: 'Senior Stylist Plan',
    type: 'tiered-slab',
    tiers: [
      { minRevenue: 0, maxRevenue: 20000, rate: 10 },
      { minRevenue: 20000, maxRevenue: 50000, rate: 15 },
      { minRevenue: 50000, maxRevenue: 999999999, rate: 20 },
    ],
    includeProducts: true,
    includeTips: false,
  },
  {
    id: 'cp-2',
    name: 'Junior Stylist Plan',
    type: 'tiered-slab',
    tiers: [
      { minRevenue: 0, maxRevenue: 15000, rate: 5 },
      { minRevenue: 15000, maxRevenue: 30000, rate: 8 },
      { minRevenue: 30000, maxRevenue: 999999999, rate: 12 },
    ],
    includeProducts: true,
    includeTips: false,
  },
  {
    id: 'cp-3',
    name: 'Therapist Plan',
    type: 'flat-percentage',
    flatRate: 18,
    includeProducts: false,
    includeTips: false,
  },
  {
    id: 'cp-4',
    name: 'Flat Per-Service',
    type: 'flat-fixed',
    flatRate: 200,
    includeProducts: false,
    includeTips: false,
  },
];
