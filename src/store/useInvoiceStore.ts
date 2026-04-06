import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Invoice } from '@/types/invoice';

const mockInvoices: Invoice[] = [
  {
    id: 'inv-1', invoiceNumber: 'INV-00001', clientId: 'client-9', appointmentId: 'apt-5',
    lineItems: [
      { id: 'li-1', type: 'service', itemId: 'svc-7', name: 'Gold Facial', quantity: 1, unitPrice: 1500, discount: 0, taxRate: 18, total: 1770 },
    ],
    subtotal: 1500, discountTotal: 0, taxTotal: 270, grandTotal: 1770, tip: 100,
    payments: [{ mode: 'UPI', amount: 1870 }],
    status: 'paid', staffId: 'staff-2', createdAt: '2026-04-05', notes: '',
  },
  {
    id: 'inv-2', invoiceNumber: 'INV-00002', clientId: 'client-2', appointmentId: 'apt-6',
    lineItems: [
      { id: 'li-2', type: 'service', itemId: 'svc-1', name: 'Haircut - Men', quantity: 1, unitPrice: 300, discount: 0, taxRate: 18, total: 354 },
    ],
    subtotal: 300, discountTotal: 0, taxTotal: 54, grandTotal: 354, tip: 50,
    payments: [{ mode: 'Cash', amount: 404 }],
    status: 'paid', staffId: 'staff-1', createdAt: '2026-04-05',
  },
  {
    id: 'inv-3', invoiceNumber: 'INV-00003', clientId: 'client-13', appointmentId: 'apt-7',
    lineItems: [
      { id: 'li-3', type: 'service', itemId: 'svc-8', name: 'Cleanup', quantity: 1, unitPrice: 500, discount: 0, taxRate: 18, total: 590 },
      { id: 'li-4', type: 'service', itemId: 'svc-11', name: 'Classic Manicure', quantity: 1, unitPrice: 400, discount: 0, taxRate: 18, total: 472 },
    ],
    subtotal: 900, discountTotal: 0, taxTotal: 162, grandTotal: 1062, tip: 200,
    payments: [{ mode: 'Card', amount: 1262 }],
    status: 'paid', staffId: 'staff-4', createdAt: '2026-04-05',
  },
  {
    id: 'inv-4', invoiceNumber: 'INV-00004', clientId: 'client-4', appointmentId: 'apt-8',
    lineItems: [
      { id: 'li-5', type: 'service', itemId: 'svc-1', name: 'Haircut - Men', quantity: 1, unitPrice: 300, discount: 0, taxRate: 18, total: 354 },
      { id: 'li-6', type: 'product', itemId: 'prod-4', name: 'Mamaearth Onion Hair Oil', quantity: 1, unitPrice: 499, discount: 0, taxRate: 18, total: 588.82 },
    ],
    subtotal: 799, discountTotal: 0, taxTotal: 143.82, grandTotal: 942.82, tip: 0,
    payments: [{ mode: 'UPI', amount: 942.82 }],
    status: 'paid', staffId: 'staff-3', createdAt: '2026-04-04',
  },
  {
    id: 'inv-5', invoiceNumber: 'INV-00005', clientId: 'client-5', appointmentId: undefined,
    lineItems: [
      { id: 'li-7', type: 'product', itemId: 'prod-1', name: 'Lakme Absolute Skin Dew Serum Foundation', quantity: 2, unitPrice: 850, discount: 100, taxRate: 18, total: 1888 },
    ],
    subtotal: 1700, discountTotal: 100, taxTotal: 288, grandTotal: 1888, tip: 0,
    payments: [{ mode: 'Wallet', amount: 300 }, { mode: 'Card', amount: 1588 }],
    status: 'paid', staffId: 'staff-8', createdAt: '2026-04-03',
  },
  {
    id: 'inv-6', invoiceNumber: 'INV-00006', clientId: 'client-25', appointmentId: undefined,
    lineItems: [
      { id: 'li-8', type: 'service', itemId: 'svc-5', name: 'Keratin Treatment', quantity: 1, unitPrice: 5000, discount: 500, taxRate: 18, total: 5310 },
    ],
    subtotal: 5000, discountTotal: 500, taxTotal: 810, grandTotal: 5310, tip: 500,
    payments: [{ mode: 'Card', amount: 5810 }],
    status: 'paid', staffId: 'staff-1', createdAt: '2026-04-02',
  },
  {
    id: 'inv-7', invoiceNumber: 'INV-00007', clientId: 'client-7', appointmentId: undefined,
    lineItems: [
      { id: 'li-9', type: 'service', itemId: 'svc-16', name: 'Swedish Massage', quantity: 1, unitPrice: 2000, discount: 0, taxRate: 18, total: 2360 },
      { id: 'li-10', type: 'service', itemId: 'svc-19', name: 'Body Scrub', quantity: 1, unitPrice: 1800, discount: 0, taxRate: 18, total: 2124 },
    ],
    subtotal: 3800, discountTotal: 0, taxTotal: 684, grandTotal: 4484, tip: 300,
    payments: [{ mode: 'Membership', amount: 4484 }, { mode: 'Cash', amount: 300 }],
    status: 'paid', staffId: 'staff-6', createdAt: '2026-04-01',
  },
  {
    id: 'inv-8', invoiceNumber: 'INV-00008', clientId: 'client-17',
    lineItems: [
      { id: 'li-11', type: 'service', itemId: 'svc-18', name: 'Aromatherapy', quantity: 1, unitPrice: 3000, discount: 0, taxRate: 18, total: 3540 },
    ],
    subtotal: 3000, discountTotal: 0, taxTotal: 540, grandTotal: 3540, tip: 0,
    payments: [],
    status: 'draft', staffId: 'staff-6', createdAt: '2026-04-06',
  },
];

interface InvoiceStore {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoice: (id: string) => Invoice | undefined;
  getByClient: (clientId: string) => Invoice[];
  getNextInvoiceNumber: () => string;
}

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      invoices: mockInvoices,
      addInvoice: (invoice) =>
        set((s) => ({ invoices: [...s.invoices, invoice] })),
      updateInvoice: (id, data) =>
        set((s) => ({
          invoices: s.invoices.map((inv) =>
            inv.id === id ? { ...inv, ...data } : inv
          ),
        })),
      deleteInvoice: (id) =>
        set((s) => ({ invoices: s.invoices.filter((inv) => inv.id !== id) })),
      getInvoice: (id) => get().invoices.find((inv) => inv.id === id),
      getByClient: (clientId) =>
        get().invoices.filter((inv) => inv.clientId === clientId),
      getNextInvoiceNumber: () => {
        const count = get().invoices.length + 1;
        return `INV-${String(count).padStart(5, '0')}`;
      },
    }),
    { name: 'miosalon-invoices' }
  )
);
