'use client';

import { cn } from '@/lib/utils';

interface MonthSelectorProps {
  value: string; // "2026-04"
  onChange: (value: string) => void;
  className?: string;
}

export function MonthSelector({ value, onChange, className }: MonthSelectorProps) {
  return (
    <input
      type="month"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-700',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        className
      )}
    />
  );
}
