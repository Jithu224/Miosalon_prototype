'use client';

import { useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useServiceStore } from '@/store/useServiceStore';
import { useHydration } from '@/hooks/useHydration';
import toast from 'react-hot-toast';

export default function OnlineBookingPage() {
  const hydrated = useHydration();
  const { settings, updateSettings } = useSettingsStore();
  const { services, categories } = useServiceStore();
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState('');

  if (!hydrated) return <div className="p-6"><div className="h-64 bg-slate-200 rounded animate-pulse" /></div>;

  return (
    <PageWrapper title="Online Booking" subtitle="Configure your online booking widget">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card title="Booking Settings">
            <div className="space-y-4">
              <Toggle checked={settings.enableOnlineBooking} onChange={(v) => { updateSettings({ enableOnlineBooking: v }); toast.success(v ? 'Online booking enabled' : 'Online booking disabled'); }} label="Enable Online Booking" />
              <Input label="Booking Page URL" value="https://book.miasalon.com/mia-salon" readOnly helperText="Share this link with clients" />
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-medium text-slate-500 mb-1">Embed Code</p>
                <code className="text-xs text-slate-600 break-all">{`<iframe src="https://book.miasalon.com/mia-salon" width="100%" height="600" />`}</code>
              </div>
            </div>
          </Card>
          <Card title="Booking Rules">
            <div className="space-y-4">
              <Input label="Advance Booking Limit (days)" type="number" defaultValue="30" />
              <Input label="Cancellation Window (hours)" type="number" defaultValue="4" />
              <Toggle checked={true} onChange={() => {}} label="Require phone number" />
              <Toggle checked={false} onChange={() => {}} label="Require advance payment" />
              <Button size="sm" onClick={() => toast.success('Settings saved')}>Save Rules</Button>
            </div>
          </Card>
        </div>

        <Card title="Booking Widget Preview">
          <div className="bg-slate-50 rounded-lg p-4 min-h-[500px]">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden max-w-sm mx-auto">
              <div className="bg-blue-600 text-white p-4 text-center">
                <h3 className="font-semibold">Mia Salon & Spa</h3>
                <p className="text-xs text-blue-100">Book your appointment</p>
              </div>
              <div className="p-4">
                {step === 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Select a Service</p>
                    {categories.map((cat) => (
                      <div key={cat.id}>
                        <p className="text-xs text-slate-400 font-medium uppercase">{cat.name}</p>
                        <div className="space-y-1 mt-1">
                          {services.filter((s) => s.categoryId === cat.id).slice(0, 3).map((s) => (
                            <button key={s.id} onClick={() => { setSelectedService(s.name); setStep(1); }} className={`w-full text-left p-2 rounded text-sm hover:bg-blue-50 transition-colors flex justify-between ${selectedService === s.name ? 'bg-blue-50 ring-1 ring-blue-200' : ''}`}>
                              <span>{s.name}</span>
                              <span className="text-slate-400">₹{s.price} · {s.duration}min</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {step === 1 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Select Date & Time</p>
                    <p className="text-xs text-slate-500">Service: {selectedService}</p>
                    <div className="grid grid-cols-4 gap-1">
                      {['Mon', 'Tue', 'Wed', 'Thu'].map((d) => (
                        <button key={d} className="p-2 text-xs rounded border hover:bg-blue-50">{d}</button>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {['10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map((t) => (
                        <button key={t} className="p-1.5 text-xs rounded border hover:bg-blue-50" onClick={() => setStep(2)}>{t}</button>
                      ))}
                    </div>
                    <button className="text-xs text-blue-600" onClick={() => setStep(0)}>Back</button>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-3 text-center">
                    <div className="text-emerald-500 text-3xl">✓</div>
                    <p className="text-sm font-medium">Booking Confirmed!</p>
                    <p className="text-xs text-slate-500">{selectedService}</p>
                    <button className="text-xs text-blue-600" onClick={() => { setStep(0); setSelectedService(''); }}>Book Another</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
