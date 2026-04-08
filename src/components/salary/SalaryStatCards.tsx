'use client';

import { formatCurrency } from '@/lib/utils';
import { HiOutlineBanknotes, HiOutlineChartBar, HiOutlineMinusCircle, HiOutlineUserGroup, HiOutlineSparkles } from 'react-icons/hi2';

interface SalaryStatCardsProps {
  totalOutflow: number;
  totalCommissions: number;
  totalIncentives: number;
  totalDeductions: number;
  staffCount: number;
}

export function SalaryStatCards({ totalOutflow, totalCommissions, totalIncentives, totalDeductions, staffCount }: SalaryStatCardsProps) {
  const cards = [
    { label: 'Total Salary Outflow', value: formatCurrency(totalOutflow), icon: HiOutlineBanknotes, bg: 'bg-amber-50 border-amber-200', iconColor: 'text-amber-600' },
    { label: 'Total Commissions', value: formatCurrency(totalCommissions), icon: HiOutlineChartBar, bg: 'bg-blue-50 border-blue-200', iconColor: 'text-blue-600' },
    { label: 'Total Incentives', value: formatCurrency(totalIncentives), icon: HiOutlineSparkles, bg: 'bg-violet-50 border-violet-200', iconColor: 'text-violet-600' },
    { label: 'Total Deductions', value: formatCurrency(totalDeductions), icon: HiOutlineMinusCircle, bg: 'bg-red-50 border-red-200', iconColor: 'text-red-600' },
    { label: 'Staff Processed', value: String(staffCount), icon: HiOutlineUserGroup, bg: 'bg-emerald-50 border-emerald-200', iconColor: 'text-emerald-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-xl border p-5 ${card.bg}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
            </div>
            <card.icon className={`w-8 h-8 ${card.iconColor} opacity-60`} />
          </div>
        </div>
      ))}
    </div>
  );
}
