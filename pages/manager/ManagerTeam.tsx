import React, { useState } from 'react'
import {
  Users,
  Search,
  Plus,
  Mail,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react'
import { cn } from '../../utils'
import { useStore } from '../../store/AppStore'

const roles = ['All Roles', 'Director', 'DP', 'Editor', 'Sound', 'Producer', 'Gaffer', 'PA']

export function ManagerTeam() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [showModal, setShowModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [taskMember, setTaskMember] = useState('')
  const [form, setForm] = useState({ name: '', role: '', project: '', status: 'Available', contact: '', tasks: 0, availability: 100 })
  const [taskForm, setTaskForm] = useState({ title: '', description: '' })
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useStore()

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
    setForm({ name: '', role: '', project: '', status: 'Available', contact: '', tasks: 0, availability: 100 })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    addTeamMember({ id: 0, name: form.name, role: form.role, project: form.project, status: form.status, contact: form.contact, tasks: form.tasks, availability: form.availability })
    setShowModal(false)
  }

  const handleDelete = (id: number) => {
    if (confirm('Delete this team member?')) deleteTeamMember(id)
  }

  const openTaskModal = (name: string) => {
    setTaskMember(name)
    setTaskForm({ title: '', description: '' })
    setShowTaskModal(true)
  }

  const handleTaskSave = () => {
    if (!taskForm.title.trim()) return
    alert(`Task "${taskForm.title}" assigned to ${taskMember}`)
    setShowTaskModal(false)
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
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                        {member.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{member.name}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1"><Mail className="w-3 h-3" /> {member.contact}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{member.role}</td>
                  <td className="px-4 py-3 text-slate-600">{member.project}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', member.status === 'On Set' ? 'bg-blue-50 text-blue-700' : member.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : member.status === 'Editing' ? 'bg-purple-50 text-purple-700' : 'bg-amber-50 text-amber-700')}>{member.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-700">{member.tasks} tasks</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 bg-slate-100 rounded-full w-24 overflow-hidden">
                        <div
                          className={cn('h-full rounded-full transition-all', member.availability > 66 ? 'bg-emerald-500' : member.availability > 33 ? 'bg-amber-500' : 'bg-rose-500')}
                          style={{ width: `${member.availability}%` }}
                        />
                      </div>
                      <span className={cn('text-xs font-medium', member.availability > 66 ? 'text-emerald-600' : member.availability > 33 ? 'text-amber-600' : 'text-rose-600')}>{member.availability}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
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
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Add Team Member</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]" placeholder="Enter name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <input type="text" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]" placeholder="Enter role" />
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
    </div>
  )
}
