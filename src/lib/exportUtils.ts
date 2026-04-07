import { SalaryRecord } from '@/types/salary';

export function exportSalaryToCSV(
  records: SalaryRecord[],
  staffNames: Record<string, string>,
  month: string
): void {
  const headers = ['Staff Name', 'Base Salary', 'Commission', 'Incentives', 'Tips', 'Gross Salary', 'Total Deductions', 'Net Salary', 'Status'];

  const rows = records.map((r) => [
    staffNames[r.staffId] || r.staffId,
    r.baseSalary,
    r.commission,
    r.incentives.reduce((s, i) => s + i.amount, 0),
    r.tips,
    r.grossSalary,
    r.totalDeductions,
    r.netSalary,
    r.status,
  ]);

  // Add totals row
  const totals = ['TOTAL', 0, 0, 0, 0, 0, 0, 0, ''];
  records.forEach((r) => {
    (totals[1] as number) += r.baseSalary;
    (totals[2] as number) += r.commission;
    (totals[3] as number) += r.incentives.reduce((s, i) => s + i.amount, 0);
    (totals[4] as number) += r.tips;
    (totals[5] as number) += r.grossSalary;
    (totals[6] as number) += r.totalDeductions;
    (totals[7] as number) += r.netSalary;
  });
  rows.push(totals as (string | number)[]);

  const csv = [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `salary-report-${month}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
