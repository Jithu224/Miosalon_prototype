import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Membership, GiftVoucher } from '@/types/loyalty';

const mockMemberships: Membership[] = [
  {
    id: 'mem-1', name: 'Silver', price: 2999, validityDays: 180,
    discountPercentage: 10, applicableServiceIds: [], isActive: true,
    description: '10% discount on all services for 6 months.',
  },
  {
    id: 'mem-2', name: 'Gold', price: 5999, validityDays: 365,
    discountPercentage: 15, applicableServiceIds: [], isActive: true,
    description: '15% discount on all services for 1 year. Priority booking.',
  },
  {
    id: 'mem-3', name: 'Platinum', price: 9999, validityDays: 365,
    discountPercentage: 25, applicableServiceIds: [], isActive: true,
    description: '25% discount on all services for 1 year. Priority booking + complimentary head massage every month.',
  },
];

const mockGiftVouchers: GiftVoucher[] = [
  {
    id: 'gv-1', code: 'GIFT-1001', amount: 1000, balance: 1000,
    purchasedBy: 'client-1', expiryDate: '2026-10-06',
    status: 'active', createdAt: '2026-04-06',
  },
  {
    id: 'gv-2', code: 'GIFT-1002', amount: 2500, balance: 2500,
    purchasedBy: 'client-7', expiryDate: '2026-07-06',
    status: 'active', createdAt: '2026-01-06',
  },
  {
    id: 'gv-3', code: 'GIFT-1003', amount: 5000, balance: 0,
    purchasedBy: 'client-3', redeemedBy: 'client-19',
    expiryDate: '2026-06-15', status: 'redeemed', createdAt: '2025-12-15',
  },
  {
    id: 'gv-4', code: 'GIFT-1004', amount: 1500, balance: 1500,
    purchasedBy: 'client-25', expiryDate: '2025-12-31',
    status: 'expired', createdAt: '2025-06-30',
  },
  {
    id: 'gv-5', code: 'GIFT-1005', amount: 3000, balance: 1200,
    purchasedBy: 'client-5', redeemedBy: 'client-21',
    expiryDate: '2026-09-01', status: 'active', createdAt: '2026-03-01',
  },
];

interface LoyaltyStore {
  memberships: Membership[];
  giftVouchers: GiftVoucher[];
  addMembership: (membership: Membership) => void;
  updateMembership: (id: string, data: Partial<Membership>) => void;
  deleteMembership: (id: string) => void;
  getMembership: (id: string) => Membership | undefined;
  addGiftVoucher: (voucher: GiftVoucher) => void;
  updateGiftVoucher: (id: string, data: Partial<GiftVoucher>) => void;
  deleteGiftVoucher: (id: string) => void;
  getGiftVoucher: (id: string) => GiftVoucher | undefined;
}

export const useLoyaltyStore = create<LoyaltyStore>()(
  persist(
    (set, get) => ({
      memberships: mockMemberships,
      giftVouchers: mockGiftVouchers,
      addMembership: (membership) =>
        set((s) => ({ memberships: [...s.memberships, membership] })),
      updateMembership: (id, data) =>
        set((s) => ({
          memberships: s.memberships.map((m) =>
            m.id === id ? { ...m, ...data } : m
          ),
        })),
      deleteMembership: (id) =>
        set((s) => ({
          memberships: s.memberships.filter((m) => m.id !== id),
        })),
      getMembership: (id) => get().memberships.find((m) => m.id === id),
      addGiftVoucher: (voucher) =>
        set((s) => ({ giftVouchers: [...s.giftVouchers, voucher] })),
      updateGiftVoucher: (id, data) =>
        set((s) => ({
          giftVouchers: s.giftVouchers.map((v) =>
            v.id === id ? { ...v, ...data } : v
          ),
        })),
      deleteGiftVoucher: (id) =>
        set((s) => ({
          giftVouchers: s.giftVouchers.filter((v) => v.id !== id),
        })),
      getGiftVoucher: (id) => get().giftVouchers.find((v) => v.id === id),
    }),
    { name: 'miosalon-loyalty' }
  )
);
