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

export default function BusinessSettingsPage() {
  const hydrated = useHydration();
  const { settings, updateSettings } = useSettingsStore();
  const [form, setForm] = useState(settings);

  if (!hydrated) return <div className="p-6"><div className="h-64 bg-slate-200 rounded animate-pulse" /></div>;

  const handleSave = () => { updateSettings(form); toast.success('Business settings saved'); };

  return (
    <PageWrapper title="Business Details" actions={<Button variant="outline" href="/settings">Back</Button>}>
      <div className="max-w-2xl space-y-6">
        <Card title="General Info">
          <div className="space-y-4">
            <Input label="Business Name" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
              <Input label="Timezone" value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} />
            </div>
          </div>
        </Card>
        <Card title="Operating Hours">
          <div className="space-y-3">
            {form.operatingHours.map((day, i) => (
              <div key={day.day} className="flex items-center gap-4">
                <span className="w-24 text-sm font-medium text-slate-700">{day.dayName}</span>
                <Toggle checked={day.isOpen} onChange={(v) => { const hrs = [...form.operatingHours]; hrs[i] = { ...hrs[i], isOpen: v }; setForm({ ...form, operatingHours: hrs }); }} />
                {day.isOpen && (
                  <>
                    <input type="time" value={day.open} onChange={(e) => { const hrs = [...form.operatingHours]; hrs[i] = { ...hrs[i], open: e.target.value }; setForm({ ...form, operatingHours: hrs }); }} className="px-2 py-1 text-sm border rounded" />
                    <span className="text-slate-400">to</span>
                    <input type="time" value={day.close} onChange={(e) => { const hrs = [...form.operatingHours]; hrs[i] = { ...hrs[i], close: e.target.value }; setForm({ ...form, operatingHours: hrs }); }} className="px-2 py-1 text-sm border rounded" />
                  </>
                )}
                {!day.isOpen && <span className="text-sm text-slate-400">Closed</span>}
              </div>
            ))}
          </div>
        </Card>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </PageWrapper>
  );
}
