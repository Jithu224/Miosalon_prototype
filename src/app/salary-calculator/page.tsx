'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import toast from 'react-hot-toast';
import {
  HiOutlineCalculator,
  HiOutlineArrowDownTray,
  HiOutlineCog6Tooth,
  HiOutlineBanknotes,
} from 'react-icons/hi2';

import { useHydration } from '@/hooks/useHydration';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { MonthSelector } from '@/components/salary/MonthSelector';
import { SalaryStatCards } from '@/components/salary/SalaryStatCards';
import { EmptyState } from '@/components/ui/EmptyState';
import { DataTable } from '@/components/data-table/DataTable';
import { useSalaryStore } from '@/store/useSalaryStore';
import { useStaffStore } from '@/store/useStaffStore';
import { useRoleStore, ROLE_PERMISSIONS } from '@/store/useRoleStore';
import { formatCurrency, formatMonth } from '@/lib/utils';
import { exportSalaryToCSV } from '@/lib/exportUtils';
import { SalaryRecord } from '@/types/salary';

const statusBadgeVariant: Record<string, 'info' | 'success' | 'neutral'> = {
  draft: 'info',
  approved: 'success',
  paid: 'neutral',
};

export default function SalaryCalculatorPage() {
  const hydrated = useHydration();
  const router = useRouter();
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));

  const [selectedStaffId, setSelectedStaffId] = useState('');
  const { role, staffId: roleStaffId } = useRoleStore();
  const perms = ROLE_PERMISSIONS[role];
  const staff = useStaffStore((s) => s.staff);
  const salaryRecords = useSalaryStore((s) => s.salaryRecords);
  const salaryProfiles = useSalaryStore((s) => s.salaryProfiles);
  const calculateAllSalaries = useSalaryStore((s) => s.calculateAllSalaries);
  const calculateSalary = useSalaryStore((s) => s.calculateSalary);

  // Role-based filtering: staff can only see their own record
  const allRecords = useMemo(() => salaryRecords.filter((r) => r.month === month), [salaryRecords, month]);
  const records = useMemo(() => {
    if (perms.canViewAllStaff) return allRecords;
    return allRecords.filter((r) => r.staffId === roleStaffId);
  }, [allRecords, perms.canViewAllStaff, roleStaffId]);
  const configuredStaff = useMemo(() => staff.filter((s) => s.isActive && salaryProfiles.some((p) => p.staffId === s.id)), [staff, salaryProfiles]);

  const staffMap = useMemo(() => {
    const map: Record<string, { name: string; avatar?: string; color: string }> = {};
    staff.forEach((s) => {
      map[s.id] = {
        name: `${s.firstName} ${s.lastName}`,
        avatar: s.avatar,
        color: s.color,
      };
    });
    return map;
  }, [staff]);

  const stats = useMemo(() => {
    return {
      totalOutflow: records.reduce((sum, r) => sum + r.netSalary, 0),
      totalCommissions: records.reduce((sum, r) => sum + r.commission, 0),
      totalDeductions: records.reduce((sum, r) => sum + r.totalDeductions, 0),
      staffCount: records.length,
    };
  }, [records]);

  const handleCalculateAll = () => {
    const results = calculateAllSalaries(month);
    toast.success(`Calculated salaries for ${results.length} staff members`);
  };

  const handleCalculateIndividual = () => {
    if (!selectedStaffId) { toast.error('Select a staff member first'); return; }
    const result = calculateSalary(selectedStaffId, month);
    if (result) {
      const s = staff.find((st) => st.id === selectedStaffId);
      toast.success(`Salary calculated for ${s ? s.firstName + ' ' + s.lastName : 'staff'}`);
    } else {
      toast.error('Could not calculate — check salary profile');
    }
  };

  const handleExportCSV = () => {
    const staffNames: Record<string, string> = {};
    Object.entries(staffMap).forEach(([id, s]) => {
      staffNames[id] = s.name;
    });
    exportSalaryToCSV(records, staffNames, month);
    toast.success('CSV exported successfully');
  };

  const columns = useMemo<ColumnDef<SalaryRecord, unknown>[]>(
    () => [
      {
        accessorKey: 'staffId',
        header: 'Name',
        cell: ({ row }) => {
          const staffInfo = staffMap[row.original.staffId];
          const name = staffInfo?.name || row.original.staffId;
          return (
            <div className="flex items-center gap-3">
              <Avatar
                name={name}
                src={staffInfo?.avatar}
                color={staffInfo?.color}
                size="sm"
              />
              <span className="font-medium text-slate-900">{name}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'baseSalary',
        header: 'Base Salary',
        cell: ({ getValue }) => formatCurrency(getValue() as number),
      },
      {
        accessorKey: 'commission',
        header: 'Commission',
        cell: ({ getValue }) => formatCurrency(getValue() as number),
      },
      {
        id: 'incentives',
        header: 'Incentives',
        cell: ({ row }) => {
          const total = row.original.incentives.reduce((s, i) => s + i.amount, 0);
          return formatCurrency(total);
        },
      },
      {
        accessorKey: 'tips',
        header: 'Tips',
        cell: ({ getValue }) => formatCurrency(getValue() as number),
      },
      {
        accessorKey: 'grossSalary',
        header: 'Gross',
        cell: ({ getValue }) => (
          <span className="font-medium">{formatCurrency(getValue() as number)}</span>
        ),
      },
      {
        accessorKey: 'totalDeductions',
        header: 'Deductions',
        cell: ({ getValue }) => (
          <span className="text-red-600">{formatCurrency(getValue() as number)}</span>
        ),
      },
      {
        accessorKey: 'netSalary',
        header: 'Net Salary',
        cell: ({ getValue }) => (
          <span className="font-semibold text-emerald-700">{formatCurrency(getValue() as number)}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue() as string;
          return (
            <Badge variant={statusBadgeVariant[status] || 'neutral'}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          );
        },
      },
    ],
    [staffMap]
  );

  if (!hydrated) {
    return (
      <PageWrapper title="Salary Calculator">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-slate-200 rounded w-48" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-xl" />
            ))}
          </div>
          <div className="h-64 bg-slate-200 rounded-xl" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={role === 'staff' ? 'My Salary' : 'Salary Calculator'} subtitle={formatMonth(month)}>
      {/* Role indicator banner */}
      {role !== 'owner' && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${role === 'manager' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-amber-50 border border-amber-200 text-amber-700'}`}>
          Viewing as <strong>{ROLE_PERMISSIONS[role].label}</strong>
          {role === 'staff' && ' — You can only view your own salary and payslip.'}
          {role === 'manager' && ' — You can calculate and review salaries, but cannot approve or mark as paid.'}
        </div>
      )}

      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <MonthSelector value={month} onChange={setMonth} />
        {perms.canCalculateSalary && (
          <>
            <Button onClick={handleCalculateAll}>
              <HiOutlineCalculator className="w-4 h-4" />
              Calculate All
            </Button>
            <div className="border-l border-slate-300 pl-3 flex items-center gap-2">
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select staff...</option>
                {configuredStaff.map((s) => (
                  <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                ))}
              </select>
              <Button variant="outline" onClick={handleCalculateIndividual} disabled={!selectedStaffId}>
                Calculate Individual
              </Button>
            </div>
          </>
        )}
        {perms.canExport && (
          <Button variant="outline" onClick={handleExportCSV} disabled={records.length === 0}>
            <HiOutlineArrowDownTray className="w-4 h-4" />
            Export CSV
          </Button>
        )}
        {perms.canConfigureSalary && (
          <Button variant="outline" href="/salary-calculator/setup">
            <HiOutlineCog6Tooth className="w-4 h-4" />
            Setup
          </Button>
        )}
        {perms.canRecordAdvances && (
          <Button variant="outline" href="/salary-calculator/advances">
            <HiOutlineBanknotes className="w-4 h-4" />
            Advances
          </Button>
        )}
      </div>

      {/* Stat Cards */}
      <div className="mb-6">
        <SalaryStatCards
          totalOutflow={stats.totalOutflow}
          totalCommissions={stats.totalCommissions}
          totalDeductions={stats.totalDeductions}
          staffCount={stats.staffCount}
        />
      </div>

      {/* Data Table or Empty State */}
      {records.length > 0 ? (
        <DataTable
          columns={columns}
          data={records}
          searchPlaceholder="Search staff..."
          onRowClick={(record) =>
            router.push(`/salary-calculator/${record.staffId}?month=${month}`)
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12">
          <EmptyState
            title="No salary data for this month"
            description="Configure salary profiles in Setup, then click Calculate All to generate salary records."
            action={
              <div className="flex items-center gap-3">
                <Button variant="outline" href="/salary-calculator/setup">
                  Go to Setup
                </Button>
                <Button onClick={handleCalculateAll}>
                  <HiOutlineCalculator className="w-4 h-4" />
                  Calculate All
                </Button>
              </div>
            }
          />
        </div>
      )}
    </PageWrapper>
  );
}
