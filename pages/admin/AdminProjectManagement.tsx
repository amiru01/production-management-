import React, { useState } from 'react'
import {
  Search,
  MoreVertical,
  Briefcase,
  CheckCircle2,
  DollarSign,
  Clock,
} from 'lucide-react'
import { cn } from '../../utils'

const projects = [
  { id: 1, name: 'Summer Campaign', client: 'Nike', manager: 'Marcus Chen', status: 'In Production', budget: 45000, spent: 28000, timeline: 'Oct 15 - Nov 15', progress: 65, color: 'bg-blue-500' },
  { id: 2, name: 'Product Launch', client: 'TechCorp', manager: 'Elena Rodriguez', status: 'Planning', budget: 28000, spent: 5000, timeline: 'Nov 1 - Dec 1', progress: 20, color: 'bg-amber-500' },
  { id: 3, name: 'Brand Story', client: 'Local Coffee', manager: 'David Kim', status: 'Post-Production', budget: 8500, spent: 8000, timeline: 'Oct 1 - Oct 25', progress: 90, color: 'bg-emerald-500' },
  { id: 4, name: 'Artist Spotlight', client: 'Spotify', manager: 'Amanda Foster', status: 'Pre-Production', budget: 65000, spent: 15000, timeline: 'Nov 2 - Dec 15', progress: 25, color: 'bg-violet-500' },
  { id: 5, name: 'Training Series', client: 'Puma', manager: 'Marcus Chen', status: 'Completed', budget: 32000, spent: 31000, timeline: 'Aug 1 - Sep 15', progress: 100, color: 'bg-emerald-500' },
  { id: 6, name: 'Holiday Campaign', client: 'Adidas', manager: 'Elena Rodriguez', status: 'In Production', budget: 55000, spent: 22000, timeline: 'Oct 20 - Nov 30', progress: 40, color: 'bg-blue-500' },
  { id: 7, name: 'Keynote Event', client: 'Apple', manager: 'David Kim', status: 'Post-Production', budget: 78000, spent: 65000, timeline: 'Sep 10 - Oct 20', progress: 85, color: 'bg-emerald-500' },
  { id: 8, name: 'Series Launch', client: 'Netflix', manager: 'Amanda Foster', status: 'Planning', budget: 120000, spent: 10000, timeline: 'Dec 1 - Feb 28', progress: 10, color: 'bg-amber-500' },
]

const statusStyles: Record<string, string> = {
  Planning: 'bg-slate-100 text-slate-700',
  'Pre-Production': 'bg-blue-50 text-blue-700',
  'In Production': 'bg-indigo-50 text-indigo-700',
  'Post-Production': 'bg-amber-50 text-amber-700',
  Completed: 'bg-emerald-50 text-emerald-700',
}

const managers = [...new Set(projects.map(p => p.manager))]
const clients = [...new Set(projects.map(p => p.client))]

export function AdminProjectManagement() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [managerFilter, setManagerFilter] = useState('All Managers')
  const [clientFilter, setClientFilter] = useState('All Clients')

  const filtered = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All Statuses' || p.status === statusFilter
    const matchesManager = managerFilter === 'All Managers' || p.manager === managerFilter
    const matchesClient = clientFilter === 'All Clients' || p.client === clientFilter
    return matchesSearch && matchesStatus && matchesManager && matchesClient
  })

  const activeProjects = projects.filter(p => p.status !== 'Completed').length
  const completedYTD = projects.filter(p => p.status === 'Completed').length
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0)
  const avgCompletionDays = 34

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Project Management</h2>
          <p className="text-slate-500">Oversee all production projects across the company.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg"><Briefcase className="w-5 h-5 text-indigo-600" /></div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Active Projects</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{activeProjects}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Completed YTD</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{completedYTD}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg"><DollarSign className="w-5 h-5 text-blue-600" /></div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Total Budget</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">${(totalBudget / 1000).toFixed(0)}k</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 rounded-lg"><Clock className="w-5 h-5 text-amber-600" /></div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Avg Completion</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{avgCompletionDays} days</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search projects..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option>All Statuses</option>
              <option>Planning</option>
              <option>Pre-Production</option>
              <option>In Production</option>
              <option>Post-Production</option>
              <option>Completed</option>
            </select>
            <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" value={managerFilter} onChange={e => setManagerFilter(e.target.value)}>
              <option>All Managers</option>
              {managers.map(m => <option key={m}>{m}</option>)}
            </select>
            <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" value={clientFilter} onChange={e => setClientFilter(e.target.value)}>
              <option>All Clients</option>
              {clients.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Project</th>
                <th className="p-4 font-medium">Client</th>
                <th className="p-4 font-medium">Manager</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Budget</th>
                <th className="p-4 font-medium">Timeline</th>
                <th className="p-4 font-medium">Progress</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-medium text-slate-900">{project.name}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{project.client}</td>
                  <td className="p-4 text-sm text-slate-600">{project.manager}</td>
                  <td className="p-4">
                    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', statusStyles[project.status])}>
                      {project.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-sm font-medium text-slate-900">${project.budget.toLocaleString()}</div>
                    <div className="text-xs text-slate-400">${project.spent.toLocaleString()} spent</div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{project.timeline}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full', project.color)} style={{ width: `${project.progress}%` }} />
                      </div>
                      <span className="text-sm font-medium text-slate-700 min-w-[3ch]">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
          <span>Showing {filtered.length} of {projects.length} projects</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
