import React, { useState, useEffect } from 'react'
import {
  Users,
  Search,
  Plus,
  Mail,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
} from 'lucide-react'
import { cn } from '../../utils'
import { apiFetch } from '../../lib/api'
import { initialTeamMembers, initialTasks } from '../../store/AppStore'

const roles = ['All Roles', 'Director', 'DP', 'Editor', 'Sound', 'Producer', 'Gaffer', 'PA']

interface TeamMember {
  id: number; name: string; role: string; project: string; status: string; tasks: number; availability: number; contact: string
}

interface Task {
  id: number; title: string; project: string; priority: string; status: string; dueDate: string; assignee: string
}

export function ManagerTeam() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [showModal, setShowModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [taskMember, setTaskMember] = useState('')
  const [form, setForm] = useState({ name: '', role: '', project: '', status: 'Available', contact: '', tasks: 0, availability: 100 })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [taskForm, setTaskForm] = useState({ title: '', description: '' })
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  const [isMockData, setIsMockData] = useState(false)

  useEffect(() => {
    if (isMockData) {
      localStorage.setItem('mock_teamMembers', JSON.stringify(teamMembers))
    }
  }, [teamMembers, isMockData])

  useEffect(() => {
    if (isMockData) {
      localStorage.setItem('mock_tasks', JSON.stringify(tasks))
    }
  }, [tasks, isMockData])

  const loadData = async () => {
    try {
      setLoading(true)
      const [members, allTasks] = await Promise.all([
        apiFetch<TeamMember[]>('/team'),
        apiFetch<Task[]>('/tasks'),
      ])
      setTeamMembers(members)
      setTasks(allTasks)
      setIsMockData(false)
    } catch (err) {
      console.warn('Backend unavailable, using mock data', err)
      const savedMembers = localStorage.getItem('mock_teamMembers')
      const savedTasks = localStorage.getItem('mock_tasks')
      setTeamMembers(savedMembers ? JSON.parse(savedMembers) : initialTeamMembers as TeamMember[])
      setTasks(savedTasks ? JSON.parse(savedTasks) : initialTasks as Task[])
      setIsMockData(true)
    } finally {
      setLoading(false)
    }
  }

  const roleOptions = roles.filter(r => r !== 'All Roles')

  const getTaskCount = (name: string) => tasks.filter(t => t.assignee === name).length
  const getWorkload = (name: string) => Math.min(100, getTaskCount(name) * 20)

  const statCards = [
    { label: 'Total Team', value: String(teamMembers.length), color: 'bg-blue-50 text-blue-600', icon: Users },
    { label: 'On Set', value: String(teamMembers.filter(m => m.status === 'On Set').length), color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 },
    { label: 'Available', value: String(teamMembers.filter(m => m.status === 'Available').length), color: 'bg-indigo-50 text-indigo-600', icon: Users },
    { label: 'On Leave', value: String(teamMembers.filter(m => m.status === 'On Leave').length), color: 'bg-amber-50 text-amber-600', icon: AlertCircle },
  ]

  const filtered = teamMembers.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'All Roles' || m.role === roleFilter
    return matchesSearch && matchesRole
  })

  const openAddModal = () => {
    setEditingId(null)
    setForm({ name: '', role: '', project: '', status: 'Available', contact: '', tasks: 0, availability: 100 })
    setShowModal(true)
  }

  const openEditModal = (member: TeamMember) => {
    setEditingId(member.id)
    setForm({ name: member.name, role: member.role, project: member.project, status: member.status, contact: member.contact, tasks: member.tasks, availability: member.availability })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) return
    try {
      if (isMockData) {
        if (editingId !== null) {
          setTeamMembers(prev => prev.map(m => m.id === editingId ? { ...m, name: form.name, role: form.role, status: form.status, contact: form.contact } : m))
        } else {
          const newMember: TeamMember = { id: Date.now(), name: form.name, role: form.role, project: '', status: form.status, contact: form.contact, tasks: 0, availability: 100 }
          setTeamMembers(prev => [...prev, newMember])
        }
      } else {
        if (editingId !== null) {
          await apiFetch(`/team/${editingId}`, {
            method: 'PUT',
            body: JSON.stringify({ name: form.name, role: form.role, status: form.status, contact: form.contact, tasks: form.tasks, availability: form.availability }),
          })
        } else {
          await apiFetch('/team', {
            method: 'POST',
            body: JSON.stringify({ name: form.name, role: form.role, status: form.status, contact: form.contact }),
          })
        }
        await loadData()
      }
      setShowModal(false)
    } catch (err) {
      console.error('Failed to save team member', err)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this team member?')) return
    try {
      if (isMockData) {
        setTeamMembers(prev => prev.filter(m => m.id !== id))
      } else {
        await apiFetch(`/team/${id}`, { method: 'DELETE' })
        await loadData()
      }
    } catch (err) {
      console.error('Failed to delete team member', err)
    }
  }

  const openTaskModal = (name: string) => {
    if (getWorkload(name) >= 100) {
      alert(`${name} is at full capacity (100% workload). Cannot assign more tasks.`)
      return
    }
    setTaskMember(name)
    setTaskForm({ title: '', description: '' })
    setShowTaskModal(true)
  }

  const handleTaskSave = async () => {
    if (!taskForm.title.trim()) return
    try {
      if (isMockData) {
        const newTask: Task = { id: Date.now(), title: taskForm.title, project: '', priority: 'Medium', status: 'To Do', dueDate: '', assignee: taskMember }
        setTasks(prev => [...prev, newTask])
      } else {
        await apiFetch('/tasks', {
          method: 'POST',
          body: JSON.stringify({ title: taskForm.title, assignee: taskMember, priority: 'Medium', status: 'To Do', dueDate: '' }),
        })
        await loadData()
      }
      setShowTaskModal(false)
    } catch (err) {
      console.error('Failed to assign task', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Team Management</h2>
          <p className="text-slate-500">Manage crew, assignments, and availability.</p>
        </div>
        <button onClick={openAddModal} className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
            <div className={cn('p-2.5 rounded-lg', card.color)}><card.icon className="w-5 h-5" /></div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
              <p className="text-sm text-slate-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970] w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={cn('text-xs font-medium px-3 py-1.5 rounded-lg transition-colors', roleFilter === r ? 'bg-[#191970] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <span className="text-sm text-slate-500"><strong className="text-slate-900">{filtered.length}</strong> members</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading team data...
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Current Project</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tasks</th>
                <th className="px-4 py-3">Workload</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((member) => (
                <tr key={member.id} className="text-sm hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedMember(member)} className="flex items-center gap-3 text-left w-full">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                        {member.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 hover:text-[#191970] transition-colors">{member.name}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1"><Mail className="w-3 h-3" /> {member.contact}</div>
                      </div>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{member.role}</td>
                  <td className="px-4 py-3 text-slate-600">{member.project}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', member.status === 'On Set' ? 'bg-blue-50 text-blue-700' : member.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : member.status === 'Editing' ? 'bg-purple-50 text-purple-700' : 'bg-amber-50 text-amber-700')}>{member.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {getTaskCount(member.name) > 0 ? (
                      <span className="text-slate-700">{getTaskCount(member.name)} tasks</span>
                    ) : (
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Available</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 bg-slate-100 rounded-full w-24 overflow-hidden">
                        <div
                          className={cn('h-full rounded-full transition-all', getWorkload(member.name) < 34 ? 'bg-emerald-500' : getWorkload(member.name) < 67 ? 'bg-amber-500' : 'bg-rose-500')}
                          style={{ width: `${getWorkload(member.name)}%` }}
                        />
                      </div>
                      <span className={cn('text-xs font-medium', getWorkload(member.name) < 34 ? 'text-emerald-600' : getWorkload(member.name) < 67 ? 'text-amber-600' : 'text-rose-600')}>{getWorkload(member.name)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEditModal(member)} className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm">Edit</button>
                      <button onClick={() => openTaskModal(member.name)} className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> Assign Task
                      </button>
                      <button onClick={() => handleDelete(member.id)} className="text-xs text-rose-500 hover:text-rose-700 px-2 py-1">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">{editingId ? 'Edit Team Member' : 'Add Team Member'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]" placeholder="Enter name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]">
                  <option value="">Select role</option>
                  {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact</label>
                <input type="text" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]" placeholder="Enter email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]">
                  <option value="Available">Available</option>
                  <option value="On Set">On Set</option>
                  <option value="Editing">Editing</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-[#191970] hover:bg-[#121258] rounded-lg transition-colors">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Assign Task to {taskMember}</h3>
              <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
                <input type="text" value={taskForm.title} onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]" placeholder="Enter task title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea value={taskForm.description} onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970] h-20" placeholder="Enter description" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowTaskModal(false)} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleTaskSave} className="px-4 py-2 text-sm font-medium text-white bg-[#191970] hover:bg-[#121258] rounded-lg transition-colors">Assign</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedMember(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Member Details</h3>
              <button onClick={() => setSelectedMember(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-12 h-12 rounded-full bg-[#191970] flex items-center justify-center text-sm font-bold text-white">
                  {selectedMember.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{selectedMember.name}</div>
                  <div className="text-sm text-slate-500">{selectedMember.contact}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">Role</div>
                  <div className="font-medium text-slate-900">{selectedMember.role || '—'}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">Status</div>
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-0.5', selectedMember.status === 'On Set' ? 'bg-blue-50 text-blue-700' : selectedMember.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : selectedMember.status === 'Editing' ? 'bg-purple-50 text-purple-700' : 'bg-amber-50 text-amber-700')}>{selectedMember.status}</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">Current Project</div>
                  <div className="font-medium text-slate-900">{selectedMember.project || '—'}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">Tasks</div>
                  <div className="font-medium text-slate-900">{getTaskCount(selectedMember.name)} tasks</div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-slate-500 mb-1">Workload</div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="h-2 bg-slate-200 rounded-full flex-1 overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', getWorkload(selectedMember.name) < 34 ? 'bg-emerald-500' : getWorkload(selectedMember.name) < 67 ? 'bg-amber-500' : 'bg-rose-500')}
                      style={{ width: `${getWorkload(selectedMember.name)}%` }}
                    />
                  </div>
                  <span className={cn('text-xs font-medium', getWorkload(selectedMember.name) < 34 ? 'text-emerald-600' : getWorkload(selectedMember.name) < 67 ? 'text-amber-600' : 'text-rose-600')}>{getWorkload(selectedMember.name)}%</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
              <button onClick={() => openTaskModal(selectedMember.name)} className="px-4 py-2 text-sm font-medium text-white bg-[#191970] hover:bg-[#121258] rounded-lg transition-colors flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Assign Task</button>
              <button onClick={() => { setSelectedMember(null); openEditModal(selectedMember) }} className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors">Edit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
