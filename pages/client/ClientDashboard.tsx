import React from 'react'
import {
  Video,
  CheckCircle2,
  MessageSquare,
  FileText,
  Download,
  PlayCircle,
  Clock,
} from 'lucide-react'
import { cn } from '../../utils'

const myProjects = [
  { id: 1, name: 'Summer Campaign 2024', status: 'In Production', progress: 65, nextMilestone: 'Rough Cut Review', date: 'Oct 18' },
  { id: 2, name: 'Social Media Shorts', status: 'Planning', progress: 15, nextMilestone: 'Script Approval', date: 'Oct 22' },
]

const pendingApprovals = [
  { id: 1, title: 'Storyboard V2', project: 'Social Media Shorts', type: 'Document', time: '2 hours ago' },
  { id: 2, title: 'Location Options', project: 'Summer Campaign 2024', type: 'Gallery', time: '1 day ago' },
]

const recentDeliverables = [
  { id: 1, title: 'Casting Tape - Lead Role', project: 'Summer Campaign 2024', type: 'Video', date: 'Oct 10' },
  { id: 2, title: 'Moodboard Final', project: 'Social Media Shorts', type: 'PDF', date: 'Oct 08' },
]

const recentInvoices = [
  { id: 'INV-2023-089', amount: '$22,500.00', status: 'Paid', date: 'Oct 01', isDue: false },
  { id: 'INV-2023-095', amount: '$15,000.00', status: 'Due Oct 25', date: 'Oct 11', isDue: true },
]

export function ClientDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back, Nike Team</h2>
          <p className="text-slate-500">Here&apos;s the latest on your projects with Lumen Studio.</p>
        </div>
        <button className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> Message Producer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">My Active Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Video className="w-5 h-5" /></div>
                    <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">{project.status}</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 text-lg mb-4">{project.name}</h4>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500">Overall Progress</span>
                      <span className="text-rose-600">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-600 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                    <div className="text-slate-500">Next: <span className="font-medium text-slate-900">{project.nextMilestone}</span></div>
                    <div className="text-slate-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {project.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-rose-600" /> Action Required: Approvals</h3>
              <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full">2 Pending</span>
            </div>
            <div className="divide-y divide-slate-100">
              {pendingApprovals.map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{item.type}</span>
                      <span className="text-xs text-slate-400">&bull; {item.time}</span>
                    </div>
                    <h4 className="font-medium text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.project}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Review</button>
                    <button className="px-3 py-1.5 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors">Approve</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-semibold text-slate-900">Recent Deliverables</h3>
              <button className="text-sm text-rose-600 font-medium hover:text-rose-700">View All</button>
            </div>
            <div className="divide-y divide-slate-100">
              {recentDeliverables.map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600 group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                      {item.type === 'Video' ? <PlayCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-slate-900 group-hover:text-rose-600 transition-colors">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.project}</p>
                      <div className="text-xs text-slate-400 mt-2">{item.date}</div>
                    </div>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"><Download className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-semibold text-slate-900">Billing</h3>
              <button className="text-sm text-rose-600 font-medium hover:text-rose-700">All Invoices</button>
            </div>
            <div className="divide-y divide-slate-100">
              {recentInvoices.map((inv) => (
                <div key={inv.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="font-medium text-sm text-slate-900">{inv.amount}</div>
                    <div className="text-xs text-slate-500">{inv.id}</div>
                  </div>
                  <div className="text-right">
                    <div className={cn('text-xs font-medium px-2 py-0.5 rounded-md inline-block mb-1', inv.isDue ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700')}>{inv.status}</div>
                    <div className="text-xs text-slate-400">{inv.date}</div>
                  </div>
                </div>
              ))}
            </div>
            {recentInvoices.some(i => i.isDue) && (
              <div className="p-3 border-t border-slate-200 bg-amber-50/50">
                <button className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">Pay Outstanding Balance</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
