'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/data-table/DataTable';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { useClientStore } from '@/store/useClientStore';
import { useHydration } from '@/hooks/useHydration';
import { Invoice } from '@/types/invoice';
import { formatCurrency, formatDate } from '@/lib/utils';

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'neutral' | 'danger'> = {
  paid: 'success',
  partial: 'warning',
  draft: 'neutral',
  void: 'danger',
};

export default function BillingPage() {
  const hydrated = useHydration();
  const { invoices } = useInvoiceStore();
  const { clients } = useClientStore();
  const router = useRouter();

  const columns: ColumnDef<Invoice, unknown>[] = useMemo(
    () => [
      {
        accessorKey: 'invoiceNumber',
        header: 'Invoice #',
        cell: ({ getValue }) => (
          <span className="font-medium text-blue-600">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Date',
        cell: ({ getValue }) => formatDate(getValue() as string),
      },
      {
        accessorKey: 'clientId',
        header: 'Client',
        cell: ({ getValue }) => {
          const client = clients.find((c) => c.id === (getValue() as string));
          return client ? `${client.firstName} ${client.lastName}` : 'Unknown';
        },
      },
      {
        accessorKey: 'grandTotal',
        header: 'Amount',
        cell: ({ getValue }) => (
          <span className="font-medium">{formatCurrency(getValue() as number)}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue() as string;
          return (
            <Badge variant={STATUS_VARIANT[status] || 'neutral'}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          );
        },
      },
      {
        id: 'payment',
        header: 'Payment',
        cell: ({ row }) => {
          const inv = row.original;
          if (inv.payments.length === 0) return <span className="text-slate-400">-</span>;
          return (
            <span className="text-sm text-slate-600">
              {inv.payments.map((p) => `${p.mode}: ${formatCurrency(p.amount)}`).join(', ')}
            </span>
          );
        },
      },
    ],
    [clients]
  );

  if (!hydrated) {
    return (
      <PageWrapper title="Billing">
        <div className="flex items-center justify-center h-96 text-slate-400">Loading...</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Billing"
      subtitle="Manage invoices and payments"
      actions={<Button href="/quick-sale">Create Invoice</Button>}
    >
      <DataTable
        columns={columns}
        data={invoices}
        searchPlaceholder="Search invoices..."
        onRowClick={(inv) => router.push(`/billing/${inv.id}`)}
      />
    </PageWrapper>
  );
}
