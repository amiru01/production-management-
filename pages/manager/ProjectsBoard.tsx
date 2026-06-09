import React, { useState } from 'react'
import { Plus, MoreHorizontal, Calendar, Users, X, ChevronDown } from 'lucide-react'
import { cn } from '../../utils'
import { useStore } from '../../store/AppStore'

const columnConfig = [
  { id: 'planning', title: 'Planning', color: 'bg-slate-100 border-slate-200 text-slate-700' },
  { id: 'pre-prod', title: 'Pre-Production', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { id: 'shooting', title: 'Shooting', color: 'bg-rose-50 border-rose-200 text-rose-700' },
  { id: 'post-prod', title: 'Post-Production', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { id: 'delivered', title: 'Delivered', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
]

const statusToColumn: Record<string, string> = {
  Planning: 'planning',
  'Pre-Production': 'pre-prod',
  'In Production': 'shooting',
  'Post-Production': 'post-prod',
  Completed: 'delivered',
}

const columnToStatus: Record<string, string> = {
  planning: 'Planning',
  'pre-prod': 'Pre-Production',
  shooting: 'In Production',
  'post-prod': 'Post-Production',
  delivered: 'Completed',
}

const statusCycle = ['planning', 'pre-prod', 'shooting', 'post-prod', 'delivered']

export function ProjectsBoard() {
  const { projects, addProject, updateProject, deleteProject } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', client: '', tags: '' })
  const [menuOpen, setMenuOpen] = useState<number | null>(null)

  const columns = columnConfig.map(col => ({
    ...col,
    count: projects.filter(p => statusToColumn[p.status] === col.id).length,
  }))

  const openAddModal = () => {
    setEditingId(null)
    setForm({ name: '', client: '', tags: '' })
    setShowModal(true)
  }

  const openEditModal = (project: typeof projects[0]) => {
    setEditingId(project.id)
    setForm({ name: project.name, client: project.client, tags: '' })
    setShowModal(true)
    setMenuOpen(null)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editingId !== null) {
      updateProject(editingId, { name: form.name, client: form.client })
    } else {
      addProject({
        id: 0,
        name: form.name,
        client: form.client,
        manager: '',
        status: 'Planning',
        budget: 0,
        spent: 0,
        timeline: '',
        progress: 0,
        color: 'bg-blue-500',
      })
    }
    setShowModal(false)
  }

  const handleDelete = (id: number) => {
    if (confirm('Delete this project?')) {
      deleteProject(id)
    }
    setMenuOpen(null)
  }

  const cycleStatus = (projectId: number, currentStatus: string) => {
    const currentCol = statusToColumn[currentStatus] || 'planning'
    const idx = statusCycle.indexOf(currentCol)
    const nextCol = statusCycle[(idx + 1) % statusCycle.length]
    updateProject(projectId, { status: columnToStatus[nextCol] })
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Projects Board</h2>
          <p className="text-slate-500">Manage production pipeline and project statuses.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-slate-50 flex items-center justify-center text-xs font-medium text-slate-600 z-10 relative">U{i}</div>
            ))}
            <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-50 flex items-center justify-center text-xs font-medium text-slate-500 z-10 relative">+3</div>
          </div>
          <button onClick={openAddModal} className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 h-full min-w-max">
          {columns.map((column) => (
            <div key={column.id} className="w-80 flex flex-col h-full">
              <div className={cn('px-3 py-2 rounded-lg border mb-4 flex items-center justify-between', column.color)}>
                <h3 className="font-semibold text-sm">{column.title}</h3>
                <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-bold">{column.count}</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px] bg-slate-100/50 rounded-xl p-2 border border-slate-200/50">
                {projects.filter(p => statusToColumn[p.status] === column.id).map((project) => (
                  <div key={project.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group relative">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-wrap gap-1">
                      </div>
                      <div className="relative">
                        <button onClick={() => setMenuOpen(menuOpen === project.id ? null : project.id)} className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal className="w-4 h-4" /></button>
                        {menuOpen === project.id && (
                          <div className="absolute right-0 top-8 w-36 bg-white rounded-lg shadow-lg border border-slate-200 z-20 py-1">
                            <button onClick={() => openEditModal(project)} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Edit</button>
                            <button onClick={() => handleDelete(project.id)} className="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50">Delete</button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => cycleStatus(project.id, project.status)}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-1"
                      >
                        {project.status} <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">{project.name}</h4>
                    <p className="text-xs text-slate-500 mb-4">{project.client}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {project.timeline ? project.timeline.split(' - ')[0] : 'TBD'}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">
                        <Users className="w-3.5 h-3.5" /> 0
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={openAddModal} className="w-full py-2 flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors border border-transparent border-dashed hover:border-slate-300">
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">{editingId !== null ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]" placeholder="Enter project name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Client</label>
                <input type="text" value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]" placeholder="Enter client name" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-[#191970] hover:bg-[#121258] rounded-lg transition-colors">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
