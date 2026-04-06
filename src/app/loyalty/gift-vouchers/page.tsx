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
import { formatCurrency, formatDate, generateId } from '@/lib/utils';
import { GiftVoucher } from '@/types/loyalty';
import toast from 'react-hot-toast';

const statusVariant: Record<string, 'success' | 'neutral' | 'danger'> = { active: 'success', redeemed: 'neutral', expired: 'danger' };

const columns: ColumnDef<GiftVoucher, unknown>[] = [
  { accessorKey: 'code', header: 'Code' },
  { accessorKey: 'amount', header: 'Amount', cell: ({ row }) => formatCurrency(row.original.amount) },
  { accessorKey: 'balance', header: 'Balance', cell: ({ row }) => formatCurrency(row.original.balance) },
  { accessorKey: 'expiryDate', header: 'Expiry', cell: ({ row }) => formatDate(row.original.expiryDate) },
  { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant={statusVariant[row.original.status]}>{row.original.status}</Badge> },
];

export default function GiftVouchersPage() {
  const hydrated = useHydration();
  const { giftVouchers, addGiftVoucher } = useLoyaltyStore();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ amount: '', expiryDate: '' });

  if (!hydrated) return <div className="p-6"><div className="h-64 bg-slate-200 rounded animate-pulse" /></div>;

  const handleAdd = () => {
    if (!form.amount || !form.expiryDate) { toast.error('Fill required fields'); return; }
    const code = `GIFT-${String(giftVouchers.length + 1).padStart(3, '0')}`;
    addGiftVoucher({ id: generateId(), code, amount: Number(form.amount), balance: Number(form.amount), expiryDate: form.expiryDate, status: 'active', createdAt: new Date().toISOString().split('T')[0] });
    toast.success(`Voucher ${code} created`); setShowModal(false); setForm({ amount: '', expiryDate: '' });
  };

  return (
    <PageWrapper title="Gift Vouchers" subtitle={`${giftVouchers.length} vouchers`} actions={<><Button variant="outline" href="/loyalty">Back</Button><Button onClick={() => setShowModal(true)}>Issue Voucher</Button></>}>
      <DataTable columns={columns} data={giftVouchers} searchPlaceholder="Search vouchers..." />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Issue Gift Voucher" size="sm" footer={<><Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button><Button onClick={handleAdd}>Issue</Button></>}>
        <div className="space-y-4">
          <Input label="Amount (₹)" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <Input label="Expiry Date" type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
        </div>
      </Modal>
    </PageWrapper>
  );
}
