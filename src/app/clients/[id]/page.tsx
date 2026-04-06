'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/data-table/DataTable';
import { useClientStore } from '@/store/useClientStore';
import { useAppointmentStore } from '@/store/useAppointmentStore';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { useHydration } from '@/hooks/useHydration';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Appointment } from '@/types/appointment';
import { Invoice } from '@/types/invoice';

const statusVariant: Record<string, 'success' | 'neutral' | 'danger'> = {
  active: 'success',
  inactive: 'neutral',
  churned: 'danger',
};

const appointmentColumns: ColumnDef<Appointment, unknown>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
  {
    accessorKey: 'services',
    header: 'Services',
    cell: ({ getValue }) => {
      const svcs = getValue() as Appointment['services'];
      return svcs.map((s) => s.serviceId).join(', ');
    },
  },
  { accessorKey: 'staffId', header: 'Staff' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const s = getValue() as string;
      const v: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'neutral'> = {
        completed: 'success',
        confirmed: 'info',
        scheduled: 'info',
        'in-progress': 'warning',
        cancelled: 'danger',
        'no-show': 'danger',
      };
      return <Badge variant={v[s] || 'neutral'}>{s}</Badge>;
    },
  },
];

const invoiceColumns: ColumnDef<Invoice, unknown>[] = [
  { accessorKey: 'invoiceNumber', header: 'Invoice #' },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
  {
    accessorKey: 'grandTotal',
    header: 'Amount',
    cell: ({ getValue }) => formatCurrency(getValue() as number),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const s = getValue() as string;
      const v: Record<string, 'success' | 'warning' | 'neutral' | 'danger'> = {
        paid: 'success',
        partial: 'warning',
        draft: 'neutral',
        void: 'danger',
      };
      return <Badge variant={v[s] || 'neutral'}>{s}</Badge>;
    },
  },
];

const clientTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'appointments', label: 'Appointments' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'notes', label: 'Notes' },
];

export default function ClientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const hydrated = useHydration();
  const router = useRouter();
  const client = useClientStore((s) => s.getClient(id));
  const updateClient = useClientStore((s) => s.updateClient);
  const appointments = useAppointmentStore((s) =>
    s.appointments.filter((a) => a.clientId === id)
  );
  const invoices = useInvoiceStore((s) =>
    s.invoices.filter((inv) => inv.clientId === id)
  );

  const [activeTab, setActiveTab] = useState('overview');
  const [notes, setNotes] = useState('');
  const [notesInit, setNotesInit] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'female' as 'male' | 'female' | 'other',
    dateOfBirth: '',
    address: '',
    status: 'active' as 'active' | 'inactive' | 'churned',
    source: '',
  });

  if (!hydrated) {
    return <div className="p-6">Loading...</div>;
  }

  if (!client) {
    return (
      <PageWrapper title="Client Not Found">
        <Card>
          <p className="text-slate-500">
            This client does not exist.{' '}
            <button
              className="text-blue-600 underline"
              onClick={() => router.push('/clients')}
            >
              Back to Clients
            </button>
          </p>
        </Card>
      </PageWrapper>
    );
  }

  if (!notesInit) {
    setNotes(client.notes || '');
    setNotesInit(true);
  }

  const openEdit = () => {
    setEditForm({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      gender: client.gender,
      dateOfBirth: client.dateOfBirth || '',
      address: client.address || '',
      status: client.status,
      source: client.source,
    });
    setEditOpen(true);
  };

  const saveEdit = () => {
    updateClient(client.id, {
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      email: editForm.email,
      phone: editForm.phone,
      gender: editForm.gender,
      dateOfBirth: editForm.dateOfBirth || undefined,
      address: editForm.address || undefined,
      status: editForm.status,
      source: editForm.source,
    });
    setEditOpen(false);
  };

  const saveNotes = () => {
    updateClient(client.id, { notes });
  };

  const avgTicket =
    client.visitCount > 0
      ? client.totalSpent / client.visitCount
      : 0;

  return (
    <PageWrapper
      title="Client Profile"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/clients')}>
            Back
          </Button>
          <Button onClick={openEdit}>Edit Client</Button>
        </div>
      }
    >
      {/* Header */}
      <Card className="mb-6">
        <div className="flex items-center gap-6">
          <Avatar
            name={`${client.firstName} ${client.lastName}`}
            size="xl"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-slate-900">
                {client.firstName} {client.lastName}
              </h2>
              <Badge variant={statusVariant[client.status]}>
                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
              </Badge>
            </div>
            <div className="text-sm text-slate-500 space-y-0.5">
              <p>{client.phone}</p>
              <p>{client.email}</p>
            </div>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-xs text-slate-500 uppercase font-medium">Wallet</p>
              <p className="text-lg font-semibold text-slate-900">
                {formatCurrency(client.walletBalance)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-medium">Rewards</p>
              <p className="text-lg font-semibold text-slate-900">
                {client.rewardPoints} pts
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs tabs={clientTabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <p className="text-xs text-slate-500 uppercase font-medium">Total Spent</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatCurrency(client.totalSpent)}
                </p>
              </Card>
              <Card>
                <p className="text-xs text-slate-500 uppercase font-medium">Visit Count</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {client.visitCount}
                </p>
              </Card>
              <Card>
                <p className="text-xs text-slate-500 uppercase font-medium">Avg Ticket</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatCurrency(avgTicket)}
                </p>
              </Card>
              <Card>
                <p className="text-xs text-slate-500 uppercase font-medium">Member Since</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatDate(client.createdAt)}
                </p>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card title="Preferences">
                {client.preferences && client.preferences.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {client.preferences.map((p) => (
                      <Badge key={p} variant="info">{p}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No preferences recorded</p>
                )}
              </Card>
              <Card title="Allergies">
                {client.allergies && client.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {client.allergies.map((a) => (
                      <Badge key={a} variant="danger">{a}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No allergies recorded</p>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* Appointments */}
        {activeTab === 'appointments' && (
          <DataTable
            columns={appointmentColumns}
            data={appointments}
            searchPlaceholder="Search appointments..."
          />
        )}

        {/* Invoices */}
        {activeTab === 'invoices' && (
          <DataTable
            columns={invoiceColumns}
            data={invoices}
            searchPlaceholder="Search invoices..."
          />
        )}

        {/* Notes */}
        {activeTab === 'notes' && (
          <Card title="Client Notes">
            <textarea
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={8}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this client..."
            />
            <div className="mt-4">
              <Button onClick={saveNotes}>Save Notes</Button>
            </div>
          </Card>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Client"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={editForm.firstName}
            onChange={(e) =>
              setEditForm((prev) => ({ ...prev, firstName: e.target.value }))
            }
          />
          <Input
            label="Last Name"
            value={editForm.lastName}
            onChange={(e) =>
              setEditForm((prev) => ({ ...prev, lastName: e.target.value }))
            }
          />
          <Input
            label="Email"
            type="email"
            value={editForm.email}
            onChange={(e) =>
              setEditForm((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <Input
            label="Phone"
            value={editForm.phone}
            onChange={(e) =>
              setEditForm((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
          <Select
            label="Gender"
            value={editForm.gender}
            onChange={(e) =>
              setEditForm((prev) => ({
                ...prev,
                gender: e.target.value as 'male' | 'female' | 'other',
              }))
            }
            options={[
              { value: 'female', label: 'Female' },
              { value: 'male', label: 'Male' },
              { value: 'other', label: 'Other' },
            ]}
          />
          <Input
            label="Date of Birth"
            type="date"
            value={editForm.dateOfBirth}
            onChange={(e) =>
              setEditForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))
            }
          />
          <Select
            label="Status"
            value={editForm.status}
            onChange={(e) =>
              setEditForm((prev) => ({
                ...prev,
                status: e.target.value as 'active' | 'inactive' | 'churned',
              }))
            }
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'churned', label: 'Churned' },
            ]}
          />
          <Select
            label="Source"
            value={editForm.source}
            onChange={(e) =>
              setEditForm((prev) => ({ ...prev, source: e.target.value }))
            }
            options={[
              { value: 'walk-in', label: 'Walk-in' },
              { value: 'online', label: 'Online' },
              { value: 'referral', label: 'Referral' },
              { value: 'lead', label: 'Lead' },
            ]}
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Address
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              value={editForm.address}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, address: e.target.value }))
              }
            />
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
