import { create } from 'zustand';

export type UserRole = 'owner' | 'manager' | 'staff';

interface RoleState {
  role: UserRole;
  staffId: string; // which staff member when role is 'staff'
  setRole: (role: UserRole) => void;
  setStaffId: (staffId: string) => void;
}

export const useRoleStore = create<RoleState>()((set) => ({
  role: 'owner',
  staffId: 'staff-1', // default: Ravi Kumar
  setRole: (role) => set({ role }),
  setStaffId: (staffId) => set({ staffId }),
}));

// Role-based permissions (from PRD persona-to-feature mapping)
export const ROLE_PERMISSIONS = {
  owner: {
    label: 'Priya (Owner)',
    canConfigureSalary: true,
    canRecordAdvances: true,
    canCalculateSalary: true,
    canApproveSalary: true,
    canMarkPaid: true,
    canExport: true,
    canViewAllStaff: true,
    canEditDeductions: true,
    canViewPayslip: true,
  },
  manager: {
    label: 'Deepak (Manager)',
    canConfigureSalary: false,
    canRecordAdvances: true,
    canCalculateSalary: true,
    canApproveSalary: false, // submits for owner approval
    canMarkPaid: false,
    canExport: true,
    canViewAllStaff: true,
    canEditDeductions: true,
    canViewPayslip: true,
  },
  staff: {
    label: 'Staff View',
    canConfigureSalary: false,
    canRecordAdvances: false,
    canCalculateSalary: false,
    canApproveSalary: false,
    canMarkPaid: false,
    canExport: false,
    canViewAllStaff: false, // can only see own salary
    canEditDeductions: false,
    canViewPayslip: true, // read-only
  },
};
