'use client';

import { useMemo } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { StaffPerformanceChart } from '@/components/charts/StaffPerformanceChart';
import { useStaffStore } from '@/store/useStaffStore';
import { useSalaryStore } from '@/store/useSalaryStore';
import { useHydration } from '@/hooks/useHydration';
import { formatCurrency } from '@/lib/utils';

const hardcodedPerformance: Record<string, { revenue: number; appointments: number }> = {
  'staff-1': { revenue: 42500, appointments: 38 },
  'staff-2': { revenue: 58200, appointments: 45 },
  'staff-3': { revenue: 18700, appointments: 22 },
  'staff-4': { revenue: 31400, appointments: 28 },
  'staff-5': { revenue: 24800, appointments: 20 },
  'staff-6': { revenue: 47600, appointments: 35 },
  'staff-7': { revenue: 0, appointments: 0 },
  'staff-8': { revenue: 1888, appointments: 3 },
};

export default function StaffPerformancePage() {
  const hydrated = useHydration();
  const staff = useStaffStore((s) => s.staff);
  const attendanceEntries = useSalaryStore((s) => s.attendanceEntries);
  const currentMonth = new Date().toISOString().slice(0, 7);

  const staffData = useMemo(
    () =>
      staff
        .filter((s) => s.isActive)
        .map((s) => {
          const perf = hardcodedPerformance[s.id] || { revenue: 0, appointments: 0 };
          const commission =
            s.commissionType === 'percentage'
              ? Math.round(perf.revenue * (s.commissionRate / 100))
              : perf.appointments * s.commissionRate;
          const att = attendanceEntries.find((a) => a.staffId === s.id && a.month === currentMonth);
          return {
            id: s.id,
            name: `${s.firstName} ${s.lastName}`,
            role: s.role,
            revenue: perf.revenue,
            appointments: perf.appointments,
            commission,
            daysPresent: att?.daysPresent ?? '-',
            daysAbsent: att?.daysAbsent ?? '-',
            halfDays: att?.halfDays ?? '-',
            totalWorkingDays: att?.totalWorkingDays ?? '-',
          };
        }),
    [staff, attendanceEntries, currentMonth]
  );

  const chartData = useMemo(
    () =>
      staffData
        .filter((s) => s.appointments > 0)
        .map((s) => ({
          name: s.name.split(' ')[0],
          revenue: s.revenue,
          appointments: s.appointments,
        })),
    [staffData]
  );

  if (!hydrated) {
    return (
      <PageWrapper title="Staff Performance" subtitle="Analyze staff productivity and revenue">
        <div className="space-y-6 animate-pulse">
          <div className="h-80 bg-slate-200 rounded-xl" />
          <div className="h-64 bg-slate-200 rounded-xl" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Staff Performance" subtitle="Analyze staff productivity and revenue">
      <div className="space-y-6">
        <Card title="Revenue & Appointments by Staff">
          <StaffPerformanceChart data={chartData} />
        </Card>

        <Card title="Staff Performance Details" padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-6 text-slate-500 font-medium">Name</th>
                  <th className="text-left py-3 px-6 text-slate-500 font-medium">Role</th>
                  <th className="text-right py-3 px-6 text-slate-500 font-medium">Appointments</th>
                  <th className="text-right py-3 px-6 text-slate-500 font-medium">Revenue</th>
                  <th className="text-right py-3 px-6 text-slate-500 font-medium">Commission</th>
                  <th className="text-right py-3 px-6 text-slate-500 font-medium">Present</th>
                  <th className="text-right py-3 px-6 text-slate-500 font-medium">Absent</th>
                  <th className="text-right py-3 px-6 text-slate-500 font-medium">Half</th>
                </tr>
              </thead>
              <tbody>
                {staffData.map((s) => (
                  <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-3 px-6 font-medium text-slate-900">{s.name}</td>
                    <td className="py-3 px-6 text-slate-600 capitalize">{s.role}</td>
                    <td className="py-3 px-6 text-right text-slate-600">{s.appointments}</td>
                    <td className="py-3 px-6 text-right font-medium text-slate-900">
                      {formatCurrency(s.revenue)}
                    </td>
                    <td className="py-3 px-6 text-right text-emerald-600 font-medium">
                      {formatCurrency(s.commission)}
                    </td>
                    <td className="py-3 px-6 text-right text-emerald-600">{s.daysPresent}</td>
                    <td className="py-3 px-6 text-right text-red-600">{s.daysAbsent}</td>
                    <td className="py-3 px-6 text-right text-amber-600">{s.halfDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
