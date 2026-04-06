'use client';

import Link from 'next/link';
import { PageWrapper } from '@/components/layout/PageWrapper';
import {
  HiOutlineCreditCard,
  HiOutlineChatBubbleLeft,
  HiOutlineKey,
  HiOutlineDevicePhoneMobile,
  HiOutlineBuildingStorefront,
  HiOutlineMapPin,
  HiOutlineShieldCheck,
  HiOutlineComputerDesktop,
  HiOutlineBell,
  HiOutlineBanknotes,
  HiOutlineDocumentText,
  HiOutlineCog6Tooth,
  HiOutlineArrowUpTray,
  HiOutlineGlobeAlt,
  HiOutlineCircleStack,
  HiOutlineWrenchScrewdriver,
} from 'react-icons/hi2';

interface SettingCard {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  enabled: boolean;
}

interface SettingsSection {
  title: string;
  cards: SettingCard[];
}

const settingsSections: SettingsSection[] = [
  {
    title: 'Account Settings',
    cards: [
      { title: 'Plan & Billing', icon: HiOutlineCreditCard, href: '/settings/billing', color: 'bg-blue-100 text-blue-600', enabled: false },
      { title: 'WhatsApp Recharge', icon: HiOutlineChatBubbleLeft, href: '/settings/whatsapp', color: 'bg-emerald-100 text-emerald-600', enabled: false },
      { title: 'Login Details', icon: HiOutlineKey, href: '/settings/login', color: 'bg-amber-100 text-amber-600', enabled: false },
      { title: 'SMS Recharge', icon: HiOutlineDevicePhoneMobile, href: '/settings/sms', color: 'bg-purple-100 text-purple-600', enabled: false },
    ],
  },
  {
    title: 'Business Settings',
    cards: [
      { title: 'Business Details', icon: HiOutlineBuildingStorefront, href: '/settings/business', color: 'bg-blue-100 text-blue-600', enabled: true },
      { title: 'Business Location', icon: HiOutlineMapPin, href: '/settings/business', color: 'bg-rose-100 text-rose-600', enabled: true },
      { title: 'Security', icon: HiOutlineShieldCheck, href: '/settings/access-control', color: 'bg-slate-200 text-slate-600', enabled: true },
    ],
  },
  {
    title: '',
    cards: [
      { title: 'Point of Sale', icon: HiOutlineComputerDesktop, href: '/settings/payment-modes', color: 'bg-indigo-100 text-indigo-600', enabled: true },
      { title: 'Notifications', icon: HiOutlineBell, href: '/settings/notifications', color: 'bg-yellow-100 text-yellow-600', enabled: true },
    ],
  },
  {
    title: '',
    cards: [
      { title: 'Cash Registry', icon: HiOutlineBanknotes, href: '/settings/cash-registry', color: 'bg-emerald-100 text-emerald-600', enabled: false },
      { title: 'Custom Fields', icon: HiOutlineDocumentText, href: '/settings/custom-fields', color: 'bg-cyan-100 text-cyan-600', enabled: false },
      { title: 'Tax Settings', icon: HiOutlineCog6Tooth, href: '/settings/tax', color: 'bg-orange-100 text-orange-600', enabled: true },
    ],
  },
  {
    title: 'Data & Migration',
    cards: [
      { title: 'Upload Master Data', icon: HiOutlineArrowUpTray, href: '/settings/upload', color: 'bg-violet-100 text-violet-600', enabled: false },
      { title: 'Global Customer Data', icon: HiOutlineGlobeAlt, href: '/settings/global-data', color: 'bg-teal-100 text-teal-600', enabled: false },
      { title: 'Data Management', icon: HiOutlineCircleStack, href: '/settings/data', color: 'bg-slate-200 text-slate-600', enabled: false },
    ],
  },
  {
    title: 'HRMS/A Tools',
    cards: [
      { title: 'Miscellaneous Changes', icon: HiOutlineWrenchScrewdriver, href: '/settings/misc', color: 'bg-gray-200 text-gray-600', enabled: false },
    ],
  },
];

export default function SettingsPage() {
  return (
    <PageWrapper title="Settings" subtitle="Configure your salon">
      <div className="space-y-6">
        {settingsSections.map((section, sIdx) => (
          <div key={sIdx}>
            {section.title && (
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">
                {section.title}
              </h2>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {section.cards.map((card) => {
                const content = (
                  <div
                    className={`bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-3 min-h-[120px] transition-all ${
                      card.enabled
                        ? 'hover:shadow-md hover:border-blue-300 cursor-pointer'
                        : 'opacity-60 cursor-default'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color}`}>
                      <card.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 text-center leading-tight">
                      {card.title}
                    </span>
                    {!card.enabled && (
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">Coming Soon</span>
                    )}
                  </div>
                );

                if (card.enabled) {
                  return (
                    <Link key={card.title} href={card.href}>
                      {content}
                    </Link>
                  );
                }

                return (
                  <div key={card.title}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
