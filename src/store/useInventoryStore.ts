import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';
import { mockProducts } from '@/data/mockProducts';

interface InventoryStore {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  getLowStock: () => Product[];
  adjustStock: (id: string, quantity: number) => void;
}

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      products: mockProducts,
      addProduct: (product) =>
        set((s) => ({ products: [...s.products, product] })),
      updateProduct: (id, data) =>
        set((s) => ({
          products: s.products.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),
      deleteProduct: (id) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
      getProduct: (id) => get().products.find((p) => p.id === id),
      getLowStock: () =>
        get().products.filter((p) => p.stock <= p.minStock),
      adjustStock: (id, quantity) =>
        set((s) => ({
          products: s.products.map((p) =>
            p.id === id
              ? { ...p, stock: p.stock + quantity }
              : p
          ),
        })),
    }),
    { name: 'miosalon-inventory' }
  )
);
