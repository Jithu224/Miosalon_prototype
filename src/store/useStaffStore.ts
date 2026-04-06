import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Staff } from '@/types/staff';
import { mockStaff } from '@/data/mockStaff';

interface StaffStore {
  staff: Staff[];
  addStaff: (member: Staff) => void;
  updateStaff: (id: string, data: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
  getStaff: (id: string) => Staff | undefined;
  getActiveStaff: () => Staff[];
}

export const useStaffStore = create<StaffStore>()(
  persist(
    (set, get) => ({
      staff: mockStaff,
      addStaff: (member) => set((s) => ({ staff: [...s.staff, member] })),
      updateStaff: (id, data) =>
        set((s) => ({
          staff: s.staff.map((m) => (m.id === id ? { ...m, ...data } : m)),
        })),
      deleteStaff: (id) =>
        set((s) => ({ staff: s.staff.filter((m) => m.id !== id) })),
      getStaff: (id) => get().staff.find((m) => m.id === id),
      getActiveStaff: () => get().staff.filter((m) => m.isActive),
    }),
    { name: 'miosalon-staff' }
  )
);
