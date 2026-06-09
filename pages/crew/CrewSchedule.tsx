import React, { useState } from 'react'
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Video,
  Users,
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
  Briefcase,
  Plus,
  X,
  Trash2,
} from 'lucide-react'
import { cn } from '../../utils'
import { useStore } from '../../store/AppStore'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const typeStyles: Record<string, { icon: any; bg: string; dot: string }> = {
  shoot: { icon: Video, bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500' },
  meeting: { icon: Users, bg: 'bg-purple-50 border-purple-200', dot: 'bg-purple-500' },
  review: { icon: FileText, bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
}

function getDayName(dateNum: number): string {
  const now = new Date()
  const d = new Date(now.getFullYear(), now.getMonth(), dateNum)
  return weekDays[d.getDay()]
}

export function CrewSchedule() {
  const { scheduleEvents, addScheduleEvent, deleteScheduleEvent } = useStore()
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newEventForm, setNewEventForm] = useState({ title: '', project: '', location: '', day: 'Mon', time: '', type: 'shoot' })

  const mappedEvents = scheduleEvents.map(e => ({
    id: e.id,
    title: e.title,
    project: e.project,
    location: e.location,
    day: getDayName(e.date),
    time: e.time,
    type: 'shoot' as const,
  }))

  const nextEvent = mappedEvents[0]
  const todayDayName = weekDays[new Date().getDay()]

  const handleAddEvent = () => {
    if (!newEventForm.title.trim()) return
    addScheduleEvent({
      title: newEventForm.title,
      project: newEventForm.project || 'General',
      location: newEventForm.location || 'TBD',
      date: 15 + currentWeekOffset,
      crew: 1,
      time: newEventForm.time || 'TBD',
      status: 'Tentative'
    })
    setNewEventForm({ title: '', project: '', location: '', day: 'Mon', time: '', type: 'shoot' })
    setShowAddModal(false)
  }

  const handleDelete = (id: number) => {
    if (confirm('Delete this event?')) {
      deleteScheduleEvent(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Schedule</h2>
          <p className="text-slate-500">Weekly calendar and upcoming events.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => alert('Call sheet downloaded as PDF.')} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Download Call Sheet
          </button>
          <button onClick={() => setShowAddModal(true)} className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-500">Today's Events</span>
            <CalendarIcon className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{mappedEvents.filter(e => e.day === todayDayName).length || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-500">This Week</span>
            <Briefcase className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{mappedEvents.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-500">Next Event In</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-amber-600">2h 15m</div>
          <div className="text-xs text-slate-400 mt-0.5">{nextEvent?.title || 'No events'}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-emerald-600" /> Week View</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentWeekOffset(o => o - 1)} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"><ChevronLeft className="w-4 h-4 text-slate-500" /></button>
            <span className="text-sm font-medium text-slate-700">Oct 9 - 15</span>
            <button onClick={() => setCurrentWeekOffset(o => o + 1)} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"><ChevronRight className="w-4 h-4 text-slate-500" /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 divide-x divide-slate-200 min-h-[280px]">
          {weekDays.map((day) => {
            const dayEvents = mappedEvents.filter(e => e.day === day)
            return (
              <div key={day} className="flex flex-col">
                <div className="p-2 text-center border-b border-slate-100 bg-slate-50/30">
                  <div className="text-xs font-semibold text-slate-500 uppercase">{day}</div>
                  <div className="text-lg font-bold text-slate-900">{9 + weekDays.indexOf(day)}</div>
                </div>
                <div className="flex-1 p-1.5 space-y-1.5">
                  {dayEvents.map((event) => {
                    const style = typeStyles[event.type]
                    const Icon = style.icon
                    return (
                      <div key={event.id} className={cn('text-xs p-2 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow group relative', style.bg)}>
                        <div className="flex items-center gap-1 mb-1">
                          <Icon className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="font-medium text-slate-700 truncate">{event.title}</span>
                        </div>
                        <div className="text-slate-500 truncate flex items-center gap-1">
                          <Clock className="w-3 h-3 shrink-0" /> {event.time}
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(event.id) }} className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600" title="Delete">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-600" /> Upcoming Events</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {mappedEvents.map((event) => {
            const style = typeStyles[event.type]
            const Icon = style.icon
            return (
              <div key={event.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4 group">
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', style.bg.replace('border', 'border-0'))}>
                  <Icon className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-slate-900">{event.title}</h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {event.project}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-medium text-slate-900">{event.time}</div>
                  <div className="text-xs text-slate-400">{event.day}</div>
                </div>
                <button onClick={() => handleDelete(event.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Add New Event</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input type="text" value={newEventForm.title} onChange={e => setNewEventForm(f => ({ ...f, title: e.target.value }))} placeholder="Event title" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project</label>
                <input type="text" value={newEventForm.project} onChange={e => setNewEventForm(f => ({ ...f, project: e.target.value }))} placeholder="Project name" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input type="text" value={newEventForm.location} onChange={e => setNewEventForm(f => ({ ...f, location: e.target.value }))} placeholder="Location" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Day</label>
                <select value={newEventForm.day} onChange={e => setNewEventForm(f => ({ ...f, day: e.target.value }))} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  {weekDays.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                <input type="text" value={newEventForm.time} onChange={e => setNewEventForm(f => ({ ...f, time: e.target.value }))} placeholder="e.g. 9:00 AM - 5:00 PM" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 mt-4">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleAddEvent} disabled={!newEventForm.title.trim()} className="px-4 py-2 text-sm font-medium text-white bg-[#191970] rounded-lg hover:bg-[#121258] transition-colors disabled:opacity-50">Add Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
