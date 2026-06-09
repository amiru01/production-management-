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
  Plus,
  X,
} from 'lucide-react'
import { cn } from '../../utils'
import { useStore } from '../../store/AppStore'

const tabs = [
  { id: 'scripts', label: 'Scripts', icon: FileText },
  { id: 'storyboards', label: 'Storyboards', icon: Image },
  { id: 'shotlists', label: 'Shot Lists', icon: List },
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'talent', label: 'Talent', icon: Users },
  { id: 'permits', label: 'Permits', icon: FileBadge },
]

const tabAddLabel: Record<string, string> = {
  scripts: 'New Script',
  storyboards: 'New Storyboard',
  shotlists: 'New Shot List',
  locations: 'New Location',
  talent: 'New Talent',
  permits: 'New Permit',
}

const tabAddIcon: Record<string, React.ElementType> = {
  scripts: FileText,
  storyboards: Image,
  shotlists: List,
  locations: MapPin,
  talent: Users,
  permits: FileBadge,
}

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

export function ManagerProductionPlanning() {
  const [activeTab, setActiveTab] = useState('scripts')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', project: '', status: 'Draft', assignee: '' })
  const { scripts, addScript, updateScript, deleteScript, storyboards, addStoryboard, updateStoryboard, deleteStoryboard, shotLists, addShotList, updateShotList, deleteShotList, permits, addPermit, updatePermit, deletePermit } = useStore()

  const handleDelete = (id: number, type: string) => {
    if (!confirm(`Delete this ${type}?`)) return
    const actions: Record<string, (id: number) => void> = {
      scripts: deleteScript, storyboards: deleteStoryboard, shotlists: deleteShotList, permits: deletePermit,
    }
    actions[type]?.(id)
  }

  const openAddModal = () => {
    setForm({ title: '', project: '', status: 'Draft', assignee: '' })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.title.trim()) return
    const addActions: Record<string, (item: any) => void> = {
      scripts: addScript, storyboards: addStoryboard, shotlists: addShotList, permits: addPermit,
    }
    addActions[activeTab]?.({
      id: 0, title: form.title, project: form.project, status: form.status,
      assignee: form.assignee, lastUpdated: 'Just now',
    })
    setShowModal(false)
  }

  const currentData: Record<string, any[]> = { scripts, storyboards, shotlists: shotLists, permits }
  const items = activeTab === 'locations' ? locations : activeTab === 'talent' ? talent : currentData[activeTab] || []
  const AddIcon = tabAddIcon[activeTab]

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
                  <td className="py-3 pr-4 text-slate-600">{s.assignee}</td>
                  <td className="py-3 pr-4">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', s.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>{s.status}</span>
                  </td>
                  <td className="py-3 pr-4 text-slate-500">{s.lastUpdated}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => alert(`Viewing: ${s.title}`)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => alert(`Downloading: ${s.title}`)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Download className="w-4 h-4" /></button>
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
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Assignee</th>
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
                  <td className="py-3 pr-4">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', s.status === 'Complete' || s.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : s.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600')}>{s.status}</span>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{s.assignee}</td>
                  <td className="py-3 text-right">
                    <button onClick={() => alert(`Viewing: ${s.title}`)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Eye className="w-4 h-4" /></button>
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
                <th className="pb-3 pr-4">Title</th>
                <th className="pb-3 pr-4">Project</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Assignee</th>
                <th className="pb-3 pr-4">Updated</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shotLists.map((s) => (
                <tr key={s.id} className="text-sm hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-4 font-medium text-slate-900">{s.title}</td>
                  <td className="py-3 pr-4 text-slate-600">{s.project}</td>
                  <td className="py-3 pr-4">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', s.status === 'Finalized' || s.status === 'Complete' ? 'bg-emerald-50 text-emerald-700' : s.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700')}>{s.status}</span>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{s.assignee}</td>
                  <td className="py-3 pr-4 text-slate-500">{s.lastUpdated}</td>
                  <td className="py-3 text-right">
                    <button onClick={() => alert(`Viewing: ${s.title}`)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Eye className="w-4 h-4" /></button>
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
                  <td className="py-3 pr-4 font-medium text-slate-900">{p.title}</td>
                  <td className="py-3 pr-4 text-slate-600">{p.project}</td>
                  <td className="py-3 pr-4">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', p.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : p.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700')}>{p.status}</span>
                  </td>
                  <td className={cn('py-3 pr-4 text-slate-600')}>{p.lastUpdated}</td>
                  <td className="py-3 text-right">
                    <button onClick={() => alert(`Downloading: ${p.title}`)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Download className="w-4 h-4" /></button>
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

  const getItemCount = () => {
    if (activeTab === 'locations') return locations.length
    if (activeTab === 'talent') return talent.length
    return currentData[activeTab]?.length || 0
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Production Planning</h2>
          <p className="text-slate-500">Manage scripts, storyboards, locations, and more.</p>
        </div>
        {'scripts storyboards shotlists permits'.split(' ').includes(activeTab) && (
          <button onClick={openAddModal} className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            <AddIcon className="w-4 h-4" /> {tabAddLabel[activeTab]}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><FileText className="w-5 h-5" /></div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{scripts.length}</p>
            <p className="text-sm text-slate-500">Active Scripts</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg"><AlertCircle className="w-5 h-5" /></div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{permits.filter(p => p.status === 'Pending').length}</p>
            <p className="text-sm text-slate-500">Pending Permits</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><MapPin className="w-5 h-5" /></div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{locations.filter(l => l.status === 'Booked').length}</p>
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
              <span><strong className="text-slate-900">{getItemCount()}</strong> items</span>
            </div>
          </div>
          <div className="overflow-x-auto">{renderTable()}</div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">{tabAddLabel[activeTab]}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]" placeholder="Enter title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project</label>
                <input type="text" value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]" placeholder="Enter project" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]">
                  <option value="Draft">Draft</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Approved">Approved</option>
                  <option value="Complete">Complete</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assignee</label>
                <input type="text" value={form.assignee} onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]" placeholder="Enter assignee" />
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
