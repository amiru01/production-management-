import React from 'react'
import {
  Search,
  Plus,
  MoreVertical,
  Shield,
  Briefcase,
  Video,
  Calculator,
  UserCircle,
} from 'lucide-react'
import { cn } from '../../utils'

const users = [
  { id: 1, name: 'Sarah Jenkins', email: 'sarah@lumen.studio', role: 'Super Admin', status: 'Active', lastActive: '2 mins ago', avatar: 'SJ' },
  { id: 2, name: 'Marcus Chen', email: 'marcus@lumen.studio', role: 'Production Manager', status: 'Active', lastActive: '1 hour ago', avatar: 'MC' },
  { id: 3, name: 'Elena Rodriguez', email: 'elena@lumen.studio', role: 'Production Team', status: 'Active', lastActive: '3 hours ago', avatar: 'ER' },
  { id: 4, name: 'David Kim', email: 'david@lumen.studio', role: 'Production Team', status: 'Offline', lastActive: '1 day ago', avatar: 'DK' },
  { id: 5, name: 'Amanda Foster', email: 'amanda@lumen.studio', role: 'Accountant', status: 'Active', lastActive: '5 mins ago', avatar: 'AF' },
  { id: 6, name: 'James Wilson', email: 'j.wilson@nike.com', role: 'Client', status: 'Invited', lastActive: 'Never', avatar: 'JW' },
]

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
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
          <p className="text-slate-500">Manage team members, clients, and their access levels.</p>
        </div>
        <button className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Invite User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search users by name or email..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
          </div>
          <div className="flex gap-2">
            <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option>All Roles</option>
              <option>Super Admin</option>
              <option>Production Manager</option>
              <option>Production Team</option>
              <option>Accountant</option>
              <option>Client</option>
            </select>
            <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
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
              {users.map((user) => {
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
                    <td className="p-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
          <span>Showing 1 to 6 of 6 users</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
