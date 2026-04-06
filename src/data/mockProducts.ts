import { Product } from '@/types/product';

export const mockProducts: Product[] = [
  {
    id: 'prod-1', name: 'Lakme Absolute Skin Dew Serum Foundation', brand: 'Lakme', sku: 'LKM-FND-001',
    category: 'Makeup', price: 850, costPrice: 550, stock: 24, minStock: 5,
    unit: 'piece', taxRate: 18, isActive: true, description: 'Lightweight serum foundation with dewy finish.',
  },
  {
    id: 'prod-2', name: 'Biotique Bio Green Apple Shampoo', brand: 'Biotique', sku: 'BIO-SHP-001',
    category: 'Hair Care', price: 299, costPrice: 180, stock: 40, minStock: 10,
    unit: 'piece', taxRate: 18, isActive: true, description: 'Daily purifying shampoo for oily hair and scalp.',
  },
  {
    id: 'prod-3', name: 'Forest Essentials Soundarya Radiance Cream', brand: 'Forest Essentials', sku: 'FE-CRM-001',
    category: 'Skin Care', price: 2875, costPrice: 1800, stock: 12, minStock: 3,
    unit: 'piece', taxRate: 18, isActive: true, description: 'Luxurious ayurvedic radiance cream with 24K gold.',
  },
  {
    id: 'prod-4', name: 'Mamaearth Onion Hair Oil', brand: 'Mamaearth', sku: 'ME-OIL-001',
    category: 'Hair Care', price: 499, costPrice: 300, stock: 35, minStock: 8,
    unit: 'piece', taxRate: 18, isActive: true, description: 'Onion oil for hair regrowth and hair fall control.',
  },
  {
    id: 'prod-5', name: 'WOW Skin Science Vitamin C Face Wash', brand: 'WOW', sku: 'WOW-FW-001',
    category: 'Skin Care', price: 399, costPrice: 240, stock: 28, minStock: 8,
    unit: 'piece', taxRate: 18, isActive: true, description: 'Brightening face wash with vitamin C and mulberry extract.',
  },
  {
    id: 'prod-6', name: 'Lakme Sun Expert SPF 50 Sunscreen', brand: 'Lakme', sku: 'LKM-SUN-001',
    category: 'Skin Care', price: 350, costPrice: 210, stock: 45, minStock: 10,
    unit: 'piece', taxRate: 18, isActive: true, description: 'Ultra matte gel sunscreen for daily protection.',
  },
  {
    id: 'prod-7', name: 'Biotique Bio Kelp Protein Shampoo', brand: 'Biotique', sku: 'BIO-SHP-002',
    category: 'Hair Care', price: 250, costPrice: 150, stock: 30, minStock: 8,
    unit: 'piece', taxRate: 18, isActive: true, description: 'Protein-rich shampoo for falling hair.',
  },
  {
    id: 'prod-8', name: 'Forest Essentials Hair Cleanser Bhringraj', brand: 'Forest Essentials', sku: 'FE-SHP-001',
    category: 'Hair Care', price: 1350, costPrice: 850, stock: 15, minStock: 4,
    unit: 'piece', taxRate: 18, isActive: true, description: 'Ayurvedic hair cleanser with bhringraj and shikakai.',
  },
  {
    id: 'prod-9', name: 'Mamaearth Ubtan Face Mask', brand: 'Mamaearth', sku: 'ME-MSK-001',
    category: 'Skin Care', price: 549, costPrice: 330, stock: 22, minStock: 5,
    unit: 'piece', taxRate: 18, isActive: true, description: 'Tan removal face mask with turmeric and saffron.',
  },
  {
    id: 'prod-10', name: 'Lakme 9 to 5 Nail Color', brand: 'Lakme', sku: 'LKM-NAL-001',
    category: 'Nails', price: 200, costPrice: 120, stock: 60, minStock: 15,
    unit: 'piece', taxRate: 18, isActive: true, description: 'Long-lasting glossy nail enamel, assorted shades.',
  },
  {
    id: 'prod-11', name: 'WOW Skin Science Hair Conditioner', brand: 'WOW', sku: 'WOW-CND-001',
    category: 'Hair Care', price: 449, costPrice: 270, stock: 25, minStock: 6,
    unit: 'piece', taxRate: 18, isActive: true, description: 'Apple cider vinegar conditioner for silky smooth hair.',
  },
  {
    id: 'prod-12', name: 'Forest Essentials Body Mist Iced Pomegranate', brand: 'Forest Essentials', sku: 'FE-BDM-001',
    category: 'Body Care', price: 1675, costPrice: 1050, stock: 10, minStock: 3,
    unit: 'piece', taxRate: 18, isActive: true, description: 'Refreshing body mist with natural pomegranate extracts.',
  },
  {
    id: 'prod-13', name: 'Biotique Bio Morning Nectar Moisturizer', brand: 'Biotique', sku: 'BIO-MST-001',
    category: 'Skin Care', price: 275, costPrice: 165, stock: 38, minStock: 10,
    unit: 'piece', taxRate: 18, isActive: true, description: 'Flawless skin moisturizer for all skin types.',
  },
  {
    id: 'prod-14', name: 'Mamaearth Aloe Vera Gel', brand: 'Mamaearth', sku: 'ME-GEL-001',
    category: 'Skin Care', price: 349, costPrice: 210, stock: 32, minStock: 8,
    unit: 'piece', taxRate: 18, isActive: true, description: 'Pure aloe vera gel for skin and hair hydration.',
  },
  {
    id: 'prod-15', name: 'Lakme Absolute Argan Oil Serum', brand: 'Lakme', sku: 'LKM-SRM-001',
    category: 'Hair Care', price: 650, costPrice: 400, stock: 18, minStock: 5,
    unit: 'piece', taxRate: 18, isActive: true, description: 'Lightweight hair serum with argan oil for frizz control.',
  },
  {
    id: 'prod-16', name: 'WOW Activated Charcoal Face Wash', brand: 'WOW', sku: 'WOW-FW-002',
    category: 'Skin Care', price: 379, costPrice: 225, stock: 20, minStock: 6,
    unit: 'piece', taxRate: 18, isActive: true, description: 'Deep cleansing charcoal face wash for men and women.',
  },
  {
    id: 'prod-17', name: 'Forest Essentials Velvet Silk Body Cream', brand: 'Forest Essentials', sku: 'FE-BDC-001',
    category: 'Body Care', price: 2250, costPrice: 1400, stock: 8, minStock: 2,
    unit: 'piece', taxRate: 18, isActive: true, description: 'Rich body cream with Indian rose and marigold.',
  },
  {
    id: 'prod-18', name: 'Mamaearth Tea Tree Hair Oil', brand: 'Mamaearth', sku: 'ME-OIL-002',
    category: 'Hair Care', price: 399, costPrice: 240, stock: 27, minStock: 7,
    unit: 'piece', taxRate: 18, isActive: true, description: 'Anti-dandruff hair oil with tea tree and ginger oil.',
  },
  {
    id: 'prod-19', name: 'Lakme Eyeconic Kajal', brand: 'Lakme', sku: 'LKM-KJL-001',
    category: 'Makeup', price: 225, costPrice: 135, stock: 50, minStock: 12,
    unit: 'piece', taxRate: 18, isActive: true, description: 'Smudge-proof deep black kajal, 22-hour stay.',
  },
  {
    id: 'prod-20', name: 'Biotique Bio Papaya Tan Removal Scrub', brand: 'Biotique', sku: 'BIO-SCR-001',
    category: 'Skin Care', price: 220, costPrice: 130, stock: 33, minStock: 8,
    unit: 'piece', taxRate: 18, isActive: true, description: 'Exfoliating face scrub for tan removal and glowing skin.',
  },
];
