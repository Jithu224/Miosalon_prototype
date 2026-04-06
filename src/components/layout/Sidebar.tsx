'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-[#1e40af] text-white flex flex-col z-50">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 shrink-0">
        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-base">
          M
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 flex flex-col items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`sidebar-icon ${isActive ? 'sidebar-icon-active' : ''}`}
            >
              <Icon className="w-5 h-5" />
            </Link>
          );
        })}
      </nav>

      {/* Powered by */}
      <div className="py-3 flex flex-col items-center shrink-0">
        <span className="text-[8px] text-blue-200/60 uppercase tracking-wider leading-tight text-center px-1">
          Powered by
        </span>
        <span className="text-[8px] text-blue-200/60 uppercase tracking-wider leading-tight text-center px-1">
          MioSalon
        </span>
      </div>
    </aside>
  );
}
