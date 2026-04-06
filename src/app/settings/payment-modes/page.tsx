'use client';

import { useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useHydration } from '@/hooks/useHydration';
import toast from 'react-hot-toast';

const allModes = ['Cash', 'Card', 'UPI', 'Wallet', 'Membership', 'Bank Transfer', 'Cheque'];

export default function PaymentModesPage() {
  const hydrated = useHydration();
  const { settings, updateSettings } = useSettingsStore();
  const [modes, setModes] = useState(settings.paymentModes);
  const [newMode, setNewMode] = useState('');

  if (!hydrated) return <div className="p-6"><div className="h-64 bg-slate-200 rounded animate-pulse" /></div>;

  const toggleMode = (mode: string) => {
    const updated = modes.includes(mode) ? modes.filter((m) => m !== mode) : [...modes, mode];
    setModes(updated);
  };

  return (
    <PageWrapper title="Payment Modes" actions={<Button variant="outline" href="/settings">Back</Button>}>
      <Card className="max-w-lg" title="Accepted Payment Methods">
        <div className="space-y-3">
          {allModes.map((mode) => (
            <Toggle key={mode} checked={modes.includes(mode)} onChange={() => toggleMode(mode)} label={mode} />
          ))}
        </div>
        <div className="mt-4 pt-4 border-t flex gap-2">
          <Input value={newMode} onChange={(e) => setNewMode(e.target.value)} placeholder="Custom payment mode" className="flex-1" />
          <Button size="sm" onClick={() => { if (newMode && !modes.includes(newMode)) { setModes([...modes, newMode]); setNewMode(''); } }}>Add</Button>
        </div>
        <div className="mt-4">
          <Button onClick={() => { updateSettings({ paymentModes: modes }); toast.success('Payment modes saved'); }}>Save</Button>
        </div>
      </Card>
    </PageWrapper>
  );
}
