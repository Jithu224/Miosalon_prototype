import { ReactNode } from 'react';
import { HiOutlineInboxStack } from 'react-icons/hi2';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-slate-300 mb-4">
        {icon || <HiOutlineInboxStack className="w-12 h-12" />}
      </div>
      <h3 className="text-sm font-medium text-slate-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 mb-4 max-w-sm">{description}</p>}
      {action}
    </div>
  );
}
