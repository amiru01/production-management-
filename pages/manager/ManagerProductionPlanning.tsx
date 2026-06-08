import React, { useState } from 'react'
import {
  FileText,
  Image,
  List,
  MapPin,
  Users,
  FileBadge,
  Search,
  AlertCircle,
  Eye,
  Download,
} from 'lucide-react'
import { cn } from '../../utils'

const tabs = [
  { id: 'scripts', label: 'Scripts', icon: FileText },
  { id: 'storyboards', label: 'Storyboards', icon: Image },
  { id: 'shotlists', label: 'Shot Lists', icon: List },
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'talent', label: 'Talent', icon: Users },
  { id: 'permits', label: 'Permits', icon: FileBadge },
]

const scripts = [
  { id: 1, title: 'Nike Summer Campaign V3', project: 'Nike Summer Campaign', writer: 'Elena R.', status: 'Approved', updated: '2 hours ago' },
  { id: 2, title: 'TechCorp Launch Script', project: 'TechCorp Launch', writer: 'Marcus C.', status: 'Draft', updated: '1 day ago' },
  { id: 3, title: 'Spotify Documentary Draft', project: 'Spotify Spotlight', writer: 'Sarah J.', status: 'Draft', updated: '3 days ago' },
  { id: 4, title: 'Local Coffee Brand Story', project: 'Local Coffee', writer: 'Elena R.', status: 'Approved', updated: '5 days ago' },
  { id: 5, title: 'Adidas Winter Promo V2', project: 'Adidas Winter Promo', writer: 'David K.', status: 'Draft', updated: '1 week ago' },
]

const storyboards = [
  { id: 1, title: 'Nike Summer - Scene 1-5', project: 'Nike Summer Campaign', scenes: 12, status: 'Complete' },
  { id: 2, title: 'TechCorp Launch Storyboard', project: 'TechCorp Launch', scenes: 8, status: 'In Progress' },
  { id: 3, title: 'Spotify Opening Sequence', project: 'Spotify Spotlight', scenes: 6, status: 'Pending' },
  { id: 4, title: 'Local Coffee Montage', project: 'Local Coffee', scenes: 4, status: 'Complete' },
]

const shotLists = [
  { id: 1, project: 'Nike Summer Campaign', scenes: '1-15', setups: 45, status: 'Finalized' },
  { id: 2, project: 'TechCorp Launch', scenes: '1-8', setups: 22, status: 'In Progress' },
  { id: 3, project: 'Spotify Spotlight', scenes: '1-6', setups: 18, status: 'Draft' },
  { id: 4, project: 'Local Coffee', scenes: '1-4', setups: 10, status: 'Finalized' },
]

const locations = [
  { id: 1, name: 'Downtown Studio A', address: '123 Main St, LA', contact: 'Jenny (555-0101)', status: 'Booked', project: 'Nike Summer' },
  { id: 2, name: 'Riverside Park', address: '456 River Rd, LA', contact: 'Mike (555-0102)', status: 'Pending', project: 'TechCorp Launch' },
  { id: 3, name: 'Sunset Warehouse', address: '789 Sunset Blvd, LA', contact: 'Anna (555-0103)', status: 'Booked', project: 'Spotify Spotlight' },
  { id: 4, name: 'Coffee Shop Interior', address: '321 Oak St, LA', contact: 'Tom (555-0104)', status: 'Available', project: '-' },
]

const talent = [
  { id: 1, name: 'Alex Johnson', role: 'Lead Actor', project: 'Nike Summer', contact: 'alex@email.com', status: 'Confirmed' },
  { id: 2, name: 'Maria Garcia', role: 'Voice Over', project: 'TechCorp Launch', contact: 'maria@email.com', status: 'Pending' },
  { id: 3, name: 'James Wilson', role: 'Narrator', project: 'Spotify Spotlight', contact: 'james@email.com', status: 'Confirmed' },
  { id: 4, name: 'Sophie Chen', role: 'Extra', project: 'Nike Summer', contact: 'sophie@email.com', status: 'On Hold' },
]

const permits = [
  { id: 1, type: 'Filming Permit', location: 'Downtown Studio A', status: 'Approved', expiry: '2026-07-15' },
  { id: 2, type: 'Park Filming', location: 'Riverside Park', status: 'Pending', expiry: '2026-06-30' },
  { id: 3, type: 'Drone License', location: 'Sunset Warehouse', status: 'Approved', expiry: '2026-08-01' },
  { id: 4, type: 'Street Closure', location: 'Main Street', status: 'Expired', expiry: '2026-05-01' },
]

export function ManagerProductionPlanning() {
  const [activeTab, setActiveTab] = useState('scripts')

  const renderTable = () => {
    switch (activeTab) {
      case 'scripts':
        return (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="pb-3 pr-4">Title</th>
                <th className="pb-3 pr-4">Project</th>
                <th className="pb-3 pr-4">Writer</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Updated</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scripts.map((s) => (
                <tr key={s.id} className="text-sm hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-4 font-medium text-slate-900">{s.title}</td>
                  <td className="py-3 pr-4 text-slate-600">{s.project}</td>
                  <td className="py-3 pr-4 text-slate-600">{s.writer}</td>
                  <td className="py-3 pr-4">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', s.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>{s.status}</span>
                  </td>
                  <td className="py-3 pr-4 text-slate-500">{s.updated}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Download className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      case 'storyboards':
        return (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="pb-3 pr-4">Preview</th>
                <th className="pb-3 pr-4">Title</th>
                <th className="pb-3 pr-4">Project</th>
                <th className="pb-3 pr-4">Scenes</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {storyboards.map((s) => (
                <tr key={s.id} className="text-sm hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="w-16 h-10 bg-slate-200 rounded-md flex items-center justify-center text-slate-400"><Image className="w-5 h-5" /></div>
                  </td>
                  <td className="py-3 pr-4 font-medium text-slate-900">{s.title}</td>
                  <td className="py-3 pr-4 text-slate-600">{s.project}</td>
                  <td className="py-3 pr-4 text-slate-600">{s.scenes} scenes</td>
                  <td className="py-3 pr-4">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', s.status === 'Complete' ? 'bg-emerald-50 text-emerald-700' : s.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600')}>{s.status}</span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Eye className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      case 'shotlists':
        return (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="pb-3 pr-4">Project</th>
                <th className="pb-3 pr-4">Scenes</th>
                <th className="pb-3 pr-4">Setups</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shotLists.map((s) => (
                <tr key={s.id} className="text-sm hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-4 font-medium text-slate-900">{s.project}</td>
                  <td className="py-3 pr-4 text-slate-600">Scenes {s.scenes}</td>
                  <td className="py-3 pr-4 text-slate-600">{s.setups} setups</td>
                  <td className="py-3 pr-4">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', s.status === 'Finalized' ? 'bg-emerald-50 text-emerald-700' : s.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700')}>{s.status}</span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Eye className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      case 'locations':
        return (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Address</th>
                <th className="pb-3 pr-4">Contact</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Project</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {locations.map((l) => (
                <tr key={l.id} className="text-sm hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-4 font-medium text-slate-900">{l.name}</td>
                  <td className="py-3 pr-4 text-slate-600">{l.address}</td>
                  <td className="py-3 pr-4 text-slate-600">{l.contact}</td>
                  <td className="py-3 pr-4">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', l.status === 'Booked' ? 'bg-blue-50 text-blue-700' : l.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700')}>{l.status}</span>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{l.project}</td>
                  <td className="py-3 text-right">
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Eye className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      case 'talent':
        return (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Role</th>
                <th className="pb-3 pr-4">Project</th>
                <th className="pb-3 pr-4">Contact</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {talent.map((t) => (
                <tr key={t.id} className="text-sm hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-4 font-medium text-slate-900">{t.name}</td>
                  <td className="py-3 pr-4 text-slate-600">{t.role}</td>
                  <td className="py-3 pr-4 text-slate-600">{t.project}</td>
                  <td className="py-3 pr-4 text-slate-600">{t.contact}</td>
                  <td className="py-3 pr-4">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', t.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' : t.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700')}>{t.status}</span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Eye className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      case 'permits':
        return (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3 pr-4">Location</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Expiry Date</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permits.map((p) => (
                <tr key={p.id} className="text-sm hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-4 font-medium text-slate-900">{p.type}</td>
                  <td className="py-3 pr-4 text-slate-600">{p.location}</td>
                  <td className="py-3 pr-4">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', p.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : p.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700')}>{p.status}</span>
                  </td>
                  <td className={cn('py-3 pr-4', new Date(p.expiry) < new Date() ? 'text-rose-600 font-medium' : 'text-slate-600')}>{p.expiry}</td>
                  <td className="py-3 text-right">
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Download className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Production Planning</h2>
          <p className="text-slate-500">Manage scripts, storyboards, locations, and more.</p>
        </div>
        <button className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
          <FileText className="w-4 h-4" /> New Script
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><FileText className="w-5 h-5" /></div>
          <div>
            <p className="text-2xl font-bold text-slate-900">8</p>
            <p className="text-sm text-slate-500">Active Scripts</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg"><AlertCircle className="w-5 h-5" /></div>
          <div>
            <p className="text-2xl font-bold text-slate-900">3</p>
            <p className="text-sm text-slate-500">Pending Permits</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><MapPin className="w-5 h-5" /></div>
          <div>
            <p className="text-2xl font-bold text-slate-900">6</p>
            <p className="text-sm text-slate-500">Locations Booked</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 relative',
                  activeTab === tab.id
                    ? 'text-[#191970] border-[#191970]'
                    : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970] w-64" />
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span><strong className="text-slate-900">{scripts.length}</strong> items</span>
            </div>
          </div>
          <div className="overflow-x-auto">{renderTable()}</div>
        </div>
      </div>
    </div>
  )
}
