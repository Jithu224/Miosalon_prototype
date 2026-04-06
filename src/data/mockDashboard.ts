const today = new Date();
const getDateLabel = (daysAgo: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};

// Seeded pseudo-random for consistent values across renders
const seededValues = [
  32450, 28300, 41200, 19800, 35600, 22100, 38900, 27500, 44100, 16500,
  33800, 29700, 42500, 21300, 36800, 24600, 39200, 18700, 31400, 43600,
  26800, 37100, 20500, 34900, 15200, 40800, 23400, 38200, 30100, 45000,
];

export const revenueData = Array.from({ length: 30 }, (_, i) => ({
  date: getDateLabel(29 - i),
  revenue: seededValues[i],
}));

const appointmentCounts = [14, 18, 11, 16, 20, 9, 15];

export const appointmentData = Array.from({ length: 7 }, (_, i) => ({
  date: getDateLabel(6 - i),
  count: appointmentCounts[i],
}));

export const servicePopularity = [
  { name: 'Haircut - Men', value: 148 },
  { name: 'Basic Facial', value: 102 },
  { name: 'Gold Facial', value: 87 },
  { name: 'Classic Manicure', value: 74 },
  { name: 'Swedish Massage', value: 65 },
];

export const recentActivity = [
  { id: 'act-1', type: 'appointment', message: 'New appointment booked by Preethi Mohan - Gold Facial + Chemical Peel', time: '5 min ago' },
  { id: 'act-2', type: 'invoice', message: 'Invoice MIA-2026-0026 paid via card - ₹2,950', time: '12 min ago' },
  { id: 'act-3', type: 'appointment', message: 'Appointment completed for Meera Nair - Hair Coloring', time: '25 min ago' },
  { id: 'act-4', type: 'client', message: 'New client registered: Tanvi Bhatt (referred by Meera Nair)', time: '40 min ago' },
  { id: 'act-5', type: 'invoice', message: 'Invoice MIA-2026-0025 paid via UPI - ₹2,124', time: '1 hr ago' },
  { id: 'act-6', type: 'appointment', message: 'Appointment cancelled by Karthik Ramachandran - Deep Tissue Massage', time: '1.5 hrs ago' },
  { id: 'act-7', type: 'feedback', message: 'New 5-star review from Rekha Kulkarni: "Best salon in Bangalore!"', time: '2 hrs ago' },
  { id: 'act-8', type: 'appointment', message: 'Walk-in checked in: Nitin Shetty - Haircut Men with Amit', time: '2.5 hrs ago' },
  { id: 'act-9', type: 'product', message: 'Low stock alert: Lakme Eyeconic Kajal (12 remaining)', time: '3 hrs ago' },
  { id: 'act-10', type: 'invoice', message: 'Partial payment received for MIA-2026-0024 - ₹2,000 of ₹3,304', time: '4 hrs ago' },
];
