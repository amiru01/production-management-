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
} from 'lucide-react'
import { cn } from '../../utils'

const categories = ['All', 'Cameras', 'Lenses', 'Audio', 'Lighting', 'Support', 'Other']

const equipment = [
  { id: 1, name: 'RED V-Raptor', category: 'Cameras', status: 'In Use', assigned: 'Studio A - Nike Shoot' },
  { id: 2, name: 'ARRI Alexa Mini', category: 'Cameras', status: 'Available', assigned: 'Gear Room' },
  { id: 3, name: 'Sony FX6', category: 'Cameras', status: 'Available', assigned: 'Gear Room' },
  { id: 4, name: 'Cooke S4 Prime Set', category: 'Lenses', status: 'In Use', assigned: 'Studio A - Nike Shoot' },
  { id: 5, name: 'Canon CN-E 24mm', category: 'Lenses', status: 'Maintenance', assigned: 'Repair Shop' },
  { id: 6, name: 'Atlas Orion Set', category: 'Lenses', status: 'Available', assigned: 'Gear Room' },
  { id: 7, name: 'Sennheiser MKH416', category: 'Audio', status: 'In Use', assigned: 'Set B - Interview' },
  { id: 8, name: 'Sound Devices MixPre', category: 'Audio', status: 'Available', assigned: 'Gear Room' },
  { id: 9, name: 'DJI Mic 2 Set', category: 'Audio', status: 'Available', assigned: 'Gear Room' },
  { id: 10, name: 'Aputure 600d Pro', category: 'Lighting', status: 'In Use', assigned: 'Studio A' },
  { id: 11, name: 'Nanlite Forza 300', category: 'Lighting', status: 'Available', assigned: 'Gear Room' },
  { id: 12, name: 'DJI Ronin 4D', category: 'Cameras', status: 'Maintenance', assigned: 'Repair Shop' },
  { id: 13, name: 'DJI RS4 Pro', category: 'Support', status: 'Available', assigned: 'Gear Room' },
  { id: 14, name: 'C-Stand Kit (x4)', category: 'Support', status: 'In Use', assigned: 'Studio A' },
  { id: 15, name: 'SmallHD Cine 13', category: 'Other', status: 'Available', assigned: 'Gear Room' },
]

const categoryIcons: Record<string, React.ElementType> = {
  Cameras: Camera,
  Lenses: Camera,
  Audio: Headphones,
  Lighting: Lightbulb,
  Support: Wrench,
  Other: Monitor,
}

const statCards = [
  { label: 'Total Items', value: '48', icon: Package, color: 'bg-blue-50 text-blue-600' },
  { label: 'In Use', value: '16', icon: CheckCircle2, color: 'bg-amber-50 text-amber-600' },
  { label: 'Available', value: '28', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Maintenance', value: '4', icon: AlertTriangle, color: 'bg-rose-50 text-rose-600' },
]

export function ManagerEquipment() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = equipment.filter((e) => {
    const matchesCategory = activeCategory === 'All' || e.category === activeCategory
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Equipment Inventory</h2>
          <p className="text-slate-500">Track gear, availability, and assignments.</p>
        </div>
        <div className="flex gap-3">
          <button className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">Export</button>
          <button className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
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
                  <span className="text-xs text-slate-400 truncate ml-2">{item.assigned}</span>
                </div>
                <button className="mt-3 w-full border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                  <Plus className="w-3.5 h-3.5" /> Assign Equipment
                </button>
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
    </div>
  )
}
