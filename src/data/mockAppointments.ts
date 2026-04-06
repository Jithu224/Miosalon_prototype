import { Appointment } from '@/types/appointment';

const today = new Date();
const getDateStr = (daysOffset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

export const mockAppointments: Appointment[] = [
  // --- Past week (completed) ---
  {
    id: 'apt-1', clientId: 'client-1', staffId: 'staff-2',
    services: [{ serviceId: 'svc-6', price: 800, duration: 45 }, { serviceId: 'svc-8', price: 500, duration: 30 }],
    date: getDateStr(-7), startTime: '10:00', endTime: '11:15',
    status: 'completed', isRecurring: false, createdAt: getDateStr(-9), source: 'phone', invoiceId: 'inv-1',
  },
  {
    id: 'apt-2', clientId: 'client-2', staffId: 'staff-1',
    services: [{ serviceId: 'svc-1', price: 300, duration: 30 }],
    date: getDateStr(-7), startTime: '11:00', endTime: '11:30',
    status: 'completed', isRecurring: false, createdAt: getDateStr(-8), source: 'walk-in', invoiceId: 'inv-2',
  },
  {
    id: 'apt-3', clientId: 'client-5', staffId: 'staff-5',
    services: [{ serviceId: 'svc-13', price: 800, duration: 45 }, { serviceId: 'svc-15', price: 600, duration: 30 }],
    date: getDateStr(-6), startTime: '14:00', endTime: '15:15',
    status: 'completed', isRecurring: false, createdAt: getDateStr(-8), source: 'online', invoiceId: 'inv-3',
  },
  {
    id: 'apt-4', clientId: 'client-7', staffId: 'staff-6',
    services: [{ serviceId: 'svc-16', price: 2000, duration: 60 }],
    date: getDateStr(-6), startTime: '10:00', endTime: '11:00',
    status: 'completed', isRecurring: true, recurringPattern: 'monthly', createdAt: getDateStr(-7), source: 'app', invoiceId: 'inv-4',
  },
  {
    id: 'apt-5', clientId: 'client-3', staffId: 'staff-2',
    services: [{ serviceId: 'svc-22', price: 8000, duration: 120 }],
    date: getDateStr(-5), startTime: '09:00', endTime: '11:00',
    status: 'completed', isRecurring: false, createdAt: getDateStr(-7), source: 'phone', invoiceId: 'inv-5',
  },
  {
    id: 'apt-6', clientId: 'client-12', staffId: 'staff-3',
    services: [{ serviceId: 'svc-1', price: 300, duration: 30 }],
    date: getDateStr(-5), startTime: '12:00', endTime: '12:30',
    status: 'completed', isRecurring: false, createdAt: getDateStr(-6), source: 'walk-in', invoiceId: 'inv-6',
  },
  {
    id: 'apt-7', clientId: 'client-9', staffId: 'staff-4',
    services: [{ serviceId: 'svc-6', price: 800, duration: 45 }],
    date: getDateStr(-4), startTime: '15:00', endTime: '15:45',
    status: 'completed', isRecurring: false, createdAt: getDateStr(-5), source: 'online', invoiceId: 'inv-7',
  },
  {
    id: 'apt-8', clientId: 'client-11', staffId: 'staff-1',
    services: [{ serviceId: 'svc-2', price: 500, duration: 45 }, { serviceId: 'svc-4', price: 1500, duration: 60 }],
    date: getDateStr(-4), startTime: '10:00', endTime: '11:45',
    status: 'completed', isRecurring: false, createdAt: getDateStr(-6), source: 'phone',
  },
  {
    id: 'apt-9', clientId: 'client-13', staffId: 'staff-2',
    services: [{ serviceId: 'svc-7', price: 1500, duration: 60 }, { serviceId: 'svc-9', price: 1200, duration: 45 }],
    date: getDateStr(-3), startTime: '11:00', endTime: '12:45',
    status: 'completed', isRecurring: false, createdAt: getDateStr(-4), source: 'online',
  },
  {
    id: 'apt-10', clientId: 'client-17', staffId: 'staff-6',
    services: [{ serviceId: 'svc-18', price: 3000, duration: 75 }],
    date: getDateStr(-3), startTime: '14:00', endTime: '15:15',
    status: 'completed', isRecurring: false, createdAt: getDateStr(-4), source: 'phone',
  },
  {
    id: 'apt-11', clientId: 'client-4', staffId: 'staff-3',
    services: [{ serviceId: 'svc-1', price: 300, duration: 30 }],
    date: getDateStr(-2), startTime: '10:00', endTime: '10:30',
    status: 'completed', isRecurring: false, createdAt: getDateStr(-3), source: 'walk-in',
  },
  {
    id: 'apt-12', clientId: 'client-25', staffId: 'staff-2',
    services: [{ serviceId: 'svc-10', price: 2000, duration: 30 }, { serviceId: 'svc-21', price: 2000, duration: 60 }],
    date: getDateStr(-2), startTime: '13:00', endTime: '14:30',
    status: 'completed', isRecurring: false, createdAt: getDateStr(-3), source: 'phone',
  },
  {
    id: 'apt-13', clientId: 'client-21', staffId: 'staff-4',
    services: [{ serviceId: 'svc-11', price: 400, duration: 30 }, { serviceId: 'svc-12', price: 500, duration: 45 }],
    date: getDateStr(-1), startTime: '11:00', endTime: '12:15',
    status: 'completed', isRecurring: false, createdAt: getDateStr(-2), source: 'online',
  },
  {
    id: 'apt-14', clientId: 'client-8', staffId: 'staff-6',
    services: [{ serviceId: 'svc-17', price: 2500, duration: 60 }],
    date: getDateStr(-1), startTime: '16:00', endTime: '17:00',
    status: 'no-show', isRecurring: false, createdAt: getDateStr(-3), source: 'online',
  },
  {
    id: 'apt-15', clientId: 'client-15', staffId: 'staff-1',
    services: [{ serviceId: 'svc-2', price: 500, duration: 45 }],
    date: getDateStr(-1), startTime: '14:00', endTime: '14:45',
    status: 'completed', isRecurring: false, createdAt: getDateStr(-2), source: 'phone',
  },
  // --- Yesterday ---
  {
    id: 'apt-16', clientId: 'client-19', staffId: 'staff-2',
    services: [{ serviceId: 'svc-23', price: 5000, duration: 90 }],
    date: getDateStr(-1), startTime: '10:00', endTime: '11:30',
    status: 'completed', isRecurring: false, createdAt: getDateStr(-3), source: 'phone',
  },
  {
    id: 'apt-17', clientId: 'client-24', staffId: 'staff-3',
    services: [{ serviceId: 'svc-1', price: 300, duration: 30 }, { serviceId: 'svc-25', price: 1000, duration: 45 }],
    date: getDateStr(-1), startTime: '11:00', endTime: '12:15',
    status: 'completed', isRecurring: false, createdAt: getDateStr(-2), source: 'walk-in',
  },
  // --- Today ---
  {
    id: 'apt-18', clientId: 'client-25', staffId: 'staff-2',
    services: [{ serviceId: 'svc-7', price: 1500, duration: 60 }, { serviceId: 'svc-10', price: 2000, duration: 30 }],
    date: getDateStr(0), startTime: '10:00', endTime: '11:30',
    status: 'confirmed', isRecurring: false, createdAt: getDateStr(-2), source: 'online',
    notes: 'Gold facial + chemical peel.',
  },
  {
    id: 'apt-19', clientId: 'client-17', staffId: 'staff-1',
    services: [{ serviceId: 'svc-2', price: 500, duration: 45 }, { serviceId: 'svc-25', price: 1000, duration: 45 }],
    date: getDateStr(0), startTime: '11:00', endTime: '12:30',
    status: 'confirmed', isRecurring: false, createdAt: getDateStr(-1), source: 'phone',
  },
  {
    id: 'apt-20', clientId: 'client-12', staffId: 'staff-3',
    services: [{ serviceId: 'svc-1', price: 300, duration: 30 }],
    date: getDateStr(0), startTime: '10:30', endTime: '11:00',
    status: 'in-progress', isRecurring: false, createdAt: getDateStr(-1), source: 'walk-in',
  },
  {
    id: 'apt-21', clientId: 'client-21', staffId: 'staff-5',
    services: [{ serviceId: 'svc-11', price: 400, duration: 30 }, { serviceId: 'svc-12', price: 500, duration: 45 }],
    date: getDateStr(0), startTime: '14:00', endTime: '15:15',
    status: 'scheduled', isRecurring: false, createdAt: getDateStr(-2), source: 'online',
  },
  {
    id: 'apt-22', clientId: 'client-19', staffId: 'staff-6',
    services: [{ serviceId: 'svc-18', price: 3000, duration: 75 }],
    date: getDateStr(0), startTime: '15:00', endTime: '16:15',
    status: 'scheduled', isRecurring: false, createdAt: getDateStr(-1), source: 'phone',
  },
  // --- Tomorrow and future ---
  {
    id: 'apt-23', clientId: 'client-7', staffId: 'staff-2',
    services: [{ serviceId: 'svc-6', price: 800, duration: 45 }, { serviceId: 'svc-9', price: 1200, duration: 45 }],
    date: getDateStr(1), startTime: '10:00', endTime: '11:30',
    status: 'confirmed', isRecurring: false, createdAt: getDateStr(0), source: 'online',
  },
  {
    id: 'apt-24', clientId: 'client-15', staffId: 'staff-1',
    services: [{ serviceId: 'svc-5', price: 5000, duration: 120 }],
    date: getDateStr(1), startTime: '13:00', endTime: '15:00',
    status: 'confirmed', isRecurring: false, createdAt: getDateStr(-1), source: 'phone',
    notes: 'Keratin treatment - first time.',
  },
  {
    id: 'apt-25', clientId: 'client-23', staffId: 'staff-4',
    services: [{ serviceId: 'svc-21', price: 2000, duration: 60 }],
    date: getDateStr(2), startTime: '16:00', endTime: '17:00',
    status: 'scheduled', isRecurring: false, createdAt: getDateStr(0), source: 'online',
    notes: 'Party makeup for college event.',
  },
  {
    id: 'apt-26', clientId: 'client-3', staffId: 'staff-1',
    services: [{ serviceId: 'svc-3', price: 2500, duration: 90 }],
    date: getDateStr(3), startTime: '10:00', endTime: '11:30',
    status: 'scheduled', isRecurring: false, createdAt: getDateStr(0), source: 'phone',
  },
  {
    id: 'apt-27', clientId: 'client-10', staffId: 'staff-6',
    services: [{ serviceId: 'svc-16', price: 2000, duration: 60 }, { serviceId: 'svc-19', price: 1800, duration: 45 }],
    date: getDateStr(4), startTime: '11:00', endTime: '12:45',
    status: 'scheduled', isRecurring: false, createdAt: getDateStr(0), source: 'app',
  },
];
