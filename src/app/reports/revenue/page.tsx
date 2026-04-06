'use client';

import { useState, useMemo } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { revenueData } from '@/data/mockDashboard';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { useHydration } from '@/hooks/useHydration';
import { formatCurrency } from '@/lib/utils';
import { HiOutlineBanknotes, HiOutlineTicket, HiOutlineDocumentText } from 'react-icons/hi2';

const dateRanges = ['Today', 'This Week', 'This Month', 'Last Month'] as const;

export default function RevenueReportsPage() {
  const hydrated = useHydration();
  const invoices = useInvoiceStore((s) => s.invoices);
  const [activeRange, setActiveRange] = useState<string>('This Month');

  const paidInvoices = useMemo(
    () => invoices.filter((inv) => inv.status === 'paid'),
    [invoices]
  );

  const totalRevenue = useMemo(
    () => paidInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0),
    [paidInvoices]
  );

  const avgTicket = useMemo(
    () => (paidInvoices.length > 0 ? totalRevenue / paidInvoices.length : 0),
    [paidInvoices, totalRevenue]
  );

  const topServices = useMemo(() => {
    const serviceMap: Record<string, { name: string; revenue: number; count: number }> = {};
    paidInvoices.forEach((inv) => {
      inv.lineItems
        .filter((li) => li.type === 'service')
        .forEach((li) => {
          if (!serviceMap[li.name]) {
            serviceMap[li.name] = { name: li.name, revenue: 0, count: 0 };
          }
          serviceMap[li.name].revenue += li.total;
          serviceMap[li.name].count += li.quantity;
        });
    });
    return Object.values(serviceMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [paidInvoices]);

  if (!hydrated) {
    return (
      <PageWrapper title="Revenue Reports" subtitle="Track revenue trends and financial performance">
        <div className="space-y-6 animate-pulse">
          <div className="h-10 bg-slate-200 rounded-lg w-96" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 bg-slate-200 rounded-xl" />
            ))}
          </div>
          <div className="h-80 bg-slate-200 rounded-xl" />
        </div>
      </PageWrapper>
    );
  }

  const kpis = [
    {
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: <HiOutlineBanknotes className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50',
    },
    {
      label: 'Average Ticket',
      value: formatCurrency(Math.round(avgTicket)),
      icon: <HiOutlineTicket className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50',
    },
    {
      label: 'Total Invoices',
      value: String(paidInvoices.length),
      icon: <HiOutlineDocumentText className="w-6 h-6 text-purple-600" />,
      bg: 'bg-purple-50',
    },
  ];

  return (
    <PageWrapper title="Revenue Reports" subtitle="Track revenue trends and financial performance">
      <div className="space-y-6">
        {/* Date Range Buttons */}
        <div className="flex flex-wrap gap-2">
          {dateRanges.map((range) => (
            <Button
              key={range}
              variant={activeRange === range ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-start gap-4"
            >
              <div className={`${kpi.bg} p-3 rounded-lg`}>{kpi.icon}</div>
              <div>
                <p className="text-sm text-slate-500">{kpi.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">{kpi.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <Card title="Revenue Trend">
          <RevenueChart data={revenueData} />
        </Card>

        {/* Top Services by Revenue */}
        <Card title="Top Services by Revenue" padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-6 text-slate-500 font-medium">#</th>
                  <th className="text-left py-3 px-6 text-slate-500 font-medium">Service</th>
                  <th className="text-right py-3 px-6 text-slate-500 font-medium">Bookings</th>
                  <th className="text-right py-3 px-6 text-slate-500 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topServices.map((svc, idx) => (
                  <tr key={svc.name} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-3 px-6 text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-6 font-medium text-slate-900">{svc.name}</td>
                    <td className="py-3 px-6 text-right text-slate-600">{svc.count}</td>
                    <td className="py-3 px-6 text-right font-medium text-slate-900">
                      {formatCurrency(Math.round(svc.revenue))}
                    </td>
                  </tr>
                ))}
                {topServices.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-400">
                      No service revenue data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
