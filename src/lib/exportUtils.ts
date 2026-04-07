import { SalaryRecord } from '@/types/salary';
import { AttendanceEntry } from '@/types/salary';

export function exportSalaryToCSV(
  records: SalaryRecord[],
  staffNames: Record<string, string>,
  month: string,
  attendanceEntries?: AttendanceEntry[]
): void {
  const headers = [
    'Staff Name', 'Base Salary', 'Commission', 'Incentives', 'Tips', 'Gross Salary',
    'Advance Recovery', 'Attendance Deduction', 'Other Deductions',
    'Total Deductions', 'Net Salary', 'Status',
    'Working Days', 'Present', 'Absent',
  ];

  const rows = records.map((r) => {
    const advanceRecovery = r.deductions
      .filter((d) => d.label.toLowerCase().includes('advance'))
      .reduce((s, d) => s + d.amount, 0);
    const attendanceDeduction = r.deductions
      .filter((d) => d.label.toLowerCase().includes('absent') || d.label.toLowerCase().includes('attendance'))
      .reduce((s, d) => s + d.amount, 0);
    const otherDeductions = r.deductions
      .filter((d) => !d.label.toLowerCase().includes('advance') && !d.label.toLowerCase().includes('absent') && !d.label.toLowerCase().includes('attendance'))
      .map((d) => `${d.label}: ${d.amount}`)
      .join('; ');

    const att = attendanceEntries?.find((a) => a.staffId === r.staffId && a.month === month);

    return [
      staffNames[r.staffId] || r.staffId,
      r.baseSalary,
      r.commission,
      r.incentives.reduce((s, i) => s + i.amount, 0),
      r.tips,
      r.grossSalary,
      advanceRecovery,
      attendanceDeduction,
      otherDeductions || '-',
      r.totalDeductions,
      r.netSalary,
      r.status,
      att?.totalWorkingDays || '-',
      att?.daysPresent || '-',
      att?.daysAbsent || '-',
    ];
  });

  // Add totals row
  const totals: (string | number)[] = ['TOTAL', 0, 0, 0, 0, 0, 0, 0, '', 0, 0, '', '', '', ''];
  records.forEach((r) => {
    (totals[1] as number) += r.baseSalary;
    (totals[2] as number) += r.commission;
    (totals[3] as number) += r.incentives.reduce((s, i) => s + i.amount, 0);
    (totals[4] as number) += r.tips;
    (totals[5] as number) += r.grossSalary;
    // advance recovery total
    (totals[6] as number) += r.deductions
      .filter((d) => d.label.toLowerCase().includes('advance'))
      .reduce((s, d) => s + d.amount, 0);
    // attendance deduction total
    (totals[7] as number) += r.deductions
      .filter((d) => d.label.toLowerCase().includes('absent') || d.label.toLowerCase().includes('attendance'))
      .reduce((s, d) => s + d.amount, 0);
    (totals[9] as number) += r.totalDeductions;
    (totals[10] as number) += r.netSalary;
  });
  rows.push(totals);

  const csv = [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `salary-report-${month}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
