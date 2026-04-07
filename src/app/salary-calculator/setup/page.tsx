'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/data-table/DataTable';
import { useSalaryStore } from '@/store/useSalaryStore';
import { useStaffStore } from '@/store/useStaffStore';
import { useRoleStore, ROLE_PERMISSIONS } from '@/store/useRoleStore';
import { useHydration } from '@/hooks/useHydration';
import { formatCurrency } from '@/lib/utils';
import { Staff } from '@/types/staff';
import { SalaryProfile } from '@/types/salary';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft } from 'react-icons/hi2';

interface FormData {
  employmentType: SalaryProfile['employmentType'];
  payStructure: SalaryProfile['payStructure'];
  baseSalary: number;
  payCycle: SalaryProfile['payCycle'];
  customPeriodStart: number;
  customPeriodEnd: number;
  weeklyPayDay: number;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

const defaultFormData: FormData = {
  employmentType: 'full-time',
  payStructure: 'fixed-only',
  baseSalary: 0,
  payCycle: 'monthly',
  customPeriodStart: 26,
  customPeriodEnd: 25,
  weeklyPayDay: 1,
  bankName: '',
  accountNumber: '',
  ifscCode: '',
};

const employmentTypeOptions = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'daily-wage', label: 'Daily Wage' },
];

const payStructureOptions = [
  { value: 'fixed-only', label: 'Fixed Only' },
  { value: 'fixed-commission', label: 'Fixed + Commission' },
  { value: 'commission-only', label: 'Commission Only' },
  { value: 'daily-wage', label: 'Daily Wage' },
];

const payCycleOptions = [
  { value: 'monthly', label: 'Monthly (1st - 30th/31st)' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'custom', label: 'Custom Period' },
];

const weekDayOptions = [
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
  { value: '0', label: 'Sunday' },
];

export default function SalarySetupPage() {
  const hydrated = useHydration();
  const { role } = useRoleStore();
  const perms = ROLE_PERMISSIONS[role];
  const { staff } = useStaffStore();
  const { salaryProfiles, addSalaryProfile, updateSalaryProfile, getSalaryProfile } = useSalaryStore();

  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!hydrated) {
    return (
      <div className="p-6">
        <div className="h-64 bg-slate-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!perms.canConfigureSalary) {
    return (
      <PageWrapper title="Access Denied">
        <div className="bg-white rounded-xl border p-12 text-center">
          <p className="text-slate-500">You don&apos;t have permission to access salary setup.</p>
          <Button href="/salary-calculator" className="mt-4">Back to Dashboard</Button>
        </div>
      </PageWrapper>
    );
  }

  const activeStaff = staff.filter((s) => s.isActive);

  const handleEdit = (s: Staff) => {
    setSelectedStaff(s);
    const profile = getSalaryProfile(s.id);
    if (profile) {
      setFormData({
        employmentType: profile.employmentType,
        payStructure: profile.payStructure,
        baseSalary: profile.baseSalary,
        payCycle: profile.payCycle,
        customPeriodStart: profile.customPeriodStart || 26,
        customPeriodEnd: profile.customPeriodEnd || 25,
        weeklyPayDay: profile.weeklyPayDay ?? 1,
        bankName: profile.bankName || '',
        accountNumber: profile.accountNumber || '',
        ifscCode: profile.ifscCode || '',
      });
    } else {
      setFormData(defaultFormData);
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!selectedStaff) return;

    // Form validation
    if (formData.payStructure !== 'commission-only') {
      if (formData.baseSalary < 0) {
        toast.error('Base salary cannot be negative');
        return;
      }
      if (formData.baseSalary === 0) {
        toast.error('Base salary is required for this pay structure');
        return;
      }
    }

    const profileData: SalaryProfile = {
      staffId: selectedStaff.id,
      employmentType: formData.employmentType,
      payStructure: formData.payStructure,
      baseSalary: formData.payStructure === 'commission-only' ? 0 : formData.baseSalary,
      payCycle: formData.payCycle,
      customPeriodStart: formData.payCycle === 'custom' ? formData.customPeriodStart : undefined,
      customPeriodEnd: formData.payCycle === 'custom' ? formData.customPeriodEnd : undefined,
      weeklyPayDay: formData.payCycle === 'weekly' ? formData.weeklyPayDay : undefined,
      bankName: formData.bankName || undefined,
      accountNumber: formData.accountNumber || undefined,
      ifscCode: formData.ifscCode || undefined,
    };

    const existing = getSalaryProfile(selectedStaff.id);
    if (existing) {
      updateSalaryProfile(selectedStaff.id, profileData);
      toast.success(`Salary profile updated for ${selectedStaff.firstName} ${selectedStaff.lastName}`);
    } else {
      addSalaryProfile(profileData);
      toast.success(`Salary profile created for ${selectedStaff.firstName} ${selectedStaff.lastName}`);
    }

    setIsModalOpen(false);
    setSelectedStaff(null);
  };

  const columns: ColumnDef<Staff, unknown>[] = [
    {
      accessorKey: 'firstName',
      header: 'Name',
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar name={`${s.firstName} ${s.lastName}`} color={s.color} size="sm" />
            <span className="font-medium text-slate-900">{s.firstName} {s.lastName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Badge variant="purple">{row.original.role}</Badge>
      ),
    },
    {
      id: 'employmentType',
      header: 'Employment Type',
      cell: ({ row }) => {
        const profile = salaryProfiles.find((p) => p.staffId === row.original.id);
        if (!profile) return <span className="text-slate-400 text-sm">Not configured</span>;
        const labels: Record<string, string> = {
          'full-time': 'Full Time',
          'part-time': 'Part Time',
          contract: 'Contract',
          'daily-wage': 'Daily Wage',
        };
        return <span className="text-sm">{labels[profile.employmentType]}</span>;
      },
    },
    {
      id: 'payStructure',
      header: 'Pay Structure',
      cell: ({ row }) => {
        const profile = salaryProfiles.find((p) => p.staffId === row.original.id);
        if (!profile) return <span className="text-slate-400 text-sm">-</span>;
        const labels: Record<string, string> = {
          'fixed-only': 'Fixed Only',
          'fixed-commission': 'Fixed + Commission',
          'commission-only': 'Commission Only',
          'daily-wage': 'Daily Wage',
        };
        return <span className="text-sm">{labels[profile.payStructure]}</span>;
      },
    },
    {
      id: 'baseSalary',
      header: 'Base Salary',
      cell: ({ row }) => {
        const profile = salaryProfiles.find((p) => p.staffId === row.original.id);
        if (!profile) return <span className="text-slate-400 text-sm">-</span>;
        return <span className="text-sm">{formatCurrency(profile.baseSalary)}</span>;
      },
    },
    {
      id: 'payCycle',
      header: 'Pay Cycle',
      cell: ({ row }) => {
        const profile = salaryProfiles.find((p) => p.staffId === row.original.id);
        if (!profile) return <span className="text-slate-400 text-sm">-</span>;
        let label = profile.payCycle;
        if (profile.payCycle === 'custom' && profile.customPeriodStart && profile.customPeriodEnd) {
          label = `${profile.customPeriodStart}th - ${profile.customPeriodEnd}th`;
        }
        if (profile.payCycle === 'weekly' && profile.weeklyPayDay !== undefined) {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          label = `Weekly (${days[profile.weeklyPayDay]})`;
        }
        return <span className="text-sm capitalize">{label}</span>;
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const hasProfile = salaryProfiles.some((p) => p.staffId === row.original.id);
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row.original);
            }}
          >
            {hasProfile ? 'Edit' : 'Configure'}
          </Button>
        );
      },
    },
  ];

  return (
    <PageWrapper
      title="Salary Setup"
      subtitle="Configure pay structure for each staff member"
      actions={
        <Button variant="outline" href="/salary-calculator">
          <HiOutlineArrowLeft className="w-4 h-4" />
          Back
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={activeStaff}
        searchPlaceholder="Search staff..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStaff(null);
        }}
        title={
          selectedStaff
            ? `Configure Salary - ${selectedStaff.firstName} ${selectedStaff.lastName}`
            : 'Configure Salary'
        }
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Employment Type"
            options={employmentTypeOptions}
            value={formData.employmentType}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, employmentType: e.target.value as FormData['employmentType'] }))
            }
          />

          <Select
            label="Pay Structure"
            options={payStructureOptions}
            value={formData.payStructure}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, payStructure: e.target.value as FormData['payStructure'] }))
            }
          />

          {formData.payStructure !== 'commission-only' && (
            <Input
              label="Base Salary"
              type="number"
              min={0}
              value={formData.baseSalary || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, baseSalary: parseFloat(e.target.value) || 0 }))
              }
              placeholder="Enter base salary"
            />
          )}

          <Select
            label="Pay Cycle"
            options={payCycleOptions}
            value={formData.payCycle}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, payCycle: e.target.value as FormData['payCycle'] }))
            }
          />

          {/* Custom Period Fields */}
          {formData.payCycle === 'custom' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
              <p className="text-xs font-medium text-blue-700">Define your custom pay period</p>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Period Start Day"
                  type="number"
                  min={1}
                  max={31}
                  value={formData.customPeriodStart}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customPeriodStart: parseInt(e.target.value) || 1 }))}
                  helperText="Day of month (1-31)"
                />
                <Input
                  label="Period End Day"
                  type="number"
                  min={1}
                  max={31}
                  value={formData.customPeriodEnd}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customPeriodEnd: parseInt(e.target.value) || 28 }))}
                  helperText="Day of next month (1-31)"
                />
              </div>
              <p className="text-xs text-blue-600">
                e.g., Start: 26, End: 25 means salary covers 26th of this month to 25th of next month
              </p>
            </div>
          )}

          {/* Weekly Pay Day */}
          {formData.payCycle === 'weekly' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <Select
                label="Pay Week Starts On"
                options={weekDayOptions}
                value={String(formData.weeklyPayDay)}
                onChange={(e) => setFormData((prev) => ({ ...prev, weeklyPayDay: parseInt(e.target.value) }))}
              />
              <p className="text-xs text-emerald-600 mt-2">
                Salary is calculated for each 7-day period starting on this day
              </p>
            </div>
          )}

          {/* Daily info */}
          {formData.payCycle === 'daily' && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-700">
                Salary will be calculated per working day. Base salary represents the daily rate.
              </p>
            </div>
          )}

          <div className="border-t border-slate-200 pt-4 mt-4">
            <p className="text-sm font-medium text-slate-700 mb-3">Bank Details (Optional)</p>
            <div className="space-y-3">
              <Input
                label="Bank Name"
                value={formData.bankName}
                onChange={(e) => setFormData((prev) => ({ ...prev, bankName: e.target.value }))}
                placeholder="Enter bank name"
              />
              <Input
                label="Account Number"
                value={formData.accountNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, accountNumber: e.target.value }))}
                placeholder="Enter account number"
              />
              <Input
                label="IFSC Code"
                value={formData.ifscCode}
                onChange={(e) => setFormData((prev) => ({ ...prev, ifscCode: e.target.value }))}
                placeholder="Enter IFSC code"
              />
            </div>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
