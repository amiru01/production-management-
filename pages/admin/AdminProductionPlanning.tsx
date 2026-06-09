import React, { useState } from 'react'
import { useStore } from '../../store/AppStore'
import {
  FileText,
  Image,
  List,
  FileCheck,
  Search,
  Clock,
  User,
  FolderOpen,
  Plus,
  MoreVertical,
  X,
  Edit2,
  Trash2,
} from 'lucide-react'
import { cn } from '../../utils'

const tabs = ['Scripts', 'Storyboards', 'Shot Lists', 'Permits'] as const
type TabType = typeof tabs[number]

const tabIcons: Record<TabType, any> = { Scripts: FileText, Storyboards: Image, 'Shot Lists': List, Permits: FileCheck }

const statusStyles: Record<string, string> = {
  Approved: 'bg-emerald-50 text-emerald-700',
  Complete: 'bg-emerald-50 text-emerald-700',
  Draft: 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-blue-50 text-blue-700',
  'In Review': 'bg-amber-50 text-amber-700',
  Pending: 'bg-amber-50 text-amber-700',
}

const tabToStoreMap: Record<TabType, string> = {
  Scripts: 'scripts',
  Storyboards: 'storyboards',
  'Shot Lists': 'shotLists',
  Permits: 'permits',
}

const tabAddFnMap: Record<TabType, string> = {
  Scripts: 'addScript',
  Storyboards: 'addStoryboard',
  'Shot Lists': 'addShotList',
  Permits: 'addPermit',
}

const tabUpdateFnMap: Record<TabType, string> = {
  Scripts: 'updateScript',
  Storyboards: 'updateStoryboard',
  'Shot Lists': 'updateShotList',
  Permits: 'updatePermit',
}

const tabDeleteFnMap: Record<TabType, string> = {
  Scripts: 'deleteScript',
  Storyboards: 'deleteStoryboard',
  'Shot Lists': 'deleteShotList',
  Permits: 'deletePermit',
}

const tabLabelMap: Record<TabType, string> = {
  Scripts: 'Script',
  Storyboards: 'Storyboard',
  'Shot Lists': 'Shot List',
  Permits: 'Permit',
}

export function AdminProductionPlanning() {
  const store = useStore()
  const [activeTab, setActiveTab] = useState<TabType>('Scripts')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [form, setForm] = useState({ title: '', project: '', status: 'Draft', assignee: '' })

  const currentData = store[tabToStoreMap[activeTab]] as any[]
  const addFn = store[tabAddFnMap[activeTab]] as any
  const updateFn = store[tabUpdateFnMap[activeTab]] as any
  const deleteFn = store[tabDeleteFnMap[activeTab]] as any

  const filtered = currentData.filter(d => d.title.toLowerCase().includes(search.toLowerCase()) || d.project.toLowerCase().includes(search.toLowerCase()))

  const totalScripts = store.scripts.length
  const approvedStoryboards = store.storyboards.filter((s: any) => s.status === 'Approved').length
  const pendingPermits = store.permits.filter((p: any) => p.status === 'Pending').length

  const openAdd = () => {
    setEditingItem(null)
    setForm({ title: '', project: '', status: 'Draft', assignee: '' })
    setShowModal(true)
  }

  const openEdit = (item: any) => {
    setEditingItem(item)
    setForm({ title: item.title, project: item.project, status: item.status, assignee: item.assignee })
    setShowModal(true)
    setOpenMenuId(null)
  }

  const handleDelete = (id: number) => {
    setOpenMenuId(null)
    if (confirm(`Are you sure you want to delete this ${tabLabelMap[activeTab].toLowerCase()}?`)) {
      deleteFn(id)
    }
  }

  const handleSubmit = () => {
    if (editingItem) {
      updateFn(editingItem.id, form)
    } else {
      addFn({ ...form, id: 0, lastUpdated: 'Just now' })
    }
    setShowModal(false)
    setEditingItem(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Production Planning</h2>
          <p className="text-slate-500">Manage scripts, storyboards, shot lists, and permits.</p>
        </div>
        <button onClick={openAdd} className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New {tabLabelMap[activeTab]}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg"><FileText className="w-5 h-5 text-indigo-600" /></div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Total Scripts</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalScripts}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg"><Image className="w-5 h-5 text-emerald-600" /></div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Approved Storyboards</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{approvedStoryboards}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 rounded-lg"><FileCheck className="w-5 h-5 text-amber-600" /></div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Pending Permits</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{pendingPermits}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tabIcons[tab]
              return (
                <button key={tab} onClick={() => { setActiveTab(tab); setSearch(''); setOpenMenuId(null) }} className={cn('flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors', activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300')}>
                  <Icon className="w-4 h-4" />
                  {tab}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-4 border-b border-slate-200">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder={`Search ${activeTab.toLowerCase()}...`} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Project</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Assignee</th>
                <th className="p-4 font-medium">Last Updated</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-medium text-slate-900">{item.title}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                      {item.project}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', statusStyles[item.status] || 'bg-slate-100 text-slate-700')}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {item.assignee}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {item.lastUpdated}
                    </div>
                  </td>
                  <td className="p-4 text-right relative">
                    <button onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {openMenuId === item.id && (
                      <div className="absolute right-4 top-12 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10 min-w-[120px]">
                        <button onClick={() => openEdit(item)} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-rose-600 hover:bg-rose-50">
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
          <span>Showing {filtered.length} of {currentData.length} {activeTab.toLowerCase()}</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50">Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">{editingItem ? `Edit ${tabLabelMap[activeTab]}` : `New ${tabLabelMap[activeTab]}`}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project</label>
                <input type="text" value={form.project} onChange={e => setForm({...form, project: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                  <option>Draft</option>
                  <option>In Progress</option>
                  <option>In Review</option>
                  <option>Approved</option>
                  <option>Pending</option>
                  <option>Complete</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assignee</label>
                <input type="text" value={form.assignee} onChange={e => setForm({...form, assignee: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={handleSubmit} className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg text-sm font-medium">{editingItem ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
