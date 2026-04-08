'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRoleStore, ROLE_PERMISSIONS } from '@/store/useRoleStore';

const tabs = [
  { href: '/salary-calculator', label: 'Dashboard', perm: null },
  { href: '/salary-calculator/setup', label: 'Setup', perm: 'canConfigureSalary' as const },
  { href: '/salary-calculator/incentives', label: 'Incentives', perm: 'canConfigureSalary' as const },
  { href: '/salary-calculator/advances', label: 'Advances', perm: 'canRecordAdvances' as const },
  { href: '/salary-calculator/bulk-payslips', label: 'Bulk Payslips', perm: 'canExport' as const },
];

export function SalarySubNav() {
  const pathname = usePathname();
  const { role } = useRoleStore();
  const perms = ROLE_PERMISSIONS[role];

  return (
    <div className="border-b border-slate-200 mb-6">
      <nav className="flex gap-0 -mb-px overflow-x-auto">
        {tabs.map((tab) => {
          // Check permission
          if (tab.perm && !(perms as unknown as Record<string, boolean>)[tab.perm]) return null;

          // Active state: exact match for dashboard, startsWith for sub-pages
          const isActive =
            tab.href === '/salary-calculator'
              ? pathname === '/salary-calculator'
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
