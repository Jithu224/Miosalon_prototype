'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineBanknotes,
  HiOutlinePrinter,
  HiOutlineArrowDownTray,
  HiOutlineTrash,
  HiOutlinePlusCircle,
  HiOutlineCalculator,
} from 'react-icons/hi2';

import { useHydration } from '@/hooks/useHydration';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { MonthSelector } from '@/components/salary/MonthSelector';
import { PayslipPreview } from '@/components/salary/PayslipPreview';
import { useSalaryStore } from '@/store/useSalaryStore';
import { useStaffStore } from '@/store/useStaffStore';
import { useRoleStore, ROLE_PERMISSIONS } from '@/store/useRoleStore';
import { formatCurrency, formatMonth, generateId } from '@/lib/utils';

const statusBadgeVariant: Record<string, 'info' | 'success' | 'neutral'> = {
  draft: 'info',
  approved: 'success',
  paid: 'neutral',
};

const roleBadgeVariant: Record<string, 'purple' | 'info' | 'warning' | 'success' | 'neutral'> = {
  admin: 'purple',
  manager: 'info',
  stylist: 'warning',
  therapist: 'success',
  receptionist: 'neutral',
};

const TABS = [
  { id: 'breakdown', label: 'Breakdown' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'deductions', label: 'Deductions' },
  { id: 'payslip', label: 'Payslip' },
];

export default function StaffSalaryDetailPage() {
  const hydrated = useHydration();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const staffId = params.staffId as string;
  const initialMonth = searchParams.get('month') || new Date().toISOString().slice(0, 7);

  const [month, setMonth] = useState(initialMonth);
  const [activeTab, setActiveTab] = useState('breakdown');
  const [newDeductionLabel, setNewDeductionLabel] = useState('');
  const [newDeductionAmount, setNewDeductionAmount] = useState('');
  const [attendanceForm, setAttendanceForm] = useState({
    totalWorkingDays: 26,
    daysPresent: 26,
    daysAbsent: 0,
    halfDays: 0,
  });
  const [attendanceLoaded, setAttendanceLoaded] = useState(false);

  const payslipRef = useRef<HTMLDivElement>(null);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'paid' | null>(null);

  // Subscribe to ARRAYS directly so React re-renders when store updates
  const { role } = useRoleStore();
  const perms = ROLE_PERMISSIONS[role];
  const staff = useStaffStore((s) => s.staff).find((s) => s.id === staffId);
  const salaryRecords = useSalaryStore((s) => s.salaryRecords);
  const salaryProfiles = useSalaryStore((s) => s.salaryProfiles);
  const attendanceEntries = useSalaryStore((s) => s.attendanceEntries);
  const customDeductions = useSalaryStore((s) => s.customDeductions);
  const advances = useSalaryStore((s) => s.advances);
  const updateSalaryRecord = useSalaryStore((s) => s.updateSalaryRecord);
  const setAttendanceEntry = useSalaryStore((s) => s.setAttendanceEntry);
  const addCustomDeduction = useSalaryStore((s) => s.addCustomDeduction);
  const removeCustomDeduction = useSalaryStore((s) => s.removeCustomDeduction);
  const calculateSalary = useSalaryStore((s) => s.calculateSalary);

  // Derive data from arrays — will re-render when arrays change
  const record = salaryRecords.find((r) => r.staffId === staffId && r.month === month);
  const profile = salaryProfiles.find((p) => p.staffId === staffId);
  const attendance = attendanceEntries.find((a) => a.staffId === staffId && a.month === month);
  const customDeds = customDeductions.filter((d) => d.staffId === staffId && d.month === month);
  const pendingAdvances = advances.filter((a) => a.staffId === staffId && a.status !== 'recovered');

  // Pre-populate attendance form
  if (hydrated && attendance && !attendanceLoaded) {
    setAttendanceForm({
      totalWorkingDays: attendance.totalWorkingDays,
      daysPresent: attendance.daysPresent,
      daysAbsent: attendance.daysAbsent,
      halfDays: attendance.halfDays,
    });
    setAttendanceLoaded(true);
  }

  const staffName = staff ? `${staff.firstName} ${staff.lastName}` : 'Unknown';
  const staffRole = staff?.role || 'staff';

  // Recalculate this individual staff's salary
  const handleRecalculate = useCallback(() => {
    const result = calculateSalary(staffId, month);
    if (result) {
      toast.success(`Salary recalculated for ${staffName}`);
    } else {
      toast.error('Could not calculate — check salary profile setup');
    }
  }, [calculateSalary, staffId, month, staffName]);

  const handleApprove = () => {
    if (!record) return;
    updateSalaryRecord(record.id, { status: 'approved' });
    toast.success(`Salary approved for ${staffName}`);
    setConfirmAction(null);
  };

  const handleMarkPaid = () => {
    if (!record) return;
    updateSalaryRecord(record.id, { status: 'paid' });
    toast.success(`Salary marked as paid for ${staffName} — advance recovery applied`);
    setConfirmAction(null);
  };

  // Auto-recalculate helper — updates salary record immediately after any change
  const recalcAfterChange = useCallback(() => {
    // Small delay to let store update settle before recalculating
    setTimeout(() => {
      calculateSalary(staffId, month);
    }, 50);
  }, [calculateSalary, staffId, month]);

  const handleSaveAttendance = () => {
    setAttendanceEntry({ staffId, month, ...attendanceForm });
    recalcAfterChange();
    toast.success('Attendance saved — salary updated');
  };

  const handleAddDeduction = () => {
    const label = newDeductionLabel.trim();
    const amount = parseFloat(newDeductionAmount);
    if (!label) { toast.error('Enter a deduction label'); return; }
    if (!amount || amount <= 0) { toast.error('Enter a valid amount'); return; }
    addCustomDeduction({ id: generateId(), staffId, month, label, amount });
    setNewDeductionLabel('');
    setNewDeductionAmount('');
    recalcAfterChange();
    toast.success('Deduction added — salary updated');
  };

  const handleRemoveDeduction = (id: string) => {
    removeCustomDeduction(id);
    recalcAfterChange();
    toast.success('Deduction removed — salary updated');
  };

  // Daily/weekly salary breakdown from record
  const dailyBreakdown = useMemo(() => {
    if (!record) return null;
    const workingDays = attendance?.totalWorkingDays || 26;
    return {
      dailyBase: Math.round(record.baseSalary / workingDays),
      dailyCommission: Math.round(record.commission / workingDays),
      dailyGross: Math.round(record.grossSalary / workingDays),
      dailyNet: Math.round(record.netSalary / workingDays),
      weeklyBase: Math.round((record.baseSalary / workingDays) * 6),
      weeklyCommission: Math.round((record.commission / workingDays) * 6),
      weeklyGross: Math.round((record.grossSalary / workingDays) * 6),
      weeklyNet: Math.round((record.netSalary / workingDays) * 6),
    };
  }, [record, attendance]);

  const attendanceDeductionPreview = useMemo(() => {
    if (!profile) return 0;
    const { totalWorkingDays, daysAbsent, halfDays } = attendanceForm;
    if (totalWorkingDays <= 0) return 0;
    const base = profile.baseSalary;
    return Math.round((base / totalWorkingDays) * daysAbsent + (base / totalWorkingDays) * halfDays * 0.5);
  }, [attendanceForm, profile]);

  if (!hydrated) {
    return (
      <PageWrapper title="Staff Salary">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-slate-200 rounded-xl" />
          <div className="h-8 bg-slate-200 rounded w-96" />
          <div className="h-64 bg-slate-200 rounded-xl" />
        </div>
      </PageWrapper>
    );
  }

  if (!staff) {
    return (
      <PageWrapper title="Staff Not Found">
        <EmptyState title="Staff member not found" action={<Button href="/salary-calculator">Back</Button>} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={staffName} subtitle={formatMonth(month)}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 no-print">
        <div className="flex items-center gap-4">
          <Avatar name={staffName} src={staff.avatar} color={staff.color} size="xl" />
          <div>
            <h2 className="text-xl font-bold text-slate-900">{staffName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={roleBadgeVariant[staffRole] || 'neutral'}>{staffRole}</Badge>
              {record && <Badge variant={statusBadgeVariant[record.status]}>{record.status}</Badge>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <MonthSelector value={month} onChange={(v) => { setMonth(v); setAttendanceLoaded(false); }} />
          {perms.canCalculateSalary && (
            <Button onClick={handleRecalculate} variant="primary">
              <HiOutlineCalculator className="w-4 h-4" />
              Recalculate
            </Button>
          )}
          {perms.canApproveSalary && record?.status === 'draft' && (
            <Button variant="success" onClick={() => setConfirmAction('approve')}>
              <HiOutlineCheckCircle className="w-4 h-4" />
              Approve
            </Button>
          )}
          {perms.canMarkPaid && record && (record.status === 'draft' || record.status === 'approved') && (
            <Button onClick={() => setConfirmAction('paid')}>
              <HiOutlineBanknotes className="w-4 h-4" />
              Mark Paid
            </Button>
          )}
          <Button variant="outline" onClick={() => router.push('/salary-calculator')}>
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 no-print">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {!record ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 no-print">
          <EmptyState
            title="Salary not calculated yet"
            description="Click Recalculate above to generate the salary for this staff member, or go back and use Calculate All."
            action={
              <Button onClick={handleRecalculate}>
                <HiOutlineCalculator className="w-4 h-4" />
                Calculate Now
              </Button>
            }
          />
        </div>
      ) : (
        <div className="no-print">
          {/* TAB 1: Breakdown */}
          {activeTab === 'breakdown' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Earnings */}
                <Card title="Earnings">
                  <div className="space-y-0">
                    <div className="flex justify-between py-3 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Base Salary</span>
                      <span className="text-sm font-medium">{formatCurrency(record.baseSalary)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Commission</span>
                      <span className="text-sm font-medium">{formatCurrency(record.commission)}</span>
                    </div>
                    {record.incentives.map((inc, i) => (
                      <div key={i} className="flex justify-between py-3 border-b border-slate-100">
                        <span className="text-sm text-slate-600">{inc.label}</span>
                        <span className="text-sm font-medium">{formatCurrency(inc.amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between py-3 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Tips</span>
                      <span className="text-sm font-medium">{formatCurrency(record.tips)}</span>
                    </div>
                    <div className="flex justify-between py-3 bg-blue-50 -mx-6 px-6 rounded-b-lg mt-1">
                      <span className="text-sm font-bold text-blue-900">GROSS SALARY</span>
                      <span className="text-sm font-bold text-blue-900">{formatCurrency(record.grossSalary)}</span>
                    </div>
                  </div>
                </Card>

                {/* Deductions */}
                <Card title="Deductions">
                  <div className="space-y-0">
                    {record.deductions.length > 0 ? (
                      record.deductions.map((ded, i) => (
                        <div key={i} className="flex justify-between py-3 border-b border-slate-100">
                          <span className="text-sm text-slate-600">{ded.label}</span>
                          <span className="text-sm font-medium text-red-600">{formatCurrency(ded.amount)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="py-3 text-sm text-slate-400">No deductions</div>
                    )}
                    <div className="flex justify-between py-3 bg-red-50 -mx-6 px-6 rounded-b-lg mt-1">
                      <span className="text-sm font-bold text-red-900">TOTAL DEDUCTIONS</span>
                      <span className="text-sm font-bold text-red-900">{formatCurrency(record.totalDeductions)}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Net Salary */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
                <p className="text-sm font-medium text-emerald-600 mb-1">NET SALARY</p>
                <p className="text-4xl font-bold text-emerald-800">{formatCurrency(record.netSalary)}</p>
                <p className="text-sm text-emerald-600 mt-2">
                  Gross ({formatCurrency(record.grossSalary)}) - Deductions ({formatCurrency(record.totalDeductions)})
                </p>
              </div>

              {/* Daily / Weekly Breakdown */}
              {dailyBreakdown && (
                <Card title="Daily & Weekly Breakdown">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="py-2 px-4 text-left text-xs font-semibold text-slate-500 uppercase">Component</th>
                          <th className="py-2 px-4 text-right text-xs font-semibold text-slate-500 uppercase">Monthly</th>
                          <th className="py-2 px-4 text-right text-xs font-semibold text-slate-500 uppercase">Weekly (6 days)</th>
                          <th className="py-2 px-4 text-right text-xs font-semibold text-slate-500 uppercase">Daily</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-100">
                          <td className="py-2 px-4 text-slate-600">Base Salary</td>
                          <td className="py-2 px-4 text-right font-medium">{formatCurrency(record.baseSalary)}</td>
                          <td className="py-2 px-4 text-right">{formatCurrency(dailyBreakdown.weeklyBase)}</td>
                          <td className="py-2 px-4 text-right">{formatCurrency(dailyBreakdown.dailyBase)}</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-2 px-4 text-slate-600">Commission</td>
                          <td className="py-2 px-4 text-right font-medium">{formatCurrency(record.commission)}</td>
                          <td className="py-2 px-4 text-right">{formatCurrency(dailyBreakdown.weeklyCommission)}</td>
                          <td className="py-2 px-4 text-right">{formatCurrency(dailyBreakdown.dailyCommission)}</td>
                        </tr>
                        <tr className="border-b border-slate-200 bg-blue-50">
                          <td className="py-2 px-4 font-semibold text-blue-900">Gross</td>
                          <td className="py-2 px-4 text-right font-bold text-blue-900">{formatCurrency(record.grossSalary)}</td>
                          <td className="py-2 px-4 text-right font-semibold text-blue-800">{formatCurrency(dailyBreakdown.weeklyGross)}</td>
                          <td className="py-2 px-4 text-right font-semibold text-blue-800">{formatCurrency(dailyBreakdown.dailyGross)}</td>
                        </tr>
                        <tr className="bg-emerald-50">
                          <td className="py-2 px-4 font-semibold text-emerald-900">Net (Take Home)</td>
                          <td className="py-2 px-4 text-right font-bold text-emerald-900">{formatCurrency(record.netSalary)}</td>
                          <td className="py-2 px-4 text-right font-semibold text-emerald-800">{formatCurrency(dailyBreakdown.weeklyNet)}</td>
                          <td className="py-2 px-4 text-right font-semibold text-emerald-800">{formatCurrency(dailyBreakdown.dailyNet)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-slate-400 mt-3">Based on {attendance?.totalWorkingDays || 26} working days/month, 6 working days/week</p>
                </Card>
              )}
            </div>
          )}

          {/* TAB 2: Attendance */}
          {activeTab === 'attendance' && (
            <Card title="Attendance Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <Input label="Total Working Days" type="number" min={0} max={31} value={attendanceForm.totalWorkingDays} onChange={(e) => setAttendanceForm((p) => ({ ...p, totalWorkingDays: parseInt(e.target.value) || 0 }))} disabled={!perms.canEditDeductions} />
                <Input label="Days Present" type="number" min={0} max={31} value={attendanceForm.daysPresent} onChange={(e) => setAttendanceForm((p) => ({ ...p, daysPresent: parseInt(e.target.value) || 0 }))} disabled={!perms.canEditDeductions} />
                <Input label="Days Absent" type="number" min={0} max={31} value={attendanceForm.daysAbsent} onChange={(e) => setAttendanceForm((p) => ({ ...p, daysAbsent: parseInt(e.target.value) || 0 }))} disabled={!perms.canEditDeductions} />
                <Input label="Half Days" type="number" min={0} max={31} value={attendanceForm.halfDays} onChange={(e) => setAttendanceForm((p) => ({ ...p, halfDays: parseInt(e.target.value) || 0 }))} disabled={!perms.canEditDeductions} />
              </div>
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-2xl">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-amber-800">Attendance Deduction Preview</span>
                  <span className="text-lg font-bold text-amber-900">{formatCurrency(attendanceDeductionPreview)}</span>
                </div>
                <p className="text-xs text-amber-600 mt-1">
                  ({formatCurrency(profile?.baseSalary || 0)} / {attendanceForm.totalWorkingDays} days) x {attendanceForm.daysAbsent} absent + {attendanceForm.halfDays} half days
                </p>
              </div>
              {perms.canEditDeductions && (
                <div className="mt-6">
                  <Button onClick={handleSaveAttendance}>Save Attendance</Button>
                  <p className="text-xs text-slate-400 mt-2">Salary is automatically recalculated when you save.</p>
                </div>
              )}
            </Card>
          )}

          {/* TAB 3: Deductions */}
          {activeTab === 'deductions' && (
            <div className="space-y-6">
              <Card title="Custom Deductions">
                {customDeds.length > 0 ? (
                  <div className="mb-6">
                    {customDeds.map((ded) => (
                      <div key={ded.id} className="flex items-center justify-between py-3 border-b border-slate-100">
                        <span className="text-sm font-medium text-slate-700">{ded.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-red-600">{formatCurrency(ded.amount)}</span>
                          {perms.canEditDeductions && (
                            <button onClick={() => handleRemoveDeduction(ded.id)} className="p-1 text-slate-400 hover:text-red-600">
                              <HiOutlineTrash className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 mb-6">No custom deductions for this month.</p>
                )}
                {perms.canEditDeductions && (
                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Add Deduction</h4>
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <Input label="Label" placeholder="e.g., Uniform, Late Fine, PF" value={newDeductionLabel} onChange={(e) => setNewDeductionLabel(e.target.value)} />
                      </div>
                      <div className="w-40">
                        <Input label="Amount (₹)" type="number" min={0} value={newDeductionAmount} onChange={(e) => setNewDeductionAmount(e.target.value)} />
                      </div>
                      <Button onClick={handleAddDeduction} size="md">
                        <HiOutlinePlusCircle className="w-4 h-4" />
                        Add
                      </Button>
                    </div>
                  </div>
                )}
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
                  Salary is automatically recalculated when you add or remove deductions.
                </div>
              </Card>

              <Card title="Advance Recovery">
                {pendingAdvances.length > 0 ? (
                  <div>
                    {pendingAdvances.map((adv) => (
                      <div key={adv.id} className="flex items-center justify-between py-3 border-b border-slate-100">
                        <div>
                          <p className="text-sm font-medium text-slate-700">Advance: {formatCurrency(adv.amount)}</p>
                          {adv.reason && <p className="text-xs text-slate-500">{adv.reason}</p>}
                          <p className="text-xs text-slate-400">Date: {adv.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-600">Deducted: <span className="font-medium">{formatCurrency(adv.deducted)}</span></p>
                          <p className="text-sm text-amber-600">Balance: <span className="font-bold">{formatCurrency(adv.amount - adv.deducted)}</span></p>
                          <Badge variant={adv.status === 'pending' ? 'warning' : 'info'} className="mt-1">{adv.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No pending advances.</p>
                )}
              </Card>
            </div>
          )}

          {/* TAB 4: Payslip */}
          {activeTab === 'payslip' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Button variant="outline" onClick={() => window.print()}>
                  <HiOutlinePrinter className="w-4 h-4" /> Print
                </Button>
                <Button variant="outline" onClick={() => window.print()}>
                  <HiOutlineArrowDownTray className="w-4 h-4" /> Download PDF
                </Button>
              </div>
              <div ref={payslipRef} className="print-area">
                <PayslipPreview
                  record={record}
                  staffName={staffName}
                  staffRole={staffRole}
                  staffId={staffId}
                  joinDate={staff.joinDate}
                  employmentType={profile?.employmentType || 'full-time'}
                  payStructure={profile?.payStructure || 'fixed-only'}
                />
              </div>
            </div>
          )}
        </div>
      )}
      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={confirmAction === 'approve'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleApprove}
        title="Approve Salary"
        message={`Approve ${staffName}'s salary of ${record ? formatCurrency(record.netSalary) : ''} for ${formatMonth(month)}? This locks the salary from further edits.`}
        confirmLabel="Approve"
        variant="primary"
      />
      <ConfirmDialog
        isOpen={confirmAction === 'paid'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleMarkPaid}
        title="Mark as Paid"
        message={`Mark ${staffName}'s salary as paid? This will also deduct any advance recovery from their advance balance.`}
        confirmLabel="Mark Paid"
        variant="primary"
      />
    </PageWrapper>
  );
}
