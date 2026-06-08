import React, { useState } from 'react'
import {
  Search,
  Plus,
  MoreVertical,
  Camera,
  Wrench,
  CheckCircle2,
  MapPin,
  User,
  Calendar,
} from 'lucide-react'
import { cn } from '../../utils'

const equipment = [
  { id: 1, name: 'Sony FX6 Cinema Camera', category: 'Camera', status: 'In Use', assignedTo: 'Marcus Chen', location: 'Studio A', returnDate: 'Oct 20, 2026' },
  { id: 2, name: 'Canon C300 Mark III', category: 'Camera', status: 'Available', assignedTo: '-', location: 'Equipment Room', returnDate: '-' },
  { id: 3, name: 'ARRI Skypanel S60-C', category: 'Lighting', status: 'In Use', assignedTo: 'Elena Rodriguez', location: 'Stage 2', returnDate: 'Oct 18, 2026' },
  { id: 4, name: 'Sennheiser MKH 416', category: 'Audio', status: 'Available', assignedTo: '-', location: 'Equipment Room', returnDate: '-' },
  { id: 5, name: 'DJI Ronin 4D', category: 'Camera', status: 'Maintenance', assignedTo: '-', location: 'Repair Shop', returnDate: 'Oct 25, 2026' },
  { id: 6, name: 'Aputure 600d Pro', category: 'Lighting', status: 'Available', assignedTo: '-', location: 'Equipment Room', returnDate: '-' },
  { id: 7, name: 'Zoom F8 Recorder', category: 'Audio', status: 'In Use', assignedTo: 'David Kim', location: 'On Location', returnDate: 'Oct 16, 2026' },
  { id: 8, name: 'Matthews C-Stand Kit', category: 'Grip', status: 'Available', assignedTo: '-', location: 'Stage 1', returnDate: '-' },
  { id: 9, name: 'SmallHD Cine 13', category: 'Monitor', status: 'In Use', assignedTo: 'Amanda Foster', location: 'Edit Suite 2', returnDate: 'Oct 22, 2026' },
  { id: 10, name: 'Kino Flo Diva-Lite', category: 'Lighting', status: 'Maintenance', assignedTo: '-', location: 'Repair Shop', returnDate: 'Nov 1, 2026' },
  { id: 11, name: 'Blackmagic Pocket 6K', category: 'Camera', status: 'Available', assignedTo: '-', location: 'Equipment Room', returnDate: '-' },
  { id: 12, name: 'Rode Wireless Go II', category: 'Audio', status: 'In Use', assignedTo: 'James Wilson', location: 'On Location', returnDate: 'Oct 17, 2026' },
]

const statusStyles: Record<string, string> = {
  Available: 'bg-emerald-50 text-emerald-700',
  'In Use': 'bg-blue-50 text-blue-700',
  Maintenance: 'bg-amber-50 text-amber-700',
}

const statusDot: Record<string, string> = {
  Available: 'bg-emerald-500',
  'In Use': 'bg-blue-500',
  Maintenance: 'bg-amber-500',
}

const categories = [...new Set(equipment.map(e => e.category))]

export function AdminEquipment() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')

  const filtered = equipment.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.assignedTo.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All Statuses' || e.status === statusFilter
    const matchesCat = categoryFilter === 'All Categories' || e.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCat
  })

  const totalItems = equipment.length
  const inUse = equipment.filter(e => e.status === 'In Use').length
  const available = equipment.filter(e => e.status === 'Available').length
  const underMaintenance = equipment.filter(e => e.status === 'Maintenance').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Equipment Inventory</h2>
          <p className="text-slate-500">Track and manage all production equipment.</p>
        </div>
        <button className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Equipment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg"><Camera className="w-5 h-5 text-indigo-600" /></div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Total Items</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalItems}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg"><User className="w-5 h-5 text-blue-600" /></div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">In Use</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{inUse}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Available</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{available}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 rounded-lg"><Wrench className="w-5 h-5 text-amber-600" /></div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Maintenance</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{underMaintenance}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search equipment..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option>All Statuses</option>
              <option>Available</option>
              <option>In Use</option>
              <option>Maintenance</option>
            </select>
            <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option>All Categories</option>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Item</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Assigned To</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">Return Date</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-medium text-slate-900">{item.name}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-slate-600">{item.category}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2 h-2 rounded-full', statusDot[item.status])} />
                      <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', statusStyles[item.status])}>
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {item.assignedTo}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {item.location}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {item.returnDate}
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
          <span>Showing {filtered.length} of {equipment.length} items</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50">Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
