'use client';

import { useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/data-table/DataTable';
import { useSalaryStore } from '@/store/useSalaryStore';
import { useStaffStore } from '@/store/useStaffStore';
import { useHydration } from '@/hooks/useHydration';
import { formatCurrency, formatDate, generateId } from '@/lib/utils';
import { SalaryAdvance } from '@/types/salary';
import toast from 'react-hot-toast';
import {
  HiOutlineArrowLeft,
  HiOutlineBanknotes,
  HiOutlineCalendarDays,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';

export default function SalaryAdvancesPage() {
  const hydrated = useHydration();
  const { advances, addAdvance } = useSalaryStore();
  const { staff } = useStaffStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStaffId, setFormStaffId] = useState('');
  const [formAmount, setFormAmount] = useState<number>(0);
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formReason, setFormReason] = useState('');

  const currentMonth = new Date().toISOString().slice(0, 7);
  const totalOutstanding = useMemo(
    () => advances.filter((a) => a.status !== 'recovered').reduce((sum, a) => sum + (a.amount - a.deducted), 0),
    [advances]
  );
  const advancesThisMonth = useMemo(
    () => advances.filter((a) => a.date.startsWith(currentMonth)).length,
    [advances, currentMonth]
  );
  const fullyRecovered = useMemo(
    () => advances.filter((a) => a.status === 'recovered').length,
    [advances]
  );

  if (!hydrated) {
    return <div className="p-6"><div className="h-64 bg-slate-200 rounded animate-pulse" /></div>;
  }

  const activeStaff = staff.filter((s) => s.isActive);
  const staffOptions = activeStaff.map((s) => ({ value: s.id, label: `${s.firstName} ${s.lastName}` }));
  const getStaffMember = (staffId: string) => staff.find((s) => s.id === staffId);

  const handleSave = () => {
    if (!formStaffId) {
      toast.error('Please select a staff member');
      return;
    }
    if (!formAmount || formAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const advance: SalaryAdvance = {
      id: generateId(),
      staffId: formStaffId,
      amount: formAmount,
      date: formDate,
      reason: formReason || undefined,
      deducted: 0,
      status: 'pending',
    };

    addAdvance(advance);
    const staffMember = getStaffMember(formStaffId);
    toast.success(
      `Advance of ${formatCurrency(formAmount)} recorded for ${staffMember?.firstName ?? 'staff'} ${staffMember?.lastName ?? ''}`
    );

    setIsModalOpen(false);
    setFormStaffId('');
    setFormAmount(0);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormReason('');
  };

  const statusVariant: Record<SalaryAdvance['status'], 'warning' | 'info' | 'success'> = {
    pending: 'warning',
    partial: 'info',
    recovered: 'success',
  };

  const columns: ColumnDef<SalaryAdvance, unknown>[] = [
    {
      accessorKey: 'staffId',
      header: 'Staff',
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
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => <span className="text-sm">{formatDate(row.original.date)}</span>,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <span className="text-sm font-medium">{formatCurrency(row.original.amount)}</span>
      ),
    },
    {
      accessorKey: 'deducted',
      header: 'Deducted',
      cell: ({ row }) => (
        <span className="text-sm">{formatCurrency(row.original.deducted)}</span>
      ),
    },
    {
      id: 'balance',
      header: 'Balance',
      cell: ({ row }) => {
        const balance = row.original.amount - row.original.deducted;
        return (
          <span className={`text-sm font-medium ${balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {formatCurrency(balance)}
          </span>
        );
      },
    },
    {
      accessorKey: 'reason',
      header: 'Reason',
      cell: ({ row }) => (
        <span className="text-sm text-slate-600">{row.original.reason || '-'}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={statusVariant[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
  ];

  return (
    <PageWrapper
      title="Salary Advances"
      subtitle="Track and manage salary advances"
      actions={
        <div className="flex items-center gap-3">
          <Button onClick={() => setIsModalOpen(true)}>Record Advance</Button>
          <Button variant="outline" href="/salary-calculator">
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      }
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3 p-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <HiOutlineBanknotes className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Outstanding</p>
              <p className="text-xl font-bold text-slate-900">{formatCurrency(totalOutstanding)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3 p-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HiOutlineCalendarDays className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Advances This Month</p>
              <p className="text-xl font-bold text-slate-900">{advancesThisMonth}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3 p-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <HiOutlineCheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Fully Recovered</p>
              <p className="text-xl font-bold text-slate-900">{fullyRecovered}</p>
            </div>
          </div>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={advances}
        searchPlaceholder="Search advances..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Advance"
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

          <Input
            label="Amount"
            type="number"
            min={0}
            value={formAmount || ''}
            onChange={(e) => setFormAmount(parseFloat(e.target.value) || 0)}
            placeholder="Enter advance amount"
          />

          <Input
            label="Date"
            type="date"
            value={formDate}
            onChange={(e) => setFormDate(e.target.value)}
          />

          <Input
            label="Reason (Optional)"
            value={formReason}
            onChange={(e) => setFormReason(e.target.value)}
            placeholder="Enter reason for advance"
          />
        </div>
      </Modal>
    </PageWrapper>
  );
}
