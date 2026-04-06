'use client';

import Link from 'next/link';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useHydration } from '@/hooks/useHydration';
import {
  HiOutlineBanknotes,
  HiOutlineUserGroup,
  HiOutlineUsers,
  HiOutlineReceiptPercent,
} from 'react-icons/hi2';

const reportCards = [
  {
    title: 'Revenue Reports',
    description: 'Track revenue trends, top services, and financial performance over time.',
    href: '/reports/revenue',
    icon: HiOutlineBanknotes,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    title: 'Staff Performance',
    description: 'Analyze staff productivity, appointments handled, and revenue generated.',
    href: '/reports/staff-performance',
    icon: HiOutlineUserGroup,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    title: 'Client Reports',
    description: 'View client acquisition, retention rates, and top spending clients.',
    href: '/reports/client-reports',
    icon: HiOutlineUsers,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    title: 'Expenses',
    description: 'Monitor business expenses, overheads, and cost breakdowns.',
    href: '/reports/expenses',
    icon: HiOutlineReceiptPercent,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
];

export default function ReportsPage() {
  const hydrated = useHydration();

  if (!hydrated) {
    return (
      <PageWrapper title="Reports" subtitle="View business analytics and reports">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-slate-200 rounded-xl" />
          ))}
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Reports" subtitle="View business analytics and reports">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md hover:border-slate-300 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className={`${card.bg} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{card.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageWrapper>
  );
}
