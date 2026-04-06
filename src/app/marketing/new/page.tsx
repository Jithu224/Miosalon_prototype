'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { useMarketingStore } from '@/store/useMarketingStore';
import { generateId } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CreateCampaignPage() {
  const router = useRouter();
  const { addCampaign } = useMarketingStore();
  const [form, setForm] = useState({ name: '', type: 'sms' as string, targetAudience: 'all' as string, message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) { toast.error('Fill required fields'); return; }
    addCampaign({
      id: generateId(), name: form.name, type: form.type as 'sms' | 'email' | 'whatsapp',
      status: 'draft', targetAudience: form.targetAudience as 'all' | 'active' | 'inactive' | 'birthday' | 'custom',
      message: form.message, recipientCount: 0, createdAt: new Date().toISOString().split('T')[0],
    });
    toast.success('Campaign created as draft');
    router.push('/marketing');
  };

  return (
    <PageWrapper title="Create Campaign" actions={<Button variant="outline" href="/marketing">Back</Button>}>
      <div className="grid grid-cols-2 gap-6">
        <Card title="Campaign Details">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Campaign Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Select label="Channel" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'sms' | 'email' | 'whatsapp' })} options={[
              { value: 'sms', label: 'SMS' }, { value: 'email', label: 'Email' }, { value: 'whatsapp', label: 'WhatsApp' },
            ]} />
            <Select label="Target Audience" value={form.targetAudience} onChange={(e) => setForm({ ...form, targetAudience: e.target.value as 'all' })} options={[
              { value: 'all', label: 'All Clients' }, { value: 'active', label: 'Active Clients' }, { value: 'inactive', label: 'Inactive Clients' }, { value: 'birthday', label: 'Birthday This Month' },
            ]} />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Message</label>
              <textarea className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Write your campaign message..." />
              {form.type === 'sms' && <p className="text-xs text-slate-400">{form.message.length}/160 characters</p>}
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit">Save as Draft</Button>
              <Button variant="outline" onClick={() => router.push('/marketing')}>Cancel</Button>
            </div>
          </form>
        </Card>
        <Card title="Preview">
          <div className="bg-slate-50 rounded-lg p-4 min-h-[200px]">
            {form.message ? (
              <div className="bg-white rounded-lg p-4 shadow-sm border max-w-xs">
                <p className="text-sm text-slate-700">{form.message}</p>
                <p className="text-xs text-slate-400 mt-2">via {form.type.toUpperCase()}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center mt-20">Message preview will appear here</p>
            )}
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
