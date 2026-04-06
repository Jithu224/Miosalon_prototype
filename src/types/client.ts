export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  anniversary?: string;
  address?: string;
  notes?: string;
  allergies?: string[];
  preferences?: string[];
  status: 'active' | 'inactive' | 'churned';
  membershipId?: string;
  walletBalance: number;
  rewardPoints: number;
  createdAt: string;
  lastVisit?: string;
  totalSpent: number;
  visitCount: number;
  tags: string[];
  source: string;
}
