import { ServiceCategory, Service } from '@/types/service';

export const mockCategories: ServiceCategory[] = [
  { id: 'cat-1', name: 'Hair', description: 'Haircuts, coloring, and styling', sortOrder: 1 },
  { id: 'cat-2', name: 'Skin', description: 'Facials, cleanup, and skin treatments', sortOrder: 2 },
  { id: 'cat-3', name: 'Nails', description: 'Manicure, pedicure, and nail art', sortOrder: 3 },
  { id: 'cat-4', name: 'Spa', description: 'Massage and body treatments', sortOrder: 4 },
  { id: 'cat-5', name: 'Makeup', description: 'Bridal, party, and everyday makeup', sortOrder: 5 },
];

export const mockServices: Service[] = [
  // Hair (5)
  { id: 'svc-1', name: 'Haircut - Men', categoryId: 'cat-1', duration: 30, price: 300, taxRate: 18, staffIds: ['staff-1', 'staff-3'], isActive: true },
  { id: 'svc-2', name: 'Haircut - Women', categoryId: 'cat-1', duration: 45, price: 500, taxRate: 18, staffIds: ['staff-1', 'staff-3'], isActive: true },
  { id: 'svc-3', name: 'Hair Coloring', categoryId: 'cat-1', duration: 90, price: 2500, taxRate: 18, staffIds: ['staff-1', 'staff-3'], isActive: true },
  { id: 'svc-4', name: 'Hair Spa Treatment', categoryId: 'cat-1', duration: 60, price: 1500, taxRate: 18, staffIds: ['staff-1'], isActive: true },
  { id: 'svc-5', name: 'Keratin Treatment', categoryId: 'cat-1', duration: 120, price: 5000, taxRate: 18, staffIds: ['staff-1'], isActive: true },
  // Skin (5)
  { id: 'svc-6', name: 'Basic Facial', categoryId: 'cat-2', duration: 45, price: 800, taxRate: 18, staffIds: ['staff-2', 'staff-4'], isActive: true },
  { id: 'svc-7', name: 'Gold Facial', categoryId: 'cat-2', duration: 60, price: 1500, taxRate: 18, staffIds: ['staff-2', 'staff-4'], isActive: true },
  { id: 'svc-8', name: 'Cleanup', categoryId: 'cat-2', duration: 30, price: 500, taxRate: 18, staffIds: ['staff-2', 'staff-4'], isActive: true },
  { id: 'svc-9', name: 'De-Tan Treatment', categoryId: 'cat-2', duration: 45, price: 1200, taxRate: 18, staffIds: ['staff-2'], isActive: true },
  { id: 'svc-10', name: 'Chemical Peel', categoryId: 'cat-2', duration: 30, price: 2000, taxRate: 18, staffIds: ['staff-2'], isActive: true },
  // Nails (5)
  { id: 'svc-11', name: 'Classic Manicure', categoryId: 'cat-3', duration: 30, price: 400, taxRate: 18, staffIds: ['staff-4', 'staff-5'], isActive: true },
  { id: 'svc-12', name: 'Classic Pedicure', categoryId: 'cat-3', duration: 45, price: 500, taxRate: 18, staffIds: ['staff-4', 'staff-5'], isActive: true },
  { id: 'svc-13', name: 'Gel Manicure', categoryId: 'cat-3', duration: 45, price: 800, taxRate: 18, staffIds: ['staff-5'], isActive: true },
  { id: 'svc-14', name: 'Gel Pedicure', categoryId: 'cat-3', duration: 60, price: 1000, taxRate: 18, staffIds: ['staff-5'], isActive: true },
  { id: 'svc-15', name: 'Nail Art', categoryId: 'cat-3', duration: 30, price: 600, taxRate: 18, staffIds: ['staff-5'], isActive: true },
  // Spa (5)
  { id: 'svc-16', name: 'Swedish Massage', categoryId: 'cat-4', duration: 60, price: 2000, taxRate: 18, staffIds: ['staff-6'], isActive: true },
  { id: 'svc-17', name: 'Deep Tissue Massage', categoryId: 'cat-4', duration: 60, price: 2500, taxRate: 18, staffIds: ['staff-6'], isActive: true },
  { id: 'svc-18', name: 'Aromatherapy', categoryId: 'cat-4', duration: 75, price: 3000, taxRate: 18, staffIds: ['staff-6'], isActive: true },
  { id: 'svc-19', name: 'Body Scrub', categoryId: 'cat-4', duration: 45, price: 1800, taxRate: 18, staffIds: ['staff-6'], isActive: true },
  { id: 'svc-20', name: 'Hot Stone Therapy', categoryId: 'cat-4', duration: 90, price: 3500, taxRate: 18, staffIds: ['staff-6'], isActive: true },
  // Makeup (5)
  { id: 'svc-21', name: 'Party Makeup', categoryId: 'cat-5', duration: 60, price: 2000, taxRate: 18, staffIds: ['staff-2', 'staff-4'], isActive: true },
  { id: 'svc-22', name: 'Bridal Makeup', categoryId: 'cat-5', duration: 120, price: 8000, taxRate: 18, staffIds: ['staff-2'], isActive: true },
  { id: 'svc-23', name: 'Engagement Makeup', categoryId: 'cat-5', duration: 90, price: 5000, taxRate: 18, staffIds: ['staff-2'], isActive: true },
  { id: 'svc-24', name: 'Eye Makeup', categoryId: 'cat-5', duration: 30, price: 800, taxRate: 18, staffIds: ['staff-2', 'staff-4'], isActive: true },
  { id: 'svc-25', name: 'Hair Styling', categoryId: 'cat-5', duration: 45, price: 1000, taxRate: 18, staffIds: ['staff-1', 'staff-3'], isActive: true },
];
