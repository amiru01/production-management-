import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Download,
  FileText,
  TrendingUp,
  Users,
  Camera,
  Briefcase,
  Clock,
  MoreVertical,
  X,
  Trash2,
} from 'lucide-react'
import { cn } from '../../utils'

const reportTypes = [
  {
    title: 'Revenue Report',
    description: 'Monthly revenue breakdown by client, project, and revenue stream with YTD comparisons.',
    icon: TrendingUp,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    lastGenerated: 'Oct 15, 2026',
    format: 'PDF',
  },
  {
    title: 'Expense Report',
    description: 'Detailed expense categorization with department-level spend analysis and budget comparisons.',
    icon: FileText,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    lastGenerated: 'Oct 14, 2026',
    format: 'CSV',
  },
  {
    title: 'Team Performance',
    description: 'Team utilization rates, project completion metrics, and individual productivity scores.',
    icon: Users,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    lastGenerated: 'Oct 12, 2026',
    format: 'PDF',
  },
  {
    title: 'Equipment Utilization',
    description: 'Equipment usage rates, maintenance schedules, and availability forecasts.',
    icon: Camera,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    lastGenerated: 'Oct 10, 2026',
    format: 'PDF',
  },
  {
    title: 'Project Summary',
    description: 'Comprehensive project status report including timelines, budgets, and milestone tracking.',
    icon: Briefcase,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    lastGenerated: 'Oct 8, 2026',
    format: 'CSV',
  },
]

const initialRecentReports = [
  { id: 1, type: 'Revenue Report', date: 'Oct 15, 2026', generatedBy: 'Sarah Jenkins', status: 'Generated', format: 'PDF' },
  { id: 2, type: 'Expense Report', date: 'Oct 14, 2026', generatedBy: 'Sarah Jenkins', status: 'Generated', format: 'CSV' },
  { id: 3, type: 'Team Performance', date: 'Oct 12, 2026', generatedBy: 'Marcus Chen', status: 'Generated', format: 'PDF' },
  { id: 4, type: 'Equipment Utilization', date: 'Oct 10, 2026', generatedBy: 'David Kim', status: 'Failed', format: 'PDF' },
  { id: 5, type: 'Project Summary', date: 'Oct 8, 2026', generatedBy: 'Elena Rodriguez', status: 'Generated', format: 'CSV' },
  { id: 6, type: 'Revenue Report', date: 'Sep 30, 2026', generatedBy: 'Sarah Jenkins', status: 'Generated', format: 'PDF' },
]

export function AdminReports() {
  const navigate = useNavigate()
  const [recentReports, setRecentReports] = useState(initialRecentReports)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)

  const handleDelete = (id: number) => {
    setOpenMenuId(null)
    if (confirm('Are you sure you want to delete this report?')) {
      setRecentReports(prev => prev.filter(r => r.id !== id))
    }
  }

  const handleDownload = (report: string) => {
    setDownloading(report)
    setTimeout(() => setDownloading(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Reports</h2>
        <p className="text-slate-500">Generate and download financial, operational, and team reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report, i) => {
          const Icon = report.icon
          return (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={cn('p-2.5 rounded-lg', report.iconBg)}>
                  <Icon className={cn('w-5 h-5', report.iconColor)} />
                </div>
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">{report.format}</span>
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-1">{report.title}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{report.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {report.lastGenerated}
                </div>
                <button onClick={() => handleDownload(report.title)} className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Recent Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Report Type</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Generated By</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Format</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">{report.type}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{report.date}</td>
                  <td className="p-4 text-sm text-slate-600">{report.generatedBy}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <div className={cn('w-2 h-2 rounded-full', report.status === 'Generated' ? 'bg-emerald-500' : 'bg-rose-500')} />
                      <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', report.status === 'Generated' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700')}>
                        {report.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{report.format}</span>
                  </td>
                  <td className="p-4 text-right relative">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDownload(report.type)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button onClick={() => setOpenMenuId(openMenuId === report.id ? null : report.id)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    {openMenuId === report.id && (
                      <div className="absolute right-4 top-10 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10 min-w-[120px]">
                        <button onClick={() => handleDelete(report.id)} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-rose-600 hover:bg-rose-50">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
