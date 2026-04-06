import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BusinessSettings } from '@/types/settings';

const defaultSettings: BusinessSettings = {
  businessName: 'Mia Salon & Spa',
  phone: '+91 80 4567 8900',
  email: 'info@miasalon.com',
  address: '42, 1st Floor, 100 Feet Road, Indiranagar, Bangalore - 560038',
  currency: 'INR',
  currencySymbol: '\u20B9',
  timezone: 'Asia/Kolkata',
  taxName: 'GST',
  taxRate: 18,
  paymentModes: ['Cash', 'Card', 'UPI', 'Wallet'],
  invoicePrefix: 'INV',
  enableOnlineBooking: true,
  enable2FA: false,
  operatingHours: [
    { day: 0, dayName: 'Sunday', open: '10:00', close: '21:00', isOpen: false },
    { day: 1, dayName: 'Monday', open: '10:00', close: '21:00', isOpen: true },
    { day: 2, dayName: 'Tuesday', open: '10:00', close: '21:00', isOpen: true },
    { day: 3, dayName: 'Wednesday', open: '10:00', close: '21:00', isOpen: true },
    { day: 4, dayName: 'Thursday', open: '10:00', close: '21:00', isOpen: true },
    { day: 5, dayName: 'Friday', open: '10:00', close: '21:00', isOpen: true },
    { day: 6, dayName: 'Saturday', open: '10:00', close: '21:00', isOpen: true },
  ],
};

interface SettingsStore {
  settings: BusinessSettings;
  updateSettings: (data: Partial<BusinessSettings>) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (data) =>
        set((s) => ({ settings: { ...s.settings, ...data } })),
    }),
    { name: 'miosalon-settings' }
  )
);
