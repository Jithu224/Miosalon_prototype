'use client';

import { useMemo } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { StaffPerformanceChart } from '@/components/charts/StaffPerformanceChart';
import { useStaffStore } from '@/store/useStaffStore';
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
          return {
            id: s.id,
            name: `${s.firstName} ${s.lastName}`,
            role: s.role,
            revenue: perf.revenue,
            appointments: perf.appointments,
            commission,
          };
        }),
    [staff]
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
