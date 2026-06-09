import React, { useState } from 'react'
import {
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Download,
  CreditCard,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { cn } from '../../utils'
import { useStore } from '../../store/AppStore'

interface Invoice {
  id: string
  project: string
  date: string
  dueDate: string
  amount: number
  status: 'Paid' | 'Overdue' | 'Pending' | 'Draft'
  description: string
}

const statusColor: Record<string, string> = {
  Paid: 'bg-emerald-50 text-emerald-700',
  Overdue: 'bg-red-50 text-red-700',
  Pending: 'bg-amber-50 text-amber-700',
  Draft: 'bg-slate-50 text-slate-600',
}

const statusIcon: Record<string, React.ReactNode> = {
  Paid: <CheckCircle2 className="w-3.5 h-3.5" />,
  Overdue: <AlertTriangle className="w-3.5 h-3.5" />,
  Pending: <Clock className="w-3.5 h-3.5" />,
  Draft: <FileText className="w-3.5 h-3.5" />,
}

function formatCurrency(amount: number): string {
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function ClientInvoices() {
  const { invoices: storeInvoices, updateInvoice } = useStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const invoices: Invoice[] = storeInvoices.map(inv => ({
    id: inv.id,
    project: inv.client,
    date: inv.date,
    dueDate: inv.dueDate,
    amount: inv.amount,
    status: (inv.status === 'Paid' || inv.status === 'Overdue' || inv.status === 'Pending' ? inv.status : 'Pending') as 'Paid' | 'Overdue' | 'Pending' | 'Draft',
    description: inv.items,
  }))

  const handlePayNow = (inv: Invoice) => {
    updateInvoice(inv.id, { status: 'Paid' })
  }

  const handleDownload = (inv: Invoice) => {
    alert(`Downloading PDF for ${inv.id}`)
  }

  const stats = {
    outstanding: invoices.filter((i) => i.status === 'Pending' || i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0),
    overdue: invoices.filter((i) => i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0),
    paidLast30: invoices.filter((i) => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0),
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Invoices</h2>
        <p className="text-slate-500 mt-1">View and pay your invoices from Lumen Studio.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500">Total Outstanding</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><DollarSign className="w-4 h-4" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{formatCurrency(stats.outstanding)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500">Overdue</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertTriangle className="w-4 h-4" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{formatCurrency(stats.overdue)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500">Paid (Last 30 Days)</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 className="w-4 h-4" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{formatCurrency(stats.paidLast30)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50/50">
                <th className="px-5 py-3">Invoice</th>
                <th className="px-5 py-3">Project</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Due Date</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => {
                const isExpanded = expandedId === inv.id
                const needsPayment = inv.status === 'Overdue' || inv.status === 'Pending'
                return (
                  <React.Fragment key={inv.id}>
                    <tr
                      className={cn('hover:bg-slate-50 transition-colors cursor-pointer', isExpanded && 'bg-slate-50')}
                      onClick={() => toggleExpand(inv.id)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-sm text-slate-900">{inv.id}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{inv.project}</td>
                      <td className="px-5 py-4 text-sm text-slate-500">{inv.date}</td>
                      <td className="px-5 py-4 text-sm text-slate-500">{inv.dueDate}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-900">{formatCurrency(inv.amount)}</td>
                      <td className="px-5 py-4">
                        <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 w-fit', statusColor[inv.status])}>
                          {statusIcon[inv.status]} {inv.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleDownload(inv)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          {needsPayment && (
                            <button
                              onClick={() => handlePayNow(inv)}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                            >
                              <CreditCard className="w-3.5 h-3.5" /> Pay Now
                            </button>
                          )}
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${inv.id}-detail`}>
                        <td colSpan={7} className="px-5 py-4 bg-slate-50/50 border-b border-slate-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                              <FileText className="w-4 h-4 text-slate-400" />
                              <span>{inv.description}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDownload(inv)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                              >
                                <Download className="w-4 h-4" /> Download PDF
                              </button>
                              {needsPayment && (
                                <button
                                  onClick={() => handlePayNow(inv)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                                >
                                  <CreditCard className="w-4 h-4" /> Pay Now
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
