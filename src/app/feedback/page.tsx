'use client';

import { ColumnDef } from '@tanstack/react-table';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/data-table/DataTable';
import { useFeedbackStore } from '@/store/useFeedbackStore';
import { useClientStore } from '@/store/useClientStore';
import { useStaffStore } from '@/store/useStaffStore';
import { useHydration } from '@/hooks/useHydration';
import { formatDate } from '@/lib/utils';
import { Feedback } from '@/types/feedback';
import { HiOutlineStar } from 'react-icons/hi2';

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <HiOutlineStar key={i} className={`w-4 h-4 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
    ))}
  </div>
);

export default function FeedbackPage() {
  const hydrated = useHydration();
  const { feedback, getAverageRating } = useFeedbackStore();
  const { clients } = useClientStore();
  const { staff } = useStaffStore();

  if (!hydrated) return <div className="p-6"><div className="h-64 bg-slate-200 rounded animate-pulse" /></div>;

  const avgRating = getAverageRating();
  const ratingDist = [5, 4, 3, 2, 1].map((r) => ({ rating: r, count: feedback.filter((f) => f.rating === r).length }));

  const columns: ColumnDef<Feedback, unknown>[] = [
    {
      accessorKey: 'clientId', header: 'Client',
      cell: ({ row }) => { const c = clients.find((cl) => cl.id === row.original.clientId); return c ? `${c.firstName} ${c.lastName}` : '-'; },
    },
    { accessorKey: 'rating', header: 'Rating', cell: ({ row }) => <Stars rating={row.original.rating} /> },
    { accessorKey: 'comment', header: 'Comment', cell: ({ row }) => <span className="text-slate-600 line-clamp-1">{row.original.comment || '-'}</span> },
    {
      accessorKey: 'staffId', header: 'Staff',
      cell: ({ row }) => { const s = staff.find((st) => st.id === row.original.staffId); return s ? `${s.firstName} ${s.lastName}` : '-'; },
    },
    { accessorKey: 'createdAt', header: 'Date', cell: ({ row }) => formatDate(row.original.createdAt) },
    {
      accessorKey: 'googleReviewSent', header: 'Google Review',
      cell: ({ row }) => <Badge variant={row.original.googleReviewSent ? 'success' : 'neutral'}>{row.original.googleReviewSent ? 'Sent' : 'Pending'}</Badge>,
    },
  ];

  return (
    <PageWrapper title="Feedback" subtitle={`${feedback.length} reviews collected`}>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="text-center">
          <p className="text-3xl font-bold text-slate-900">{avgRating.toFixed(1)}</p>
          <Stars rating={Math.round(avgRating)} />
          <p className="text-sm text-slate-500 mt-1">Average Rating</p>
        </Card>
        {ratingDist.slice(0, 3).map((d) => (
          <Card key={d.rating} className="text-center">
            <p className="text-2xl font-bold text-slate-900">{d.count}</p>
            <div className="flex items-center justify-center gap-1">
              <Stars rating={d.rating} />
            </div>
            <p className="text-sm text-slate-500 mt-1">{d.rating}-star reviews</p>
          </Card>
        ))}
      </div>

      <DataTable columns={columns} data={feedback} searchPlaceholder="Search feedback..." />
    </PageWrapper>
  );
}
