import React, { useState } from 'react'
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
} from 'lucide-react'
import { cn } from '../../utils'

const clients = [
  { id: 1, name: 'Sarah Jenkins', company: 'Nike', email: 'sarah@nike.com', phone: '+1 (555) 123-4567', projects: 5, status: 'Active', lastActivity: '2 hours ago', avatar: 'SJ' },
  { id: 2, name: 'Marcus Chen', company: 'TechCorp', email: 'marcus@techcorp.io', phone: '+1 (555) 234-5678', projects: 3, status: 'Active', lastActivity: '1 day ago', avatar: 'MC' },
  { id: 3, name: 'Elena Rodriguez', company: 'Local Coffee', email: 'elena@localcoffee.com', phone: '+1 (555) 345-6789', projects: 1, status: 'At Risk', lastActivity: '2 weeks ago', avatar: 'ER' },
  { id: 4, name: 'David Kim', company: 'Spotify', email: 'david@spotify.com', phone: '+1 (555) 456-7890', projects: 7, status: 'Active', lastActivity: '30 mins ago', avatar: 'DK' },
  { id: 5, name: 'Amanda Foster', company: 'Puma', email: 'amanda@puma.com', phone: '+1 (555) 567-8901', projects: 2, status: 'Active', lastActivity: '4 hours ago', avatar: 'AF' },
  { id: 6, name: 'James Wilson', company: 'Adidas', email: 'jwilson@adidas.com', phone: '+1 (555) 678-9012', projects: 0, status: 'Inactive', lastActivity: '3 months ago', avatar: 'JW' },
  { id: 7, name: 'Lisa Park', company: 'Apple', email: 'l.park@apple.com', phone: '+1 (555) 789-0123', projects: 4, status: 'Active', lastActivity: '1 hour ago', avatar: 'LP' },
  { id: 8, name: 'Tom Rivera', company: 'Netflix', email: 'tom@netflix.com', phone: '+1 (555) 890-1234', projects: 2, status: 'At Risk', lastActivity: '1 week ago', avatar: 'TR' },
]

const statusColors: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700',
  'At Risk': 'bg-amber-50 text-amber-700',
  Inactive: 'bg-slate-100 text-slate-600',
}

export function AdminClientManagement() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')

  const filtered = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All Statuses' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalClients = clients.length
  const activeClients = clients.filter(c => c.status === 'Active').length
  const atRisk = clients.filter(c => c.status === 'At Risk').length
  const newThisMonth = 3

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Client Management</h2>
          <p className="text-slate-500">Manage all client accounts and their production activity.</p>
        </div>
        <button className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
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
          <span>Showing {filtered.length} of {clients.length} clients</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
