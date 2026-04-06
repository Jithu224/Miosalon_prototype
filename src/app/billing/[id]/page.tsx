'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { useClientStore } from '@/store/useClientStore';
import { useHydration } from '@/hooks/useHydration';
import { formatCurrency, formatDate } from '@/lib/utils';

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'neutral' | 'danger'> = {
  paid: 'success',
  partial: 'warning',
  draft: 'neutral',
  void: 'danger',
};

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const hydrated = useHydration();
  const { invoices } = useInvoiceStore();
  const { clients } = useClientStore();
  const router = useRouter();

  if (!hydrated) {
    return (
      <PageWrapper title="Invoice Detail">
        <div className="flex items-center justify-center h-96 text-slate-400">Loading...</div>
      </PageWrapper>
    );
  }

  const invoice = invoices.find((inv) => inv.id === id);

  if (!invoice) {
    return (
      <PageWrapper title="Invoice Not Found">
        <div className="text-center py-12">
          <p className="text-slate-500 mb-4">The invoice you are looking for does not exist.</p>
          <Button variant="outline" onClick={() => router.push('/billing')}>
            Back to Billing
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const client = clients.find((c) => c.id === invoice.clientId);

  return (
    <PageWrapper
      title={`Invoice ${invoice.invoiceNumber}`}
      subtitle="View invoice details"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push('/billing')}>
            Back
          </Button>
          <Button onClick={() => window.print()}>
            Print
          </Button>
        </div>
      }
    >
      <div className="max-w-3xl mx-auto">
        <Card>
          {/* Print-friendly invoice */}
          <div className="print:p-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Mia Salon & Spa</h2>
                <p className="text-sm text-slate-500 mt-1">123 MG Road, Bengaluru, Karnataka 560001</p>
                <p className="text-sm text-slate-500">Phone: +91 80 1234 5678</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-slate-900">{invoice.invoiceNumber}</p>
                <p className="text-sm text-slate-500 mt-1">Date: {formatDate(invoice.createdAt)}</p>
                <div className="mt-2">
                  <Badge variant={STATUS_VARIANT[invoice.status] || 'neutral'}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Client info */}
            <div className="mb-6 p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Bill To</p>
              <p className="text-sm font-semibold text-slate-900">
                {client ? `${client.firstName} ${client.lastName}` : 'Unknown Client'}
              </p>
              {client && (
                <>
                  <p className="text-sm text-slate-600">{client.email}</p>
                  <p className="text-sm text-slate-600">{client.phone}</p>
                </>
              )}
            </div>

            {/* Line items */}
            <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Item</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Qty</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Unit Price</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Discount</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Tax</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lineItems.map((li) => (
                    <tr key={li.id} className="border-b border-slate-100">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{li.name}</div>
                        <div className="text-xs text-slate-400 capitalize">{li.type}</div>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-700">{li.quantity}</td>
                      <td className="px-4 py-3 text-right text-slate-700">{formatCurrency(li.unitPrice)}</td>
                      <td className="px-4 py-3 text-right text-slate-700">
                        {li.discount > 0 ? `${li.discount}%` : '-'}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-700">{li.taxRate}%</td>
                      <td className="px-4 py-3 text-right font-medium text-slate-900">{formatCurrency(li.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-6">
              <div className="w-72 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="text-slate-700">{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.discountTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Discount</span>
                    <span className="text-red-600">-{formatCurrency(invoice.discountTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tax</span>
                  <span className="text-slate-700">+{formatCurrency(invoice.taxTotal)}</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t border-slate-200 pt-2">
                  <span className="text-slate-900">Grand Total</span>
                  <span className="text-slate-900">{formatCurrency(invoice.grandTotal)}</span>
                </div>
                {invoice.tip > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tip</span>
                    <span className="text-emerald-600">+{formatCurrency(invoice.tip)}</span>
                  </div>
                )}
                {invoice.tip > 0 && (
                  <div className="flex justify-between text-sm font-semibold border-t border-slate-100 pt-1">
                    <span className="text-slate-700">Total Collected</span>
                    <span className="text-slate-900">{formatCurrency(invoice.grandTotal + invoice.tip)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment details */}
            {invoice.payments.length > 0 && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Payment Details</p>
                <div className="space-y-1">
                  {invoice.payments.map((p, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-slate-600">{p.mode}</span>
                      <span className="font-medium text-slate-900">{formatCurrency(p.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {invoice.notes && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Notes</p>
                <p className="text-sm text-slate-700">{invoice.notes}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
