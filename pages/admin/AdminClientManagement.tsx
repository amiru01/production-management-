import React, { useState } from 'react'
import { useStore } from '../../store/AppStore'
import {
  Search,
  Plus,
  MoreVertical,
  Building2,
  Users,
  AlertTriangle,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  X,
  Edit2,
  Trash2,
} from 'lucide-react'
import { cn } from '../../utils'

const statusColors: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700',
  'At Risk': 'bg-amber-50 text-amber-700',
  Inactive: 'bg-slate-100 text-slate-600',
}

export function AdminClientManagement() {
  const { clients, addClient, updateClient, deleteClient } = useStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState<any>(null)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', status: 'Active' })

  const filtered = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All Statuses' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalClients = clients.length
  const activeClients = clients.filter(c => c.status === 'Active').length
  const atRisk = clients.filter(c => c.status === 'At Risk').length
  const newThisMonth = clients.filter(c => c.status === 'Active').length

  const openAdd = () => {
    setEditingClient(null)
    setForm({ name: '', company: '', email: '', phone: '', status: 'Active' })
    setShowModal(true)
  }

  const openEdit = (client: any) => {
    setEditingClient(client)
    setForm({ name: client.name, company: client.company, email: client.email, phone: client.phone, status: client.status })
    setShowModal(true)
    setOpenMenuId(null)
  }

  const handleDelete = (id: number) => {
    setOpenMenuId(null)
    if (confirm('Are you sure you want to delete this client?')) {
      deleteClient(id)
    }
  }

  const handleSubmit = () => {
    if (editingClient) {
      updateClient(editingClient.id, form)
    } else {
      addClient({
        ...form,
        id: 0,
        projects: 0,
        lastActivity: 'Just now',
        avatar: form.name.split(' ').map((s: string) => s[0]).join(''),
      } as any)
    }
    setShowModal(false)
    setEditingClient(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Client Management</h2>
          <p className="text-slate-500">Manage all client accounts and their production activity.</p>
        </div>
        <button onClick={openAdd} className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg"><Users className="w-5 h-5 text-indigo-600" /></div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Total Clients</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalClients}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg"><Building2 className="w-5 h-5 text-emerald-600" /></div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Active</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{activeClients}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 rounded-lg"><AlertTriangle className="w-5 h-5 text-amber-600" /></div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">At Risk</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{atRisk}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg"><UserPlus className="w-5 h-5 text-blue-600" /></div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">New This Month</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{newThisMonth}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search clients by name, company or email..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option>All Statuses</option>
              <option>Active</option>
              <option>At Risk</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Client</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Projects</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Last Activity</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600">{client.avatar}</div>
                      <div>
                        <div className="font-medium text-slate-900">{client.name}</div>
                        <div className="text-sm text-slate-500">{client.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {client.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {client.phone}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-slate-900">{client.projects}</span>
                  </td>
                  <td className="p-4">
                    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', statusColors[client.status])}>
                      {client.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center text-sm text-slate-500">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                      {client.lastActivity}
                    </div>
                  </td>
                  <td className="p-4 text-right relative">
                    <button onClick={() => setOpenMenuId(openMenuId === client.id ? null : client.id)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {openMenuId === client.id && (
                      <div className="absolute right-4 top-12 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10 min-w-[120px]">
                        <button onClick={() => openEdit(client)} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => handleDelete(client.id)} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-rose-600 hover:bg-rose-50">
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
          <span>Showing {filtered.length} of {clients.length} clients</span>
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
              <h3 className="text-lg font-semibold text-slate-900">{editingClient ? 'Edit Client' : 'Add Client'}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                  <option>Active</option>
                  <option>At Risk</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={handleSubmit} className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg text-sm font-medium">{editingClient ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
