'use client';

import Link from 'next/link';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { HiOutlineBuildingStorefront, HiOutlineReceiptPercent, HiOutlineCreditCard, HiOutlineBell, HiOutlineShieldCheck } from 'react-icons/hi2';

const settingsCards = [
  { title: 'Business Details', description: 'Name, logo, address, operating hours', icon: HiOutlineBuildingStorefront, href: '/settings/business', color: 'bg-blue-50 text-blue-600' },
  { title: 'Tax Settings', description: 'Tax name, rates, and configurations', icon: HiOutlineReceiptPercent, href: '/settings/tax', color: 'bg-emerald-50 text-emerald-600' },
  { title: 'Payment Modes', description: 'Configure accepted payment methods', icon: HiOutlineCreditCard, href: '/settings/payment-modes', color: 'bg-purple-50 text-purple-600' },
  { title: 'Notifications', description: 'SMS, email, and WhatsApp templates', icon: HiOutlineBell, href: '/settings/notifications', color: 'bg-yellow-50 text-yellow-600' },
  { title: 'Access Control', description: 'Role permissions and security', icon: HiOutlineShieldCheck, href: '/settings/access-control', color: 'bg-red-50 text-red-600' },
];

export default function SettingsPage() {
  return (
    <PageWrapper title="Settings" subtitle="Configure your salon">
      <div className="grid grid-cols-2 gap-4">
        {settingsCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{card.title}</h3>
                  <p className="text-sm text-slate-500">{card.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </PageWrapper>
  );
}
