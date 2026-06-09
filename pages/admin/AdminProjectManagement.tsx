import React, { useState } from 'react'
import { useStore } from '../../store/AppStore'
import {
  Search,
  Plus,
  MoreVertical,
  Briefcase,
  CheckCircle2,
  DollarSign,
  Clock,
  X,
  Edit2,
  Trash2,
} from 'lucide-react'
import { cn } from '../../utils'

const statusStyles: Record<string, string> = {
  Planning: 'bg-slate-100 text-slate-700',
  'Pre-Production': 'bg-blue-50 text-blue-700',
  'In Production': 'bg-indigo-50 text-indigo-700',
  'Post-Production': 'bg-amber-50 text-amber-700',
  Completed: 'bg-emerald-50 text-emerald-700',
}

export function AdminProjectManagement() {
  const { projects, addProject, updateProject, deleteProject } = useStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [managerFilter, setManagerFilter] = useState('All Managers')
  const [clientFilter, setClientFilter] = useState('All Clients')
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', client: '', manager: '', status: 'Planning', budget: 0, spent: 0, timeline: '', progress: 0, color: 'bg-blue-500' })

  const managers = [...new Set(projects.map(p => p.manager))]
  const clients = [...new Set(projects.map(p => p.client))]

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

  const openAdd = () => {
    setEditingProject(null)
    setForm({ name: '', client: '', manager: '', status: 'Planning', budget: 0, spent: 0, timeline: '', progress: 0, color: 'bg-blue-500' })
    setShowModal(true)
  }

  const openEdit = (project: any) => {
    setEditingProject(project)
    setForm({ name: project.name, client: project.client, manager: project.manager, status: project.status, budget: project.budget, spent: project.spent, timeline: project.timeline, progress: project.progress, color: project.color })
    setShowModal(true)
    setOpenMenuId(null)
  }

  const handleDelete = (id: number) => {
    setOpenMenuId(null)
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(id)
    }
  }

  const handleSubmit = () => {
    if (editingProject) {
      updateProject(editingProject.id, form)
    } else {
      addProject(form as any)
    }
    setShowModal(false)
    setEditingProject(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Project Management</h2>
          <p className="text-slate-500">Oversee all production projects across the company.</p>
        </div>
        <button onClick={openAdd} className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Project
        </button>
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
                  <td className="p-4 text-right relative">
                    <button onClick={() => setOpenMenuId(openMenuId === project.id ? null : project.id)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {openMenuId === project.id && (
                      <div className="absolute right-4 top-12 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10 min-w-[120px]">
                        <button onClick={() => openEdit(project)} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => handleDelete(project.id)} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-rose-600 hover:bg-rose-50">
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

        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
          <span>Showing {filtered.length} of {projects.length} projects</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">{editingProject ? 'Edit Project' : 'Create Project'}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Client</label>
                <input type="text" value={form.client} onChange={e => setForm({...form, client: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Manager</label>
                <input type="text" value={form.manager} onChange={e => setForm({...form, manager: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                  <option>Planning</option>
                  <option>Pre-Production</option>
                  <option>In Production</option>
                  <option>Post-Production</option>
                  <option>Completed</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Budget</label>
                  <input type="number" value={form.budget} onChange={e => setForm({...form, budget: +e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Spent</label>
                  <input type="number" value={form.spent} onChange={e => setForm({...form, spent: +e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Timeline</label>
                <input type="text" value={form.timeline} onChange={e => setForm({...form, timeline: e.target.value})} placeholder="e.g. Oct 15 - Nov 15" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Progress (%)</label>
                <input type="number" min="0" max="100" value={form.progress} onChange={e => setForm({...form, progress: +e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={handleSubmit} className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg text-sm font-medium">{editingProject ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
