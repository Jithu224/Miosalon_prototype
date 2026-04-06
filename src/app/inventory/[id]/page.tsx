'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useHydration } from '@/hooks/useHydration';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const hydrated = useHydration();
  const params = useParams();
  const { products, adjustStock, updateProduct } = useInventoryStore();
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustType, setAdjustType] = useState('purchase');

  if (!hydrated) return <div className="p-6"><div className="h-64 bg-slate-200 rounded animate-pulse" /></div>;

  const product = products.find((p) => p.id === params.id);
  if (!product) return <PageWrapper title="Product Not Found"><p>No product found with this ID.</p></PageWrapper>;

  const handleAdjust = () => {
    const qty = Number(adjustQty);
    if (!qty) { toast.error('Enter a valid quantity'); return; }
    const delta = adjustType === 'purchase' ? qty : -qty;
    adjustStock(product.id, delta);
    toast.success(`Stock ${adjustType === 'purchase' ? 'added' : 'reduced'} by ${qty}`);
    setAdjustQty('');
  };

  const isLow = product.stock <= product.minStock;

  return (
    <PageWrapper title={product.name} subtitle={product.sku} actions={<Button variant="outline" href="/inventory">Back to Inventory</Button>}>
      <div className="grid grid-cols-3 gap-6">
        <Card title="Product Details" className="col-span-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-slate-500">Category:</span> <span className="font-medium">{product.category}</span></div>
            <div><span className="text-slate-500">Brand:</span> <span className="font-medium">{product.brand || '-'}</span></div>
            <div><span className="text-slate-500">Sell Price:</span> <span className="font-medium">{formatCurrency(product.price)}</span></div>
            <div><span className="text-slate-500">Cost Price:</span> <span className="font-medium">{formatCurrency(product.costPrice)}</span></div>
            <div><span className="text-slate-500">Tax Rate:</span> <span className="font-medium">{product.taxRate}%</span></div>
            <div><span className="text-slate-500">Unit:</span> <span className="font-medium">{product.unit}</span></div>
            <div><span className="text-slate-500">Status:</span> <Badge variant={product.isActive ? 'success' : 'neutral'}>{product.isActive ? 'Active' : 'Inactive'}</Badge></div>
            <div><span className="text-slate-500">Profit Margin:</span> <span className="font-medium">{((product.price - product.costPrice) / product.price * 100).toFixed(0)}%</span></div>
          </div>
          {product.description && <p className="mt-4 text-sm text-slate-600">{product.description}</p>}
          <div className="mt-4 pt-4 border-t">
            <Button variant={product.isActive ? 'outline' : 'success'} size="sm" onClick={() => { updateProduct(product.id, { isActive: !product.isActive }); toast.success(`Product ${product.isActive ? 'deactivated' : 'activated'}`); }}>
              {product.isActive ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="Stock Level">
            <div className="text-center">
              <p className={`text-4xl font-bold ${isLow ? 'text-red-600' : 'text-slate-900'}`}>{product.stock}</p>
              <p className="text-sm text-slate-500 mt-1">{product.unit}s in stock</p>
              {isLow && <Badge variant="danger" className="mt-2">Low Stock</Badge>}
              <p className="text-xs text-slate-400 mt-2">Min alert: {product.minStock}</p>
            </div>
          </Card>

          <Card title="Adjust Stock">
            <div className="space-y-3">
              <Select label="Type" value={adjustType} onChange={(e) => setAdjustType(e.target.value)} options={[
                { value: 'purchase', label: 'Add Stock (Purchase)' },
                { value: 'sale', label: 'Remove (Sale)' },
                { value: 'internal-use', label: 'Remove (Internal Use)' },
                { value: 'damage', label: 'Remove (Damage)' },
              ]} />
              <Input label="Quantity" type="number" value={adjustQty} onChange={(e) => setAdjustQty(e.target.value)} placeholder="Enter quantity" />
              <Button onClick={handleAdjust} className="w-full">Adjust Stock</Button>
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
