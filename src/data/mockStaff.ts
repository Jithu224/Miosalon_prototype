import { Staff } from '@/types/staff';

const defaultWorkingHours = [0, 1, 2, 3, 4, 5, 6].map(day => ({
  day: day as 0 | 1 | 2 | 3 | 4 | 5 | 6,
  startTime: '09:00',
  endTime: '20:00',
  isOff: day === 0,
}));

export const mockStaff: Staff[] = [
  {
    id: 'staff-1', firstName: 'Ravi', lastName: 'Kumar', email: 'ravi@miasalon.com', phone: '9876543210',
    role: 'stylist', serviceIds: ['svc-1', 'svc-2', 'svc-3', 'svc-4', 'svc-5', 'svc-25'],
    workingHours: defaultWorkingHours, commissionType: 'percentage', commissionRate: 15,
    isActive: true, joinDate: '2023-01-15', color: '#3b82f6',
  },
  {
    id: 'staff-2', firstName: 'Priya', lastName: 'Sharma', email: 'priya@miasalon.com', phone: '9876543211',
    role: 'stylist', serviceIds: ['svc-6', 'svc-7', 'svc-8', 'svc-9', 'svc-10', 'svc-21', 'svc-22', 'svc-23', 'svc-24'],
    workingHours: defaultWorkingHours, commissionType: 'percentage', commissionRate: 20,
    isActive: true, joinDate: '2022-06-01', color: '#10b981',
  },
  {
    id: 'staff-3', firstName: 'Amit', lastName: 'Patel', email: 'amit@miasalon.com', phone: '9876543212',
    role: 'stylist', serviceIds: ['svc-1', 'svc-2', 'svc-3', 'svc-25'],
    workingHours: defaultWorkingHours, commissionType: 'percentage', commissionRate: 12,
    isActive: true, joinDate: '2023-08-10', color: '#f59e0b',
  },
  {
    id: 'staff-4', firstName: 'Sneha', lastName: 'Reddy', email: 'sneha@miasalon.com', phone: '9876543213',
    role: 'therapist', serviceIds: ['svc-6', 'svc-7', 'svc-8', 'svc-11', 'svc-12', 'svc-21', 'svc-24'],
    workingHours: defaultWorkingHours, commissionType: 'percentage', commissionRate: 15,
    isActive: true, joinDate: '2023-03-20', color: '#ef4444',
  },
  {
    id: 'staff-5', firstName: 'Neha', lastName: 'Gupta', email: 'neha@miasalon.com', phone: '9876543214',
    role: 'stylist', serviceIds: ['svc-11', 'svc-12', 'svc-13', 'svc-14', 'svc-15'],
    workingHours: defaultWorkingHours, commissionType: 'fixed', commissionRate: 200,
    isActive: true, joinDate: '2024-01-05', color: '#8b5cf6',
  },
  {
    id: 'staff-6', firstName: 'Deepak', lastName: 'Singh', email: 'deepak@miasalon.com', phone: '9876543215',
    role: 'therapist', serviceIds: ['svc-16', 'svc-17', 'svc-18', 'svc-19', 'svc-20'],
    workingHours: defaultWorkingHours, commissionType: 'percentage', commissionRate: 18,
    isActive: true, joinDate: '2022-11-01', color: '#ec4899',
  },
  {
    id: 'staff-7', firstName: 'Arun', lastName: 'Mehta', email: 'arun@miasalon.com', phone: '9876543216',
    role: 'manager', serviceIds: [],
    workingHours: defaultWorkingHours, commissionType: 'fixed', commissionRate: 0,
    isActive: true, joinDate: '2022-01-01', color: '#06b6d4',
  },
  {
    id: 'staff-8', firstName: 'Kavita', lastName: 'Joshi', email: 'kavita@miasalon.com', phone: '9876543217',
    role: 'receptionist', serviceIds: [],
    workingHours: defaultWorkingHours, commissionType: 'fixed', commissionRate: 0,
    isActive: true, joinDate: '2023-05-15', color: '#84cc16',
  },
];
