'use client';

import { useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/data-table/DataTable';
import { Avatar } from '@/components/ui/Avatar';
import { useSalaryStore } from '@/store/useSalaryStore';
import { useStaffStore } from '@/store/useStaffStore';
import { useHydration } from '@/hooks/useHydration';
import { formatCurrency, generateId } from '@/lib/utils';
import { IncentiveRule } from '@/types/salary';
import toast from 'react-hot-toast';
import {
  HiOutlineArrowLeft,
  HiOutlineTrash,
} from 'react-icons/hi2';

const typeBadgeVariant: Record<IncentiveRule['type'], 'success' | 'info' | 'neutral'> = {
  'attendance-bonus': 'success',
  'target-bonus': 'info',
  custom: 'neutral',
};

export default function IncentiveRulesPage() {
  const hydrated = useHydration();
  const { incentiveRules, addIncentiveRule, deleteIncentiveRule } = useSalaryStore();
  const { staff } = useStaffStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStaffId, setFormStaffId] = useState('');
  const [formType, setFormType] = useState<IncentiveRule['type']>('attendance-bonus');
  const [formLabel, setFormLabel] = useState('');
  const [formAmount, setFormAmount] = useState<number>(0);
  const [formCondition, setFormCondition] = useState('');

  const activeStaff = useMemo(() => staff.filter((s) => s.isActive), [staff]);
  const staffOptions = activeStaff.map((s) => ({ value: s.id, label: `${s.firstName} ${s.lastName}` }));
  const typeOptions = [
    { value: 'attendance-bonus', label: 'Attendance Bonus' },
    { value: 'target-bonus', label: 'Target Bonus' },
    { value: 'custom', label: 'Custom' },
  ];

  const getStaffMember = (staffId: string) => staff.find((s) => s.id === staffId);

  if (!hydrated) {
    return <div className="p-6"><div className="h-64 bg-slate-200 rounded animate-pulse" /></div>;
  }

  const handleSave = () => {
    if (!formStaffId) {
      toast.error('Please select a staff member');
      return;
    }
    if (!formLabel.trim()) {
      toast.error('Please enter a label');
      return;
    }
    if (!formAmount || formAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const rule: IncentiveRule = {
      id: generateId(),
      staffId: formStaffId,
      type: formType,
      label: formLabel.trim(),
      amount: formAmount,
      condition: formType === 'target-bonus' ? formCondition.trim() || undefined : undefined,
    };

    addIncentiveRule(rule);
    const staffMember = getStaffMember(formStaffId);
    toast.success(
      `Incentive rule added for ${staffMember?.firstName ?? 'staff'} ${staffMember?.lastName ?? ''}`
    );

    setIsModalOpen(false);
    setFormStaffId('');
    setFormType('attendance-bonus');
    setFormLabel('');
    setFormAmount(0);
    setFormCondition('');
  };

  const handleDelete = (id: string) => {
    deleteIncentiveRule(id);
    toast.success('Incentive rule deleted');
  };

  const columns: ColumnDef<IncentiveRule, unknown>[] = [
    {
      accessorKey: 'staffId',
      header: 'Staff Name',
      cell: ({ row }) => {
        const s = getStaffMember(row.original.staffId);
        if (!s) return <span className="text-slate-400 text-sm">Unknown</span>;
        return (
          <div className="flex items-center gap-3">
            <Avatar name={`${s.firstName} ${s.lastName}`} color={s.color} size="sm" />
            <span className="font-medium text-slate-900">{s.firstName} {s.lastName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.original.type;
        return (
          <Badge variant={typeBadgeVariant[type]}>
            {type === 'attendance-bonus' ? 'Attendance Bonus' : type === 'target-bonus' ? 'Target Bonus' : 'Custom'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'label',
      header: 'Label',
      cell: ({ row }) => <span className="text-sm text-slate-900">{row.original.label}</span>,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <span className="text-sm font-medium">{formatCurrency(row.original.amount)}</span>
      ),
    },
    {
      accessorKey: 'condition',
      header: 'Condition',
      cell: ({ row }) => (
        <span className="text-sm text-slate-600">{row.original.condition || '-'}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(row.original.id);
          }}
        >
          <HiOutlineTrash className="w-4 h-4 text-red-500" />
        </Button>
      ),
    },
  ];

  return (
    <PageWrapper
      title="Incentive Rules"
      subtitle="Manage incentive rules for each staff member"
      actions={
        <div className="flex items-center gap-3">
          <Button onClick={() => setIsModalOpen(true)}>Add Rule</Button>
          <Button variant="outline" href="/salary-calculator">
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      }
    >
      <DataTable
        columns={columns}
        data={incentiveRules}
        searchPlaceholder="Search incentive rules..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Incentive Rule"
        size="sm"
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
            label="Staff"
            options={staffOptions}
            value={formStaffId}
            onChange={(e) => setFormStaffId(e.target.value)}
            placeholder="Select staff member"
          />

          <Select
            label="Type"
            options={typeOptions}
            value={formType}
            onChange={(e) => setFormType(e.target.value as IncentiveRule['type'])}
          />

          <Input
            label="Label"
            value={formLabel}
            onChange={(e) => setFormLabel(e.target.value)}
            placeholder="e.g., Attendance Bonus"
          />

          <Input
            label="Amount"
            type="number"
            min={0}
            value={formAmount || ''}
            onChange={(e) => setFormAmount(parseFloat(e.target.value) || 0)}
            placeholder="Enter incentive amount"
          />

          {formType === 'target-bonus' && (
            <Input
              label="Condition"
              value={formCondition}
              onChange={(e) => setFormCondition(e.target.value)}
              placeholder="e.g., revenue > 50000"
            />
          )}
        </div>
      </Modal>
    </PageWrapper>
  );
}
