'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/data-table/DataTable';
import { useStaffStore } from '@/store/useStaffStore';
import { useHydration } from '@/hooks/useHydration';
import { Staff } from '@/types/staff';

const roleVariant: Record<Staff['role'], 'purple' | 'info' | 'success' | 'orange' | 'neutral'> = {
  admin: 'purple',
  manager: 'info',
  stylist: 'success',
  therapist: 'orange',
  receptionist: 'neutral',
};

const columns: ColumnDef<Staff, unknown>[] = [
  {
    accessorKey: 'firstName',
    header: 'Name',
    cell: ({ row }) => {
      const s = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar
            name={`${s.firstName} ${s.lastName}`}
            size="sm"
            color={s.color}
          />
          <span className="font-medium text-slate-900">
            {s.firstName} {s.lastName}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ getValue }) => {
      const r = getValue() as Staff['role'];
      return (
        <Badge variant={roleVariant[r]}>
          {r.charAt(0).toUpperCase() + r.slice(1)}
        </Badge>
      );
    },
  },
  { accessorKey: 'phone', header: 'Phone' },
  {
    accessorKey: 'commissionRate',
    header: 'Commission',
    cell: ({ row }) => {
      const s = row.original;
      return s.commissionType === 'percentage'
        ? `${s.commissionRate}%`
        : `Fixed - ${s.commissionRate}`;
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ getValue }) => {
      const active = getValue() as boolean;
      return (
        <Badge variant={active ? 'success' : 'neutral'}>
          {active ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
  },
];

export default function StaffPage() {
  const hydrated = useHydration();
  const staff = useStaffStore((s) => s.staff);
  const router = useRouter();
  const [view, setView] = useState<'grid' | 'table'>('grid');

  if (!hydrated) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <PageWrapper
      title="Staff"
      actions={
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === 'grid'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => setView('grid')}
            >
              Grid
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === 'table'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => setView('table')}
            >
              Table
            </button>
          </div>
          <Button href="/staff/new">Add Staff</Button>
        </div>
      }
    >
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {staff.map((member) => (
            <Card
              key={member.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <div
                onClick={() => router.push(`/staff/${member.id}`)}
                className="flex flex-col items-center text-center"
              >
                <Avatar
                  name={`${member.firstName} ${member.lastName}`}
                  size="lg"
                  color={member.color}
                />
                <h3 className="mt-3 font-semibold text-slate-900">
                  {member.firstName} {member.lastName}
                </h3>
                <Badge
                  variant={roleVariant[member.role]}
                  className="mt-1"
                >
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                </Badge>
                <p className="mt-2 text-sm text-slate-500">{member.phone}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {member.serviceIds.length} service
                  {member.serviceIds.length !== 1 ? 's' : ''}
                </p>
                <Badge
                  variant={member.isActive ? 'success' : 'neutral'}
                  className="mt-2"
                >
                  {member.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={staff}
          searchPlaceholder="Search staff..."
          onRowClick={(member) => router.push(`/staff/${member.id}`)}
        />
      )}
    </PageWrapper>
  );
}
