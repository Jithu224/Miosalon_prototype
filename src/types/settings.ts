export interface BusinessSettings {
  businessName: string;
  logo?: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  operatingHours: DaySchedule[];
  taxName: string;
  taxRate: number;
  paymentModes: string[];
  invoicePrefix: string;
  enableOnlineBooking: boolean;
  enable2FA: boolean;
}

export interface DaySchedule {
  day: number;
  dayName: string;
  open: string;
  close: string;
  isOpen: boolean;
}
