import React, { useState } from 'react'
import {
  Camera,
  Headphones,
  Lightbulb,
  Monitor,
  Plus,
  Search,
  Package,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  X,
} from 'lucide-react'
import { cn } from '../../utils'
import { useStore } from '../../store/AppStore'

const categories = ['All', 'Cameras', 'Lenses', 'Audio', 'Lighting', 'Support', 'Other']

const categoryIcons: Record<string, React.ElementType> = {
  Cameras: Camera,
  Lenses: Camera,
  Audio: Headphones,
  Lighting: Lightbulb,
  Support: Wrench,
  Other: Monitor,
}

export function ManagerEquipment() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [assignItem, setAssignItem] = useState('')
  const [form, setForm] = useState({ name: '', category: 'Cameras', status: 'Available', assignedTo: '', location: '', returnDate: '' })
  const [assignForm, setAssignForm] = useState({ assignedTo: '', location: '' })
  const { equipment, addEquipment, updateEquipment, deleteEquipment } = useStore()

  const statCards = [
    { label: 'Total Items', value: String(equipment.length), icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'In Use', value: String(equipment.filter(e => e.status === 'In Use').length), icon: CheckCircle2, color: 'bg-amber-50 text-amber-600' },
    { label: 'Available', value: String(equipment.filter(e => e.status === 'Available').length), icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Maintenance', value: String(equipment.filter(e => e.status === 'Maintenance').length), icon: AlertTriangle, color: 'bg-rose-50 text-rose-600' },
  ]

  const filtered = equipment.filter((e) => {
    const matchesCategory = activeCategory === 'All' || e.category === activeCategory
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const openAddModal = () => {
    setForm({ name: '', category: 'Cameras', status: 'Available', assignedTo: '', location: '', returnDate: '' })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    addEquipment({
      id: 0, name: form.name, category: form.category, status: form.status,
      assignedTo: form.assignedTo, location: form.location, returnDate: form.returnDate,
    })
    setShowModal(false)
  }

  const handleDelete = (id: number) => {
    if (confirm('Delete this equipment item?')) deleteEquipment(id)
  }

  const openAssignModal = (name: string) => {
    setAssignItem(name)
    setAssignForm({ assignedTo: '', location: '' })
    setShowAssignModal(true)
  }

  const handleAssign = () => {
    const item = equipment.find(e => e.name === assignItem)
    if (item) {
      updateEquipment(item.id, { assignedTo: assignForm.assignedTo, location: assignForm.location, status: 'In Use' })
    }
    setShowAssignModal(false)
  }

  const handleExport = () => {
    const csv = 'Name,Category,Status,Assigned To,Location\n' + equipment.map(e => `${e.name},${e.category},${e.status},${e.assignedTo},${e.location}`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'equipment.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Equipment Inventory</h2>
          <p className="text-slate-500">Track gear, availability, and assignments.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">Export</button>
          <button onClick={openAddModal} className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Equipment
          </button>
        </div>
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

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn('flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors', activeCategory === cat ? 'bg-[#191970] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}
              >
                {cat !== 'All' && categoryIcons[cat] && React.createElement(categoryIcons[cat], { className: 'w-3.5 h-3.5' })}
                {cat}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970] w-56"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="border border-slate-200 rounded-xl hover:shadow-md transition-all group">
              <div className="h-32 bg-slate-100 rounded-t-xl flex items-center justify-center text-slate-300 border-b border-slate-200">
                {categoryIcons[item.category] ? React.createElement(categoryIcons[item.category], { className: 'w-10 h-10' }) : <Package className="w-10 h-10" />}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-900 text-sm">{item.name}</h4>
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider', item.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : item.status === 'In Use' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700')}>{item.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{item.category}</span>
                  <span className="text-xs text-slate-400 truncate ml-2">{item.assignedTo}{item.location ? ` - ${item.location}` : ''}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openAssignModal(item.name)} className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                    <Plus className="w-3.5 h-3.5" /> Assign Equipment
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-xs text-rose-500 hover:text-rose-700 px-2 py-1.5 opacity-0 group-hover:opacity-100">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No equipment found</p>
            <p className="text-sm">Try adjusting your filters.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Add Equipment</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]" placeholder="Equipment name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]">
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]">
                  <option value="Available">Available</option>
                  <option value="In Use">In Use</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-[#191970] hover:bg-[#121258] rounded-lg transition-colors">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Assign Equipment: {assignItem}</h3>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assigned To</label>
                <input type="text" value={assignForm.assignedTo} onChange={e => setAssignForm(f => ({ ...f, assignedTo: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]" placeholder="Person or project" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input type="text" value={assignForm.location} onChange={e => setAssignForm(f => ({ ...f, location: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]" placeholder="Location" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowAssignModal(false)} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleAssign} className="px-4 py-2 text-sm font-medium text-white bg-[#191970] hover:bg-[#121258] rounded-lg transition-colors">Assign</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
