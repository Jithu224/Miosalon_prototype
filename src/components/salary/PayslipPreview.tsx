'use client';

import { SalaryRecord } from '@/types/salary';
import { formatCurrency, formatMonth } from '@/lib/utils';

interface PayslipPreviewProps {
  record: SalaryRecord;
  staffName: string;
  staffRole: string;
  staffId: string;
  joinDate: string;
  employmentType: string;
  payStructure: string;
  salonName?: string;
  attendance?: { totalWorkingDays: number; daysPresent: number; daysAbsent: number; halfDays: number };
  periodStart?: string; // "01 Apr 2026"
  periodEnd?: string; // "30 Apr 2026"
}

export function PayslipPreview({
  record,
  staffName,
  staffRole,
  staffId,
  joinDate,
  employmentType,
  payStructure,
  salonName = 'Mia Salon & Spa',
  attendance,
  periodStart,
  periodEnd,
}: PayslipPreviewProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg max-w-2xl mx-auto print:border-0 print:rounded-none print:max-w-none">
      {/* Header */}
      <div className="border-b border-slate-300 p-6 text-center bg-slate-50 print:bg-white">
        <h2 className="text-lg font-bold text-slate-900">{salonName}</h2>
        <p className="text-sm text-slate-500">SALARY SLIP</p>
        <p className="text-sm font-medium text-slate-700 mt-1">{formatMonth(record.month)}</p>
      </div>

      {/* Staff Info */}
      <div className="border-b border-slate-200 px-6 py-4 grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-slate-500">Employee:</span> <span className="font-medium">{staffName}</span></div>
        <div><span className="text-slate-500">ID:</span> <span className="font-medium">{staffId}</span></div>
        <div><span className="text-slate-500">Designation:</span> <span className="font-medium capitalize">{staffRole}</span></div>
        <div><span className="text-slate-500">Joined:</span> <span className="font-medium">{joinDate}</span></div>
        <div><span className="text-slate-500">Employment:</span> <span className="font-medium capitalize">{employmentType.replace('-', ' ')}</span></div>
        <div><span className="text-slate-500">Pay Type:</span> <span className="font-medium capitalize">{payStructure.replace('-', ' ')}</span></div>
      </div>

      {/* Pay Period & Attendance */}
      {(periodStart || attendance) && (
        <div className="border-b border-slate-200 px-6 py-3">
          {periodStart && periodEnd && (
            <div className="text-sm mb-2">
              <span className="text-slate-500">Pay Period:</span>{' '}
              <span className="font-medium">{periodStart} &mdash; {periodEnd}</span>
            </div>
          )}
          {attendance && (
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div><span className="text-slate-500">Working Days:</span> <span className="font-medium">{attendance.totalWorkingDays}</span></div>
              <div><span className="text-slate-500">Present:</span> <span className="font-medium">{attendance.daysPresent}</span></div>
              <div><span className="text-slate-500">Absent:</span> <span className="font-medium">{attendance.daysAbsent}</span></div>
              <div><span className="text-slate-500">Half Days:</span> <span className="font-medium">{attendance.halfDays}</span></div>
            </div>
          )}
        </div>
      )}

      {/* Earnings */}
      <div className="border-b border-slate-200 px-6 py-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">Earnings</h3>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-1.5 text-slate-600">Base Salary</td>
              <td className="py-1.5 text-right font-medium">{formatCurrency(record.baseSalary)}</td>
            </tr>
            {record.commission > 0 && (
              <tr className="border-b border-slate-100">
                <td className="py-1.5 text-slate-600">Commission</td>
                <td className="py-1.5 text-right font-medium">{formatCurrency(record.commission)}</td>
              </tr>
            )}
            {record.incentives.map((inc, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-1.5 text-slate-600">{inc.label}</td>
                <td className="py-1.5 text-right font-medium">{formatCurrency(inc.amount)}</td>
              </tr>
            ))}
            {record.tips > 0 && (
              <tr className="border-b border-slate-100">
                <td className="py-1.5 text-slate-600">Tips</td>
                <td className="py-1.5 text-right font-medium">{formatCurrency(record.tips)}</td>
              </tr>
            )}
            <tr className="font-semibold">
              <td className="py-2 text-slate-900">GROSS SALARY</td>
              <td className="py-2 text-right text-slate-900">{formatCurrency(record.grossSalary)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Deductions */}
      <div className="border-b border-slate-200 px-6 py-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">Deductions</h3>
        {record.deductions.length > 0 ? (
          <table className="w-full text-sm">
            <tbody>
              {record.deductions.map((ded, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-1.5 text-slate-600">{ded.label}</td>
                  <td className="py-1.5 text-right font-medium text-red-600">{formatCurrency(ded.amount)}</td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td className="py-2 text-slate-900">TOTAL DEDUCTIONS</td>
                <td className="py-2 text-right text-red-600">{formatCurrency(record.totalDeductions)}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-slate-400">No deductions</p>
        )}
      </div>

      {/* Net Salary */}
      <div className="px-6 py-5 bg-emerald-50 print:bg-white">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">NET SALARY</span>
          <span className="text-2xl font-bold text-emerald-700">{formatCurrency(record.netSalary)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-slate-200 text-xs text-slate-400 flex justify-between">
        <span>Status: {record.status.toUpperCase()}</span>
        <span>Generated: {new Date(record.calculatedAt).toLocaleDateString('en-IN')}</span>
      </div>
    </div>
  );
}
