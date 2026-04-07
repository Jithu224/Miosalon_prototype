'use client';

import { usePathname } from 'next/navigation';
import { HiOutlineBell, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { NAV_ITEMS } from '@/lib/constants';
import { useRoleStore, UserRole, ROLE_PERMISSIONS } from '@/store/useRoleStore';
import { useStaffStore } from '@/store/useStaffStore';

function useBreadcrumb() {
  const pathname = usePathname();
  const navItem = NAV_ITEMS.find((item) =>
    item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
  );
  const sectionLabel = navItem?.label ?? 'Dashboard';
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
        const label = part.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        segments.push({ label, href: accumulated });
      }
    }
  }
  return segments;
}

const ROLE_COLORS: Record<UserRole, string> = {
  owner: 'bg-blue-600',
  manager: 'bg-emerald-600',
  staff: 'bg-amber-600',
};

const ROLE_INITIALS: Record<UserRole, string> = {
  owner: 'PS',
  manager: 'DN',
  staff: '',
};

export function Header() {
  const breadcrumb = useBreadcrumb();
  const { role, setRole, staffId, setStaffId } = useRoleStore();
  const staff = useStaffStore((s) => s.staff);
  const activeStaff = staff.filter((s) => s.isActive && s.role !== 'admin');
  const perms = ROLE_PERMISSIONS[role];

  const selectedStaff = staff.find((s) => s.id === staffId);
  const initials = role === 'staff' && selectedStaff
    ? `${selectedStaff.firstName[0]}${selectedStaff.lastName[0]}`
    : ROLE_INITIALS[role];

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        {breadcrumb.map((seg, i) => (
          <span key={seg.href} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-slate-300">&gt;</span>}
            <span className={i === breadcrumb.length - 1 ? 'text-slate-800 font-medium' : 'text-slate-400'}>
              {seg.label}
            </span>
          </span>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Role Switcher */}
        <div className="flex items-center gap-2 mr-2 pr-3 border-r border-slate-200">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="px-2 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="owner">Owner (Priya)</option>
            <option value="manager">Manager (Deepak)</option>
            <option value="staff">Staff View</option>
          </select>
          {role === 'staff' && (
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {activeStaff.map((s) => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
              ))}
            </select>
          )}
        </div>

        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <HiOutlineMagnifyingGlass className="w-5 h-5" />
        </button>
        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <HiOutlineBell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="ml-2 pl-3 border-l border-slate-200 flex items-center gap-2">
          <div className={`w-8 h-8 ${ROLE_COLORS[role]} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-slate-700">{perms.label}</p>
            <p className="text-[10px] text-slate-400 capitalize">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
