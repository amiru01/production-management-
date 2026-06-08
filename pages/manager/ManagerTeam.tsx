import React, { useState } from 'react'
import {
  Users,
  Search,
  Plus,
  Mail,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { cn } from '../../utils'

const roles = ['All Roles', 'Director', 'DP', 'Editor', 'Sound', 'Producer', 'Gaffer', 'PA']

const teamMembers = [
  { id: 1, name: 'Elena R.', role: 'Director', project: 'Nike Summer Campaign', status: 'On Set', tasks: 3, availability: 20, contact: 'elena@prod.com' },
  { id: 2, name: 'David K.', role: 'DP', project: 'Available', status: 'Available', tasks: 0, availability: 100, contact: 'david@prod.com' },
  { id: 3, name: 'Sarah J.', role: 'Editor', project: 'Local Coffee', status: 'Editing', tasks: 5, availability: 40, contact: 'sarah@prod.com' },
  { id: 4, name: 'Mike T.', role: 'Sound', project: 'Nike Summer Campaign', status: 'On Set', tasks: 2, availability: 60, contact: 'mike@prod.com' },
  { id: 5, name: 'Marcus C.', role: 'Producer', project: 'TechCorp Launch', status: 'On Leave', tasks: 0, availability: 0, contact: 'marcus@prod.com' },
  { id: 6, name: 'Anna P.', role: 'Gaffer', project: 'Spotify Spotlight', status: 'Available', tasks: 1, availability: 85, contact: 'anna@prod.com' },
  { id: 7, name: 'Tom S.', role: 'PA', project: 'Nike Summer Campaign', status: 'On Set', tasks: 6, availability: 15, contact: 'tom@prod.com' },
  { id: 8, name: 'Lisa M.', role: 'Editor', project: 'Adidas Winter Promo', status: 'Available', tasks: 2, availability: 70, contact: 'lisa@prod.com' },
]

const statCards = [
  { label: 'Total Team', value: '12', color: 'bg-blue-50 text-blue-600', icon: Users },
  { label: 'On Set', value: '4', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 },
  { label: 'Available', value: '3', color: 'bg-indigo-50 text-indigo-600', icon: Users },
  { label: 'On Leave', value: '1', color: 'bg-amber-50 text-amber-600', icon: AlertCircle },
]

export function ManagerTeam() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')

  const filtered = teamMembers.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'All Roles' || m.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Team Management</h2>
          <p className="text-slate-500">Manage crew, assignments, and availability.</p>
        </div>
        <button className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
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
                    <button className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm flex items-center gap-1.5 ml-auto">
                      <Plus className="w-3.5 h-3.5" /> Assign Task
                    </button>
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
