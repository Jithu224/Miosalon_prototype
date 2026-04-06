'use client';

import { useState, useMemo, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import toast from 'react-hot-toast';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useAppointmentStore } from '@/store/useAppointmentStore';
import { useClientStore } from '@/store/useClientStore';
import { useStaffStore } from '@/store/useStaffStore';
import { useServiceStore } from '@/store/useServiceStore';
import { useHydration } from '@/hooks/useHydration';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { formatCurrency, formatTime, generateId } from '@/lib/utils';
import { APPOINTMENT_CALENDAR_COLORS } from '@/lib/constants';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Appointment;
}

const STATUS_BADGE_VARIANT: Record<string, 'info' | 'success' | 'warning' | 'neutral' | 'danger' | 'orange'> = {
  scheduled: 'info',
  confirmed: 'success',
  'in-progress': 'warning',
  completed: 'neutral',
  cancelled: 'danger',
  'no-show': 'orange',
};

export default function AppointmentsPage() {
  const hydrated = useHydration();
  const { appointments, addAppointment, updateStatus } = useAppointmentStore();
  const { clients } = useClientStore();
  const { staff } = useStaffStore();
  const { services, categories } = useServiceStore();

  const [view, setView] = useState<View>('week');
  const [date, setDate] = useState(new Date());
  const [detailModal, setDetailModal] = useState<Appointment | null>(null);
  const [newModal, setNewModal] = useState(false);

  // New appointment form state
  const [formClientId, setFormClientId] = useState('');
  const [formStaffId, setFormStaffId] = useState('');
  const [formSelectedServices, setFormSelectedServices] = useState<string[]>([]);
  const [formDate, setFormDate] = useState('');
  const [formStartTime, setFormStartTime] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const events: CalendarEvent[] = useMemo(() => {
    return appointments.map((apt) => {
      const client = clients.find((c) => c.id === apt.clientId);
      const clientName = client ? `${client.firstName} ${client.lastName}` : 'Unknown';
      const serviceNames = apt.services
        .map((s) => services.find((svc) => svc.id === s.serviceId)?.name || 'Service')
        .join(', ');

      return {
        id: apt.id,
        title: `${clientName} - ${serviceNames}`,
        start: new Date(`${apt.date}T${apt.startTime}`),
        end: new Date(`${apt.date}T${apt.endTime}`),
        resource: apt,
      };
    });
  }, [appointments, clients, services]);

  const eventPropGetter = useCallback((event: CalendarEvent) => {
    const color = APPOINTMENT_CALENDAR_COLORS[event.resource.status] || '#3b82f6';
    return {
      style: {
        backgroundColor: color,
        borderRadius: '6px',
        opacity: 0.9,
        color: '#fff',
        border: 'none',
        fontSize: '12px',
      },
    };
  }, []);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setDetailModal(event.resource);
  }, []);

  const handleSelectSlot = useCallback(({ start }: { start: Date }) => {
    const d = format(start, 'yyyy-MM-dd');
    const t = format(start, 'HH:mm');
    setFormDate(d);
    setFormStartTime(t);
    setFormClientId('');
    setFormStaffId('');
    setFormSelectedServices([]);
    setFormNotes('');
    setNewModal(true);
  }, []);

  function resetForm() {
    setFormClientId('');
    setFormStaffId('');
    setFormSelectedServices([]);
    setFormNotes('');
    setFormDate('');
    setFormStartTime('');
  }

  function openNewModal() {
    resetForm();
    setNewModal(true);
  }

  const calculatedEndTime = useMemo(() => {
    if (!formStartTime || formSelectedServices.length === 0) return '';
    const totalMinutes = formSelectedServices.reduce((sum, svcId) => {
      const svc = services.find((s) => s.id === svcId);
      return sum + (svc?.duration || 0);
    }, 0);
    const [h, m] = formStartTime.split(':').map(Number);
    const totalMins = h * 60 + m + totalMinutes;
    const endH = Math.floor(totalMins / 60);
    const endM = totalMins % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  }, [formStartTime, formSelectedServices, services]);

  function handleSaveAppointment() {
    if (!formClientId || !formStaffId || formSelectedServices.length === 0 || !formDate || !formStartTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    const apt: Appointment = {
      id: generateId(),
      clientId: formClientId,
      staffId: formStaffId,
      services: formSelectedServices.map((svcId) => {
        const svc = services.find((s) => s.id === svcId)!;
        return { serviceId: svcId, price: svc.price, duration: svc.duration };
      }),
      date: formDate,
      startTime: formStartTime,
      endTime: calculatedEndTime,
      status: 'scheduled',
      notes: formNotes || undefined,
      isRecurring: false,
      createdAt: new Date().toISOString().split('T')[0],
      source: 'walk-in',
    };

    addAppointment(apt);
    toast.success('Appointment created successfully');
    setNewModal(false);
    resetForm();
  }

  function handleStatusChange(id: string, status: AppointmentStatus) {
    updateStatus(id, status);
    setDetailModal((prev) => (prev ? { ...prev, status } : null));
    toast.success(`Status updated to ${status}`);
  }

  function toggleService(svcId: string) {
    setFormSelectedServices((prev) =>
      prev.includes(svcId) ? prev.filter((id) => id !== svcId) : [...prev, svcId]
    );
  }

  if (!hydrated) {
    return (
      <PageWrapper title="Appointments">
        <div className="flex items-center justify-center h-96 text-slate-400">Loading...</div>
      </PageWrapper>
    );
  }

  const detailClient = detailModal ? clients.find((c) => c.id === detailModal.clientId) : null;
  const detailStaff = detailModal ? staff.find((s) => s.id === detailModal.staffId) : null;

  const clientOptions = clients.map((c) => ({ value: c.id, label: `${c.firstName} ${c.lastName}` }));
  const staffOptions = staff.filter((s) => s.isActive).map((s) => ({ value: s.id, label: `${s.firstName} ${s.lastName}` }));

  const servicesByCategory = categories.map((cat) => ({
    category: cat,
    items: services.filter((svc) => svc.categoryId === cat.id && svc.isActive),
  }));

  return (
    <PageWrapper
      title="Appointments"
      subtitle="Manage your salon appointments"
      actions={<Button onClick={openNewModal}>New Appointment</Button>}
    >
      {/* View toggle */}
      <div className="flex items-center gap-2 mb-4">
        {(['month', 'week', 'day'] as View[]).map((v) => (
          <Button
            key={v}
            variant={view === v ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setView(v)}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </Button>
        ))}
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4" style={{ height: 700 }}>
        <Calendar
          localizer={localizer}
          events={events}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={eventPropGetter}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          popup
          style={{ height: '100%' }}
        />
      </div>

      {/* Appointment Detail Modal */}
      <Modal
        isOpen={!!detailModal}
        onClose={() => setDetailModal(null)}
        title="Appointment Details"
        size="lg"
      >
        {detailModal && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Client</p>
                <p className="text-sm font-medium text-slate-900">
                  {detailClient ? `${detailClient.firstName} ${detailClient.lastName}` : 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Staff</p>
                <p className="text-sm font-medium text-slate-900">
                  {detailStaff ? `${detailStaff.firstName} ${detailStaff.lastName}` : 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Date</p>
                <p className="text-sm font-medium text-slate-900">{detailModal.date}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Time</p>
                <p className="text-sm font-medium text-slate-900">
                  {formatTime(detailModal.startTime)} - {formatTime(detailModal.endTime)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</p>
                <Badge variant={STATUS_BADGE_VARIANT[detailModal.status] || 'neutral'}>
                  {detailModal.status}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Source</p>
                <p className="text-sm font-medium text-slate-900 capitalize">{detailModal.source}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Services</p>
              <div className="space-y-1">
                {detailModal.services.map((s, i) => {
                  const svc = services.find((sv) => sv.id === s.serviceId);
                  return (
                    <div key={i} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 text-sm">
                      <span>{svc?.name || s.serviceId}</span>
                      <span className="font-medium">{formatCurrency(s.price)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {detailModal.notes && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Notes</p>
                <p className="text-sm text-slate-700">{detailModal.notes}</p>
              </div>
            )}

            <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
              {detailModal.status === 'scheduled' && (
                <Button size="sm" variant="success" onClick={() => handleStatusChange(detailModal.id, 'confirmed')}>
                  Confirm
                </Button>
              )}
              {(detailModal.status === 'scheduled' || detailModal.status === 'confirmed') && (
                <Button size="sm" onClick={() => handleStatusChange(detailModal.id, 'in-progress')}>
                  Start
                </Button>
              )}
              {detailModal.status === 'in-progress' && (
                <Button size="sm" variant="success" onClick={() => handleStatusChange(detailModal.id, 'completed')}>
                  Complete
                </Button>
              )}
              {detailModal.status !== 'completed' && detailModal.status !== 'cancelled' && (
                <Button size="sm" variant="danger" onClick={() => handleStatusChange(detailModal.id, 'cancelled')}>
                  Cancel
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => setDetailModal(null)} className="ml-auto">
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* New Appointment Modal */}
      <Modal
        isOpen={newModal}
        onClose={() => setNewModal(false)}
        title="New Appointment"
        size="xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setNewModal(false)}>Cancel</Button>
            <Button onClick={handleSaveAppointment}>Save Appointment</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Client"
              options={clientOptions}
              value={formClientId}
              onChange={(e) => setFormClientId(e.target.value)}
              placeholder="Select client..."
            />
            <Select
              label="Staff"
              options={staffOptions}
              value={formStaffId}
              onChange={(e) => setFormStaffId(e.target.value)}
              placeholder="Select staff..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Date"
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
            />
            <Input
              label="Start Time"
              type="time"
              value={formStartTime}
              onChange={(e) => setFormStartTime(e.target.value)}
            />
            <Input
              label="End Time (auto)"
              type="time"
              value={calculatedEndTime}
              readOnly
              className="bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Services</label>
            <div className="border border-slate-200 rounded-lg max-h-60 overflow-y-auto">
              {servicesByCategory.map(({ category, items }) =>
                items.length > 0 ? (
                  <div key={category.id}>
                    <div className="px-3 py-2 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider sticky top-0">
                      {category.name}
                    </div>
                    {items.map((svc) => (
                      <label
                        key={svc.id}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                      >
                        <input
                          type="checkbox"
                          checked={formSelectedServices.includes(svc.id)}
                          onChange={() => toggleService(svc.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700 flex-1">{svc.name}</span>
                        <span className="text-xs text-slate-500">{svc.duration}min</span>
                        <span className="text-sm font-medium text-slate-900">{formatCurrency(svc.price)}</span>
                      </label>
                    ))}
                  </div>
                ) : null
              )}
            </div>
            {formSelectedServices.length > 0 && (
              <p className="text-xs text-slate-500 mt-1">
                {formSelectedServices.length} service(s) selected — Total duration:{' '}
                {formSelectedServices.reduce((sum, id) => {
                  const svc = services.find((s) => s.id === id);
                  return sum + (svc?.duration || 0);
                }, 0)}{' '}
                min
              </p>
            )}
          </div>

          <Input
            label="Notes"
            value={formNotes}
            onChange={(e) => setFormNotes(e.target.value)}
            placeholder="Optional notes..."
          />
        </div>
      </Modal>
    </PageWrapper>
  );
}
