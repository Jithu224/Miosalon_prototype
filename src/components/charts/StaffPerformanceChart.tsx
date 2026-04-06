'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface StaffPerformanceChartProps {
  data: { name: string; revenue: number; appointments: number }[];
}

export function StaffPerformanceChart({ data }: StaffPerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          formatter={(value, name) => [
            name === 'revenue' ? formatCurrency(Number(value)) : value,
            name === 'revenue' ? 'Revenue' : 'Appointments',
          ]}
          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
        />
        <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="revenue" />
        <Bar dataKey="appointments" fill="#10b981" radius={[4, 4, 0, 0]} name="appointments" />
      </BarChart>
    </ResponsiveContainer>
  );
}
