'use client';

import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { useClientStore } from '@/store/useClientStore';
import { useServiceStore } from '@/store/useServiceStore';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { useStaffStore } from '@/store/useStaffStore';
import { useHydration } from '@/hooks/useHydration';
import { InvoiceLineItem, Payment } from '@/types/invoice';
import { formatCurrency, generateId } from '@/lib/utils';
import { PAYMENT_MODES } from '@/lib/constants';

export default function QuickSalePage() {
  const hydrated = useHydration();
  const { clients } = useClientStore();
  const { services, categories } = useServiceStore();
  const { products } = useInventoryStore();
  const { addInvoice, getNextInvoiceNumber } = useInvoiceStore();
  const { staff } = useStaffStore();

  const [clientId, setClientId] = useState('');
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([]);
  const [tip, setTip] = useState(0);
  const [payments, setPayments] = useState<Payment[]>([{ mode: 'Cash', amount: 0 }]);
  const [activeTab, setActiveTab] = useState('cat-1');

  // Modals for picking service / product from left side buttons
  const [servicePickerOpen, setServicePickerOpen] = useState(false);
  const [productPickerOpen, setProductPickerOpen] = useState(false);

  // Calculations
  const subtotal = useMemo(() => lineItems.reduce((sum, li) => sum + li.unitPrice * li.quantity, 0), [lineItems]);
  const discountTotal = useMemo(() => lineItems.reduce((sum, li) => sum + (li.unitPrice * li.quantity * li.discount) / 100, 0), [lineItems]);
  const taxTotal = useMemo(() => lineItems.reduce((sum, li) => {
    const afterDiscount = li.unitPrice * li.quantity - (li.unitPrice * li.quantity * li.discount) / 100;
    return sum + (afterDiscount * li.taxRate) / 100;
  }, 0), [lineItems]);
  const grandTotal = useMemo(() => subtotal - discountTotal + taxTotal, [subtotal, discountTotal, taxTotal]);
  const totalPayments = useMemo(() => payments.reduce((sum, p) => sum + p.amount, 0), [payments]);

  function addServiceItem(svcId: string) {
    const svc = services.find((s) => s.id === svcId);
    if (!svc) return;
    // Check if already added
    const existing = lineItems.find((li) => li.itemId === svcId && li.type === 'service');
    if (existing) {
      toast('Service already added', { icon: 'ℹ️' });
      return;
    }
    const unitPrice = svc.price;
    const taxRate = svc.taxRate;
    const total = unitPrice + (unitPrice * taxRate) / 100;
    setLineItems((prev) => [
      ...prev,
      {
        id: generateId(),
        type: 'service',
        itemId: svc.id,
        name: svc.name,
        quantity: 1,
        unitPrice,
        discount: 0,
        taxRate,
        total,
      },
    ]);
  }

  function addProductItem(prodId: string) {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;
    const existing = lineItems.find((li) => li.itemId === prodId && li.type === 'product');
    if (existing) {
      // Increment quantity
      updateLineItem(existing.id, 'quantity', existing.quantity + 1);
      return;
    }
    const unitPrice = prod.price;
    const taxRate = prod.taxRate;
    const total = unitPrice + (unitPrice * taxRate) / 100;
    setLineItems((prev) => [
      ...prev,
      {
        id: generateId(),
        type: 'product',
        itemId: prod.id,
        name: prod.name,
        quantity: 1,
        unitPrice,
        discount: 0,
        taxRate,
        total,
      },
    ]);
  }

  function updateLineItem(id: string, field: string, value: number) {
    setLineItems((prev) =>
      prev.map((li) => {
        if (li.id !== id) return li;
        const updated = { ...li, [field]: value };
        const afterDiscount = updated.unitPrice * updated.quantity - (updated.unitPrice * updated.quantity * updated.discount) / 100;
        updated.total = afterDiscount + (afterDiscount * updated.taxRate) / 100;
        return updated;
      })
    );
  }

  function removeLineItem(id: string) {
    setLineItems((prev) => prev.filter((li) => li.id !== id));
  }

  function updatePayment(index: number, field: keyof Payment, value: string | number) {
    setPayments((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  }

  function addSplitPayment() {
    setPayments((prev) => [...prev, { mode: 'Cash', amount: 0 }]);
  }

  function removePayment(index: number) {
    if (payments.length <= 1) return;
    setPayments((prev) => prev.filter((_, i) => i !== index));
  }

  function handleCharge() {
    if (!clientId) {
      toast.error('Please select a client');
      return;
    }
    if (lineItems.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalDue = grandTotal + tip;
    const paymentStatus = totalPaid >= totalDue ? 'paid' : totalPaid > 0 ? 'partial' : 'draft';

    const invoice = {
      id: generateId(),
      invoiceNumber: getNextInvoiceNumber(),
      clientId,
      lineItems: lineItems.map((li) => ({ ...li })),
      subtotal,
      discountTotal,
      taxTotal,
      grandTotal,
      tip,
      payments: payments.filter((p) => p.amount > 0),
      status: paymentStatus as 'paid' | 'partial' | 'draft',
      staffId: staff[0]?.id || '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    addInvoice(invoice);
    toast.success(`Invoice ${invoice.invoiceNumber} created!`);

    // Reset
    setClientId('');
    setLineItems([]);
    setTip(0);
    setPayments([{ mode: 'Cash', amount: 0 }]);
  }

  if (!hydrated) {
    return (
      <PageWrapper title="Quick Sale">
        <div className="flex items-center justify-center h-96 text-slate-400">Loading...</div>
      </PageWrapper>
    );
  }

  const clientOptions = clients.map((c) => ({ value: c.id, label: `${c.firstName} ${c.lastName}` }));

  const quickTabs = [
    ...categories.map((cat) => ({ id: cat.id, label: cat.name })),
    { id: 'products', label: 'Products' },
  ];

  const activeServices = activeTab !== 'products'
    ? services.filter((s) => s.categoryId === activeTab && s.isActive)
    : [];
  const activeProducts = activeTab === 'products'
    ? products.filter((p) => p.isActive)
    : [];

  return (
    <PageWrapper title="Quick Sale" subtitle="Process a walk-in sale">
      <div className="flex gap-6" style={{ minHeight: 'calc(100vh - 180px)' }}>
        {/* LEFT SIDE - Invoice Builder (60%) */}
        <div className="w-[60%] space-y-4">
          <Card>
            {/* Client selector */}
            <Select
              label="Client"
              options={clientOptions}
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Select client..."
            />

            {/* Line items table */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Button size="sm" variant="outline" onClick={() => setServicePickerOpen(true)}>
                  Add Service
                </Button>
                <Button size="sm" variant="outline" onClick={() => setProductPickerOpen(true)}>
                  Add Product
                </Button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Item</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500 uppercase w-16">Qty</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500 uppercase w-24">Price</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500 uppercase w-20">Disc %</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500 uppercase w-16">Tax</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500 uppercase w-24">Total</th>
                      <th className="px-3 py-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-3 py-8 text-center text-slate-400">
                          No items added yet. Use the buttons above or the quick-add grid.
                        </td>
                      </tr>
                    ) : (
                      lineItems.map((li) => (
                        <tr key={li.id} className="border-b border-slate-100">
                          <td className="px-3 py-2">
                            <div className="font-medium text-slate-800">{li.name}</div>
                            <div className="text-xs text-slate-400 capitalize">{li.type}</div>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <input
                              type="number"
                              min={1}
                              value={li.quantity}
                              onChange={(e) => updateLineItem(li.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-14 text-center border border-slate-200 rounded px-1 py-0.5 text-sm"
                            />
                          </td>
                          <td className="px-3 py-2 text-right text-slate-700">{formatCurrency(li.unitPrice)}</td>
                          <td className="px-3 py-2 text-center">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={li.discount}
                              onChange={(e) => updateLineItem(li.id, 'discount', Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                              className="w-14 text-center border border-slate-200 rounded px-1 py-0.5 text-sm"
                            />
                          </td>
                          <td className="px-3 py-2 text-center text-slate-500">{li.taxRate}%</td>
                          <td className="px-3 py-2 text-right font-medium text-slate-900">{formatCurrency(li.total)}</td>
                          <td className="px-3 py-2">
                            <button
                              onClick={() => removeLineItem(li.id)}
                              className="text-red-400 hover:text-red-600 text-lg leading-none"
                            >
                              &times;
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            {lineItems.length > 0 && (
              <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="text-slate-700">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Discount</span>
                  <span className="text-red-600">-{formatCurrency(discountTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tax</span>
                  <span className="text-slate-700">+{formatCurrency(taxTotal)}</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t border-slate-200 pt-2">
                  <span className="text-slate-900">Grand Total</span>
                  <span className="text-slate-900">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            )}

            {/* Tip */}
            <div className="mt-4">
              <Input
                label="Tip"
                type="number"
                min={0}
                value={tip || ''}
                onChange={(e) => setTip(parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            {/* Payments */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Payment</label>
                <Button size="sm" variant="ghost" onClick={addSplitPayment}>
                  + Add Split
                </Button>
              </div>
              {payments.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={p.mode}
                    onChange={(e) => updatePayment(idx, 'mode', e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {PAYMENT_MODES.map((mode) => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={0}
                    value={p.amount || ''}
                    onChange={(e) => updatePayment(idx, 'amount', parseFloat(e.target.value) || 0)}
                    placeholder="Amount"
                    className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                  {payments.length > 1 && (
                    <button
                      onClick={() => removePayment(idx)}
                      className="text-red-400 hover:text-red-600 text-lg px-2"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              {lineItems.length > 0 && (
                <div className="flex justify-between text-sm pt-1">
                  <span className="text-slate-500">Total due (incl. tip)</span>
                  <span className="font-medium">{formatCurrency(grandTotal + tip)}</span>
                </div>
              )}
              {totalPayments > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Amount entered</span>
                  <span className={totalPayments >= grandTotal + tip ? 'text-emerald-600 font-medium' : 'text-orange-600 font-medium'}>
                    {formatCurrency(totalPayments)}
                  </span>
                </div>
              )}
            </div>

            {/* Charge button */}
            <div className="mt-6">
              <Button className="w-full" size="lg" onClick={handleCharge}>
                Charge {formatCurrency(grandTotal + tip)}
              </Button>
            </div>
          </Card>
        </div>

        {/* RIGHT SIDE - Quick Add Grid (40%) */}
        <div className="w-[40%]">
          <Card padding={false}>
            <div className="p-4 pb-0">
              <Tabs tabs={quickTabs} activeTab={activeTab} onChange={setActiveTab} />
            </div>
            <div className="p-4 grid grid-cols-2 gap-2 max-h-[calc(100vh-280px)] overflow-y-auto">
              {activeTab !== 'products' &&
                activeServices.map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => addServiceItem(svc.id)}
                    className="p-3 text-left border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <p className="text-sm font-medium text-slate-800 leading-tight">{svc.name}</p>
                    <p className="text-sm text-blue-600 font-semibold mt-1">{formatCurrency(svc.price)}</p>
                  </button>
                ))}
              {activeTab === 'products' &&
                activeProducts.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => addProductItem(prod.id)}
                    className="p-3 text-left border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <p className="text-sm font-medium text-slate-800 leading-tight">{prod.name}</p>
                    <p className="text-sm text-blue-600 font-semibold mt-1">{formatCurrency(prod.price)}</p>
                  </button>
                ))}
              {activeTab !== 'products' && activeServices.length === 0 && (
                <div className="col-span-2 py-8 text-center text-sm text-slate-400">
                  No services in this category
                </div>
              )}
              {activeTab === 'products' && activeProducts.length === 0 && (
                <div className="col-span-2 py-8 text-center text-sm text-slate-400">
                  No products available
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Service Picker Modal */}
      <Modal
        isOpen={servicePickerOpen}
        onClose={() => setServicePickerOpen(false)}
        title="Add Service"
        size="lg"
      >
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {categories.map((cat) => {
            const catServices = services.filter((s) => s.categoryId === cat.id && s.isActive);
            if (catServices.length === 0) return null;
            return (
              <div key={cat.id}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{cat.name}</p>
                <div className="space-y-1">
                  {catServices.map((svc) => (
                    <button
                      key={svc.id}
                      onClick={() => {
                        addServiceItem(svc.id);
                        setServicePickerOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 text-sm"
                    >
                      <span className="text-slate-700">{svc.name}</span>
                      <span className="font-medium text-slate-900">{formatCurrency(svc.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Modal>

      {/* Product Picker Modal */}
      <Modal
        isOpen={productPickerOpen}
        onClose={() => setProductPickerOpen(false)}
        title="Add Product"
        size="lg"
      >
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {products.filter((p) => p.isActive).map((prod) => (
            <button
              key={prod.id}
              onClick={() => {
                addProductItem(prod.id);
                setProductPickerOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 text-sm"
            >
              <div>
                <span className="text-slate-700">{prod.name}</span>
                {prod.brand && <span className="text-xs text-slate-400 ml-2">{prod.brand}</span>}
              </div>
              <span className="font-medium text-slate-900">{formatCurrency(prod.price)}</span>
            </button>
          ))}
        </div>
      </Modal>
    </PageWrapper>
  );
}
