'use client';

import { useMemo, useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { ServicePopularityChart } from '@/components/charts/ServicePopularityChart';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { revenueData, servicePopularity, recentActivity } from '@/data/mockDashboard';
import { useAppointmentStore } from '@/store/useAppointmentStore';
import { useClientStore } from '@/store/useClientStore';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { useStaffStore } from '@/store/useStaffStore';
import { useServiceStore } from '@/store/useServiceStore';
import { useSalaryStore } from '@/store/useSalaryStore';
import { useHydration } from '@/hooks/useHydration';
import { formatCurrency, formatTime } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import {
  HiOutlineBanknotes,
  HiOutlineCalendarDays,
  HiOutlineUserPlus,
  HiOutlineUsers,
  HiOutlineCalendar,
  HiOutlineCreditCard,
  HiOutlineUser,
  HiOutlineStar,
  HiOutlineCube,
} from 'react-icons/hi2';

type FilterTab = 'last30' | 'today' | 'yesterday' | 'scheduled';

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
  const [activeFilter, setActiveFilter] = useState<FilterTab>('last30');
  const [dateFrom, setDateFrom] = useState('2026-03-07');
  const [dateTo, setDateTo] = useState('2026-04-06');

  const appointments = useAppointmentStore((s) => s.appointments);
  const clients = useClientStore((s) => s.clients);
  const invoices = useInvoiceStore((s) => s.invoices);
  const staff = useStaffStore((s) => s.staff);
  const services = useServiceStore((s) => s.services);
  const attendanceEntries = useSalaryStore((s) => s.attendanceEntries);

  const currentMonth = '2026-04';
  const attendanceSummary = useMemo(() => {
    const monthEntries = attendanceEntries.filter((a) => a.month === currentMonth);
    const totalStaff = monthEntries.length;
    const totalPresent = monthEntries.reduce((s, a) => s + a.daysPresent, 0);
    const totalAbsent = monthEntries.reduce((s, a) => s + a.daysAbsent, 0);
    const fullAttendance = monthEntries.filter((a) => a.daysAbsent === 0 && a.halfDays === 0).length;
    return { totalStaff, totalPresent, totalAbsent, fullAttendance };
  }, [attendanceEntries]);

  const todayStr = '2026-04-06';
  const yesterdayStr = '2026-04-05';

  // Filtered data based on active tab
  const filteredAppointments = useMemo(() => {
    switch (activeFilter) {
      case 'today':
        return appointments.filter((a) => a.date === todayStr);
      case 'yesterday':
        return appointments.filter((a) => a.date === yesterdayStr);
      case 'scheduled':
        return appointments.filter((a) => a.date === todayStr && a.status === 'scheduled');
      case 'last30':
      default:
        return appointments;
    }
  }, [appointments, activeFilter]);

  const filteredInvoices = useMemo(() => {
    switch (activeFilter) {
      case 'today':
        return invoices.filter((inv) => inv.createdAt === todayStr && inv.status === 'paid');
      case 'yesterday':
        return invoices.filter((inv) => inv.createdAt === yesterdayStr && inv.status === 'paid');
      case 'scheduled':
        return invoices.filter((inv) => inv.createdAt === todayStr && inv.status === 'paid');
      case 'last30':
      default:
        return invoices.filter((inv) => inv.status === 'paid');
    }
  }, [invoices, activeFilter]);

  const totalSales = useMemo(
    () => filteredInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0),
    [filteredInvoices]
  );

  const walkInClients = useMemo(() => {
    return filteredAppointments.filter((a) => a.notes?.toLowerCase().includes('walk-in') || a.notes?.toLowerCase().includes('walkin')).length;
  }, [filteredAppointments]);

  const newClients = useMemo(() => {
    const weekAgo = new Date('2026-03-30');
    return clients.filter((c) => new Date(c.createdAt) >= weekAgo).length;
  }, [clients]);

  const todayAppointments = useMemo(
    () => appointments.filter((a) => a.date === todayStr),
    [appointments]
  );

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

  if (!hydrated) {
    return (
      <PageWrapper title="Dashboard" subtitle="Welcome back! Here's what's happening today.">
        <div className="space-y-6 animate-pulse">
          <div className="h-10 bg-slate-200 rounded-lg w-2/3" />
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

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: 'last30', label: 'Last 30 days' },
    { key: 'today', label: 'Today' },
    { key: 'yesterday', label: 'Yesterday' },
    { key: 'scheduled', label: 'Scheduled Today' },
  ];

  return (
    <PageWrapper title="Dashboard" subtitle="Welcome back! Here's what's happening today.">
      <div className="space-y-6">

        {/* Filter Tabs Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === tab.key
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-slate-400 text-sm">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Stat Cards Row - MioSalon colored cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Sales Card - Yellow */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-3 right-3 opacity-20">
              <HiOutlineBanknotes className="w-12 h-12 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-700">Sales</p>
              <p className="text-3xl font-bold text-amber-900 mt-2">
                {formatCurrency(totalSales || 7590)}
              </p>
              <p className="text-xs text-amber-600 mt-1">Total Sales</p>
            </div>
          </div>

          {/* Appointments Card - Blue */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-3 right-3 opacity-20">
              <HiOutlineCalendarDays className="w-12 h-12 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700">Appointments</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {filteredAppointments.length || 12}
              </p>
              <p className="text-xs text-blue-600 mt-1">Scheduled Appointments</p>
            </div>
          </div>

          {/* Walk-in Clients Card - Red/Pink */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-3 right-3 opacity-20">
              <HiOutlineUsers className="w-12 h-12 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-700">Walk-in Clients</p>
              <p className="text-3xl font-bold text-red-900 mt-2">
                {walkInClients || 3}
              </p>
              <p className="text-xs text-red-600 mt-1">Walk-in Visits</p>
            </div>
          </div>

          {/* New Clients Card - Green */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-3 right-3 opacity-20">
              <HiOutlineUserPlus className="w-12 h-12 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-700">New Clients</p>
              <p className="text-3xl font-bold text-emerald-900 mt-2">
                {newClients || 4}
              </p>
              <p className="text-xs text-emerald-600 mt-1">Repeat &amp; New</p>
            </div>
          </div>
        </div>

        {/* Charts Row: Donut Chart + Sales Insight */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Revenue by Service">
            <ServicePopularityChart data={servicePopularity} />
          </Card>
          <Card title="Sales Insight">
            <RevenueChart data={revenueData} />
          </Card>
        </div>

        {/* Staff Attendance Overview */}
        <Card title="Staff Attendance — April 2026">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-blue-900">{attendanceSummary.totalStaff}</p>
              <p className="text-xs text-blue-600">Staff Tracked</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-emerald-900">{attendanceSummary.totalPresent}</p>
              <p className="text-xs text-emerald-600">Total Present Days</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-red-900">{attendanceSummary.totalAbsent}</p>
              <p className="text-xs text-red-600">Total Absent Days</p>
            </div>
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-violet-900">{attendanceSummary.fullAttendance}</p>
              <p className="text-xs text-violet-600">Full Attendance</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 px-4 text-slate-500 font-medium text-xs">Staff</th>
                  <th className="text-right py-2 px-4 text-slate-500 font-medium text-xs">Present</th>
                  <th className="text-right py-2 px-4 text-slate-500 font-medium text-xs">Absent</th>
                  <th className="text-right py-2 px-4 text-slate-500 font-medium text-xs">Half</th>
                  <th className="text-left py-2 px-4 text-slate-500 font-medium text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceEntries
                  .filter((a) => a.month === currentMonth)
                  .map((a) => {
                    const member = staff.find((s) => s.id === a.staffId);
                    const name = member ? `${member.firstName} ${member.lastName}` : a.staffId;
                    const perfect = a.daysAbsent === 0 && a.halfDays === 0;
                    return (
                      <tr key={a.staffId} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-2 px-4 font-medium text-slate-900">{name}</td>
                        <td className="py-2 px-4 text-right text-emerald-600">{a.daysPresent}</td>
                        <td className="py-2 px-4 text-right text-red-600">{a.daysAbsent}</td>
                        <td className="py-2 px-4 text-right text-amber-600">{a.halfDays}</td>
                        <td className="py-2 px-4">
                          {perfect ? (
                            <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">Full</span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">{a.daysAbsent}d absent</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Today's Appointments Table */}
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
                    <td colSpan={5} className="text-center py-12 text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <HiOutlineCalendarDays className="w-10 h-10 text-slate-300" />
                        <p className="font-medium">No Data Available</p>
                        <p className="text-xs">No appointments scheduled for today</p>
                      </div>
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

        {/* Recent Activity */}
        <Card title="Recent Activity">
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p className="font-medium">No SalesInsight Data</p>
                <p className="text-xs mt-1">No recent activity to show</p>
              </div>
            ) : (
              recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 bg-slate-50 rounded-lg">
                    {activityIcons[item.type] || <HiOutlineCalendar className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{item.message}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
