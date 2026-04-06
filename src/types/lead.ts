export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: 'website' | 'social-media' | 'walk-in' | 'referral' | 'ad';
  interestedServices: string[];
  status: 'new' | 'contacted' | 'follow-up' | 'converted' | 'lost';
  assignedStaffId?: string;
  notes?: string;
  createdAt: string;
  lastContactedAt?: string;
}
