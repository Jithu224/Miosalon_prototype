'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/data-table/DataTable';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useHydration } from '@/hooks/useHydration';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types/product';

const columns: ColumnDef<Product, unknown>[] = [
  { accessorKey: 'name', header: 'Product' },
  { accessorKey: 'sku', header: 'SKU' },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'brand', header: 'Brand' },
  { accessorKey: 'price', header: 'Price', cell: ({ row }) => formatCurrency(row.original.price) },
  {
    accessorKey: 'stock', header: 'Stock',
    cell: ({ row }) => {
      const p = row.original;
      const isLow = p.stock <= p.minStock;
      return <span className={isLow ? 'text-red-600 font-semibold' : ''}>{p.stock} {p.unit}s{isLow && ' ⚠️'}</span>;
    },
  },
  {
    accessorKey: 'isActive', header: 'Status',
    cell: ({ row }) => <Badge variant={row.original.isActive ? 'success' : 'neutral'}>{row.original.isActive ? 'Active' : 'Inactive'}</Badge>,
  },
];

export default function InventoryPage() {
  const hydrated = useHydration();
  const { products, getLowStock } = useInventoryStore();
  const router = useRouter();

  if (!hydrated) return <div className="p-6"><div className="h-64 bg-slate-200 rounded animate-pulse" /></div>;

  const lowStock = getLowStock();

  return (
    <PageWrapper title="Inventory" subtitle={`${products.length} products${lowStock.length > 0 ? ` · ${lowStock.length} low stock` : ''}`} actions={<Button href="/inventory/new">Add Product</Button>}>
      {lowStock.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-medium text-red-700">Low Stock Alert: {lowStock.map((p) => p.name).join(', ')}</p>
        </div>
      )}
      <DataTable columns={columns} data={products} searchPlaceholder="Search products..." onRowClick={(p) => router.push(`/inventory/${p.id}`)} />
    </PageWrapper>
  );
}
