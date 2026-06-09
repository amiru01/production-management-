import React, { useState, useMemo } from 'react'
import {
  Search,
  Plus,
  Filter,
  Download,
  MoreVertical,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { cn } from '../../utils'
import { useStore, type Invoice } from '../../store/AppStore'

const statusStyles: Record<string, { icon: any; color: string; bg: string }> = {
  Paid: { icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50' },
  Sent: { icon: Clock, color: 'text-blue-700', bg: 'bg-blue-50' },
  Draft: { icon: FileText, color: 'text-slate-700', bg: 'bg-slate-100' },
  Overdue: { icon: AlertCircle, color: 'text-rose-700', bg: 'bg-rose-50' },
  Pending: { icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50' },
}

const statuses = ['Draft', 'Sent', 'Paid', 'Overdue', 'Pending']

export function Invoices() {
  const { invoices, addInvoice, updateInvoice, deleteInvoice } = useStore()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [formData, setFormData] = useState({ client: '', amount: 0, date: '', dueDate: '', status: 'Draft', items: '' })
  const [dropdownId, setDropdownId] = useState<string | null>(null)
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return invoices
    const q = search.toLowerCase()
    return invoices.filter(i =>
      i.id.toLowerCase().includes(q) ||
      i.client.toLowerCase().includes(q) ||
      i.items.toLowerCase().includes(q)
    )
  }, [invoices, search])

  const totalOutstanding = useMemo(() =>
    invoices.filter(i => i.status === 'Pending' || i.status === 'Sent' || i.status === 'Overdue')
      .reduce((s, i) => s + i.amount, 0), [invoices])

  const totalOverdue = useMemo(() =>
    invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0), [invoices])

  const totalPaid = useMemo(() =>
    invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0), [invoices])

  const totalDrafts = useMemo(() =>
    invoices.filter(i => i.status === 'Draft').reduce((s, i) => s + i.amount, 0), [invoices])

  const handleNew = () => {
    setEditingInvoice(null)
    setFormData({ client: '', amount: 0, date: new Date().toISOString().split('T')[0], dueDate: '', status: 'Draft', items: '' })
    setModalOpen(true)
  }

  const handleEdit = (inv: Invoice) => {
    setEditingInvoice(inv)
    setFormData({ client: inv.client, amount: inv.amount, date: inv.date, dueDate: inv.dueDate, status: inv.status, items: inv.items })
    setDropdownId(null)
    setModalOpen(true)
  }

  const handleSave = () => {
    if (editingInvoice) {
      updateInvoice(editingInvoice.id, formData)
    } else {
      addInvoice({ ...formData, id: 'INV-' + Date.now() })
    }
    setModalOpen(false)
  }

  const handleDelete = (id: string) => {
    setDropdownId(null)
    if (confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(id)
    }
  }

  const handleStatusChange = (id: string, status: string) => {
    updateInvoice(id, { status })
    setEditingStatusId(null)
  }

  const handleExport = () => {
    const rows = [['Invoice', 'Client', 'Items', 'Date', 'Due Date', 'Amount', 'Status']]
    filtered.forEach(i => rows.push([i.id, i.client, i.items, i.date, i.dueDate, String(i.amount), i.status]))
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'invoices.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Invoices</h2>
          <p className="text-slate-500">Manage client billing and track payments.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={handleNew} className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Total Outstanding</div>
          <div className="text-2xl font-bold text-slate-900">${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Overdue</div>
          <div className="text-2xl font-bold text-rose-600">${totalOverdue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Paid (Last 30 Days)</div>
          <div className="text-2xl font-bold text-emerald-600">${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Drafts</div>
          <div className="text-2xl font-bold text-slate-700">${totalDrafts.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoices by ID, client, or project..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"><Filter className="w-4 h-4" /> Filter</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Invoice</th>
                <th className="p-4 font-medium">Client / Items</th>
                <th className="p-4 font-medium">Issue Date</th>
                <th className="p-4 font-medium">Due Date</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((inv) => {
                const style = statusStyles[inv.status] || statusStyles.Draft
                const StatusIcon = style.icon
                return (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4"><div className="font-medium text-slate-900 text-sm">{inv.id}</div></td>
                    <td className="p-4">
                      <div className="font-medium text-slate-900 text-sm">{inv.client}</div>
                      <div className="text-xs text-slate-500">{inv.items}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{inv.date}</td>
                    <td className="p-4 text-sm text-slate-600">{inv.dueDate}</td>
                    <td className="p-4 font-medium text-slate-900">${inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="p-4 relative">
                      {editingStatusId === inv.id ? (
                        <select
                          value={inv.status}
                          onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                          onBlur={() => setEditingStatusId(null)}
                          autoFocus
                          className="text-xs px-2 py-1 border border-amber-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        >
                          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <div
                          onClick={() => setEditingStatusId(inv.id)}
                          className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer hover:opacity-80', style.bg, style.color)}
                        >
                          <StatusIcon className="w-3.5 h-3.5" /> {inv.status}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right relative">
                      <button
                        onClick={() => setDropdownId(dropdownId === inv.id ? null : inv.id)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {dropdownId === inv.id && (
                        <div className="absolute right-4 top-12 z-10 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[120px]">
                          <button onClick={() => handleEdit(inv)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Edit</button>
                          <button onClick={() => handleDelete(inv.id)} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-slate-50">Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-sm">No invoices found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
          <span>Showing {filtered.length} of {invoices.length} invoices</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">{editingInvoice ? 'Edit Invoice' : 'New Invoice'}</h3>
            <div className="space-y-4">
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
              <input
                type="date"
                placeholder="Due Date"
                value={formData.dueDate}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input
                placeholder="Items / Description"
                value={formData.items}
                onChange={e => setFormData({ ...formData, items: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
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
