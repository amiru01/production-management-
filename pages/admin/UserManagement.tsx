import React, { useState } from 'react'
import { useStore } from '../../store/AppStore'
import {
  Search,
  Plus,
  MoreVertical,
  Shield,
  Briefcase,
  Video,
  Calculator,
  UserCircle,
  X,
  Edit2,
  Trash2,
} from 'lucide-react'
import { cn } from '../../utils'

const roleIcons: Record<string, any> = {
  'Super Admin': Shield,
  'Production Manager': Briefcase,
  'Production Team': Video,
  Accountant: Calculator,
  Client: UserCircle,
}

const roleColors: Record<string, string> = {
  'Super Admin': 'text-indigo-700 bg-indigo-50',
  'Production Manager': 'text-blue-700 bg-blue-50',
  'Production Team': 'text-emerald-700 bg-emerald-50',
  Accountant: 'text-amber-700 bg-amber-50',
  Client: 'text-rose-700 bg-rose-50',
}

export function UserManagement() {
  const { users, addUser, updateUser, deleteUser } = useStore()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', email: '', role: 'Production Team', status: 'Active' })

  const filtered = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'All Roles' || u.role === roleFilter
    const matchesStatus = statusFilter === 'All Statuses' || u.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const openAdd = () => {
    setEditingUser(null)
    setForm({ name: '', email: '', role: 'Production Team', status: 'Active' })
    setShowModal(true)
  }

  const openEdit = (user: any) => {
    setEditingUser(user)
    setForm({ name: user.name, email: user.email, role: user.role, status: user.status })
    setShowModal(true)
    setOpenMenuId(null)
  }

  const handleDelete = (id: number) => {
    setOpenMenuId(null)
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser(id)
    }
  }

  const handleSubmit = () => {
    if (editingUser) {
      updateUser(editingUser.id, form)
    } else {
      addUser({
        ...form,
        id: 0,
        lastActive: 'Just now',
        avatar: form.name.split(' ').map((s: string) => s[0]).join(''),
      } as any)
    }
    setShowModal(false)
    setEditingUser(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
          <p className="text-slate-500">Manage team members, clients, and their access levels.</p>
        </div>
        <button onClick={openAdd} className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Invite User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search users by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
          </div>
          <div className="flex gap-2">
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option>All Roles</option>
              <option>Super Admin</option>
              <option>Production Manager</option>
              <option>Production Team</option>
              <option>Accountant</option>
              <option>Client</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Offline</option>
              <option>Invited</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Last Active</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((user) => {
                const Icon = roleIcons[user.role]
                return (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600">{user.avatar}</div>
                        <div>
                          <div className="font-medium text-slate-900">{user.name}</div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium', roleColors[user.role])}>
                        <Icon className="w-3.5 h-3.5" />
                        {user.role}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-2 h-2 rounded-full', user.status === 'Active' ? 'bg-emerald-500' : user.status === 'Offline' ? 'bg-slate-300' : 'bg-amber-500')} />
                        <span className="text-sm text-slate-600">{user.status}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-500">{user.lastActive}</td>
                    <td className="p-4 text-right relative">
                      <button onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {openMenuId === user.id && (
                        <div className="absolute right-4 top-12 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10 min-w-[120px]">
                          <button onClick={() => openEdit(user)} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button onClick={() => handleDelete(user.id)} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-rose-600 hover:bg-rose-50">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
          <span>Showing {filtered.length} of {users.length} users</span>
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
              <h3 className="text-lg font-semibold text-slate-900">{editingUser ? 'Edit User' : 'Invite User'}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                  <option>Super Admin</option>
                  <option>Production Manager</option>
                  <option>Production Team</option>
                  <option>Accountant</option>
                  <option>Client</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                  <option>Active</option>
                  <option>Offline</option>
                  <option>Invited</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={handleSubmit} className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg text-sm font-medium">{editingUser ? 'Update' : 'Invite'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
