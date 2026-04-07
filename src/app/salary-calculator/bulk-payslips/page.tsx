'use client';

import { useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { HiOutlinePrinter, HiOutlineArrowLeft } from 'react-icons/hi2';

import { useHydration } from '@/hooks/useHydration';
import { Button } from '@/components/ui/Button';
import { PayslipPreview } from '@/components/salary/PayslipPreview';
import { useSalaryStore } from '@/store/useSalaryStore';
import { useStaffStore } from '@/store/useStaffStore';
import { formatMonth } from '@/lib/utils';

function BulkPayslipsContent() {
  const hydrated = useHydration();
  const searchParams = useSearchParams();
  const month = searchParams.get('month') || new Date().toISOString().slice(0, 7);

  const staff = useStaffStore((s) => s.staff);
  const salaryRecords = useSalaryStore((s) => s.salaryRecords);
  const salaryProfiles = useSalaryStore((s) => s.salaryProfiles);
  const attendanceEntries = useSalaryStore((s) => s.attendanceEntries);

  const records = useMemo(() => salaryRecords.filter((r) => r.month === month), [salaryRecords, month]);

  const staffMap = useMemo(() => {
    const map: Record<string, { name: string; role: string; joinDate: string; avatar?: string; color: string }> = {};
    staff.forEach((s) => {
      map[s.id] = {
        name: `${s.firstName} ${s.lastName}`,
        role: s.role,
        joinDate: s.joinDate,
        avatar: s.avatar,
        color: s.color,
      };
    });
    return map;
  }, [staff]);

  const periodEnd = `${new Date(parseInt(month.split('-')[0]), parseInt(month.split('-')[1]), 0).getDate()} ${formatMonth(month)}`;
  const periodStart = `01 ${formatMonth(month)}`;

  if (!hydrated) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-slate-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-container { background: white; }
          .payslip-wrapper { page-break-after: always; }
          .payslip-wrapper:last-child { page-break-after: auto; }
        }
      `}</style>

      {/* Header toolbar */}
      <div className="no-print sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Bulk Payslips &mdash; {formatMonth(month)}</h1>
          <p className="text-sm text-slate-500">{records.length} payslip{records.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => window.print()}>
            <HiOutlinePrinter className="w-4 h-4" />
            Print All
          </Button>
          <Button variant="outline" href={`/salary-calculator?month=${month}`}>
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Payslips */}
      <div className="print-container p-6 space-y-8">
        {records.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            No salary records found for {formatMonth(month)}.
          </div>
        ) : (
          records.map((record) => {
            const staffInfo = staffMap[record.staffId];
            const profile = salaryProfiles.find((p) => p.staffId === record.staffId);
            const attendance = attendanceEntries.find((a) => a.staffId === record.staffId && a.month === month);

            return (
              <div key={record.id} className="payslip-wrapper">
                <PayslipPreview
                  record={record}
                  staffName={staffInfo?.name || record.staffId}
                  staffRole={staffInfo?.role || 'staff'}
                  staffId={record.staffId}
                  joinDate={staffInfo?.joinDate || '-'}
                  employmentType={profile?.employmentType || 'full-time'}
                  payStructure={profile?.payStructure || 'fixed-only'}
                  attendance={attendance ? {
                    totalWorkingDays: attendance.totalWorkingDays,
                    daysPresent: attendance.daysPresent,
                    daysAbsent: attendance.daysAbsent,
                    halfDays: attendance.halfDays,
                  } : undefined}
                  periodStart={periodStart}
                  periodEnd={periodEnd}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function BulkPayslipsPage() {
  return (
    <Suspense fallback={<div className="p-6"><div className="h-64 bg-slate-200 rounded animate-pulse" /></div>}>
      <BulkPayslipsContent />
    </Suspense>
  );
}
