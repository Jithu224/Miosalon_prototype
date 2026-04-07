import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  SalaryProfile,
  SalaryAdvance,
  IncentiveRule,
  AttendanceEntry,
  CustomDeduction,
  SalaryRecord,
  CommissionProfile,
} from '@/types/salary';
import {
  mockSalaryProfiles,
  mockAdvances,
  mockIncentiveRules,
  mockAttendance,
  mockCustomDeductions,
  mockSalaryRecords,
  mockCommissionProfiles,
} from '@/data/mockSalaryData';
import { calculateFullSalary, calculateAdvanceRecovery } from '@/lib/salaryCalculation';
import { useStaffStore } from '@/store/useStaffStore';
import { useInvoiceStore } from '@/store/useInvoiceStore';
// generateId available from @/lib/utils if needed

interface SalaryStore {
  // State
  salaryProfiles: SalaryProfile[];
  advances: SalaryAdvance[];
  incentiveRules: IncentiveRule[];
  attendanceEntries: AttendanceEntry[];
  customDeductions: CustomDeduction[];
  salaryRecords: SalaryRecord[];
  commissionProfiles: CommissionProfile[];

  // Salary Profile CRUD
  addSalaryProfile: (profile: SalaryProfile) => void;
  updateSalaryProfile: (staffId: string, data: Partial<SalaryProfile>) => void;
  getSalaryProfile: (staffId: string) => SalaryProfile | undefined;

  // Commission Profile CRUD
  addCommissionProfile: (profile: CommissionProfile) => void;
  updateCommissionProfile: (id: string, data: Partial<CommissionProfile>) => void;
  deleteCommissionProfile: (id: string) => void;
  getCommissionProfile: (id: string) => CommissionProfile | undefined;

  // Advance CRUD
  addAdvance: (advance: SalaryAdvance) => void;
  getAdvancesByStaff: (staffId: string) => SalaryAdvance[];
  getPendingAdvances: (staffId: string) => SalaryAdvance[];
  getAdvanceBalance: (staffId: string) => number;

  // Incentive Rule CRUD
  addIncentiveRule: (rule: IncentiveRule) => void;
  updateIncentiveRule: (id: string, data: Partial<IncentiveRule>) => void;
  deleteIncentiveRule: (id: string) => void;
  getIncentivesByStaff: (staffId: string) => IncentiveRule[];

  // Attendance
  setAttendanceEntry: (entry: AttendanceEntry) => void;
  getAttendanceEntry: (staffId: string, month: string) => AttendanceEntry | undefined;

  // Custom Deductions
  addCustomDeduction: (deduction: CustomDeduction) => void;
  removeCustomDeduction: (id: string) => void;
  getCustomDeductions: (staffId: string, month: string) => CustomDeduction[];

  // Salary Records
  addSalaryRecord: (record: SalaryRecord) => void;
  updateSalaryRecord: (id: string, data: Partial<SalaryRecord>) => void;
  getSalaryRecord: (staffId: string, month: string) => SalaryRecord | undefined;
  getSalaryRecordsByMonth: (month: string) => SalaryRecord[];

  // Core calculation methods
  calculateSalary: (staffId: string, month: string) => SalaryRecord | null;
  calculateAllSalaries: (month: string) => SalaryRecord[];
}

export const useSalaryStore = create<SalaryStore>()(
  persist(
    (set, get) => ({
      // ── State (initialized from mock data) ──────────────────────────────
      salaryProfiles: mockSalaryProfiles,
      advances: mockAdvances,
      incentiveRules: mockIncentiveRules,
      attendanceEntries: mockAttendance,
      customDeductions: mockCustomDeductions,
      salaryRecords: mockSalaryRecords,
      commissionProfiles: mockCommissionProfiles,

      // ── Salary Profile CRUD ─────────────────────────────────────────────
      addSalaryProfile: (profile) =>
        set((s) => ({ salaryProfiles: [...s.salaryProfiles, profile] })),

      updateSalaryProfile: (staffId, data) =>
        set((s) => ({
          salaryProfiles: s.salaryProfiles.map((p) =>
            p.staffId === staffId ? { ...p, ...data } : p
          ),
        })),

      getSalaryProfile: (staffId) =>
        get().salaryProfiles.find((p) => p.staffId === staffId),

      // ── Commission Profile CRUD ─────────────────────────────────────────
      addCommissionProfile: (profile) =>
        set((s) => ({ commissionProfiles: [...s.commissionProfiles, profile] })),

      updateCommissionProfile: (id, data) =>
        set((s) => ({
          commissionProfiles: s.commissionProfiles.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),

      deleteCommissionProfile: (id) =>
        set((s) => ({ commissionProfiles: s.commissionProfiles.filter((p) => p.id !== id) })),

      getCommissionProfile: (id) =>
        get().commissionProfiles.find((p) => p.id === id),

      // ── Advance CRUD ────────────────────────────────────────────────────
      addAdvance: (advance) =>
        set((s) => ({ advances: [...s.advances, advance] })),

      getAdvancesByStaff: (staffId) =>
        get().advances.filter((a) => a.staffId === staffId),

      getPendingAdvances: (staffId) =>
        get().advances.filter(
          (a) => a.staffId === staffId && (a.status === 'pending' || a.status === 'partial')
        ),

      getAdvanceBalance: (staffId) => {
        const pending = get().advances.filter(
          (a) => a.staffId === staffId && (a.status === 'pending' || a.status === 'partial')
        );
        return pending.reduce((sum, a) => sum + (a.amount - a.deducted), 0);
      },

      // ── Incentive Rule CRUD ─────────────────────────────────────────────
      addIncentiveRule: (rule) =>
        set((s) => ({ incentiveRules: [...s.incentiveRules, rule] })),

      updateIncentiveRule: (id, data) =>
        set((s) => ({
          incentiveRules: s.incentiveRules.map((r) =>
            r.id === id ? { ...r, ...data } : r
          ),
        })),

      deleteIncentiveRule: (id) =>
        set((s) => ({ incentiveRules: s.incentiveRules.filter((r) => r.id !== id) })),

      getIncentivesByStaff: (staffId) =>
        get().incentiveRules.filter((r) => r.staffId === staffId),

      // ── Attendance ──────────────────────────────────────────────────────
      setAttendanceEntry: (entry) =>
        set((s) => {
          const exists = s.attendanceEntries.find(
            (e) => e.staffId === entry.staffId && e.month === entry.month
          );
          if (exists) {
            return {
              attendanceEntries: s.attendanceEntries.map((e) =>
                e.staffId === entry.staffId && e.month === entry.month ? entry : e
              ),
            };
          }
          return { attendanceEntries: [...s.attendanceEntries, entry] };
        }),

      getAttendanceEntry: (staffId, month) =>
        get().attendanceEntries.find(
          (e) => e.staffId === staffId && e.month === month
        ),

      // ── Custom Deductions ───────────────────────────────────────────────
      addCustomDeduction: (deduction) =>
        set((s) => ({ customDeductions: [...s.customDeductions, deduction] })),

      removeCustomDeduction: (id) =>
        set((s) => ({ customDeductions: s.customDeductions.filter((d) => d.id !== id) })),

      getCustomDeductions: (staffId, month) =>
        get().customDeductions.filter(
          (d) => d.staffId === staffId && d.month === month
        ),

      // ── Salary Records ──────────────────────────────────────────────────
      addSalaryRecord: (record) =>
        set((s) => ({ salaryRecords: [...s.salaryRecords, record] })),

      updateSalaryRecord: (id, data) => {
        const state = get();
        const record = state.salaryRecords.find((r) => r.id === id);

        // When marking as paid, apply advance recovery to the advance ledger
        if (data.status === 'paid' && record && record.status !== 'paid') {
          const pendingAdvances = state.advances.filter(
            (a) => a.staffId === record.staffId && (a.status === 'pending' || a.status === 'partial')
          );
          const { advances: recoveredAdvances } = calculateAdvanceRecovery(pendingAdvances);
          if (recoveredAdvances.length > 0) {
            set((s) => ({
              advances: s.advances.map((a) => {
                const recovery = recoveredAdvances.find((ra) => ra.id === a.id);
                if (!recovery) return a;
                const newDeducted = Math.min(a.deducted + recovery.amount, a.amount);
                return { ...a, deducted: newDeducted, status: newDeducted >= a.amount ? 'recovered' as const : 'partial' as const };
              }),
            }));
          }
        }

        set((s) => ({
          salaryRecords: s.salaryRecords.map((r) =>
            r.id === id ? { ...r, ...data } : r
          ),
        }));
      },

      getSalaryRecord: (staffId, month) =>
        get().salaryRecords.find(
          (r) => r.staffId === staffId && r.month === month
        ),

      getSalaryRecordsByMonth: (month) =>
        get().salaryRecords.filter((r) => r.month === month),

      // ── Core: Calculate Salary ──────────────────────────────────────────
      calculateSalary: (staffId, month) => {
        const state = get();

        // 1. Get staff from useStaffStore
        const staff = useStaffStore.getState().getStaff(staffId);
        if (!staff) return null;

        // 2. Get salary profile
        const profile = state.salaryProfiles.find((p) => p.staffId === staffId);
        if (!profile) return null;

        // 3. Get invoices for this staff + month from useInvoiceStore
        const allInvoices = useInvoiceStore.getState().invoices;
        const staffInvoices = allInvoices.filter((inv) => {
          if (inv.staffId !== staffId) return false;
          if (inv.status !== 'paid') return false;
          // Match month: createdAt starts with "YYYY-MM"
          return inv.createdAt.startsWith(month);
        });

        // 4. Calculate revenue (sum of lineItems subtotals from paid invoices)
        const invoiceRevenue = staffInvoices.reduce((sum, inv) => sum + inv.subtotal, 0);
        const invoiceCount = staffInvoices.length;

        // 5. Get tips from invoices
        const tips = staffInvoices.reduce((sum, inv) => sum + (inv.tip || 0), 0);

        // 6. Get attendance, incentives, pending advances, custom deductions
        const attendance = state.attendanceEntries.find(
          (e) => e.staffId === staffId && e.month === month
        );
        const incentiveRules = state.incentiveRules.filter((r) => r.staffId === staffId);
        const pendingAdvances = state.advances.filter(
          (a) => a.staffId === staffId && (a.status === 'pending' || a.status === 'partial')
        );
        const customDeds = state.customDeductions.filter(
          (d) => d.staffId === staffId && d.month === month
        );

        // 6b. Look up commission profile if assigned
        const commissionProfile = profile.commissionProfileId
          ? state.commissionProfiles.find((cp) => cp.id === profile.commissionProfileId)
          : undefined;

        // 7. Call calculateFullSalary from lib
        const result = calculateFullSalary({
          profile,
          commissionType: staff.commissionType,
          commissionRate: staff.commissionRate,
          joinDate: staff.joinDate,
          month,
          invoiceRevenue,
          invoiceCount,
          tips,
          attendance,
          incentiveRules,
          pendingAdvances,
          customDeductions: customDeds,
          commissionProfile,
        });

        // 8. Create SalaryRecord — preserve status if approved/paid
        const existingRecord = state.salaryRecords.find(
          (r) => r.staffId === staffId && r.month === month
        );

        // BUG FIX: Don't overwrite approved/paid records back to draft
        const preserveStatus = existingRecord && (existingRecord.status === 'approved' || existingRecord.status === 'paid');

        const record: SalaryRecord = {
          id: existingRecord?.id || `sal-${month.replace('-', '')}-${staffId.replace('staff-', '')}`,
          staffId,
          month,
          baseSalary: result.baseSalary,
          commission: result.commission,
          incentives: result.incentives,
          tips: result.tips,
          grossSalary: result.grossSalary,
          deductions: result.deductions,
          totalDeductions: result.totalDeductions,
          netSalary: result.netSalary,
          status: preserveStatus ? existingRecord.status : 'draft',
          calculatedAt: new Date().toISOString(),
        };

        // Update or add the record
        if (existingRecord) {
          set((s) => ({
            salaryRecords: s.salaryRecords.map((r) =>
              r.id === existingRecord.id ? record : r
            ),
          }));
        } else {
          set((s) => ({ salaryRecords: [...s.salaryRecords, record] }));
        }

        // BUG FIX: Advance recovery is now DEFERRED until "Mark Paid"
        // Calculation only SHOWS advance recovery in the salary record deductions
        // but does NOT update the advance ledger. This makes recalculation idempotent.
        // Advance.deducted is only updated when salary status changes to 'paid'.

        // 9. Return the record
        return record;
      },

      // ── Core: Calculate All Salaries ────────────────────────────────────
      calculateAllSalaries: (month) => {
        // 1. Get all active staff from useStaffStore
        const activeStaff = useStaffStore.getState().getActiveStaff();
        const state = get();
        const records: SalaryRecord[] = [];

        // 2. For each staff with a salary profile, call calculateSalary
        for (const staff of activeStaff) {
          const hasProfile = state.salaryProfiles.some((p) => p.staffId === staff.id);
          if (!hasProfile) continue;

          const record = get().calculateSalary(staff.id, month);
          if (record) records.push(record);
        }

        // 3. Return all records
        return records;
      },
    }),
    { name: 'miosalon-salary' }
  )
);
