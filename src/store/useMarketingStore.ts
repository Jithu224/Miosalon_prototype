import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Campaign } from '@/types/marketing';

const mockCampaigns: Campaign[] = [
  {
    id: 'camp-1', name: 'Summer Glow Offer', type: 'sms', status: 'sent',
    targetAudience: 'active', message: 'Get 20% off on all facials this summer! Book now at Mia Salon & Spa. Valid till 30th April.',
    scheduledAt: '2026-04-01T10:00:00', sentAt: '2026-04-01T10:00:00',
    recipientCount: 180, openRate: 72, createdAt: '2026-03-28',
  },
  {
    id: 'camp-2', name: 'Birthday Month Special', type: 'whatsapp', status: 'scheduled',
    targetAudience: 'birthday', message: 'Happy Birthday! Enjoy a complimentary head massage with any service this month. Show this message at the counter.',
    scheduledAt: '2026-04-10T09:00:00',
    recipientCount: 24, createdAt: '2026-04-05',
  },
  {
    id: 'camp-3', name: 'Win-back Inactive Clients', type: 'email', status: 'sent',
    targetAudience: 'inactive', message: 'We miss you! Come back to Mia Salon & Spa and get flat Rs.500 off on your next visit. Use code COMEBACK500.',
    scheduledAt: '2026-03-15T11:00:00', sentAt: '2026-03-15T11:05:00',
    recipientCount: 45, openRate: 38, createdAt: '2026-03-12',
  },
  {
    id: 'camp-4', name: 'Bridal Season Launch', type: 'whatsapp', status: 'draft',
    targetAudience: 'all', message: 'Bridal season is here! Book our exclusive bridal packages starting at Rs.15,000. Pre-wedding consultations available.',
    recipientCount: 0, createdAt: '2026-04-04',
  },
  {
    id: 'camp-5', name: 'Referral Reward Blast', type: 'sms', status: 'sent',
    targetAudience: 'active', message: 'Refer a friend and earn Rs.200 wallet credits! Your friend gets 15% off on their first visit. T&C apply.',
    scheduledAt: '2026-03-20T10:00:00', sentAt: '2026-03-20T10:00:00',
    recipientCount: 160, openRate: 65, createdAt: '2026-03-18',
  },
];

interface MarketingStore {
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, data: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  getCampaign: (id: string) => Campaign | undefined;
}

export const useMarketingStore = create<MarketingStore>()(
  persist(
    (set, get) => ({
      campaigns: mockCampaigns,
      addCampaign: (campaign) =>
        set((s) => ({ campaigns: [...s.campaigns, campaign] })),
      updateCampaign: (id, data) =>
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),
      deleteCampaign: (id) =>
        set((s) => ({ campaigns: s.campaigns.filter((c) => c.id !== id) })),
      getCampaign: (id) => get().campaigns.find((c) => c.id === id),
    }),
    { name: 'miosalon-marketing' }
  )
);
