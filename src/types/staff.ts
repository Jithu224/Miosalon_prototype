export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'stylist' | 'therapist' | 'receptionist';
  avatar?: string;
  serviceIds: string[];
  workingHours: WorkingHours[];
  commissionType: 'percentage' | 'fixed' | 'tiered';
  commissionRate: number;
  isActive: boolean;
  joinDate: string;
  color: string;
}

export interface WorkingHours {
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  startTime: string;
  endTime: string;
  isOff: boolean;
}
