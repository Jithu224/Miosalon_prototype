'use client';

import { useState, useMemo } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useHydration } from '@/hooks/useHydration';
import { formatCurrency, formatDate } from '@/lib/utils';
import { HiOutlineBanknotes, HiOutlinePlus } from 'react-icons/hi2';

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

const initialExpenses: Expense[] = [
  { id: 'exp-1', category: 'Rent', description: 'Monthly shop rent - April 2026', amount: 85000, date: '2026-04-01' },
  { id: 'exp-2', category: 'Supplies', description: 'Salon products restock - L\'Oreal, Lakme, Schwarzkopf', amount: 32500, date: '2026-04-02' },
  { id: 'exp-3', category: 'Salaries', description: 'Staff salaries - March 2026', amount: 240000, date: '2026-04-01' },
  { id: 'exp-4', category: 'Marketing', description: 'Instagram & Google Ads - March campaign', amount: 15000, date: '2026-03-28' },
  { id: 'exp-5', category: 'Utilities', description: 'Electricity and water bill - March 2026', amount: 12800, date: '2026-04-03' },
  { id: 'exp-6', category: 'Supplies', description: 'Towels, capes, and disposables', amount: 8500, date: '2026-04-04' },
  { id: 'exp-7', category: 'Marketing', description: 'Printed flyers and brochures', amount: 4200, date: '2026-04-05' },
  { id: 'exp-8', category: 'Maintenance', description: 'AC servicing and plumbing repair', amount: 6500, date: '2026-04-03' },
];

const categoryVariant: Record<string, 'info' | 'success' | 'purple' | 'orange' | 'warning' | 'neutral' | 'danger'> = {
  Rent: 'info',
  Supplies: 'success',
  Salaries: 'purple',
  Marketing: 'orange',
  Utilities: 'warning',
  Maintenance: 'neutral',
};

const categoryOptions = [
  { value: 'Rent', label: 'Rent' },
  { value: 'Supplies', label: 'Supplies' },
  { value: 'Salaries', label: 'Salaries' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Utilities', label: 'Utilities' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Other', label: 'Other' },
];

export default function ExpensesPage() {
  const hydrated = useHydration();
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Supplies',
    description: '',
    amount: '',
    date: '2026-04-06',
  });

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, exp) => sum + exp.amount, 0),
    [expenses]
  );

  const handleSubmit = () => {
    if (!formData.description || !formData.amount) return;
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      category: formData.category,
      description: formData.description,
      amount: parseFloat(formData.amount),
      date: formData.date,
    };
    setExpenses((prev) => [newExpense, ...prev]);
    setFormData({ category: 'Supplies', description: '', amount: '', date: '2026-04-06' });
    setIsModalOpen(false);
  };

  if (!hydrated) {
    return (
      <PageWrapper title="Expenses" subtitle="Track and categorize business expenses">
        <div className="space-y-6 animate-pulse">
          <div className="h-28 bg-slate-200 rounded-xl w-72" />
          <div className="h-64 bg-slate-200 rounded-xl" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Expenses"
      subtitle="Track and categorize business expenses"
      actions={
        <Button onClick={() => setIsModalOpen(true)}>
          <HiOutlinePlus className="w-4 h-4" />
          Add Expense
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Total Expenses KPI */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-start gap-4 w-fit">
          <div className="bg-red-50 p-3 rounded-lg">
            <HiOutlineBanknotes className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Expenses</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>

        {/* Expense List */}
        <Card title="Expense List" padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-6 text-slate-500 font-medium">Date</th>
                  <th className="text-left py-3 px-6 text-slate-500 font-medium">Category</th>
                  <th className="text-left py-3 px-6 text-slate-500 font-medium">Description</th>
                  <th className="text-right py-3 px-6 text-slate-500 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-3 px-6 text-slate-600 whitespace-nowrap">{formatDate(exp.date)}</td>
                    <td className="py-3 px-6">
                      <Badge variant={categoryVariant[exp.category] || 'neutral'}>
                        {exp.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-6 text-slate-700">{exp.description}</td>
                    <td className="py-3 px-6 text-right font-medium text-slate-900">
                      {formatCurrency(exp.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Expense"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save Expense</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
          <Input
            label="Description"
            placeholder="Enter expense description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Input
            label="Amount"
            type="number"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
      </Modal>
    </PageWrapper>
  );
}
