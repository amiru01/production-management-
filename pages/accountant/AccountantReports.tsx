import React, { useState, useMemo } from 'react'
import {
  Download,
  FileText,
  BarChart3,
  PieChart,
  DollarSign,
  TrendingUp,
  Calendar,
  Eye,
  X,
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
import { useStore } from '../../store/AppStore'

interface ReportEntry {
  name: string
  type: string
  date: string
  by: string
}

const typeStyles: Record<string, string> = {
  'Revenue Report': 'bg-emerald-50 text-emerald-700',
  'Expense Report': 'bg-rose-50 text-rose-700',
  'Profit & Loss': 'bg-blue-50 text-blue-700',
  'Payment Report': 'bg-amber-50 text-amber-700',
}

const reportTemplates = [
  {
    title: 'Revenue Report',
    description: 'Detailed breakdown of all revenue streams and income sources across the period.',
    icon: TrendingUp,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    title: 'Expense Report',
    description: 'Comprehensive view of operational costs, vendor payments, and overheads.',
    icon: BarChart3,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
  {
    title: 'Profit & Loss',
    description: 'Net income analysis comparing revenue against expenses over the reporting period.',
    icon: DollarSign,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    title: 'Payment Report',
    description: 'Summary of all client payments received, pending, and failed by payment method.',
    icon: PieChart,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
]

export function AccountantReports() {
  const { invoices, projects, expenses, payments } = useStore()
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [reports, setReports] = useState<ReportEntry[]>([])
  const [showGenerate, setShowGenerate] = useState(false)

  const monthlyFinancials = useMemo(() => {
    const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
    const totalRevenue = invoices.reduce((s, i) => s + i.amount, 0)
    const totalExpenses = projects.reduce((s, p) => s + p.spent, 0) + expenses.reduce((s, e) => s + e.amount, 0)
    const perMonthRev = Math.max(Math.round(totalRevenue / 6), 1000)
    const perMonthExp = Math.max(Math.round(totalExpenses / 6), 1000)
    return months.map((month, idx) => ({
      month,
      revenue: perMonthRev + idx * 4000 + Math.round(Math.sin(idx * 1.3) * 3000),
      expenses: perMonthExp + idx * 2000 + Math.round(Math.cos(idx * 1.1) * 2000),
    }))
  }, [invoices, projects, expenses])

  const handleGenerateReport = (type: string) => {
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    const newReport: ReportEntry = {
      name: `${type} - ${dateStr}`,
      type,
      date: dateStr,
      by: 'Current User',
    }
    setReports(prev => [newReport, ...prev])
    setShowGenerate(false)
  }

  const handleDownload = (report: ReportEntry) => {
    const lines = [`${report.name}`, `${'='.repeat(40)}`, '']
    if (report.type === 'Revenue Report') {
      invoices.forEach(i => lines.push(`${i.id} | ${i.client} | $${i.amount.toLocaleString()} | ${i.status} | Due: ${i.dueDate}`))
      lines.push('')
      lines.push(`Total Invoiced: $${invoices.reduce((s, i) => s + i.amount, 0).toLocaleString()}`)
      lines.push(`Total Paid: $${invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0).toLocaleString()}`)
      lines.push(`Total Pending: $${invoices.filter(i => i.status === 'Pending').reduce((s, i) => s + i.amount, 0).toLocaleString()}`)
    } else if (report.type === 'Expense Report') {
      expenses.forEach(e => lines.push(`${e.description} | ${e.department} | $${e.amount.toLocaleString()} | ${e.status} | ${e.requestedBy}`))
      lines.push('')
      lines.push(`Total Expenses: $${expenses.reduce((s, e) => s + e.amount, 0).toLocaleString()}`)
    } else if (report.type === 'Profit & Loss') {
      const totalRev = invoices.reduce((s, i) => s + i.amount, 0)
      const totalExp = projects.reduce((s, p) => s + p.spent, 0) + expenses.reduce((s, e) => s + e.amount, 0)
      lines.push(`Total Revenue: $${totalRev.toLocaleString()}`)
      lines.push(`Total Expenses: $${totalExp.toLocaleString()}`)
      lines.push(`Net Profit: $${(totalRev - totalExp).toLocaleString()}`)
      lines.push('')
      lines.push('Breakdown:')
      projects.forEach(p => lines.push(`  ${p.name}: Revenue $${p.budget.toLocaleString()} | Spent $${p.spent.toLocaleString()}`))
    } else if (report.type === 'Payment Report') {
      payments.forEach(p => lines.push(`${p.id} | ${p.client} | $${p.amount.toLocaleString()} | ${p.method} | ${p.date} | ${p.status}`))
      lines.push('')
      lines.push(`Total Payments: $${payments.reduce((s, p) => s + p.amount, 0).toLocaleString()}`)
    }
    const content = lines.join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = report.name.replace(/\s+/g, '_') + '.txt'; a.click()
    URL.revokeObjectURL(url)
  }

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
          <button onClick={() => setShowGenerate(true)} className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            <FileText className="w-4 h-4" /> Generate Report
          </button>
        </div>
      </div>

      {showGenerate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowGenerate(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Generate Financial Report</h3>
              <button onClick={() => setShowGenerate(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-4">Select report type to generate:</p>
            <div className="space-y-2">
              {[
                { title: 'Revenue Report', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { title: 'Expense Report', icon: BarChart3, color: 'text-rose-600', bg: 'bg-rose-50' },
                { title: 'Profit & Loss', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
                { title: 'Payment Report', icon: PieChart, color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map((rt, i) => {
                const Icon = rt.icon
                return (
                  <button key={i} onClick={() => handleGenerateReport(rt.title)} className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-all text-left">
                    <div className={cn('p-2 rounded-lg', rt.bg)}>
                      <Icon className={cn('w-5 h-5', rt.color)} />
                    </div>
                    <p className="text-sm font-medium text-slate-900">{rt.title}</p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {reports.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center col-span-full">
          <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No Reports Generated</h3>
          <p className="text-sm text-slate-500">Click the Generate Report button to create your first report.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTemplates.map((card, i) => {
          const Icon = card.icon
          const lastGen = reports.find(r => r.type === card.title)
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
                    <span className="text-xs text-slate-400">Last generated: {lastGen ? lastGen.date : 'Not generated'}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const r = reports.find(rpt => rpt.type === card.title)
                          if (r) handleDownload(r)
                        }}
                        disabled={!lastGen}
                        className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-40"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                      <button
                        onClick={() => {
                          const now = new Date()
                          const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
                          const newReport: ReportEntry = { name: `${card.title} - ${dateStr}`, type: card.title, date: dateStr, by: 'Current User' }
                          setReports(prev => [newReport, ...prev])
                        }}
                        className="text-xs font-medium text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                      >
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
      )}

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
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">No reports generated yet</p>
                    <p className="text-xs mt-1">Generate a report using the button above to see it here.</p>
                  </td>
                </tr>
              ) : reports.map((rpt, i) => (
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
                      <button onClick={() => handleDownload(rpt)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDownload(rpt)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Download">
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
          <span>Showing {reports.length} of {reports.length} reports</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
