'use client';

import { useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useHydration } from '@/hooks/useHydration';
import toast from 'react-hot-toast';

const roles = ['Admin', 'Manager', 'Stylist', 'Therapist', 'Receptionist'];
const modules = ['Dashboard', 'Appointments', 'Clients', 'Staff', 'Services', 'Inventory', 'Billing', 'Reports', 'Marketing', 'Settings'];

const defaultPerms: Record<string, Record<string, boolean>> = {
  Admin: Object.fromEntries(modules.map((m) => [m, true])),
  Manager: Object.fromEntries(modules.map((m) => [m, m !== 'Settings'])),
  Stylist: Object.fromEntries(modules.map((m) => [m, ['Dashboard', 'Appointments', 'Clients'].includes(m)])),
  Therapist: Object.fromEntries(modules.map((m) => [m, ['Dashboard', 'Appointments', 'Clients'].includes(m)])),
  Receptionist: Object.fromEntries(modules.map((m) => [m, ['Dashboard', 'Appointments', 'Clients', 'Billing'].includes(m)])),
};

export default function AccessControlPage() {
  const hydrated = useHydration();
  const [perms, setPerms] = useState(defaultPerms);

  if (!hydrated) return <div className="p-6"><div className="h-64 bg-slate-200 rounded animate-pulse" /></div>;

  const toggle = (role: string, module: string) => {
    if (role === 'Admin') return;
    setPerms({ ...perms, [role]: { ...perms[role], [module]: !perms[role][module] } });
  };

  return (
    <PageWrapper title="Access Control" actions={<Button variant="outline" href="/settings">Back</Button>}>
      <Card title="Role Permissions Matrix">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left text-xs font-semibold text-slate-500 py-2 px-3">Module</th>
                {roles.map((r) => <th key={r} className="text-center text-xs font-semibold text-slate-500 py-2 px-3">{r}</th>)}
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => (
                <tr key={m} className="border-b border-slate-50">
                  <td className="text-sm text-slate-700 py-2 px-3">{m}</td>
                  {roles.map((r) => (
                    <td key={r} className="text-center py-2 px-3">
                      <input type="checkbox" checked={perms[r]?.[m] ?? false} onChange={() => toggle(r, m)} disabled={r === 'Admin'} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4"><Button onClick={() => toast.success('Permissions saved')}>Save Permissions</Button></div>
      </Card>
    </PageWrapper>
  );
}
