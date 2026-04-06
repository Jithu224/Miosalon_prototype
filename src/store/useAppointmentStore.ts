import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Appointment, AppointmentStatus } from '@/types/appointment';

const mockAppointments: Appointment[] = [
  {
    id: 'apt-1', clientId: 'client-1', staffId: 'staff-1',
    services: [{ serviceId: 'svc-2', price: 500, duration: 45 }],
    date: '2026-04-06', startTime: '10:00', endTime: '10:45',
    status: 'confirmed', isRecurring: false, createdAt: '2026-04-01', source: 'online',
  },
  {
    id: 'apt-2', clientId: 'client-3', staffId: 'staff-2',
    services: [{ serviceId: 'svc-6', price: 800, duration: 45 }, { serviceId: 'svc-21', price: 2000, duration: 60 }],
    date: '2026-04-06', startTime: '11:00', endTime: '12:45',
    status: 'scheduled', isRecurring: false, createdAt: '2026-04-02', source: 'phone',
  },
  {
    id: 'apt-3', clientId: 'client-5', staffId: 'staff-5',
    services: [{ serviceId: 'svc-13', price: 800, duration: 45 }, { serviceId: 'svc-15', price: 600, duration: 30 }],
    date: '2026-04-06', startTime: '14:00', endTime: '15:15',
    status: 'scheduled', isRecurring: false, createdAt: '2026-04-03', source: 'app',
  },
  {
    id: 'apt-4', clientId: 'client-7', staffId: 'staff-6',
    services: [{ serviceId: 'svc-16', price: 2000, duration: 60 }],
    date: '2026-04-06', startTime: '15:00', endTime: '16:00',
    status: 'confirmed', isRecurring: true, recurringPattern: 'monthly', createdAt: '2026-03-01', source: 'online',
  },
  {
    id: 'apt-5', clientId: 'client-9', staffId: 'staff-2',
    services: [{ serviceId: 'svc-7', price: 1500, duration: 60 }],
    date: '2026-04-05', startTime: '10:00', endTime: '11:00',
    status: 'completed', isRecurring: false, createdAt: '2026-04-01', source: 'walk-in', invoiceId: 'inv-1',
  },
  {
    id: 'apt-6', clientId: 'client-2', staffId: 'staff-1',
    services: [{ serviceId: 'svc-1', price: 300, duration: 30 }],
    date: '2026-04-05', startTime: '11:30', endTime: '12:00',
    status: 'completed', isRecurring: false, createdAt: '2026-04-02', source: 'phone', invoiceId: 'inv-2',
  },
  {
    id: 'apt-7', clientId: 'client-13', staffId: 'staff-4',
    services: [{ serviceId: 'svc-8', price: 500, duration: 30 }, { serviceId: 'svc-11', price: 400, duration: 30 }],
    date: '2026-04-05', startTime: '14:00', endTime: '15:00',
    status: 'completed', isRecurring: false, createdAt: '2026-04-01', source: 'online', invoiceId: 'inv-3',
  },
  {
    id: 'apt-8', clientId: 'client-4', staffId: 'staff-3',
    services: [{ serviceId: 'svc-1', price: 300, duration: 30 }],
    date: '2026-04-04', startTime: '10:00', endTime: '10:30',
    status: 'completed', isRecurring: false, createdAt: '2026-04-01', source: 'walk-in', invoiceId: 'inv-4',
  },
  {
    id: 'apt-9', clientId: 'client-11', staffId: 'staff-2',
    services: [{ serviceId: 'svc-22', price: 8000, duration: 120 }],
    date: '2026-04-07', startTime: '09:00', endTime: '11:00',
    status: 'scheduled', isRecurring: false, createdAt: '2026-03-20', source: 'phone',
  },
  {
    id: 'apt-10', clientId: 'client-19', staffId: 'staff-1',
    services: [{ serviceId: 'svc-3', price: 2500, duration: 90 }],
    date: '2026-04-07', startTime: '13:00', endTime: '14:30',
    status: 'scheduled', isRecurring: false, createdAt: '2026-04-03', source: 'online',
  },
  {
    id: 'apt-11', clientId: 'client-8', staffId: 'staff-3',
    services: [{ serviceId: 'svc-1', price: 300, duration: 30 }],
    date: '2026-04-04', startTime: '16:00', endTime: '16:30',
    status: 'no-show', isRecurring: false, createdAt: '2026-04-01', source: 'app',
  },
  {
    id: 'apt-12', clientId: 'client-17', staffId: 'staff-6',
    services: [{ serviceId: 'svc-18', price: 3000, duration: 75 }],
    date: '2026-04-06', startTime: '16:30', endTime: '17:45',
    status: 'scheduled', isRecurring: false, createdAt: '2026-04-04', source: 'online',
  },
  {
    id: 'apt-13', clientId: 'client-25', staffId: 'staff-2',
    services: [{ serviceId: 'svc-9', price: 1200, duration: 45 }, { serviceId: 'svc-10', price: 2000, duration: 30 }],
    date: '2026-04-08', startTime: '11:00', endTime: '12:15',
    status: 'scheduled', isRecurring: false, createdAt: '2026-04-05', source: 'online',
  },
  {
    id: 'apt-14', clientId: 'client-21', staffId: 'staff-5',
    services: [{ serviceId: 'svc-12', price: 500, duration: 45 }],
    date: '2026-04-08', startTime: '14:00', endTime: '14:45',
    status: 'scheduled', isRecurring: true, recurringPattern: 'biweekly', createdAt: '2026-03-25', source: 'app',
  },
  {
    id: 'apt-15', clientId: 'client-15', staffId: 'staff-4',
    services: [{ serviceId: 'svc-6', price: 800, duration: 45 }],
    date: '2026-04-03', startTime: '15:00', endTime: '15:45',
    status: 'cancelled', isRecurring: false, createdAt: '2026-03-30', source: 'online',
    notes: 'Client requested cancellation due to personal emergency.',
  },
];

interface AppointmentStore {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, data: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  getAppointment: (id: string) => Appointment | undefined;
  getByDate: (date: string) => Appointment[];
  getByStaff: (staffId: string) => Appointment[];
  getByClient: (clientId: string) => Appointment[];
  updateStatus: (id: string, status: AppointmentStatus) => void;
}

export const useAppointmentStore = create<AppointmentStore>()(
  persist(
    (set, get) => ({
      appointments: mockAppointments,
      addAppointment: (appointment) =>
        set((s) => ({ appointments: [...s.appointments, appointment] })),
      updateAppointment: (id, data) =>
        set((s) => ({
          appointments: s.appointments.map((a) =>
            a.id === id ? { ...a, ...data } : a
          ),
        })),
      deleteAppointment: (id) =>
        set((s) => ({
          appointments: s.appointments.filter((a) => a.id !== id),
        })),
      getAppointment: (id) => get().appointments.find((a) => a.id === id),
      getByDate: (date) =>
        get().appointments.filter((a) => a.date === date),
      getByStaff: (staffId) =>
        get().appointments.filter((a) => a.staffId === staffId),
      getByClient: (clientId) =>
        get().appointments.filter((a) => a.clientId === clientId),
      updateStatus: (id, status) =>
        set((s) => ({
          appointments: s.appointments.map((a) =>
            a.id === id ? { ...a, status } : a
          ),
        })),
    }),
    { name: 'miosalon-appointments' }
  )
);
