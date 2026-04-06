export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';

export interface Appointment {
  id: string;
  clientId: string;
  staffId: string;
  services: { serviceId: string; price: number; duration: number }[];
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  isRecurring: boolean;
  recurringPattern?: 'weekly' | 'biweekly' | 'monthly';
  invoiceId?: string;
  createdAt: string;
  source: 'walk-in' | 'phone' | 'online' | 'app';
}
