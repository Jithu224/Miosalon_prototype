'use client';

import { useParams } from 'next/navigation';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useLeadStore } from '@/store/useLeadStore';
import { useHydration } from '@/hooks/useHydration';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

const statusVariant: Record<string, 'info' | 'warning' | 'purple' | 'success' | 'danger'> = {
  new: 'info', contacted: 'warning', 'follow-up': 'purple', converted: 'success', lost: 'danger',
};

export default function LeadDetailPage() {
  const hydrated = useHydration();
  const params = useParams();
  const { leads, updateStatus, updateLead } = useLeadStore();

  if (!hydrated) return <div className="p-6"><div className="h-64 bg-slate-200 rounded animate-pulse" /></div>;

  const lead = leads.find((l) => l.id === params.id);
  if (!lead) return <PageWrapper title="Lead Not Found"><p>No lead found.</p></PageWrapper>;

  return (
    <PageWrapper title={lead.name} subtitle={lead.phone} actions={<Button variant="outline" href="/leads">Back to Leads</Button>}>
      <div className="grid grid-cols-3 gap-6">
        <Card title="Lead Details" className="col-span-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-slate-500">Name:</span> <span className="font-medium">{lead.name}</span></div>
            <div><span className="text-slate-500">Phone:</span> <span className="font-medium">{lead.phone}</span></div>
            <div><span className="text-slate-500">Email:</span> <span className="font-medium">{lead.email || '-'}</span></div>
            <div><span className="text-slate-500">Source:</span> <span className="font-medium capitalize">{lead.source}</span></div>
            <div><span className="text-slate-500">Created:</span> <span className="font-medium">{formatDate(lead.createdAt)}</span></div>
            <div><span className="text-slate-500">Last Contacted:</span> <span className="font-medium">{lead.lastContactedAt ? formatDate(lead.lastContactedAt) : 'Never'}</span></div>
            <div><span className="text-slate-500">Status:</span> <Badge variant={statusVariant[lead.status]}>{lead.status}</Badge></div>
          </div>
          {lead.notes && <div className="mt-4 pt-4 border-t"><p className="text-sm text-slate-600">{lead.notes}</p></div>}
        </Card>
        <Card title="Actions">
          <div className="space-y-2">
            {lead.status !== 'converted' && lead.status !== 'lost' && (
              <>
                <Button className="w-full" variant="success" onClick={() => { updateStatus(lead.id, 'converted'); toast.success('Lead converted!'); }}>Convert to Client</Button>
                <Button className="w-full" variant="outline" onClick={() => { updateLead(lead.id, { lastContactedAt: new Date().toISOString().split('T')[0] }); updateStatus(lead.id, 'contacted'); toast.success('Marked contacted'); }}>Mark Contacted</Button>
                <Button className="w-full" variant="danger" onClick={() => { updateStatus(lead.id, 'lost'); toast.success('Marked lost'); }}>Mark Lost</Button>
              </>
            )}
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
