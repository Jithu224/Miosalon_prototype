'use client';

import Link from 'next/link';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { useLoyaltyStore } from '@/store/useLoyaltyStore';
import { useHydration } from '@/hooks/useHydration';
import { formatCurrency } from '@/lib/utils';
import { HiOutlineCreditCard, HiOutlineCube, HiOutlineGift } from 'react-icons/hi2';

export default function LoyaltyPage() {
  const hydrated = useHydration();
  const { memberships, giftVouchers } = useLoyaltyStore();

  if (!hydrated) return <div className="p-6"><div className="h-64 bg-slate-200 rounded animate-pulse" /></div>;

  const activeVouchers = giftVouchers.filter((v) => v.status === 'active');
  const totalVoucherValue = activeVouchers.reduce((sum, v) => sum + v.balance, 0);

  const cards = [
    { title: 'Memberships', count: memberships.filter((m) => m.isActive).length, label: 'active plans', icon: HiOutlineCreditCard, href: '/loyalty/memberships', color: 'bg-blue-50 text-blue-600' },
    { title: 'Packages', count: 0, label: 'service packages', icon: HiOutlineCube, href: '/loyalty/packages', color: 'bg-emerald-50 text-emerald-600' },
    { title: 'Gift Vouchers', count: activeVouchers.length, label: `outstanding (${formatCurrency(totalVoucherValue)})`, icon: HiOutlineGift, href: '/loyalty/gift-vouchers', color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <PageWrapper title="Loyalty Programs" subtitle="Manage memberships, packages, and gift vouchers">
      <div className="grid grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{card.title}</h3>
                  <p className="text-2xl font-bold text-slate-900">{card.count}</p>
                  <p className="text-sm text-slate-500">{card.label}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </PageWrapper>
  );
}
