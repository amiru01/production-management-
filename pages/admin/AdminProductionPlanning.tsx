import React, { useState } from 'react'
import {
  FileText,
  Image,
  List,
  FileCheck,
  Search,
  Clock,
  User,
  FolderOpen,
} from 'lucide-react'
import { cn } from '../../utils'

const tabs = ['Scripts', 'Storyboards', 'Shot Lists', 'Permits'] as const
type TabType = typeof tabs[number]

const scripts = [
  { id: 1, title: 'Nike Summer Campaign Script', project: 'Summer Campaign', status: 'Approved', assignee: 'Marcus Chen', lastUpdated: '2 hours ago' },
  { id: 2, title: 'TechCorp Product Launch', project: 'Product Launch', status: 'Draft', assignee: 'Elena Rodriguez', lastUpdated: '1 day ago' },
  { id: 3, title: 'Local Coffee Brand Story v3', project: 'Brand Story', status: 'Approved', assignee: 'David Kim', lastUpdated: '3 days ago' },
  { id: 4, title: 'Artist Spotlight Interview Script', project: 'Artist Spotlight', status: 'In Review', assignee: 'Amanda Foster', lastUpdated: '5 hours ago' },
]

const storyboards = [
  { id: 1, title: 'Summer Campaign Storyboard', project: 'Summer Campaign', status: 'Approved', assignee: 'David Kim', lastUpdated: '1 day ago' },
  { id: 2, title: 'Product Launch Animatic', project: 'Product Launch', status: 'In Progress', assignee: 'Elena Rodriguez', lastUpdated: '4 hours ago' },
  { id: 3, title: 'Brand Story Moodboard', project: 'Brand Story', status: 'Approved', assignee: 'Marcus Chen', lastUpdated: '1 week ago' },
  { id: 4, title: 'Keynote Event Storyboard', project: 'Keynote Event', status: 'Pending', assignee: 'Lisa Park', lastUpdated: '2 days ago' },
]

const shotLists = [
  { id: 1, title: 'Nike Location Shot List', project: 'Summer Campaign', status: 'Complete', assignee: 'Marcus Chen', lastUpdated: '3 days ago' },
  { id: 2, title: 'TechCorp Studio Setup', project: 'Product Launch', status: 'In Progress', assignee: 'James Wilson', lastUpdated: '1 hour ago' },
  { id: 3, title: 'Coffee Shop B-Roll List', project: 'Brand Story', status: 'Complete', assignee: 'Elena Rodriguez', lastUpdated: '5 days ago' },
  { id: 4, title: 'Netflix Series Shot Plan', project: 'Series Launch', status: 'Draft', assignee: 'Amanda Foster', lastUpdated: '1 day ago' },
]

const permits = [
  { id: 1, title: 'Downtown Filming Permit', project: 'Summer Campaign', status: 'Approved', assignee: 'David Kim', lastUpdated: '2 days ago' },
  { id: 2, title: 'Park Location Permit', project: 'Brand Story', status: 'Pending', assignee: 'Marcus Chen', lastUpdated: '1 week ago' },
  { id: 3, title: 'Aerial Drone Authorization', project: 'Artist Spotlight', status: 'Pending', assignee: 'Amanda Foster', lastUpdated: '4 days ago' },
  { id: 4, title: 'Studio Soundstage Permit', project: 'Holiday Campaign', status: 'Approved', assignee: 'Elena Rodriguez', lastUpdated: '1 day ago' },
]

const tabData: Record<TabType, typeof scripts> = { Scripts: scripts, Storyboards: storyboards, 'Shot Lists': shotLists, Permits: permits }

const tabIcons: Record<TabType, any> = { Scripts: FileText, Storyboards: Image, 'Shot Lists': List, Permits: FileCheck }

const statusStyles: Record<string, string> = {
  Approved: 'bg-emerald-50 text-emerald-700',
  Complete: 'bg-emerald-50 text-emerald-700',
  Draft: 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-blue-50 text-blue-700',
  'In Review': 'bg-amber-50 text-amber-700',
  Pending: 'bg-amber-50 text-amber-700',
}

export function AdminProductionPlanning() {
  const [activeTab, setActiveTab] = useState<TabType>('Scripts')
  const [search, setSearch] = useState('')

  const currentData = tabData[activeTab]
  const filtered = currentData.filter(d => d.title.toLowerCase().includes(search.toLowerCase()) || d.project.toLowerCase().includes(search.toLowerCase()))

  const totalScripts = scripts.length
  const approvedStoryboards = storyboards.filter(s => s.status === 'Approved').length
  const pendingPermits = permits.filter(p => p.status === 'Pending').length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Production Planning</h2>
        <p className="text-slate-500">Manage scripts, storyboards, shot lists, and permits.</p>
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
                <button key={tab} onClick={() => { setActiveTab(tab); setSearch('') }} className={cn('flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors', activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300')}>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
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
    </div>
  )
}
