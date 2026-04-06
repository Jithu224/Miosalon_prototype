'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DataTable } from '@/components/data-table/DataTable';
import { useServiceStore } from '@/store/useServiceStore';
import { useHydration } from '@/hooks/useHydration';
import { formatCurrency, generateId } from '@/lib/utils';
import { Service } from '@/types/service';
import toast from 'react-hot-toast';

const columns: ColumnDef<Service, unknown>[] = [
  { accessorKey: 'name', header: 'Service Name' },
  { accessorKey: 'duration', header: 'Duration', cell: ({ row }) => `${row.original.duration} min` },
  { accessorKey: 'price', header: 'Price', cell: ({ row }) => formatCurrency(row.original.price) },
  { accessorKey: 'taxRate', header: 'Tax', cell: ({ row }) => `${row.original.taxRate}%` },
  { accessorKey: 'staffIds', header: 'Staff', cell: ({ row }) => `${row.original.staffIds.length} assigned` },
  {
    accessorKey: 'isActive', header: 'Status',
    cell: ({ row }) => <Badge variant={row.original.isActive ? 'success' : 'neutral'}>{row.original.isActive ? 'Active' : 'Inactive'}</Badge>,
  },
];

export default function ServicesPage() {
  const hydrated = useHydration();
  const { services, categories, addService } = useServiceStore();
  const [activeTab, setActiveTab] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', categoryId: '', duration: '30', price: '', taxRate: '18' });

  if (!hydrated) return <div className="p-6"><div className="h-8 bg-slate-200 rounded w-48 mb-6 animate-pulse" /><div className="h-64 bg-slate-200 rounded animate-pulse" /></div>;

  const tabs = [{ id: 'all', label: 'All', count: services.length }, ...categories.map((c) => ({ id: c.id, label: c.name, count: services.filter((s) => s.categoryId === c.id).length }))];
  const filtered = activeTab === 'all' ? services : services.filter((s) => s.categoryId === activeTab);

  const handleAdd = () => {
    if (!form.name || !form.categoryId || !form.price) { toast.error('Fill all required fields'); return; }
    addService({ id: generateId(), name: form.name, categoryId: form.categoryId, duration: Number(form.duration), price: Number(form.price), taxRate: Number(form.taxRate), staffIds: [], isActive: true });
    toast.success('Service added'); setShowModal(false);
    setForm({ name: '', categoryId: '', duration: '30', price: '', taxRate: '18' });
  };

  return (
    <PageWrapper title="Services" subtitle={`${services.length} services across ${categories.length} categories`} actions={<Button onClick={() => setShowModal(true)}>Add Service</Button>}>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <div className="mt-4"><DataTable columns={columns} data={filtered} searchPlaceholder="Search services..." /></div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Service" footer={<><Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button><Button onClick={handleAdd}>Save</Button></>}>
        <div className="space-y-4">
          <Input label="Service Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Select label="Category" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} options={categories.map((c) => ({ value: c.id, label: c.name }))} placeholder="Select category" />
          <div className="grid grid-cols-3 gap-4">
            <Input label="Duration (min)" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            <Input label="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Input label="Tax %" type="number" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: e.target.value })} />
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
