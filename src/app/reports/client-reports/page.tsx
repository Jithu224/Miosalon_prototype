'use client';

import { useMemo } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useClientStore } from '@/store/useClientStore';
import { useHydration } from '@/hooks/useHydration';
import { formatCurrency, formatDate } from '@/lib/utils';
import { HiOutlineUsers, HiOutlineUserPlus, HiOutlineUserMinus } from 'react-icons/hi2';

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  active: 'success',
  inactive: 'warning',
  churned: 'danger',
};

export default function ClientReportsPage() {
  const hydrated = useHydration();
  const clients = useClientStore((s) => s.clients);

  const totalClients = clients.length;
  const activeClients = useMemo(() => clients.filter((c) => c.status === 'active').length, [clients]);
  const churnedClients = useMemo(() => clients.filter((c) => c.status === 'churned').length, [clients]);

  const topClients = useMemo(
    () =>
      [...clients]
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 10),
    [clients]
  );

  if (!hydrated) {
    return (
      <PageWrapper title="Client Reports" subtitle="Insights into client activity and retention">
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 bg-slate-200 rounded-xl" />
            ))}
          </div>
          <div className="h-64 bg-slate-200 rounded-xl" />
        </div>
      </PageWrapper>
    );
  }

  const kpis = [
    {
      label: 'Total Clients',
      value: String(totalClients),
      icon: <HiOutlineUsers className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50',
    },
    {
      label: 'Active Clients',
      value: String(activeClients),
      icon: <HiOutlineUserPlus className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50',
    },
    {
      label: 'Churned Clients',
      value: String(churnedClients),
      icon: <HiOutlineUserMinus className="w-6 h-6 text-red-600" />,
      bg: 'bg-red-50',
    },
  ];

  return (
    <PageWrapper title="Client Reports" subtitle="Insights into client activity and retention">
      <div className="space-y-6">
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

        {/* Top Clients Table */}
        <Card title="Top 10 Clients by Spending" padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-6 text-slate-500 font-medium">#</th>
                  <th className="text-left py-3 px-6 text-slate-500 font-medium">Name</th>
                  <th className="text-right py-3 px-6 text-slate-500 font-medium">Total Spent</th>
                  <th className="text-right py-3 px-6 text-slate-500 font-medium">Visits</th>
                  <th className="text-left py-3 px-6 text-slate-500 font-medium">Last Visit</th>
                  <th className="text-left py-3 px-6 text-slate-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {topClients.map((client, idx) => (
                  <tr key={client.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-3 px-6 text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-6 font-medium text-slate-900">
                      {client.firstName} {client.lastName}
                    </td>
                    <td className="py-3 px-6 text-right font-medium text-slate-900">
                      {formatCurrency(client.totalSpent)}
                    </td>
                    <td className="py-3 px-6 text-right text-slate-600">{client.visitCount}</td>
                    <td className="py-3 px-6 text-slate-600">{client.lastVisit ? formatDate(client.lastVisit) : '-'}</td>
                    <td className="py-3 px-6">
                      <Badge variant={statusVariant[client.status] || 'neutral'}>
                        {client.status}
                      </Badge>
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
