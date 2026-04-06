'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import { useStaffStore } from '@/store/useStaffStore';
import { useHydration } from '@/hooks/useHydration';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Staff, WorkingHours } from '@/types/staff';

const roleVariant: Record<Staff['role'], 'purple' | 'info' | 'success' | 'orange' | 'neutral'> = {
  admin: 'purple',
  manager: 'info',
  stylist: 'success',
  therapist: 'orange',
  receptionist: 'neutral',
};

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const staffTabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'performance', label: 'Performance' },
];

export default function StaffProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const hydrated = useHydration();
  const router = useRouter();
  const member = useStaffStore((s) => s.getStaff(id));
  const updateStaff = useStaffStore((s) => s.updateStaff);

  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: Staff['role'];
    commissionType: Staff['commissionType'];
    commissionRate: string;
  } | null>(null);
  const [schedule, setSchedule] = useState<WorkingHours[] | null>(null);

  if (!hydrated) {
    return <div className="p-6">Loading...</div>;
  }

  if (!member) {
    return (
      <PageWrapper title="Staff Not Found">
        <Card>
          <p className="text-slate-500">
            This staff member does not exist.{' '}
            <button
              className="text-blue-600 underline"
              onClick={() => router.push('/staff')}
            >
              Back to Staff
            </button>
          </p>
        </Card>
      </PageWrapper>
    );
  }

  // Initialize profile form lazily
  if (!profileForm) {
    setProfileForm({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      role: member.role,
      commissionType: member.commissionType,
      commissionRate: String(member.commissionRate),
    });
    return null;
  }

  // Initialize schedule lazily
  if (!schedule) {
    setSchedule([...member.workingHours]);
    return null;
  }

  const saveProfile = () => {
    updateStaff(member.id, {
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      email: profileForm.email,
      phone: profileForm.phone,
      role: profileForm.role,
      commissionType: profileForm.commissionType,
      commissionRate: Number(profileForm.commissionRate) || 0,
    });
  };

  const updateScheduleDay = (
    dayIndex: number,
    field: keyof WorkingHours,
    value: string | boolean
  ) => {
    setSchedule((prev) =>
      (prev || []).map((wh) =>
        wh.day === dayIndex ? { ...wh, [field]: value } : wh
      )
    );
  };

  const saveSchedule = () => {
    updateStaff(member.id, { workingHours: schedule });
  };

  return (
    <PageWrapper
      title="Staff Profile"
      actions={
        <Button variant="outline" onClick={() => router.push('/staff')}>
          Back
        </Button>
      }
    >
      {/* Header */}
      <Card className="mb-6">
        <div className="flex items-center gap-6">
          <Avatar
            name={`${member.firstName} ${member.lastName}`}
            size="xl"
            color={member.color}
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-slate-900">
                {member.firstName} {member.lastName}
              </h2>
              <Badge variant={roleVariant[member.role]}>
                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
              </Badge>
              <Badge variant={member.isActive ? 'success' : 'neutral'}>
                {member.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="text-sm text-slate-500 space-y-0.5">
              <p>{member.phone}</p>
              <p>{member.email}</p>
            </div>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-xs text-slate-500 uppercase font-medium">Joined</p>
              <p className="text-sm font-semibold text-slate-900">
                {formatDate(member.joinDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-medium">Commission</p>
              <p className="text-sm font-semibold text-slate-900">
                {member.commissionType === 'percentage'
                  ? `${member.commissionRate}%`
                  : formatCurrency(member.commissionRate)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs tabs={staffTabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card title="Edit Profile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={profileForm.firstName}
                onChange={(e) =>
                  setProfileForm((prev) => prev && { ...prev, firstName: e.target.value })
                }
              />
              <Input
                label="Last Name"
                value={profileForm.lastName}
                onChange={(e) =>
                  setProfileForm((prev) => prev && { ...prev, lastName: e.target.value })
                }
              />
              <Input
                label="Email"
                type="email"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm((prev) => prev && { ...prev, email: e.target.value })
                }
              />
              <Input
                label="Phone"
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm((prev) => prev && { ...prev, phone: e.target.value })
                }
              />
              <Select
                label="Role"
                value={profileForm.role}
                onChange={(e) =>
                  setProfileForm((prev) =>
                    prev && { ...prev, role: e.target.value as Staff['role'] }
                  )
                }
                options={[
                  { value: 'admin', label: 'Admin' },
                  { value: 'manager', label: 'Manager' },
                  { value: 'stylist', label: 'Stylist' },
                  { value: 'therapist', label: 'Therapist' },
                  { value: 'receptionist', label: 'Receptionist' },
                ]}
              />
              <Select
                label="Commission Type"
                value={profileForm.commissionType}
                onChange={(e) =>
                  setProfileForm((prev) =>
                    prev && {
                      ...prev,
                      commissionType: e.target.value as Staff['commissionType'],
                    }
                  )
                }
                options={[
                  { value: 'percentage', label: 'Percentage' },
                  { value: 'fixed', label: 'Fixed' },
                  { value: 'tiered', label: 'Tiered' },
                ]}
              />
              <Input
                label="Commission Rate"
                type="number"
                value={profileForm.commissionRate}
                onChange={(e) =>
                  setProfileForm((prev) =>
                    prev && { ...prev, commissionRate: e.target.value }
                  )
                }
              />
            </div>
            <div className="mt-6">
              <Button onClick={saveProfile}>Save Profile</Button>
            </div>
          </Card>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <Card title="Weekly Schedule">
            <div className="space-y-4">
              {schedule.map((wh) => (
                <div
                  key={wh.day}
                  className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0"
                >
                  <div className="w-28 font-medium text-slate-700">
                    {dayNames[wh.day]}
                  </div>
                  <Toggle
                    checked={!wh.isOff}
                    onChange={(checked) =>
                      updateScheduleDay(wh.day, 'isOff', !checked)
                    }
                    label={wh.isOff ? 'Off' : 'Working'}
                  />
                  {!wh.isOff && (
                    <div className="flex items-center gap-2 ml-4">
                      <input
                        type="time"
                        className="px-2 py-1 text-sm border border-slate-300 rounded-lg"
                        value={wh.startTime}
                        onChange={(e) =>
                          updateScheduleDay(wh.day, 'startTime', e.target.value)
                        }
                      />
                      <span className="text-slate-400">to</span>
                      <input
                        type="time"
                        className="px-2 py-1 text-sm border border-slate-300 rounded-lg"
                        value={wh.endTime}
                        onChange={(e) =>
                          updateScheduleDay(wh.day, 'endTime', e.target.value)
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button onClick={saveSchedule}>Save Schedule</Button>
            </div>
          </Card>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <p className="text-xs text-slate-500 uppercase font-medium">
                Appointments This Month
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-2">42</p>
              <p className="text-xs text-emerald-600 mt-1">+12% vs last month</p>
            </Card>
            <Card>
              <p className="text-xs text-slate-500 uppercase font-medium">
                Revenue Generated
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {formatCurrency(85000)}
              </p>
              <p className="text-xs text-emerald-600 mt-1">+8% vs last month</p>
            </Card>
            <Card>
              <p className="text-xs text-slate-500 uppercase font-medium">
                Commission Earned
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {formatCurrency(
                  member.commissionType === 'percentage'
                    ? Math.round(85000 * (member.commissionRate / 100))
                    : member.commissionRate * 42
                )}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {member.commissionType === 'percentage'
                  ? `${member.commissionRate}% of revenue`
                  : `Fixed per appointment`}
              </p>
            </Card>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
