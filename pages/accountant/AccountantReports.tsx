import React, { useState } from 'react'
import {
  Download,
  FileText,
  BarChart3,
  PieChart,
  DollarSign,
  TrendingUp,
  Calendar,
  Eye,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { cn } from '../../utils'

const reports = [
  { name: 'Q3 2023 Revenue Summary', type: 'Revenue Report', date: 'Oct 02, 2023', by: 'John Miller' },
  { name: 'September Operating Expenses', type: 'Expense Report', date: 'Oct 01, 2023', by: 'John Miller' },
  { name: 'Q3 Profit & Loss Statement', type: 'Profit & Loss', date: 'Sep 30, 2023', by: 'Sarah Chen' },
  { name: 'Client Payment History Sep', type: 'Payment Report', date: 'Sep 29, 2023', by: 'Sarah Chen' },
  { name: 'Annual Budget vs Actuals', type: 'Revenue Report', date: 'Sep 25, 2023', by: 'John Miller' },
  { name: 'Vendor Expense Breakdown', type: 'Expense Report', date: 'Sep 20, 2023', by: 'Mike Rivera' },
]

const monthlyFinancials = [
  { month: 'May', revenue: 85000, expenses: 52000 },
  { month: 'Jun', revenue: 92000, expenses: 58000 },
  { month: 'Jul', revenue: 78000, expenses: 49000 },
  { month: 'Aug', revenue: 102000, expenses: 61000 },
  { month: 'Sep', revenue: 96000, expenses: 55000 },
  { month: 'Oct', revenue: 115000, expenses: 67000 },
]

const reportCards = [
  {
    title: 'Revenue Report',
    description: 'Detailed breakdown of all revenue streams and income sources across the period.',
    icon: TrendingUp,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    lastGenerated: 'Oct 02, 2023',
  },
  {
    title: 'Expense Report',
    description: 'Comprehensive view of operational costs, vendor payments, and overheads.',
    icon: BarChart3,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    lastGenerated: 'Oct 01, 2023',
  },
  {
    title: 'Profit & Loss',
    description: 'Net income analysis comparing revenue against expenses over the reporting period.',
    icon: DollarSign,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    lastGenerated: 'Sep 30, 2023',
  },
  {
    title: 'Payment Report',
    description: 'Summary of all client payments received, pending, and failed by payment method.',
    icon: PieChart,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    lastGenerated: 'Sep 29, 2023',
  },
]

const typeStyles: Record<string, string> = {
  'Revenue Report': 'bg-emerald-50 text-emerald-700',
  'Expense Report': 'bg-rose-50 text-rose-700',
  'Profit & Loss': 'bg-blue-50 text-blue-700',
  'Payment Report': 'bg-amber-50 text-amber-700',
}

export function AccountantReports() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Financial Reports</h2>
          <p className="text-slate-500">Generate and download financial reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
          <button className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            <FileText className="w-4 h-4" /> Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportCards.map((card, i) => {
          const Icon = card.icon
          return (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-start gap-4">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', card.bg)}>
                  <Icon className={cn('w-5 h-5', card.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900">{card.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{card.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-slate-400">Last generated: {card.lastGenerated}</span>
                    <div className="flex gap-2">
                      <button className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                      <button className="text-xs font-medium text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> Generate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Monthly Revenue vs Expenses</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyFinancials} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(v: number) => [`$${v.toLocaleString()}`, undefined]} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue" barSize={28} />
              <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expenses" barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Recent Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Report Name</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Date Generated</th>
                <th className="p-4 font-medium">Generated By</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {reports.map((rpt, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="font-medium text-slate-900 text-sm">{rpt.name}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn('inline-flex px-2.5 py-1 rounded-md text-xs font-medium', typeStyles[rpt.type])}>
                      {rpt.type}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{rpt.date}</td>
                  <td className="p-4 text-sm text-slate-600">{rpt.by}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
          <span>Showing 6 of 18 reports</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
