export interface InvoiceLineItem {
  id: string;
  type: 'service' | 'product';
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  total: number;
}

export interface Payment {
  mode: 'Cash' | 'Card' | 'UPI' | 'Wallet' | 'Membership';
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  appointmentId?: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  tip: number;
  payments: Payment[];
  status: 'draft' | 'paid' | 'partial' | 'void';
  staffId: string;
  createdAt: string;
  notes?: string;
}
