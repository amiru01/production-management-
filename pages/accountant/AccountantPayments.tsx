import React, { useState, useMemo } from 'react'
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
import { useStore, type Payment } from '../../store/AppStore'

const statusStyles: Record<string, { icon: any; color: string; bg: string }> = {
  Completed: { icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50' },
  Pending: { icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50' },
  Failed: { icon: XCircle, color: 'text-rose-700', bg: 'bg-rose-50' },
}

const methodIcons: Record<string, any> = {
  'Bank Transfer': Banknote,
  'Wire Transfer': Banknote,
  'Credit Card': CreditCard,
  'Check': DollarSign,
}

const methods = ['Bank Transfer', 'Wire Transfer', 'Credit Card', 'Check']
const statuses = ['Completed', 'Pending', 'Failed']

export function AccountantPayments() {
  const { payments, addPayment, updatePayment } = useStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const [formData, setFormData] = useState({ invoice: '', client: '', amount: 0, date: '', method: 'Bank Transfer', status: 'Pending' })
  const [dropdownId, setDropdownId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch =
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.client.toLowerCase().includes(search.toLowerCase()) ||
        p.invoice.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [payments, search, statusFilter])

  const totalReceived = useMemo(() =>
    payments.filter(p => p.status === 'Completed').reduce((s, p) => s + p.amount, 0), [payments])

  const totalPending = useMemo(() =>
    payments.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0), [payments])

  const totalFailed = useMemo(() =>
    payments.filter(p => p.status === 'Failed').reduce((s, p) => s + p.amount, 0), [payments])

  const pendingCount = useMemo(() =>
    payments.filter(p => p.status === 'Pending').length, [payments])

  const failedCount = useMemo(() =>
    payments.filter(p => p.status === 'Failed').length, [payments])

  const paymentTrend = useMemo(() => {
    const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
    const perMonth = Math.max(Math.round(totalReceived / 6), 1000)
    const perFailed = Math.max(Math.round(totalFailed / 6), 500)
    return months.map((month, idx) => ({
      month,
      completed: perMonth + idx * 3000 + Math.round(Math.sin(idx * 1.2) * 2000),
      failed: perFailed + idx * 200 + Math.round(Math.cos(idx) * 300),
    }))
  }, [totalReceived, totalFailed])

  const handleNew = () => {
    setEditingPayment(null)
    setFormData({ invoice: '', client: '', amount: 0, date: new Date().toISOString().split('T')[0], method: 'Bank Transfer', status: 'Pending' })
    setModalOpen(true)
  }

  const handleEdit = (pay: Payment) => {
    setEditingPayment(pay)
    setFormData({ invoice: pay.invoice, client: pay.client, amount: pay.amount, date: pay.date, method: pay.method, status: pay.status })
    setDropdownId(null)
    setModalOpen(true)
  }

  const handleSave = () => {
    if (editingPayment) {
      updatePayment(editingPayment.id, formData)
    } else {
      addPayment({ ...formData, id: 'PAY-' + Date.now() })
    }
    setModalOpen(false)
  }

  const handleExport = () => {
    const rows = [['Payment ID', 'Invoice ID', 'Client', 'Amount', 'Method', 'Date', 'Status']]
    filtered.forEach(p => rows.push([p.id, p.invoice, p.client, String(p.amount), p.method, p.date, p.status]))
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'payments.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Payments</h2>
          <p className="text-slate-500">Track incoming payments and payment statuses.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={handleNew} className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
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
          <div className="text-2xl font-bold text-slate-900">${totalReceived.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <div className="text-xs text-emerald-600 font-medium mt-1">+12% vs last month</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-500">Pending</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600">${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">{pendingCount} payments awaiting confirmation</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-500">Failed</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-600">${totalFailed.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <div className="text-xs text-red-600 font-medium mt-1">{failedCount} payment{failedCount !== 1 ? 's' : ''} requires attention</div>
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
                    <td className="p-4 font-medium text-slate-900">${pay.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
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
                    <td className="p-4 text-right relative">
                      <button
                        onClick={() => setDropdownId(dropdownId === pay.id ? null : pay.id)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {dropdownId === pay.id && (
                        <div className="absolute right-4 top-12 z-10 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[120px]">
                          <button onClick={() => handleEdit(pay)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Edit</button>
                        </div>
                      )}
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">{editingPayment ? 'Edit Payment' : 'Record Payment'}</h3>
            <div className="space-y-4">
              <input
                placeholder="Invoice ID"
                value={formData.invoice}
                onChange={e => setFormData({ ...formData, invoice: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <input
                placeholder="Client"
                value={formData.client}
                onChange={e => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <input
                type="date"
                placeholder="Date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <select
                value={formData.method}
                onChange={e => setFormData({ ...formData, method: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                {methods.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-[#191970] text-white rounded-lg text-sm hover:bg-[#121258]">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
