import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Lead } from '@/types/lead';

const mockLeads: Lead[] = [
  {
    id: 'lead-1', name: 'Ritu Sharma', phone: '9112345001', email: 'ritu.s@gmail.com',
    source: 'website', interestedServices: ['svc-22', 'svc-23'], status: 'new',
    createdAt: '2026-04-05', notes: 'Enquired about bridal packages for June wedding.',
  },
  {
    id: 'lead-2', name: 'Anil Kapoor', phone: '9112345002',
    source: 'walk-in', interestedServices: ['svc-1'], status: 'converted',
    assignedStaffId: 'staff-8', createdAt: '2026-03-20', lastContactedAt: '2026-03-22',
    notes: 'Converted to client-20.',
  },
  {
    id: 'lead-3', name: 'Prerna Joshi', phone: '9112345003', email: 'prerna.j@outlook.com',
    source: 'social-media', interestedServices: ['svc-5', 'svc-3'], status: 'contacted',
    assignedStaffId: 'staff-8', createdAt: '2026-04-01', lastContactedAt: '2026-04-03',
    notes: 'Interested in keratin treatment. Shared price list.',
  },
  {
    id: 'lead-4', name: 'Deepa Murthy', phone: '9112345004',
    source: 'referral', interestedServices: ['svc-16', 'svc-18'], status: 'follow-up',
    assignedStaffId: 'staff-7', createdAt: '2026-03-25', lastContactedAt: '2026-04-02',
    notes: 'Referred by client-7. Wants to try spa services. Follow up next week.',
  },
  {
    id: 'lead-5', name: 'Sunil Reddy', phone: '9112345005', email: 'sunil.r@yahoo.com',
    source: 'ad', interestedServices: ['svc-1', 'svc-4'], status: 'new',
    createdAt: '2026-04-06', notes: 'Came via Google Ads campaign.',
  },
  {
    id: 'lead-6', name: 'Meghna Patel', phone: '9112345006', email: 'meghna.p@gmail.com',
    source: 'website', interestedServices: ['svc-13', 'svc-15'], status: 'contacted',
    assignedStaffId: 'staff-8', createdAt: '2026-03-28', lastContactedAt: '2026-03-30',
    notes: 'Interested in gel nails. Asked about nail art designs.',
  },
  {
    id: 'lead-7', name: 'Kiran Das', phone: '9112345007',
    source: 'social-media', interestedServices: ['svc-6', 'svc-9'], status: 'lost',
    assignedStaffId: 'staff-7', createdAt: '2026-02-15', lastContactedAt: '2026-03-10',
    notes: 'No response after 3 follow-ups. Marked as lost.',
  },
  {
    id: 'lead-8', name: 'Fatima Begum', phone: '9112345008', email: 'fatima.b@gmail.com',
    source: 'referral', interestedServices: ['svc-22'], status: 'follow-up',
    assignedStaffId: 'staff-8', createdAt: '2026-04-02', lastContactedAt: '2026-04-04',
    notes: 'Sister getting married in May. Wants bridal trial session.',
  },
  {
    id: 'lead-9', name: 'Rohini Kulkarni', phone: '9112345009',
    source: 'walk-in', interestedServices: ['svc-7', 'svc-8'], status: 'new',
    createdAt: '2026-04-06', notes: 'Walked in to enquire about facial packages.',
  },
  {
    id: 'lead-10', name: 'Ajay Nair', phone: '9112345010', email: 'ajay.n@gmail.com',
    source: 'ad', interestedServices: ['svc-17'], status: 'contacted',
    assignedStaffId: 'staff-7', createdAt: '2026-03-30', lastContactedAt: '2026-04-01',
    notes: 'Enquired about deep tissue massage. Sent schedule.',
  },
  {
    id: 'lead-11', name: 'Savitha Hegde', phone: '9112345011',
    source: 'website', interestedServices: ['svc-11', 'svc-12'], status: 'converted',
    assignedStaffId: 'staff-8', createdAt: '2026-03-10', lastContactedAt: '2026-03-15',
    notes: 'Converted to client-23.',
  },
  {
    id: 'lead-12', name: 'Naveen Gowda', phone: '9112345012', email: 'naveen.g@outlook.com',
    source: 'social-media', interestedServices: ['svc-1', 'svc-25'], status: 'lost',
    assignedStaffId: 'staff-7', createdAt: '2026-02-20', lastContactedAt: '2026-03-05',
    notes: 'Found another salon closer to home.',
  },
];

interface LeadStore {
  leads: Lead[];
  addLead: (lead: Lead) => void;
  updateLead: (id: string, data: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  getLead: (id: string) => Lead | undefined;
  updateStatus: (id: string, status: Lead['status']) => void;
}

export const useLeadStore = create<LeadStore>()(
  persist(
    (set, get) => ({
      leads: mockLeads,
      addLead: (lead) => set((s) => ({ leads: [...s.leads, lead] })),
      updateLead: (id, data) =>
        set((s) => ({
          leads: s.leads.map((l) => (l.id === id ? { ...l, ...data } : l)),
        })),
      deleteLead: (id) =>
        set((s) => ({ leads: s.leads.filter((l) => l.id !== id) })),
      getLead: (id) => get().leads.find((l) => l.id === id),
      updateStatus: (id, status) =>
        set((s) => ({
          leads: s.leads.map((l) =>
            l.id === id ? { ...l, status } : l
          ),
        })),
    }),
    { name: 'miosalon-leads' }
  )
);
