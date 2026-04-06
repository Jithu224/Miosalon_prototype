'use client';

import { useMemo } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { AppointmentChart } from '@/components/charts/AppointmentChart';
import { ServicePopularityChart } from '@/components/charts/ServicePopularityChart';
import { revenueData, appointmentData, servicePopularity, recentActivity } from '@/data/mockDashboard';
import { useAppointmentStore } from '@/store/useAppointmentStore';
import { useClientStore } from '@/store/useClientStore';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { useStaffStore } from '@/store/useStaffStore';
import { useServiceStore } from '@/store/useServiceStore';
import { useHydration } from '@/hooks/useHydration';
import { formatCurrency, formatTime } from '@/lib/utils';
import {
  HiOutlineBanknotes,
  HiOutlineCalendarDays,
  HiOutlineUserPlus,
  HiOutlineDocumentText,
  HiOutlineCalendar,
  HiOutlineCreditCard,
  HiOutlineUser,
  HiOutlineStar,
  HiOutlineCube,
} from 'react-icons/hi2';

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple'> = {
  confirmed: 'success',
  scheduled: 'info',
  completed: 'success',
  cancelled: 'danger',
  'no-show': 'warning',
  'in-progress': 'purple',
};

const activityIcons: Record<string, React.ReactNode> = {
  appointment: <HiOutlineCalendar className="w-4 h-4 text-blue-500" />,
  invoice: <HiOutlineCreditCard className="w-4 h-4 text-emerald-500" />,
  client: <HiOutlineUser className="w-4 h-4 text-purple-500" />,
  feedback: <HiOutlineStar className="w-4 h-4 text-yellow-500" />,
  product: <HiOutlineCube className="w-4 h-4 text-orange-500" />,
};

export default function DashboardPage() {
  const hydrated = useHydration();
  const appointments = useAppointmentStore((s) => s.appointments);
  const clients = useClientStore((s) => s.clients);
  const invoices = useInvoiceStore((s) => s.invoices);
  const staff = useStaffStore((s) => s.staff);
  const services = useServiceStore((s) => s.services);

  const todayStr = '2026-04-06';

  const todayAppointments = useMemo(
    () => appointments.filter((a) => a.date === todayStr),
    [appointments]
  );

  const todayRevenue = useMemo(
    () =>
      invoices
        .filter((inv) => inv.createdAt === todayStr && inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.grandTotal, 0),
    [invoices]
  );

  const pendingInvoices = useMemo(
    () => invoices.filter((inv) => inv.status === 'draft' || inv.status === 'partial').length,
    [invoices]
  );

  const newClientsThisWeek = useMemo(() => {
    const weekAgo = new Date('2026-03-30');
    return clients.filter((c) => new Date(c.createdAt) >= weekAgo).length;
  }, [clients]);

  if (!hydrated) {
    return (
      <PageWrapper title="Dashboard" subtitle="Welcome back! Here's what's happening today.">
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-slate-200 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-slate-200 rounded-xl" />
            <div className="h-80 bg-slate-200 rounded-xl" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  const statCards = [
    {
      label: "Today's Revenue",
      value: formatCurrency(todayRevenue || 45200),
      change: '+12.5%',
      positive: true,
      icon: <HiOutlineBanknotes className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50',
    },
    {
      label: "Today's Appointments",
      value: String(todayAppointments.length),
      change: '+8.3%',
      positive: true,
      icon: <HiOutlineCalendarDays className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50',
    },
    {
      label: 'New Clients This Week',
      value: String(newClientsThisWeek || 6),
      change: '+15.0%',
      positive: true,
      icon: <HiOutlineUserPlus className="w-6 h-6 text-purple-600" />,
      bg: 'bg-purple-50',
    },
    {
      label: 'Pending Invoices',
      value: String(pendingInvoices || 1),
      change: '-3.2%',
      positive: false,
      icon: <HiOutlineDocumentText className="w-6 h-6 text-orange-600" />,
      bg: 'bg-orange-50',
    },
  ];

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Unknown';
  };

  const getStaffName = (staffId: string) => {
    const member = staff.find((s) => s.id === staffId);
    return member ? `${member.firstName} ${member.lastName}` : 'Unknown';
  };

  const getServiceNames = (serviceItems: { serviceId: string }[]) => {
    return serviceItems
      .map((si) => {
        const svc = services.find((s) => s.id === si.serviceId);
        return svc ? svc.name : si.serviceId;
      })
      .join(', ');
  };

  return (
    <PageWrapper title="Dashboard" subtitle="Welcome back! Here's what's happening today.">
      <div className="space-y-6">
        {/* Row 1: Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-start gap-4"
            >
              <div className={`${stat.bg} p-3 rounded-lg`}>{stat.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">{stat.value}</p>
                <Badge variant={stat.positive ? 'success' : 'danger'} className="mt-1">
                  {stat.change}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Revenue (30 Days)">
            <RevenueChart data={revenueData} />
          </Card>
          <Card title="Appointments (7 Days)">
            <AppointmentChart data={appointmentData} />
          </Card>
        </div>

        {/* Row 3: Today's Appointments + Service Popularity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Today's Appointments" padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-6 text-slate-500 font-medium">Time</th>
                    <th className="text-left py-3 px-6 text-slate-500 font-medium">Client</th>
                    <th className="text-left py-3 px-6 text-slate-500 font-medium">Services</th>
                    <th className="text-left py-3 px-6 text-slate-500 font-medium">Staff</th>
                    <th className="text-left py-3 px-6 text-slate-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-400">
                        No appointments today
                      </td>
                    </tr>
                  ) : (
                    todayAppointments.map((apt) => (
                      <tr key={apt.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-3 px-6 whitespace-nowrap">
                          {formatTime(apt.startTime)}
                        </td>
                        <td className="py-3 px-6 font-medium text-slate-900">
                          {getClientName(apt.clientId)}
                        </td>
                        <td className="py-3 px-6 text-slate-600 max-w-[200px] truncate">
                          {getServiceNames(apt.services)}
                        </td>
                        <td className="py-3 px-6 text-slate-600">
                          {getStaffName(apt.staffId)}
                        </td>
                        <td className="py-3 px-6">
                          <Badge variant={statusVariant[apt.status] || 'neutral'}>
                            {apt.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
          <Card title="Service Popularity">
            <ServicePopularityChart data={servicePopularity} />
          </Card>
        </div>

        {/* Row 4: Recent Activity */}
        <Card title="Recent Activity">
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="mt-0.5 p-2 bg-slate-50 rounded-lg">
                  {activityIcons[item.type] || <HiOutlineCalendar className="w-4 h-4 text-slate-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">{item.message}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
