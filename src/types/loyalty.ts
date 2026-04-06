export interface Membership {
  id: string;
  name: string;
  price: number;
  validityDays: number;
  discountPercentage: number;
  applicableServiceIds: string[];
  isActive: boolean;
  description?: string;
}

export interface GiftVoucher {
  id: string;
  code: string;
  amount: number;
  balance: number;
  purchasedBy?: string;
  redeemedBy?: string;
  expiryDate: string;
  status: 'active' | 'redeemed' | 'expired';
  createdAt: string;
}

export interface PrepaidWallet {
  clientId: string;
  balance: number;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
}
