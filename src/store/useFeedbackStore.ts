import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Feedback } from '@/types/feedback';

const mockFeedback: Feedback[] = [
  {
    id: 'fb-1', clientId: 'client-1', appointmentId: 'apt-5', rating: 5,
    comment: 'Amazing gold facial! Priya is the best. My skin feels so refreshed.',
    staffId: 'staff-2', createdAt: '2026-04-05', googleReviewSent: true,
  },
  {
    id: 'fb-2', clientId: 'client-2', appointmentId: 'apt-6', rating: 4,
    comment: 'Good haircut as always. Slightly longer wait than expected.',
    staffId: 'staff-1', createdAt: '2026-04-05', googleReviewSent: false,
  },
  {
    id: 'fb-3', clientId: 'client-13', appointmentId: 'apt-7', rating: 5,
    comment: 'Wonderful cleanup and manicure combo. Sneha is very thorough.',
    staffId: 'staff-4', createdAt: '2026-04-05', googleReviewSent: true,
  },
  {
    id: 'fb-4', clientId: 'client-4', appointmentId: 'apt-8', rating: 3,
    comment: 'Haircut was okay. Nothing special.',
    staffId: 'staff-3', createdAt: '2026-04-04', googleReviewSent: false,
  },
  {
    id: 'fb-5', clientId: 'client-5', appointmentId: 'apt-3', rating: 5,
    staffId: 'staff-5', createdAt: '2026-04-03', googleReviewSent: true,
  },
  {
    id: 'fb-6', clientId: 'client-7', appointmentId: 'apt-4', rating: 4,
    comment: 'Great massage. Deepak really knows his pressure points.',
    staffId: 'staff-6', createdAt: '2026-04-02', googleReviewSent: true,
  },
  {
    id: 'fb-7', clientId: 'client-9', appointmentId: 'apt-5', rating: 5,
    comment: 'Love the gold facial results. Will definitely come back.',
    staffId: 'staff-2', createdAt: '2026-04-01', googleReviewSent: false,
  },
  {
    id: 'fb-8', clientId: 'client-11', appointmentId: 'apt-9', rating: 4,
    comment: 'Bridal trial went well. Minor adjustments needed for the final look.',
    staffId: 'staff-2', createdAt: '2026-03-30', googleReviewSent: false,
  },
  {
    id: 'fb-9', clientId: 'client-19', appointmentId: 'apt-10', rating: 5,
    comment: 'Ravi did an excellent job with my hair coloring. Exactly the shade I wanted!',
    staffId: 'staff-1', createdAt: '2026-03-28', googleReviewSent: true,
  },
  {
    id: 'fb-10', clientId: 'client-25', appointmentId: 'apt-13', rating: 5,
    comment: 'Premium experience as always. The chemical peel was fantastic.',
    staffId: 'staff-2', createdAt: '2026-03-27', googleReviewSent: true,
  },
  {
    id: 'fb-11', clientId: 'client-17', appointmentId: 'apt-12', rating: 2,
    comment: 'Aromatherapy session was shorter than expected. Felt rushed.',
    staffId: 'staff-6', createdAt: '2026-03-25', googleReviewSent: false,
  },
  {
    id: 'fb-12', clientId: 'client-21', appointmentId: 'apt-14', rating: 4,
    staffId: 'staff-5', createdAt: '2026-03-24', googleReviewSent: false,
  },
  {
    id: 'fb-13', clientId: 'client-3', appointmentId: 'apt-2', rating: 1,
    comment: 'Very disappointed. Had to wait 40 minutes past my appointment time. Staff was unapologetic.',
    staffId: 'staff-2', createdAt: '2026-03-22', googleReviewSent: false,
  },
  {
    id: 'fb-14', clientId: 'client-24', appointmentId: 'apt-8', rating: 4,
    comment: 'Nice haircut for my son. Amit is patient with kids.',
    staffId: 'staff-3', createdAt: '2026-03-20', googleReviewSent: false,
  },
  {
    id: 'fb-15', clientId: 'client-23', appointmentId: 'apt-3', rating: 3,
    comment: 'Nail art was decent but design could have been more creative.',
    staffId: 'staff-5', createdAt: '2026-03-18', googleReviewSent: false,
  },
];

interface FeedbackStore {
  feedback: Feedback[];
  addFeedback: (item: Feedback) => void;
  updateFeedback: (id: string, data: Partial<Feedback>) => void;
  deleteFeedback: (id: string) => void;
  getFeedback: (id: string) => Feedback | undefined;
  getAverageRating: () => number;
}

export const useFeedbackStore = create<FeedbackStore>()(
  persist(
    (set, get) => ({
      feedback: mockFeedback,
      addFeedback: (item) =>
        set((s) => ({ feedback: [...s.feedback, item] })),
      updateFeedback: (id, data) =>
        set((s) => ({
          feedback: s.feedback.map((f) =>
            f.id === id ? { ...f, ...data } : f
          ),
        })),
      deleteFeedback: (id) =>
        set((s) => ({ feedback: s.feedback.filter((f) => f.id !== id) })),
      getFeedback: (id) => get().feedback.find((f) => f.id === id),
      getAverageRating: () => {
        const items = get().feedback;
        if (items.length === 0) return 0;
        const sum = items.reduce((acc, f) => acc + f.rating, 0);
        return Math.round((sum / items.length) * 10) / 10;
      },
    }),
    { name: 'miosalon-feedback' }
  )
);
