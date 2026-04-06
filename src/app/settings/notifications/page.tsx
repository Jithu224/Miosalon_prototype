'use client';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { useHydration } from '@/hooks/useHydration';
import toast from 'react-hot-toast';
import { useState } from 'react';

const notificationTypes = [
  { key: 'appointmentConfirm', label: 'Appointment Confirmation', desc: 'Send when appointment is booked' },
  { key: 'appointmentReminder', label: 'Appointment Reminder', desc: 'Send 2 hours before appointment' },
  { key: 'invoiceEmail', label: 'Invoice Email', desc: 'Send digital invoice after payment' },
  { key: 'feedbackRequest', label: 'Feedback Request', desc: 'Send after service completion' },
  { key: 'birthdayGreeting', label: 'Birthday Greeting', desc: 'Send on client birthday' },
  { key: 'membershipExpiry', label: 'Membership Expiry', desc: 'Remind before membership expires' },
];

export default function NotificationsPage() {
  const hydrated = useHydration();
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ appointmentConfirm: true, appointmentReminder: true, invoiceEmail: true, feedbackRequest: true, birthdayGreeting: true, membershipExpiry: false });

  if (!hydrated) return <div className="p-6"><div className="h-64 bg-slate-200 rounded animate-pulse" /></div>;

  return (
    <PageWrapper title="Notifications" actions={<Button variant="outline" href="/settings">Back</Button>}>
      <Card className="max-w-2xl" title="Notification Settings">
        <div className="space-y-4">
          {notificationTypes.map((n) => (
            <div key={n.key} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-900">{n.label}</p>
                <p className="text-xs text-slate-500">{n.desc}</p>
              </div>
              <Toggle checked={enabled[n.key] ?? false} onChange={(v) => setEnabled({ ...enabled, [n.key]: v })} />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button onClick={() => toast.success('Notification settings saved')}>Save</Button>
        </div>
      </Card>
    </PageWrapper>
  );
}
