import React from 'react'
import {
  TrendingUp,
  TrendingDown,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { cn } from '../../utils'

const cashFlowData = [
  { name: 'Week 1', in: 15000, out: 8000 },
  { name: 'Week 2', in: 22000, out: 12000 },
  { name: 'Week 3', in: 18000, out: 15000 },
  { name: 'Week 4', in: 35000, out: 10000 },
]

const profitData = [
  { month: 'Jan', profit: 12000 },
  { month: 'Feb', profit: 15000 },
  { month: 'Mar', profit: 14000 },
  { month: 'Apr', profit: 22000 },
  { month: 'May', profit: 18000 },
  { month: 'Jun', profit: 28000 },
]

const kpis = [
  { title: 'Total Revenue (MTD)', value: '$90,000', change: '+15%', trend: 'up' as const },
  { title: 'Total Expenses (MTD)', value: '$45,000', change: '-2%', trend: 'down' as const },
  { title: 'Net Profit (MTD)', value: '$45,000', change: '+8%', trend: 'up' as const },
  { title: 'Outstanding Invoices', value: '$32,500', change: '5 Invoices', trend: 'neutral' as const },
]

const recentTransactions = [
  { id: 'TRX-001', date: 'Oct 15', description: 'Client Payment - Nike', type: 'income' as const, amount: '+$22,500', status: 'Completed' },
  { id: 'TRX-002', date: 'Oct 14', description: 'Equipment Rental - LensPro', type: 'expense' as const, amount: '-$3,200', status: 'Completed' },
  { id: 'TRX-003', date: 'Oct 14', description: 'Freelancer Payment - D. Kim', type: 'expense' as const, amount: '-$1,500', status: 'Processing' },
  { id: 'TRX-004', date: 'Oct 12', description: 'Client Payment - Local Coffee', type: 'income' as const, amount: '+$4,250', status: 'Completed' },
]

export function AccountantDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Financial Overview</h2>
          <p className="text-slate-500">Track revenue, expenses, and cash flow.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">Create Invoice</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-slate-500 text-sm font-medium mb-1">{kpi.title}</h3>
            <div className="flex items-end gap-3">
              <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
              <span className={cn('text-xs font-medium px-2 py-0.5 rounded-md mb-1 flex items-center gap-1', kpi.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : kpi.trend === 'down' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-700')}>
                {kpi.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                {kpi.trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Cash Flow (This Month)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]} />
                <Bar dataKey="in" fill="#10b981" radius={[4, 4, 0, 0]} name="Money In" barSize={32} />
                <Bar dataKey="out" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Money Out" barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Net Profit Trend (YTD)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: number) => [`$${value.toLocaleString()}`, 'Profit']} />
                <Line type="monotone" dataKey="profit" stroke="#d97706" strokeWidth={3} dot={{ r: 4, fill: '#d97706', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
          <button className="text-sm text-amber-600 font-medium hover:text-amber-700">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Transaction</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center', trx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600')}>
                        {trx.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 text-sm">{trx.description}</div>
                        <div className="text-xs text-slate-500">{trx.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{trx.date}</td>
                  <td className="p-4">
                    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', trx.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>{trx.status}</span>
                  </td>
                  <td className={cn('p-4 text-right font-medium', trx.type === 'income' ? 'text-emerald-600' : 'text-slate-900')}>{trx.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
