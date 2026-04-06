'use client';

import { useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { useLeadStore } from '@/store/useLeadStore';
import { useHydration } from '@/hooks/useHydration';
import { generateId, formatDate } from '@/lib/utils';
import { Lead } from '@/types/lead';
import toast from 'react-hot-toast';

const statusConfig: Record<string, { label: string; variant: 'info' | 'warning' | 'purple' | 'success' | 'danger'; color: string }> = {
  new: { label: 'New', variant: 'info', color: 'border-blue-400' },
  contacted: { label: 'Contacted', variant: 'warning', color: 'border-yellow-400' },
  'follow-up': { label: 'Follow Up', variant: 'purple', color: 'border-purple-400' },
  converted: { label: 'Converted', variant: 'success', color: 'border-emerald-400' },
  lost: { label: 'Lost', variant: 'danger', color: 'border-red-400' },
};

export default function LeadsPage() {
  const hydrated = useHydration();
  const { leads, addLead, updateStatus } = useLeadStore();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', source: 'website' });

  if (!hydrated) return <div className="p-6"><div className="h-64 bg-slate-200 rounded animate-pulse" /></div>;

  const handleAdd = () => {
    if (!form.name || !form.phone) { toast.error('Name and phone required'); return; }
    addLead({ id: generateId(), name: form.name, phone: form.phone, email: form.email || undefined, source: form.source as Lead['source'], interestedServices: [], status: 'new', createdAt: new Date().toISOString().split('T')[0] });
    toast.success('Lead added'); setShowModal(false); setForm({ name: '', phone: '', email: '', source: 'website' });
  };

  const columns = ['new', 'contacted', 'follow-up', 'converted', 'lost'] as const;

  return (
    <PageWrapper title="Leads" subtitle={`${leads.length} total leads`} actions={<Button onClick={() => setShowModal(true)}>Add Lead</Button>}>
      <div className="grid grid-cols-5 gap-4">
        {columns.map((status) => {
          const col = statusConfig[status];
          const colLeads = leads.filter((l) => l.status === status);
          return (
            <div key={status} className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={col.variant}>{col.label}</Badge>
                <span className="text-xs text-slate-400">{colLeads.length}</span>
              </div>
              <div className="space-y-2">
                {colLeads.map((lead) => (
                  <Card key={lead.id} className={`border-l-4 ${col.color}`} padding={false}>
                    <div className="p-3">
                      <p className="font-medium text-sm text-slate-900">{lead.name}</p>
                      <p className="text-xs text-slate-500">{lead.phone}</p>
                      {lead.notes && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{lead.notes}</p>}
                      <p className="text-xs text-slate-400 mt-1">{formatDate(lead.createdAt)}</p>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {status !== 'converted' && status !== 'lost' && (
                          <>
                            {status === 'new' && <button className="text-xs px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded" onClick={() => { updateStatus(lead.id, 'contacted'); toast.success('Marked contacted'); }}>Contact</button>}
                            {status === 'contacted' && <button className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded" onClick={() => { updateStatus(lead.id, 'follow-up'); toast.success('Moved to follow-up'); }}>Follow Up</button>}
                            <button className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded" onClick={() => { updateStatus(lead.id, 'converted'); toast.success('Converted!'); }}>Convert</button>
                            <button className="text-xs px-2 py-0.5 bg-red-50 text-red-700 rounded" onClick={() => { updateStatus(lead.id, 'lost'); toast.success('Marked lost'); }}>Lost</button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
                {colLeads.length === 0 && <p className="text-xs text-slate-300 text-center py-4">No leads</p>}
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Lead" size="sm" footer={<><Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button><Button onClick={handleAdd}>Add</Button></>}>
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Select label="Source" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} options={[
            { value: 'website', label: 'Website' }, { value: 'social-media', label: 'Social Media' },
            { value: 'walk-in', label: 'Walk-in' }, { value: 'referral', label: 'Referral' }, { value: 'ad', label: 'Advertisement' },
          ]} />
        </div>
      </Modal>
    </PageWrapper>
  );
}
