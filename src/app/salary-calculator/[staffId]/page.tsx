'use client';

import { useState, useMemo, useRef } from 'react';
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
import { MonthSelector } from '@/components/salary/MonthSelector';
import { PayslipPreview } from '@/components/salary/PayslipPreview';
import { useSalaryStore } from '@/store/useSalaryStore';
import { useStaffStore } from '@/store/useStaffStore';
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
  const initialMonth = searchParams.get('month') || '2026-04';

  const [month, setMonth] = useState(initialMonth);
  const [activeTab, setActiveTab] = useState('breakdown');

  // Deduction form state
  const [newDeductionLabel, setNewDeductionLabel] = useState('');
  const [newDeductionAmount, setNewDeductionAmount] = useState('');

  // Attendance form state
  const [attendanceForm, setAttendanceForm] = useState({
    totalWorkingDays: 26,
    daysPresent: 26,
    daysAbsent: 0,
    halfDays: 0,
  });
  const [attendanceLoaded, setAttendanceLoaded] = useState(false);

  const payslipRef = useRef<HTMLDivElement>(null);

  // Store selectors
  const staff = useStaffStore((s) => s.getStaff(staffId));
  const getSalaryRecord = useSalaryStore((s) => s.getSalaryRecord);
  const getSalaryProfile = useSalaryStore((s) => s.getSalaryProfile);
  const getAttendanceEntry = useSalaryStore((s) => s.getAttendanceEntry);
  const getCustomDeductions = useSalaryStore((s) => s.getCustomDeductions);
  const getPendingAdvances = useSalaryStore((s) => s.getPendingAdvances);
  const updateSalaryRecord = useSalaryStore((s) => s.updateSalaryRecord);
  const setAttendanceEntry = useSalaryStore((s) => s.setAttendanceEntry);
  const addCustomDeduction = useSalaryStore((s) => s.addCustomDeduction);
  const removeCustomDeduction = useSalaryStore((s) => s.removeCustomDeduction);

  const record = useMemo(() => getSalaryRecord(staffId, month), [getSalaryRecord, staffId, month]);
  const profile = useMemo(() => getSalaryProfile(staffId), [getSalaryProfile, staffId]);
  const attendance = useMemo(() => getAttendanceEntry(staffId, month), [getAttendanceEntry, staffId, month]);
  const customDeds = useMemo(() => getCustomDeductions(staffId, month), [getCustomDeductions, staffId, month]);
  const pendingAdvances = useMemo(() => getPendingAdvances(staffId), [getPendingAdvances, staffId]);

  // Pre-populate attendance form when data loads
  if (hydrated && attendance && !attendanceLoaded) {
    setAttendanceForm({
      totalWorkingDays: attendance.totalWorkingDays,
      daysPresent: attendance.daysPresent,
      daysAbsent: attendance.daysAbsent,
      halfDays: attendance.halfDays,
    });
    setAttendanceLoaded(true);
  }

  const staffName = staff ? `${staff.firstName} ${staff.lastName}` : 'Unknown Staff';
  const staffRole = staff?.role || 'staff';

  const handleApprove = () => {
    if (!record) return;
    updateSalaryRecord(record.id, { status: 'approved' });
    toast.success(`Salary approved for ${staffName}`);
  };

  const handleMarkPaid = () => {
    if (!record) return;
    updateSalaryRecord(record.id, { status: 'paid' });
    toast.success(`Salary marked as paid for ${staffName}`);
  };

  const handleSaveAttendance = () => {
    setAttendanceEntry({
      staffId,
      month,
      ...attendanceForm,
    });
    toast.success('Attendance saved');
  };

  const handleAddDeduction = () => {
    const label = newDeductionLabel.trim();
    const amount = parseFloat(newDeductionAmount);
    if (!label) {
      toast.error('Please enter a deduction label');
      return;
    }
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    addCustomDeduction({
      id: generateId(),
      staffId,
      month,
      label,
      amount,
    });
    setNewDeductionLabel('');
    setNewDeductionAmount('');
    toast.success('Deduction added');
  };

  const handleRemoveDeduction = (id: string) => {
    removeCustomDeduction(id);
    toast.success('Deduction removed');
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate attendance deduction preview
  const attendanceDeductionPreview = useMemo(() => {
    if (!record) return 0;
    const { totalWorkingDays, daysAbsent } = attendanceForm;
    if (totalWorkingDays <= 0) return 0;
    return Math.round((record.baseSalary / totalWorkingDays) * daysAbsent);
  }, [attendanceForm, record]);

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
        <EmptyState
          title="Staff member not found"
          description="The staff member you are looking for does not exist."
          action={<Button href="/salary-calculator">Back to Salary Calculator</Button>}
        />
      </PageWrapper>
    );
  }

  if (!record) {
    return (
      <PageWrapper title={staffName}>
        <div className="mb-4">
          <Button variant="ghost" onClick={() => router.push('/salary-calculator')}>
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-12">
          <EmptyState
            title="Salary not calculated yet"
            description="Go back to the main dashboard and click Calculate All to generate salary records for this staff member."
            action={
              <Button href="/salary-calculator">
                <HiOutlineArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            }
          />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={staffName} subtitle={formatMonth(month)}>
      {/* Print-only styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 no-print">
        <div className="flex items-center gap-4">
          <Avatar name={staffName} src={staff.avatar} color={staff.color} size="xl" />
          <div>
            <h2 className="text-xl font-bold text-slate-900">{staffName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={roleBadgeVariant[staffRole] || 'neutral'}>
                {staffRole.charAt(0).toUpperCase() + staffRole.slice(1)}
              </Badge>
              <Badge variant={statusBadgeVariant[record.status]}>
                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MonthSelector
            value={month}
            onChange={(v) => {
              setMonth(v);
              setAttendanceLoaded(false);
              router.push(`/salary-calculator/${staffId}?month=${v}`);
            }}
          />
          {record.status === 'draft' && (
            <Button variant="success" onClick={handleApprove}>
              <HiOutlineCheckCircle className="w-4 h-4" />
              Approve
            </Button>
          )}
          {(record.status === 'draft' || record.status === 'approved') && (
            <Button onClick={handleMarkPaid}>
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

      {/* Tab Content */}
      <div className="no-print">
        {/* ─── TAB 1: Breakdown ─── */}
        {activeTab === 'breakdown' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings */}
              <Card title="Earnings">
                <div className="space-y-0">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Base Salary</span>
                    <span className="text-sm font-medium">{formatCurrency(record.baseSalary)}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Commission</span>
                    <span className="text-sm font-medium">{formatCurrency(record.commission)}</span>
                  </div>
                  {record.incentives.map((inc, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100">
                      <span className="text-sm text-slate-600">{inc.label}</span>
                      <span className="text-sm font-medium">{formatCurrency(inc.amount)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Tips</span>
                    <span className="text-sm font-medium">{formatCurrency(record.tips)}</span>
                  </div>
                  <div className="border-t-2 border-slate-200 mt-1" />
                  <div className="flex items-center justify-between py-3 bg-blue-50 -mx-6 px-6 rounded-b-lg">
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
                      <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100">
                        <span className="text-sm text-slate-600">{ded.label}</span>
                        <span className="text-sm font-medium text-red-600">{formatCurrency(ded.amount)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="py-3 text-sm text-slate-400">No deductions</div>
                  )}
                  <div className="border-t-2 border-slate-200 mt-1" />
                  <div className="flex items-center justify-between py-3 bg-red-50 -mx-6 px-6 rounded-b-lg">
                    <span className="text-sm font-bold text-red-900">TOTAL DEDUCTIONS</span>
                    <span className="text-sm font-bold text-red-900">{formatCurrency(record.totalDeductions)}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Net Salary Card */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
              <p className="text-sm font-medium text-emerald-600 mb-1">NET SALARY</p>
              <p className="text-4xl font-bold text-emerald-800">{formatCurrency(record.netSalary)}</p>
              <p className="text-sm text-emerald-600 mt-2">
                Gross ({formatCurrency(record.grossSalary)}) - Deductions ({formatCurrency(record.totalDeductions)})
              </p>
            </div>
          </div>
        )}

        {/* ─── TAB 2: Attendance ─── */}
        {activeTab === 'attendance' && (
          <Card title="Attendance Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <Input
                label="Total Working Days"
                type="number"
                min={0}
                max={31}
                value={attendanceForm.totalWorkingDays}
                onChange={(e) =>
                  setAttendanceForm((prev) => ({
                    ...prev,
                    totalWorkingDays: parseInt(e.target.value) || 0,
                  }))
                }
              />
              <Input
                label="Days Present"
                type="number"
                min={0}
                max={31}
                value={attendanceForm.daysPresent}
                onChange={(e) =>
                  setAttendanceForm((prev) => ({
                    ...prev,
                    daysPresent: parseInt(e.target.value) || 0,
                  }))
                }
              />
              <Input
                label="Days Absent"
                type="number"
                min={0}
                max={31}
                value={attendanceForm.daysAbsent}
                onChange={(e) =>
                  setAttendanceForm((prev) => ({
                    ...prev,
                    daysAbsent: parseInt(e.target.value) || 0,
                  }))
                }
              />
              <Input
                label="Half Days"
                type="number"
                min={0}
                max={31}
                value={attendanceForm.halfDays}
                onChange={(e) =>
                  setAttendanceForm((prev) => ({
                    ...prev,
                    halfDays: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>

            {/* Live Calculation Preview */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-2xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-amber-800">Attendance Deduction</span>
                <span className="text-lg font-bold text-amber-900">
                  {formatCurrency(attendanceDeductionPreview)}
                </span>
              </div>
              <p className="text-xs text-amber-600 mt-1">
                ({formatCurrency(record.baseSalary)} / {attendanceForm.totalWorkingDays} days) x {attendanceForm.daysAbsent} absent days
              </p>
            </div>

            <div className="mt-6">
              <Button onClick={handleSaveAttendance}>
                Save Attendance
              </Button>
            </div>
          </Card>
        )}

        {/* ─── TAB 3: Deductions ─── */}
        {activeTab === 'deductions' && (
          <div className="space-y-6">
            {/* Custom Deductions */}
            <Card title="Custom Deductions">
              {customDeds.length > 0 ? (
                <div className="space-y-0 mb-6">
                  {customDeds.map((ded) => (
                    <div
                      key={ded.id}
                      className="flex items-center justify-between py-3 border-b border-slate-100"
                    >
                      <div>
                        <span className="text-sm font-medium text-slate-700">{ded.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-red-600">
                          {formatCurrency(ded.amount)}
                        </span>
                        <button
                          onClick={() => handleRemoveDeduction(ded.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 mb-6">No custom deductions for this month.</p>
              )}

              {/* Add Deduction Form */}
              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Add Deduction</h4>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Input
                      label="Label"
                      placeholder="e.g., Uniform, Late Fine"
                      value={newDeductionLabel}
                      onChange={(e) => setNewDeductionLabel(e.target.value)}
                    />
                  </div>
                  <div className="w-40">
                    <Input
                      label="Amount"
                      type="number"
                      min={0}
                      placeholder="0"
                      value={newDeductionAmount}
                      onChange={(e) => setNewDeductionAmount(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddDeduction} size="md">
                    <HiOutlinePlusCircle className="w-4 h-4" />
                    Add
                  </Button>
                </div>
              </div>
            </Card>

            {/* Advance Recovery */}
            <Card title="Advance Recovery">
              {pendingAdvances.length > 0 ? (
                <div className="space-y-0">
                  {pendingAdvances.map((adv) => {
                    const balance = adv.amount - adv.deducted;
                    return (
                      <div
                        key={adv.id}
                        className="flex items-center justify-between py-3 border-b border-slate-100"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            Advance: {formatCurrency(adv.amount)}
                          </p>
                          {adv.reason && (
                            <p className="text-xs text-slate-500">{adv.reason}</p>
                          )}
                          <p className="text-xs text-slate-400 mt-0.5">
                            Date: {adv.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-600">
                            Deducted: <span className="font-medium">{formatCurrency(adv.deducted)}</span>
                          </p>
                          <p className="text-sm text-amber-600">
                            Balance: <span className="font-bold">{formatCurrency(balance)}</span>
                          </p>
                          <Badge variant={adv.status === 'pending' ? 'warning' : 'info'} className="mt-1">
                            {adv.status.charAt(0).toUpperCase() + adv.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No pending advances for this staff member.</p>
              )}
            </Card>
          </div>
        )}

        {/* ─── TAB 4: Payslip ─── */}
        {activeTab === 'payslip' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Button variant="outline" onClick={handlePrint}>
                <HiOutlinePrinter className="w-4 h-4" />
                Print
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <HiOutlineArrowDownTray className="w-4 h-4" />
                Download PDF
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
    </PageWrapper>
  );
}
