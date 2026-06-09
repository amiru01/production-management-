import React, { useState } from 'react'
import { useStore } from '../../store/AppStore'
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
  X,
  Edit2,
  Trash2,
} from 'lucide-react'
import { cn } from '../../utils'

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

export function AdminEquipment() {
  const { equipment, addEquipment, updateEquipment, deleteEquipment } = useStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', category: 'Camera', status: 'Available', assignedTo: '-', location: '', returnDate: '-' })

  const categories = [...new Set(equipment.map(e => e.category))]

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

  const openAdd = () => {
    setEditingItem(null)
    setForm({ name: '', category: 'Camera', status: 'Available', assignedTo: '-', location: '', returnDate: '-' })
    setShowModal(true)
  }

  const openEdit = (item: any) => {
    setEditingItem(item)
    setForm({ name: item.name, category: item.category, status: item.status, assignedTo: item.assignedTo, location: item.location, returnDate: item.returnDate })
    setShowModal(true)
    setOpenMenuId(null)
  }

  const handleDelete = (id: number) => {
    setOpenMenuId(null)
    if (confirm('Are you sure you want to delete this equipment item?')) {
      deleteEquipment(id)
    }
  }

  const handleSubmit = () => {
    if (editingItem) {
      updateEquipment(editingItem.id, form)
    } else {
      addEquipment(form as any)
    }
    setShowModal(false)
    setEditingItem(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Equipment Inventory</h2>
          <p className="text-slate-500">Track and manage all production equipment.</p>
        </div>
        <button onClick={openAdd} className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
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
          <span>Showing {filtered.length} of {equipment.length} items</span>
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
              <h3 className="text-lg font-semibold text-slate-900">{editingItem ? 'Edit Equipment' : 'Add Equipment'}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                  <option>Camera</option>
                  <option>Lighting</option>
                  <option>Audio</option>
                  <option>Grip</option>
                  <option>Monitor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                  <option>Available</option>
                  <option>In Use</option>
                  <option>Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assigned To</label>
                <input type="text" value={form.assignedTo} onChange={e => setForm({...form, assignedTo: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Return Date</label>
                <input type="text" value={form.returnDate} onChange={e => setForm({...form, returnDate: e.target.value})} placeholder="e.g. Oct 20, 2026" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={handleSubmit} className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg text-sm font-medium">{editingItem ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
