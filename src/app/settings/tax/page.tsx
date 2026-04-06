'use client';

import { useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useHydration } from '@/hooks/useHydration';
import toast from 'react-hot-toast';

export default function TaxSettingsPage() {
  const hydrated = useHydration();
  const { settings, updateSettings } = useSettingsStore();
  const [taxName, setTaxName] = useState(settings.taxName);
  const [taxRate, setTaxRate] = useState(String(settings.taxRate));

  if (!hydrated) return <div className="p-6"><div className="h-64 bg-slate-200 rounded animate-pulse" /></div>;

  return (
    <PageWrapper title="Tax Settings" actions={<Button variant="outline" href="/settings">Back</Button>}>
      <Card className="max-w-lg" title="Tax Configuration">
        <div className="space-y-4">
          <Input label="Tax Name" value={taxName} onChange={(e) => setTaxName(e.target.value)} helperText="e.g., GST, VAT, Sales Tax" />
          <Input label="Default Tax Rate (%)" type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
          <Input label="Tax ID / GSTIN" defaultValue="29AABCT1234F1ZQ" />
          <Button onClick={() => { updateSettings({ taxName, taxRate: Number(taxRate) }); toast.success('Tax settings saved'); }}>Save</Button>
        </div>
      </Card>
    </PageWrapper>
  );
}
