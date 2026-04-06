'use client';

import { ColumnDef } from '@tanstack/react-table';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/data-table/DataTable';
import { useMarketingStore } from '@/store/useMarketingStore';
import { useHydration } from '@/hooks/useHydration';
import { formatDate } from '@/lib/utils';
import { Campaign } from '@/types/marketing';
import { HiOutlineEnvelope, HiOutlineChatBubbleLeft, HiOutlineDevicePhoneMobile } from 'react-icons/hi2';

const typeIcons: Record<string, React.ReactNode> = {
  sms: <HiOutlineDevicePhoneMobile className="w-4 h-4" />,
  email: <HiOutlineEnvelope className="w-4 h-4" />,
  whatsapp: <HiOutlineChatBubbleLeft className="w-4 h-4 text-green-600" />,
};

const statusVariant: Record<string, 'success' | 'warning' | 'info' | 'neutral' | 'danger'> = {
  sent: 'success', scheduled: 'info', draft: 'neutral', cancelled: 'danger',
};

const columns: ColumnDef<Campaign, unknown>[] = [
  { accessorKey: 'name', header: 'Campaign' },
  { accessorKey: 'type', header: 'Type', cell: ({ row }) => <div className="flex items-center gap-2">{typeIcons[row.original.type]} <span className="capitalize">{row.original.type}</span></div> },
  { accessorKey: 'targetAudience', header: 'Audience', cell: ({ row }) => <span className="capitalize">{row.original.targetAudience}</span> },
  { accessorKey: 'recipientCount', header: 'Recipients' },
  { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant={statusVariant[row.original.status]}>{row.original.status}</Badge> },
  { accessorKey: 'sentAt', header: 'Sent', cell: ({ row }) => row.original.sentAt ? formatDate(row.original.sentAt) : '-' },
  { accessorKey: 'openRate', header: 'Open Rate', cell: ({ row }) => row.original.openRate ? `${row.original.openRate}%` : '-' },
];

export default function MarketingPage() {
  const hydrated = useHydration();
  const { campaigns } = useMarketingStore();

  if (!hydrated) return <div className="p-6"><div className="h-64 bg-slate-200 rounded animate-pulse" /></div>;

  return (
    <PageWrapper title="Marketing" subtitle={`${campaigns.length} campaigns`} actions={<Button href="/marketing/new">Create Campaign</Button>}>
      <DataTable columns={columns} data={campaigns} searchPlaceholder="Search campaigns..." />
    </PageWrapper>
  );
}
