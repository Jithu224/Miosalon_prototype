'use client';

import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  HiOutlineUser,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineMagnifyingGlass,
} from 'react-icons/hi2';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { useClientStore } from '@/store/useClientStore';
import { useServiceStore } from '@/store/useServiceStore';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { useStaffStore } from '@/store/useStaffStore';
import { useSettingsStore } from '@/store/useSettingsStore';
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
  const { settings } = useSettingsStore();

  const [clientId, setClientId] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([]);
  const [tip, setTip] = useState(0);
  const [payments, setPayments] = useState<Payment[]>([{ mode: 'Cash', amount: 0 }]);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>('Cash');

  // Modals
  const [servicePickerOpen, setServicePickerOpen] = useState(false);
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [addItemMenuOpen, setAddItemMenuOpen] = useState(false);

  // Discounts & Offers
  const [discountsExpanded, setDiscountsExpanded] = useState(false);
  const [globalDiscountPercent, setGlobalDiscountPercent] = useState(0);

  // Staff assignment per line item
  const [lineItemStaff, setLineItemStaff] = useState<Record<string, string>>({});

  // Accordion state for service picker
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Calculations
  const subtotal = useMemo(() => lineItems.reduce((sum, li) => sum + li.unitPrice * li.quantity, 0), [lineItems]);
  const discountTotal = useMemo(() => {
    const lineDisc = lineItems.reduce((sum, li) => sum + (li.unitPrice * li.quantity * li.discount) / 100, 0);
    const globalDisc = (subtotal - lineDisc) * globalDiscountPercent / 100;
    return lineDisc + globalDisc;
  }, [lineItems, subtotal, globalDiscountPercent]);
  const taxTotal = useMemo(() => lineItems.reduce((sum, li) => {
    const afterDiscount = li.unitPrice * li.quantity - (li.unitPrice * li.quantity * li.discount) / 100;
    const afterGlobal = afterDiscount - (afterDiscount * globalDiscountPercent / 100);
    return sum + (afterGlobal * li.taxRate) / 100;
  }, 0), [lineItems, globalDiscountPercent]);
  const grandTotal = useMemo(() => subtotal - discountTotal + taxTotal, [subtotal, discountTotal, taxTotal]);
  const totalPayments = useMemo(() => payments.reduce((sum, p) => sum + p.amount, 0), [payments]);
  const balance = useMemo(() => grandTotal + tip - totalPayments, [grandTotal, tip, totalPayments]);

  const selectedClient = clients.find((c) => c.id === clientId);

  const filteredClients = useMemo(() => {
    if (!clientSearch.trim()) return clients;
    const q = clientSearch.toLowerCase();
    return clients.filter(
      (c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q))
    );
  }, [clients, clientSearch]);

  function addServiceItem(svcId: string) {
    const svc = services.find((s) => s.id === svcId);
    if (!svc) return;
    const existing = lineItems.find((li) => li.itemId === svcId && li.type === 'service');
    if (existing) {
      toast('Service already added', { icon: 'i' });
      return;
    }
    const unitPrice = svc.price;
    const taxRate = svc.taxRate;
    const total = unitPrice + (unitPrice * taxRate) / 100;
    const newId = generateId();
    setLineItems((prev) => [
      ...prev,
      { id: newId, type: 'service', itemId: svc.id, name: svc.name, quantity: 1, unitPrice, discount: 0, taxRate, total },
    ]);
    if (staff.length > 0) {
      setLineItemStaff((prev) => ({ ...prev, [newId]: staff[0].id }));
    }
  }

  function addProductItem(prodId: string) {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;
    const existing = lineItems.find((li) => li.itemId === prodId && li.type === 'product');
    if (existing) {
      updateLineItem(existing.id, 'quantity', existing.quantity + 1);
      return;
    }
    const unitPrice = prod.price;
    const taxRate = prod.taxRate;
    const total = unitPrice + (unitPrice * taxRate) / 100;
    const newId = generateId();
    setLineItems((prev) => [
      ...prev,
      { id: newId, type: 'product', itemId: prod.id, name: prod.name, quantity: 1, unitPrice, discount: 0, taxRate, total },
    ]);
    if (staff.length > 0) {
      setLineItemStaff((prev) => ({ ...prev, [newId]: staff[0].id }));
    }
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
    setLineItemStaff((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
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

  function handleRaiseSale() {
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
    setClientSearch('');
    setLineItems([]);
    setTip(0);
    setPayments([{ mode: 'Cash', amount: 0 }]);
    setGlobalDiscountPercent(0);
    setLineItemStaff({});
  }

  if (!hydrated) {
    return (
      <PageWrapper title="Quick Sale">
        <div className="flex items-center justify-center h-96 text-slate-400">Loading...</div>
      </PageWrapper>
    );
  }

  const todayDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <PageWrapper title="Quick Sale" subtitle="Process a walk-in sale">
      {/* Top - Client Selector */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-[280px]">
            <HiOutlineUser className="w-5 h-5 text-slate-400" />
            <div className="relative flex-1">
              <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                <HiOutlineMagnifyingGlass className="w-4 h-4 text-slate-400 ml-3" />
                <input
                  type="text"
                  value={clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value);
                    if (clientId) setClientId('');
                  }}
                  placeholder="Search customer name or phone..."
                  className="flex-1 px-3 py-2 text-sm focus:outline-none"
                />
              </div>
              {clientSearch && !clientId && (
                <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredClients.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-slate-400">No customers found</div>
                  ) : (
                    filteredClients.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setClientId(c.id);
                          setClientSearch(`${c.firstName} ${c.lastName}`);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center justify-between"
                      >
                        <span className="font-medium text-slate-800">{c.firstName} {c.lastName}</span>
                        <span className="text-xs text-slate-400">{c.phone}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          {selectedClient && (
            <div className="flex items-center gap-3 text-sm">
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
                {selectedClient.firstName} {selectedClient.lastName}
              </span>
              {selectedClient.phone && (
                <span className="text-slate-500">{selectedClient.phone}</span>
              )}
            </div>
          )}
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap">
            + Create customer on the fly
          </button>
        </div>
      </div>

      {/* Middle - Invoice Area + Receipt */}
      <div className="flex gap-4" style={{ minHeight: 'calc(100vh - 420px)' }}>
        {/* Left - Invoice Line Items (wider) */}
        <div className="flex-[3] space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900 text-base">Invoice Items</h3>
              <div className="relative">
                <Button size="sm" variant="primary" onClick={() => setAddItemMenuOpen(!addItemMenuOpen)}>
                  <HiOutlinePlus className="w-4 h-4" /> Add Items
                </Button>
                {addItemMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 w-40">
                    <button
                      onClick={() => { setServicePickerOpen(true); setAddItemMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 text-slate-700 rounded-t-lg"
                    >
                      Service
                    </button>
                    <button
                      onClick={() => { setProductPickerOpen(true); setAddItemMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 text-slate-700 rounded-b-lg border-t border-slate-100"
                    >
                      Product
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Line items table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase w-10">#</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">Item Name</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase w-32">Staff</th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-500 uppercase w-16">Qty</th>
                    <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-500 uppercase w-24">Rate</th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-500 uppercase w-20">Disc %</th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-500 uppercase w-16">Tax</th>
                    <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-500 uppercase w-24">Amount</th>
                    <th className="px-3 py-2.5 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-3 py-10 text-center text-slate-400">
                        No items added yet. Click Add Items to add services or products.
                      </td>
                    </tr>
                  ) : (
                    lineItems.map((li, idx) => (
                      <tr key={li.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="px-3 py-2.5 text-slate-500 text-center">{idx + 1}</td>
                        <td className="px-3 py-2.5">
                          <div className="font-medium text-slate-800">{li.name}</div>
                          <div className="text-xs text-slate-400 capitalize">{li.type}</div>
                        </td>
                        <td className="px-3 py-2.5">
                          <select
                            value={lineItemStaff[li.id] || ''}
                            onChange={(e) => setLineItemStaff((prev) => ({ ...prev, [li.id]: e.target.value }))}
                            className="w-full text-xs border border-slate-200 rounded px-1.5 py-1 bg-white"
                          >
                            <option value="">Assign...</option>
                            {staff.map((s) => (
                              <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <input
                            type="number"
                            min={1}
                            value={li.quantity}
                            onChange={(e) => updateLineItem(li.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-14 text-center border border-slate-200 rounded px-1 py-0.5 text-sm"
                          />
                        </td>
                        <td className="px-3 py-2.5 text-right text-slate-700">{formatCurrency(li.unitPrice)}</td>
                        <td className="px-3 py-2.5 text-center">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={li.discount}
                            onChange={(e) => updateLineItem(li.id, 'discount', Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                            className="w-14 text-center border border-slate-200 rounded px-1 py-0.5 text-sm"
                          />
                        </td>
                        <td className="px-3 py-2.5 text-center text-slate-500 text-xs">{li.taxRate}%</td>
                        <td className="px-3 py-2.5 text-right font-semibold text-slate-900">{formatCurrency(li.total)}</td>
                        <td className="px-3 py-2.5">
                          <button
                            onClick={() => removeLineItem(li.id)}
                            className="text-red-400 hover:text-red-600 p-1"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Quick add service/product buttons below table */}
            <div className="flex items-center gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={() => setServicePickerOpen(true)}>
                + Add Service
              </Button>
              <Button size="sm" variant="outline" onClick={() => setProductPickerOpen(true)}>
                + Add Product
              </Button>
            </div>
          </Card>
        </div>

        {/* Right - Receipt Preview */}
        <div className="flex-[1.2]">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sticky top-6">
            <div className="text-center border-b border-dashed border-slate-300 pb-3 mb-3">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">RECEIPT</h3>
              <p className="text-xs text-slate-500 mt-1">{settings.businessName}</p>
              <p className="text-xs text-slate-400 mt-0.5">{settings.address}</p>
              <p className="text-xs text-slate-400">{settings.phone}</p>
            </div>

            <div className="border-b border-dashed border-slate-300 pb-3 mb-3">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Date:</span>
                <span>{todayDate}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Bill To:</span>
                <span className="font-medium text-slate-700">
                  {selectedClient ? `${selectedClient.firstName} ${selectedClient.lastName}` : 'Walk-in'}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-1.5 border-b border-dashed border-slate-300 pb-3 mb-3">
              {lineItems.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-3">No items</p>
              ) : (
                lineItems.map((li) => (
                  <div key={li.id} className="flex justify-between text-xs">
                    <div className="flex-1">
                      <span className="text-slate-700">{li.name}</span>
                      {li.quantity > 1 && <span className="text-slate-400 ml-1">x{li.quantity}</span>}
                    </div>
                    <span className="font-medium text-slate-800 ml-2">{formatCurrency(li.total)}</span>
                  </div>
                ))
              )}
            </div>

            {/* Totals */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(discountTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Tax</span>
                <span>+{formatCurrency(taxTotal)}</span>
              </div>
              {tip > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>Tip</span>
                  <span>+{formatCurrency(tip)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-200">
                <span>Total</span>
                <span>{formatCurrency(grandTotal + tip)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-4 space-y-4">
        {/* Discounts & Offers */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <button
            onClick={() => setDiscountsExpanded(!discountsExpanded)}
            className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-slate-700"
          >
            <span>Discounts &amp; Offers</span>
            {discountsExpanded ? <HiOutlineChevronUp className="w-4 h-4" /> : <HiOutlineChevronDown className="w-4 h-4" />}
          </button>
          {discountsExpanded && (
            <div className="px-5 pb-4 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-4">
                <label className="text-sm text-slate-600 whitespace-nowrap">Global Discount %</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={globalDiscountPercent || ''}
                  onChange={(e) => setGlobalDiscountPercent(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                  className="w-24 px-3 py-1.5 text-sm border border-slate-300 rounded-lg"
                  placeholder="0"
                />
                <label className="text-sm text-slate-600 whitespace-nowrap ml-4">Tip</label>
                <input
                  type="number"
                  min={0}
                  value={tip || ''}
                  onChange={(e) => setTip(parseFloat(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 text-sm border border-slate-300 rounded-lg"
                  placeholder="0"
                />
              </div>
            </div>
          )}
        </div>

        {/* Mode of Payment */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Mode of Payment</h3>

          {/* Payment mode buttons */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {PAYMENT_MODES.map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedPaymentMode(mode)}
                className={`px-4 py-2 text-sm rounded-lg border font-medium transition-colors ${
                  selectedPaymentMode === mode
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Payment entries */}
          <div className="space-y-2">
            {payments.map((p, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <select
                  value={p.mode}
                  onChange={(e) => updatePayment(idx, 'mode', e.target.value)}
                  className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white w-36"
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
                  className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg max-w-[200px]"
                />
                {payments.length > 1 && (
                  <button onClick={() => removePayment(idx)} className="text-red-400 hover:text-red-600 p-1">
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addSplitPayment}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-1"
            >
              + Split Payment
            </button>
          </div>

          {/* Bill Value / Paid / Balance row */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-200">
            <div className="flex-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Bill Value</p>
              <p className="text-xl font-bold text-slate-900">{formatCurrency(grandTotal + tip)}</p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Paid</p>
              <p className={`text-xl font-bold ${totalPayments >= grandTotal + tip ? 'text-emerald-600' : 'text-orange-600'}`}>
                {formatCurrency(totalPayments)}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Balance</p>
              <p className={`text-xl font-bold ${balance <= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(Math.max(0, balance))}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" size="lg" onClick={handleRaiseSale}>
                Save
              </Button>
              <Button variant="primary" size="lg" onClick={handleRaiseSale}>
                Raise Sale
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Picker Modal (accordion style) */}
      <Modal
        isOpen={servicePickerOpen}
        onClose={() => setServicePickerOpen(false)}
        title="Add Service"
        size="lg"
      >
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {categories.map((cat) => {
            const catServices = services.filter((s) => s.categoryId === cat.id && s.isActive);
            if (catServices.length === 0) return null;
            const isExpanded = expandedCategory === cat.id;
            return (
              <div key={cat.id} className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-700">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{catServices.length} services</span>
                    {isExpanded ? <HiOutlineChevronUp className="w-4 h-4 text-slate-400" /> : <HiOutlineChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>
                {isExpanded && (
                  <div className="divide-y divide-slate-100">
                    {catServices.map((svc) => {
                      const isAdded = lineItems.some((li) => li.itemId === svc.id && li.type === 'service');
                      return (
                        <button
                          key={svc.id}
                          onClick={() => {
                            addServiceItem(svc.id);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors ${isAdded ? 'bg-blue-50/50' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isAdded ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                              {isAdded && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className="text-slate-700">{svc.name}</span>
                          </div>
                          <span className="font-medium text-slate-900">{formatCurrency(svc.price)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
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
          {products.filter((p) => p.isActive).map((prod) => {
            const isAdded = lineItems.some((li) => li.itemId === prod.id && li.type === 'product');
            return (
              <button
                key={prod.id}
                onClick={() => addProductItem(prod.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm hover:bg-blue-50 transition-colors ${isAdded ? 'bg-blue-50/50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isAdded ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                    {isAdded && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-700">{prod.name}</span>
                    {prod.brand && <span className="text-xs text-slate-400 ml-2">{prod.brand}</span>}
                  </div>
                </div>
                <span className="font-medium text-slate-900">{formatCurrency(prod.price)}</span>
              </button>
            );
          })}
          {products.filter((p) => p.isActive).length === 0 && (
            <p className="text-center text-sm text-slate-400 py-6">No products available</p>
          )}
        </div>
      </Modal>
    </PageWrapper>
  );
}
