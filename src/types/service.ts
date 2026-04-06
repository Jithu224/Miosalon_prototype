export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
}

export interface Service {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
  duration: number;
  price: number;
  taxRate: number;
  staffIds: string[];
  isActive: boolean;
  color?: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  services: { serviceId: string; quantity: number }[];
  totalPrice: number;
  discountedPrice: number;
  validityDays: number;
  isActive: boolean;
}
