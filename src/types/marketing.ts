export interface Campaign {
  id: string;
  name: string;
  type: 'sms' | 'email' | 'whatsapp';
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  targetAudience: 'all' | 'active' | 'inactive' | 'birthday' | 'custom';
  message: string;
  scheduledAt?: string;
  sentAt?: string;
  recipientCount: number;
  openRate?: number;
  createdAt: string;
}

export interface DiscountCoupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minBillAmount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}
