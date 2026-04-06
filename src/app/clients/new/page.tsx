'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useClientStore } from '@/store/useClientStore';
import { useHydration } from '@/hooks/useHydration';
import { generateId } from '@/lib/utils';

export default function AddClientPage() {
  const hydrated = useHydration();
  const addClient = useClientStore((s) => s.addClient);
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    gender: 'female' as 'male' | 'female' | 'other',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    source: 'walk-in',
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    addClient({
      id: generateId(),
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      gender: form.gender,
      dateOfBirth: form.dateOfBirth || undefined,
      address: form.address || undefined,
      notes: form.notes || undefined,
      status: 'active',
      walletBalance: 0,
      rewardPoints: 0,
      visitCount: 0,
      totalSpent: 0,
      createdAt: today,
      tags: [],
      source: form.source,
    });
    router.push('/clients');
  };

  if (!hydrated) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <PageWrapper title="Add Client" subtitle="Register a new client">
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <Card title="Personal Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              required
            />
            <Input
              label="Last Name"
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              required
            />
            <Select
              label="Gender"
              value={form.gender}
              onChange={(e) => update('gender', e.target.value)}
              options={[
                { value: 'female', label: 'Female' },
                { value: 'male', label: 'Male' },
                { value: 'other', label: 'Other' },
              ]}
            />
            <Input
              label="Date of Birth"
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => update('dateOfBirth', e.target.value)}
            />
          </div>
        </Card>

        <Card title="Contact Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              required
            />
            <Input
              label="Phone"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Address
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
            />
          </div>
        </Card>

        <Card title="Additional Information">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notes
              </label>
              <textarea
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
              />
            </div>
            <Select
              label="Source"
              value={form.source}
              onChange={(e) => update('source', e.target.value)}
              options={[
                { value: 'walk-in', label: 'Walk-in' },
                { value: 'online', label: 'Online' },
                { value: 'referral', label: 'Referral' },
                { value: 'lead', label: 'Lead' },
              ]}
            />
          </div>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit">Save Client</Button>
          <Button type="button" variant="outline" onClick={() => router.push('/clients')}>
            Cancel
          </Button>
        </div>
      </form>
    </PageWrapper>
  );
}
