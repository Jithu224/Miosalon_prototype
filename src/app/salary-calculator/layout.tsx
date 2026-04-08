'use client';

import { SalarySubNav } from '@/components/salary/SalarySubNav';

export default function SalaryCalculatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SalarySubNav />
      {children}
    </div>
  );
}
