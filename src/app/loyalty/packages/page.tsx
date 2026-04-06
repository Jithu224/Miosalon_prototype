'use client';

import { useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useHydration } from '@/hooks/useHydration';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

const mockPackages = [
  { id: 'pkg-1', name: 'Bridal Package', services: ['Bridal Makeup', 'Hair Styling', 'Classic Manicure', 'Classic Pedicure'], totalPrice: 10400, discountedPrice: 8500, validityDays: 30 },
  { id: 'pkg-2', name: 'Monthly Grooming (Men)', services: ['Haircut - Men', 'Basic Facial', 'Cleanup'], totalPrice: 1600, discountedPrice: 1200, validityDays: 30 },
  { id: 'pkg-3', name: 'Spa Day Package', services: ['Swedish Massage', 'Body Scrub', 'Gold Facial'], totalPrice: 4300, discountedPrice: 3500, validityDays: 7 },
];

export default function PackagesPage() {
  const hydrated = useHydration();
  const [showModal, setShowModal] = useState(false);

  if (!hydrated) return <div className="p-6"><div className="h-64 bg-slate-200 rounded animate-pulse" /></div>;

  return (
    <PageWrapper title="Service Packages" subtitle={`${mockPackages.length} packages`} actions={<><Button variant="outline" href="/loyalty">Back</Button><Button onClick={() => setShowModal(true)}>Create Package</Button></>}>
      <div className="grid grid-cols-3 gap-4">
        {mockPackages.map((pkg) => (
          <Card key={pkg.id}>
            <h3 className="font-semibold text-lg text-slate-900">{pkg.name}</h3>
            <div className="mt-3 space-y-1">
              {pkg.services.map((s) => (
                <p key={s} className="text-sm text-slate-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />{s}
                </p>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-blue-600">{formatCurrency(pkg.discountedPrice)}</span>
                <span className="text-sm text-slate-400 line-through ml-2">{formatCurrency(pkg.totalPrice)}</span>
              </div>
              <Badge variant="success">{Math.round((1 - pkg.discountedPrice / pkg.totalPrice) * 100)}% off</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-2">Valid for {pkg.validityDays} days</p>
          </Card>
        ))}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Package" size="lg" footer={<><Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button><Button onClick={() => { toast.success('Package created'); setShowModal(false); }}>Create</Button></>}>
        <div className="space-y-4">
          <Input label="Package Name" placeholder="e.g., Bridal Special" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Total Price (₹)" type="number" />
            <Input label="Discounted Price (₹)" type="number" />
          </div>
          <Input label="Validity (days)" type="number" defaultValue="30" />
        </div>
      </Modal>
    </PageWrapper>
  );
}
