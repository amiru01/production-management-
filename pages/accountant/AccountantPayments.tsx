import React, { useState } from 'react'
import {
  Search,
  Plus,
  Filter,
  Download,
  MoreVertical,
  Banknote,
  CreditCard,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { cn } from '../../utils'

const payments = [
  { id: 'PAY-001', invoice: 'INV-2023-089', client: 'Nike', amount: '$22,500.00', method: 'Bank Transfer', date: 'Oct 15, 2023', status: 'Completed' },
  { id: 'PAY-002', invoice: 'INV-2023-090', client: 'TechCorp', amount: '$14,000.00', method: 'Credit Card', date: 'Oct 18, 2023', status: 'Pending' },
  { id: 'PAY-003', invoice: 'INV-2023-092', client: 'Adidas', amount: '$18,000.00', method: 'Credit Card', date: 'Oct 20, 2023', status: 'Completed' },
  { id: 'PAY-004', invoice: 'INV-2023-085', client: 'Spotify', amount: '$32,500.00', method: 'Bank Transfer', date: 'Sep 29, 2023', status: 'Failed' },
  { id: 'PAY-005', invoice: 'INV-2023-093', client: 'Starbucks', amount: '$6,750.00', method: 'Check', date: 'Oct 22, 2023', status: 'Pending' },
  { id: 'PAY-006', invoice: 'INV-2023-086', client: 'Local Coffee', amount: '$4,250.00', method: 'Credit Card', date: 'Oct 12, 2023', status: 'Completed' },
  { id: 'PAY-007', invoice: 'INV-2023-094', client: 'Nike', amount: '$12,800.00', method: 'Bank Transfer', date: 'Oct 25, 2023', status: 'Completed' },
  { id: 'PAY-008', invoice: 'INV-2023-095', client: 'Apple', amount: '$45,000.00', method: 'Bank Transfer', date: 'Oct 28, 2023', status: 'Pending' },
]

const paymentTrend = [
  { month: 'May', completed: 45000, failed: 2000 },
  { month: 'Jun', completed: 52000, failed: 1500 },
  { month: 'Jul', completed: 48000, failed: 3000 },
  { month: 'Aug', completed: 61000, failed: 1000 },
  { month: 'Sep', completed: 58000, failed: 2500 },
  { month: 'Oct', completed: 78000, failed: 3500 },
]

const statusStyles: Record<string, { icon: any; color: string; bg: string }> = {
  Completed: { icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50' },
  Pending: { icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50' },
  Failed: { icon: XCircle, color: 'text-rose-700', bg: 'bg-rose-50' },
}

const methodIcons: Record<string, any> = {
  'Bank Transfer': Banknote,
  'Credit Card': CreditCard,
  'Check': DollarSign,
}

export function AccountantPayments() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = payments.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.invoice.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Payments</h2>
          <p className="text-slate-500">Track incoming payments and payment statuses.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Record Payment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-500">Total Received (MTD)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">$78,050.00</div>
          <div className="text-xs text-emerald-600 font-medium mt-1">+12% vs last month</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-500">Pending</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600">$59,750.00</div>
          <div className="text-xs text-slate-500 font-medium mt-1">3 payments awaiting confirmation</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-500">Failed</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-600">$32,500.00</div>
          <div className="text-xs text-red-600 font-medium mt-1">1 payment requires attention</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-500">Avg Processing Time</span>
            <DollarSign className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">1.4 Days</div>
          <div className="text-xs text-emerald-600 font-medium mt-1">-0.3 days vs last month</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Payment Volume (Monthly)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={paymentTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(v: number) => [`$${v.toLocaleString()}`, undefined]} />
              <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" barSize={32} />
              <Bar dataKey="failed" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Failed" barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, client, or invoice..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Completed', 'Pending', 'Failed'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  'px-3 py-2 rounded-lg font-medium text-sm transition-colors border',
                  statusFilter === s
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Payment ID</th>
                <th className="p-4 font-medium">Invoice ID</th>
                <th className="p-4 font-medium">Client</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Method</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((pay) => {
                const style = statusStyles[pay.status]
                const StatusIcon = style.icon
                const MethodIcon = methodIcons[pay.method]
                return (
                  <tr key={pay.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4">
                      <div className="font-medium text-slate-900 text-sm">{pay.id}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{pay.invoice}</td>
                    <td className="p-4 font-medium text-slate-900 text-sm">{pay.client}</td>
                    <td className="p-4 font-medium text-slate-900">{pay.amount}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        {MethodIcon && <MethodIcon className="w-3.5 h-3.5 text-slate-400" />}
                        {pay.method}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{pay.date}</td>
                    <td className="p-4">
                      <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium', style.bg, style.color)}>
                        <StatusIcon className="w-3.5 h-3.5" /> {pay.status}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 text-sm">
                    No payments found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
          <span>Showing {filtered.length} of {payments.length} payments</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
