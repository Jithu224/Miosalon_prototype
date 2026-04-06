import {
  HiOutlineHome,
  HiOutlineCalendarDays,
  HiOutlineBolt,
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineScissors,
  HiOutlineCube,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineMegaphone,
  HiOutlineGift,
  HiOutlineUserPlus,
  HiOutlineChatBubbleLeft,
  HiOutlineGlobeAlt,
  HiOutlineCog6Tooth,
} from 'react-icons/hi2';

export const NAV_ITEMS = [
  {
    group: 'Main',
    items: [
      { label: 'Dashboard', href: '/', icon: HiOutlineHome },
      { label: 'Appointments', href: '/appointments', icon: HiOutlineCalendarDays },
      { label: 'Quick Sale', href: '/quick-sale', icon: HiOutlineBolt },
    ],
  },
  {
    group: 'Management',
    items: [
      { label: 'Clients', href: '/clients', icon: HiOutlineUsers },
      { label: 'Staff', href: '/staff', icon: HiOutlineUserGroup },
      { label: 'Services', href: '/services', icon: HiOutlineScissors },
      { label: 'Inventory', href: '/inventory', icon: HiOutlineCube },
    ],
  },
  {
    group: 'Finance',
    items: [
      { label: 'Billing', href: '/billing', icon: HiOutlineDocumentText },
      { label: 'Reports', href: '/reports', icon: HiOutlineChartBar },
    ],
  },
  {
    group: 'Growth',
    items: [
      { label: 'Marketing', href: '/marketing', icon: HiOutlineMegaphone },
      { label: 'Loyalty', href: '/loyalty', icon: HiOutlineGift },
      { label: 'Leads', href: '/leads', icon: HiOutlineUserPlus },
      { label: 'Feedback', href: '/feedback', icon: HiOutlineChatBubbleLeft },
      { label: 'Online Booking', href: '/online-booking', icon: HiOutlineGlobeAlt },
    ],
  },
  {
    group: 'System',
    items: [
      { label: 'Settings', href: '/settings', icon: HiOutlineCog6Tooth },
    ],
  },
];

export const APPOINTMENT_STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  'in-progress': 'bg-yellow-100 text-yellow-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
  'no-show': 'bg-orange-100 text-orange-700',
};

export const APPOINTMENT_CALENDAR_COLORS: Record<string, string> = {
  scheduled: '#3b82f6',
  confirmed: '#10b981',
  'in-progress': '#f59e0b',
  completed: '#9ca3af',
  cancelled: '#ef4444',
  'no-show': '#f97316',
};

export const PAYMENT_MODES = ['Cash', 'Card', 'UPI', 'Wallet', 'Membership'] as const;

export const LEAD_STATUSES = ['new', 'contacted', 'follow-up', 'converted', 'lost'] as const;

export const STAFF_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
];
