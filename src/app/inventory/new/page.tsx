'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { useInventoryStore } from '@/store/useInventoryStore';
import { generateId } from '@/lib/utils';
import toast from 'react-hot-toast';

const categoryOptions = [
  { value: 'Hair Care', label: 'Hair Care' },
  { value: 'Skin Care', label: 'Skin Care' },
  { value: 'Makeup', label: 'Makeup' },
  { value: 'Nails', label: 'Nails' },
  { value: 'Body Care', label: 'Body Care' },
  { value: 'Tools', label: 'Tools' },
];

export default function NewProductPage() {
  const router = useRouter();
  const { addProduct } = useInventoryStore();
  const [form, setForm] = useState({ name: '', sku: '', category: '', brand: '', price: '', costPrice: '', stock: '0', minStock: '5', unit: 'piece', taxRate: '18' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.sku || !form.category || !form.price) { toast.error('Fill required fields'); return; }
    addProduct({
      id: generateId(), name: form.name, sku: form.sku, category: form.category, brand: form.brand || undefined,
      price: Number(form.price), costPrice: Number(form.costPrice), stock: Number(form.stock),
      minStock: Number(form.minStock), unit: form.unit, taxRate: Number(form.taxRate), isActive: true,
    });
    toast.success('Product added');
    router.push('/inventory');
  };

  return (
    <PageWrapper title="Add Product" actions={<Button variant="outline" href="/inventory">Back</Button>}>
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} options={categoryOptions} placeholder="Select" />
            <Input label="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Sell Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <Input label="Cost Price (₹)" type="number" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} />
            <Input label="Tax %" type="number" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Current Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            <Input label="Min Stock Alert" type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} />
            <Input label="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit">Add Product</Button>
            <Button variant="outline" onClick={() => router.push('/inventory')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </PageWrapper>
  );
}
