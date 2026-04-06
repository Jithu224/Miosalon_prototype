export interface Feedback {
  id: string;
  clientId: string;
  appointmentId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  staffId: string;
  createdAt: string;
  googleReviewSent: boolean;
}
