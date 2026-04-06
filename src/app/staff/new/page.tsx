'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useStaffStore } from '@/store/useStaffStore';
import { useHydration } from '@/hooks/useHydration';
import { generateId } from '@/lib/utils';
import { WorkingHours } from '@/types/staff';

const defaultWorkingHours: WorkingHours[] = [0, 1, 2, 3, 4, 5, 6].map((day) => ({
  day: day as WorkingHours['day'],
  startTime: '09:00',
  endTime: '18:00',
  isOff: day === 0,
}));

const STAFF_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316',
];

export default function AddStaffPage() {
  const hydrated = useHydration();
  const addStaff = useStaffStore((s) => s.addStaff);
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'stylist' as 'admin' | 'manager' | 'stylist' | 'therapist' | 'receptionist',
    commissionType: 'percentage' as 'percentage' | 'fixed' | 'tiered',
    commissionRate: '',
    joinDate: new Date().toISOString().split('T')[0],
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const color = STAFF_COLORS[Math.floor(Math.random() * STAFF_COLORS.length)];
    addStaff({
      id: generateId(),
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      role: form.role,
      serviceIds: [],
      workingHours: defaultWorkingHours,
      commissionType: form.commissionType,
      commissionRate: Number(form.commissionRate) || 0,
      isActive: true,
      joinDate: form.joinDate,
      color,
    });
    router.push('/staff');
  };

  if (!hydrated) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <PageWrapper title="Add Staff" subtitle="Add a new team member">
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
        </Card>

        <Card title="Role & Commission">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Role"
              value={form.role}
              onChange={(e) => update('role', e.target.value)}
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'manager', label: 'Manager' },
                { value: 'stylist', label: 'Stylist' },
                { value: 'therapist', label: 'Therapist' },
                { value: 'receptionist', label: 'Receptionist' },
              ]}
            />
            <Input
              label="Join Date"
              type="date"
              value={form.joinDate}
              onChange={(e) => update('joinDate', e.target.value)}
              required
            />
            <Select
              label="Commission Type"
              value={form.commissionType}
              onChange={(e) => update('commissionType', e.target.value)}
              options={[
                { value: 'percentage', label: 'Percentage' },
                { value: 'fixed', label: 'Fixed' },
                { value: 'tiered', label: 'Tiered' },
              ]}
            />
            <Input
              label="Commission Rate"
              type="number"
              value={form.commissionRate}
              onChange={(e) => update('commissionRate', e.target.value)}
              placeholder={form.commissionType === 'percentage' ? 'e.g. 30' : 'e.g. 500'}
            />
          </div>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit">Save Staff</Button>
          <Button type="button" variant="outline" onClick={() => router.push('/staff')}>
            Cancel
          </Button>
        </div>
      </form>
    </PageWrapper>
  );
}
