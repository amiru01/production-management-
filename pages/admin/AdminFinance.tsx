import React from 'react'
import { useStore } from '../../store/AppStore'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { cn } from '../../utils'

const revenueData = [
  { name: 'Jan', revenue: 45000, expenses: 28000 },
  { name: 'Feb', revenue: 52000, expenses: 30000 },
  { name: 'Mar', revenue: 48000, expenses: 29000 },
  { name: 'Apr', revenue: 61000, expenses: 32000 },
  { name: 'May', revenue: 59000, expenses: 31000 },
  { name: 'Jun', revenue: 75000, expenses: 35000 },
  { name: 'Jul', revenue: 72000, expenses: 38000 },
  { name: 'Aug', revenue: 68000, expenses: 36000 },
  { name: 'Sep', revenue: 81000, expenses: 40000 },
  { name: 'Oct', revenue: 78000, expenses: 37000 },
  { name: 'Nov', revenue: 85000, expenses: 42000 },
  { name: 'Dec', revenue: 92000, expenses: 45000 },
]

const budgets = [
  { department: 'Production', allocated: 500000, spent: 380000, remaining: 120000, status: 'On Track' },
  { department: 'Equipment', allocated: 250000, spent: 210000, remaining: 40000, status: 'At Risk' },
  { department: 'Post-Production', allocated: 180000, spent: 120000, remaining: 60000, status: 'On Track' },
  { department: 'Talent', allocated: 300000, spent: 290000, remaining: 10000, status: 'Over Budget' },
  { department: 'Transport & Logistics', allocated: 120000, spent: 75000, remaining: 45000, status: 'On Track' },
  { department: 'Marketing', allocated: 200000, spent: 140000, remaining: 60000, status: 'On Track' },
]

const budgetStatusStyles: Record<string, string> = {
  'On Track': 'bg-emerald-50 text-emerald-700',
  'At Risk': 'bg-amber-50 text-amber-700',
  'Over Budget': 'bg-rose-50 text-rose-700',
}

export function AdminFinance() {
  const { expenses, updateExpense } = useStore()
  const totalRevenue = 816000
  const totalExpenses = 423000
  const netProfit = totalRevenue - totalExpenses
  const pendingPayables = expenses.filter(e => e.status === 'Pending').reduce((s, e) => s + e.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Financial Management</h2>
        <p className="text-slate-500">Company finances, budgets, and expense approvals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg"><TrendingUp className="w-5 h-5 text-emerald-600" /></div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">+18%</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Total Revenue YTD</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-rose-50 rounded-lg"><TrendingDown className="w-5 h-5 text-rose-600" /></div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-rose-50 text-rose-700">+8%</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Total Expenses</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">${totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg"><DollarSign className="w-5 h-5 text-blue-600" /></div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">+32%</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Net Profit</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">${netProfit.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 rounded-lg"><AlertCircle className="w-5 h-5 text-amber-600" /></div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Pending Payables</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">${pendingPayables.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Revenue vs Expenses</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]} />
              <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#revGrad)" name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#expGrad)" name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Department Budgets</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Department</th>
                  <th className="p-4 font-medium text-right">Allocated</th>
                  <th className="p-4 font-medium text-right">Spent</th>
                  <th className="p-4 font-medium text-right">Remaining</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {budgets.map((b, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">{b.department}</td>
                    <td className="p-4 text-right text-sm text-slate-600">${(b.allocated / 1000).toFixed(0)}k</td>
                    <td className="p-4 text-right text-sm text-slate-600">${(b.spent / 1000).toFixed(0)}k</td>
                    <td className="p-4 text-right text-sm font-medium" style={{ color: b.remaining < 50000 ? '#dc2626' : '#059669' }}>${(b.remaining / 1000).toFixed(0)}k</td>
                    <td className="p-4">
                      <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', budgetStatusStyles[b.status])}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900">Expense Approvals</h3>
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</button>
          </div>
          <div className="divide-y divide-slate-200">
            {expenses.map((exp) => (
              <div key={exp.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{exp.description}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{exp.department} · {exp.requestedBy} · {exp.date}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-900 ml-4">${exp.amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {exp.status === 'Pending' ? (
                    <>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-50 text-amber-700">Pending</span>
                      <button onClick={() => updateExpense(exp.id, { status: 'Approved' })} className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 px-2 py-1 rounded hover:bg-emerald-50 transition-colors">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button onClick={() => updateExpense(exp.id, { status: 'Rejected' })} className="flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 px-2 py-1 rounded hover:bg-rose-50 transition-colors">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  ) : (
                    <span className={cn('text-xs font-medium px-2 py-1 rounded-full', exp.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700')}>
                      {exp.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
