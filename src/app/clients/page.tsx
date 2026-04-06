'use client';

import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { DataTable } from '@/components/data-table/DataTable';
import { useClientStore } from '@/store/useClientStore';
import { useHydration } from '@/hooks/useHydration';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Client } from '@/types/client';

const statusVariant: Record<Client['status'], 'success' | 'neutral' | 'danger'> = {
  active: 'success',
  inactive: 'neutral',
  churned: 'danger',
};

const columns: ColumnDef<Client, unknown>[] = [
  {
    accessorKey: 'firstName',
    header: 'Name',
    cell: ({ row }) => {
      const c = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar name={`${c.firstName} ${c.lastName}`} size="sm" />
          <span className="font-medium text-slate-900">
            {c.firstName} {c.lastName}
          </span>
        </div>
      );
    },
  },
  { accessorKey: 'phone', header: 'Phone' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'lastVisit',
    header: 'Last Visit',
    cell: ({ getValue }) => {
      const v = getValue() as string | undefined;
      return v ? formatDate(v) : '-';
    },
  },
  {
    accessorKey: 'totalSpent',
    header: 'Total Spent',
    cell: ({ getValue }) => formatCurrency(getValue() as number),
  },
  { accessorKey: 'visitCount', header: 'Visits' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const s = getValue() as Client['status'];
      return (
        <Badge variant={statusVariant[s]}>
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </Badge>
      );
    },
  },
];

export default function ClientsPage() {
  const hydrated = useHydration();
  const clients = useClientStore((s) => s.clients);
  const router = useRouter();

  if (!hydrated) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <PageWrapper
      title="Clients"
      actions={<Button href="/clients/new">Add Client</Button>}
    >
      <DataTable
        columns={columns}
        data={clients}
        searchPlaceholder="Search clients..."
        onRowClick={(client) => router.push(`/clients/${client.id}`)}
      />
    </PageWrapper>
  );
}
