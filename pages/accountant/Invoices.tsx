import React from 'react'
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

const invoices = [
  { id: 'INV-2023-089', client: 'Nike', project: 'Summer Campaign', date: 'Oct 01, 2023', dueDate: 'Oct 15, 2023', amount: '$22,500.00', status: 'Paid' },
  { id: 'INV-2023-090', client: 'TechCorp', project: 'Product Launch', date: 'Oct 05, 2023', dueDate: 'Oct 19, 2023', amount: '$14,000.00', status: 'Sent' },
  { id: 'INV-2023-091', client: 'Local Coffee', project: 'Brand Story', date: 'Oct 10, 2023', dueDate: 'Oct 24, 2023', amount: '$4,250.00', status: 'Draft' },
  { id: 'INV-2023-085', client: 'Spotify', project: 'Artist Spotlight', date: 'Sep 15, 2023', dueDate: 'Sep 29, 2023', amount: '$32,500.00', status: 'Overdue' },
  { id: 'INV-2023-092', client: 'Adidas', project: 'Winter Promo', date: 'Oct 12, 2023', dueDate: 'Oct 26, 2023', amount: '$18,000.00', status: 'Sent' },
]

const statusStyles: Record<string, { icon: any; color: string; bg: string }> = {
  Paid: { icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50' },
  Sent: { icon: Clock, color: 'text-blue-700', bg: 'bg-blue-50' },
  Draft: { icon: FileText, color: 'text-slate-700', bg: 'bg-slate-100' },
  Overdue: { icon: AlertCircle, color: 'text-rose-700', bg: 'bg-rose-50' },
}

export function Invoices() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Invoices</h2>
          <p className="text-slate-500">Manage client billing and track payments.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Total Outstanding</div>
          <div className="text-2xl font-bold text-slate-900">$64,500.00</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Overdue</div>
          <div className="text-2xl font-bold text-rose-600">$32,500.00</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Paid (Last 30 Days)</div>
          <div className="text-2xl font-bold text-emerald-600">$45,200.00</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Drafts</div>
          <div className="text-2xl font-bold text-slate-700">$4,250.00</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search invoices by ID, client, or project..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" />
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
                <th className="p-4 font-medium">Client / Project</th>
                <th className="p-4 font-medium">Issue Date</th>
                <th className="p-4 font-medium">Due Date</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoices.map((inv) => {
                const style = statusStyles[inv.status]
                const StatusIcon = style.icon
                return (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4"><div className="font-medium text-slate-900 text-sm">{inv.id}</div></td>
                    <td className="p-4">
                      <div className="font-medium text-slate-900 text-sm">{inv.client}</div>
                      <div className="text-xs text-slate-500">{inv.project}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{inv.date}</td>
                    <td className="p-4 text-sm text-slate-600">{inv.dueDate}</td>
                    <td className="p-4 font-medium text-slate-900">{inv.amount}</td>
                    <td className="p-4">
                      <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium', style.bg, style.color)}>
                        <StatusIcon className="w-3.5 h-3.5" /> {inv.status}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><MoreVertical className="w-5 h-5" /></button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
          <span>Showing 1 to 5 of 24 invoices</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
