import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ title, headerAction, children, className, padding = true }: CardProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 shadow-sm', className)}>
      {title && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          {headerAction}
        </div>
      )}
      <div className={cn(padding && 'p-6')}>{children}</div>
    </div>
  );
}
