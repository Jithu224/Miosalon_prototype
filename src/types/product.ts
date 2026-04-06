export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand?: string;
  price: number;
  costPrice: number;
  taxRate: number;
  stock: number;
  minStock: number;
  unit: string;
  vendorId?: string;
  isActive: boolean;
  description?: string;
}

export interface Vendor {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface StockAdjustment {
  id: string;
  productId: string;
  type: 'purchase' | 'sale' | 'internal-use' | 'damage' | 'transfer';
  quantity: number;
  reason?: string;
  date: string;
}
