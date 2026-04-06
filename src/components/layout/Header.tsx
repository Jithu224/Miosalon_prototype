'use client';

import { usePathname } from 'next/navigation';
import { HiOutlineBell, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { NAV_ITEMS } from '@/lib/constants';

function useBreadcrumb() {
  const pathname = usePathname();

  // Find matching nav item
  const navItem = NAV_ITEMS.find((item) =>
    item.href === '/'
      ? pathname === '/'
      : pathname.startsWith(item.href)
  );

  const sectionLabel = navItem?.label ?? 'Dashboard';

  // Build segments from pathname beyond the nav item's href
  const segments: { label: string; href: string }[] = [
    { label: sectionLabel, href: navItem?.href ?? '/' },
  ];

  if (navItem && pathname !== navItem.href && pathname !== '/') {
    const rest = pathname.slice(navItem.href.length).replace(/^\//, '');
    if (rest) {
      const parts = rest.split('/');
      let accumulated = navItem.href;
      for (const part of parts) {
        accumulated += '/' + part;
        const label = part
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        segments.push({ label, href: accumulated });
      }
    }
  }

  return segments;
}

export function Header() {
  const breadcrumb = useBreadcrumb();

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        {breadcrumb.map((seg, i) => (
          <span key={seg.href} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-slate-300">&gt;</span>}
            <span
              className={
                i === breadcrumb.length - 1
                  ? 'text-slate-800 font-medium'
                  : 'text-slate-400'
              }
            >
              {seg.label}
            </span>
          </span>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Search icon */}
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <HiOutlineMagnifyingGlass className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <HiOutlineBell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User avatar */}
        <div className="ml-2 pl-3 border-l border-slate-200 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium cursor-pointer">
            AU
          </div>
        </div>
      </div>
    </header>
  );
}
