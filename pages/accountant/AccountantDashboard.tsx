import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { useStore } from '../../store/AppStore'

function formatCurrency(v: number) {
  return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatShort(v: number) {
  return '$' + v.toLocaleString('en-US')
}

export function AccountantDashboard() {
  const navigate = useNavigate()
  const { invoices, payments, projects } = useStore()

  const totalRevenue = useMemo(() => invoices.reduce((s, i) => s + i.amount, 0), [invoices])
  const totalExpenses = useMemo(() => projects.reduce((s, p) => s + p.spent, 0), [projects])
  const netProfit = totalRevenue - totalExpenses
  const outstandingInvoices = useMemo(() => invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue'), [invoices])
  const outstandingTotal = useMemo(() => outstandingInvoices.reduce((s, i) => s + i.amount, 0), [outstandingInvoices])

  const kpis = [
    { title: 'Total Revenue (MTD)', value: formatCurrency(totalRevenue), change: '+15%', trend: 'up' as const },
    { title: 'Total Expenses (MTD)', value: formatCurrency(totalExpenses), change: '-2%', trend: 'down' as const },
    { title: 'Net Profit (MTD)', value: formatCurrency(netProfit), change: '+8%', trend: 'up' as const },
    { title: 'Outstanding Invoices', value: formatShort(outstandingTotal), change: `${outstandingInvoices.length} Invoices`, trend: 'neutral' as const },
  ]

  const cashFlowData = useMemo(() => {
    const i = Math.round(totalRevenue / 4)
    const o = Math.round(totalExpenses / 4)
    return [
      { name: 'Week 1', in: i, out: o },
      { name: 'Week 2', in: i + 5000, out: o - 2000 },
      { name: 'Week 3', in: i - 3000, out: o + 1000 },
      { name: 'Week 4', in: i + 8000, out: o - 3000 },
    ]
  }, [totalRevenue, totalExpenses])

  const profitData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    const base = Math.max(Math.round(netProfit / 6), 1000)
    return months.map((month, idx) => ({
      month,
      profit: base + idx * 2000 + Math.round(Math.sin(idx * 1.5) * 3000),
    }))
  }, [netProfit])

  const recentTransactions = useMemo(() => {
    const fromPayments = payments
      .filter(p => p.status === 'Completed')
      .map(p => ({
        id: p.id,
        date: p.date.split(',')[0],
        description: `Client Payment - ${p.client}`,
        type: 'income' as const,
        amount: '+$' + p.amount.toLocaleString('en-US'),
        status: 'Completed' as const,
      }))
    const fromInvoices = invoices
      .filter(i => i.status === 'Overdue')
      .map(i => ({
        id: i.id,
        date: i.date.split(',')[0],
        description: `Outstanding Invoice - ${i.client}`,
        type: 'expense' as const,
        amount: '-$' + i.amount.toLocaleString('en-US'),
        status: 'Overdue' as const,
      }))
    const all = [...fromPayments, ...fromInvoices]
    const monthOrder: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }
    all.sort((a, b) => {
      const ap = a.date.split(' '), bp = b.date.split(' ')
      if (ap.length < 2 || bp.length < 2) return 0
      const am = monthOrder[ap[0]] ?? 0, bm = monthOrder[bp[0]] ?? 0
      if (am !== bm) return bm - am
      return parseInt(bp[1]) - parseInt(ap[1])
    })
    return all.slice(0, 4)
  }, [payments, invoices])

  const handleExportCSV = () => {
    const rows = [['Transaction', 'Date', 'Status', 'Amount']]
    recentTransactions.forEach(t => rows.push([t.description, t.date, t.status, t.amount]))
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'transactions.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Financial Overview</h2>
          <p className="text-slate-500">Track revenue, expenses, and cash flow.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => navigate('/accountant/invoices')} className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">Create Invoice</button>
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
          <button onClick={() => navigate('/accountant/payments')} className="text-sm text-amber-600 font-medium hover:text-amber-700">View All</button>
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
