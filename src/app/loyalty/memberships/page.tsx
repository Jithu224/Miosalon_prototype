'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { DataTable } from '@/components/data-table/DataTable';
import { useLoyaltyStore } from '@/store/useLoyaltyStore';
import { useHydration } from '@/hooks/useHydration';
import { formatCurrency, generateId } from '@/lib/utils';
import { Membership } from '@/types/loyalty';
import toast from 'react-hot-toast';

const columns: ColumnDef<Membership, unknown>[] = [
  { accessorKey: 'name', header: 'Plan Name' },
  { accessorKey: 'price', header: 'Price', cell: ({ row }) => formatCurrency(row.original.price) },
  { accessorKey: 'validityDays', header: 'Validity', cell: ({ row }) => `${row.original.validityDays} days` },
  { accessorKey: 'discountPercentage', header: 'Discount', cell: ({ row }) => `${row.original.discountPercentage}%` },
  { accessorKey: 'description', header: 'Description' },
  { accessorKey: 'isActive', header: 'Status', cell: ({ row }) => <Badge variant={row.original.isActive ? 'success' : 'neutral'}>{row.original.isActive ? 'Active' : 'Inactive'}</Badge> },
];

export default function MembershipsPage() {
  const hydrated = useHydration();
  const { memberships, addMembership } = useLoyaltyStore();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', validityDays: '365', discountPercentage: '', description: '' });

  if (!hydrated) return <div className="p-6"><div className="h-64 bg-slate-200 rounded animate-pulse" /></div>;

  const handleAdd = () => {
    if (!form.name || !form.price || !form.discountPercentage) { toast.error('Fill required fields'); return; }
    addMembership({ id: generateId(), name: form.name, price: Number(form.price), validityDays: Number(form.validityDays), discountPercentage: Number(form.discountPercentage), applicableServiceIds: [], isActive: true, description: form.description });
    toast.success('Membership plan created'); setShowModal(false);
    setForm({ name: '', price: '', validityDays: '365', discountPercentage: '', description: '' });
  };

  return (
    <PageWrapper title="Memberships" subtitle={`${memberships.length} plans`} actions={<><Button variant="outline" href="/loyalty">Back</Button><Button onClick={() => setShowModal(true)}>Add Plan</Button></>}>
      <DataTable columns={columns} data={memberships} searchPlaceholder="Search plans..." />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Membership Plan" footer={<><Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button><Button onClick={handleAdd}>Create</Button></>}>
        <div className="space-y-4">
          <Input label="Plan Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="grid grid-cols-3 gap-4">
            <Input label="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Input label="Validity (days)" type="number" value={form.validityDays} onChange={(e) => setForm({ ...form, validityDays: e.target.value })} />
            <Input label="Discount %" type="number" value={form.discountPercentage} onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })} />
          </div>
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
      </Modal>
    </PageWrapper>
  );
}
