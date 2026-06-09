import React, { useState } from 'react'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Plus,
  FileText,
  Camera,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react'
import { cn } from '../../utils'
import { useStore } from '../../store/AppStore'

const today = new Date()
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function ManagerScheduling() {
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [showModal, setShowModal] = useState(false)
  const [showCallSheet, setShowCallSheet] = useState(false)
  const [form, setForm] = useState({ date: today.getDate(), title: '', project: '', location: '', crew: '', time: '', status: 'Tentative' })
  const { scheduleEvents, addScheduleEvent, updateScheduleEvent, deleteScheduleEvent } = useStore()

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const todayEvents = scheduleEvents.filter(e => e.date === today.getDate())
  const thisWeekEvents = scheduleEvents.filter(e => e.date >= today.getDate() && e.date <= today.getDate() + 7)
  const crewToday = todayEvents.reduce((sum, e) => sum + (typeof e.crew === 'number' ? e.crew : 0), 0)

  const openAddModal = (day?: number) => {
    setForm({ date: day || today.getDate(), title: '', project: '', location: '', crew: '', time: '', status: 'Tentative' })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.title.trim()) return
    addScheduleEvent({
      id: 0, date: form.date, title: form.title, project: form.project, location: form.location,
      crew: form.crew ? parseInt(form.crew) || form.crew : 1, time: form.time, status: form.status,
    })
    setShowModal(false)
  }

  const scheduleTable = scheduleEvents.filter(e => e.date >= today.getDate()).slice(0, 5).map(e => ({
    date: `${monthNames[currentMonth].slice(0, 3)} ${e.date}`,
    project: e.project,
    location: e.location,
    crew: typeof e.crew === 'number' ? `${e.crew} crew` : String(e.crew),
    status: e.status === 'Confirmed' ? 'Confirmed' : 'Scheduled',
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Production Scheduling</h2>
          <p className="text-slate-500">Calendar and timeline for upcoming shoots and events.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowCallSheet(true)} className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            <FileText className="w-4 h-4" /> Call Sheet
          </button>
          <button onClick={() => openAddModal()} className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Schedule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><Camera className="w-5 h-5" /></div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{todayEvents.length}</p>
            <p className="text-sm text-slate-500">Today's Shoots</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><Calendar className="w-5 h-5" /></div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{thisWeekEvents.length}</p>
            <p className="text-sm text-slate-500">This Week</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg"><Users className="w-5 h-5" /></div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{crewToday}</p>
            <p className="text-sm text-slate-500">Crew Assigned Today</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-500" /> {monthNames[currentMonth]} {currentYear}</h3>
            <div className="flex items-center gap-1">
              <button onClick={prevMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={nextMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-slate-500 py-2">{day}</div>
            ))}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dayEvents = scheduleEvents.filter((e) => e.date === day)
              const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
              return (
                <div key={day} onClick={() => openAddModal(day)} className={cn('h-20 p-1 border border-slate-100 rounded-lg overflow-hidden cursor-pointer hover:border-slate-300 transition-colors', isToday && 'bg-[#191970]/5 border-[#191970]/30')}>
                  <div className={cn('text-xs font-medium mb-1', isToday ? 'text-[#191970]' : 'text-slate-600')}>{day}</div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div key={event.id} className={cn('text-[10px] px-1 py-0.5 rounded truncate font-medium', event.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700')}>{event.title}</div>
                    ))}
                    {dayEvents.length > 2 && <div className="text-[10px] text-slate-400 pl-1">+{dayEvents.length - 2} more</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-slate-500" /> Today's Schedule</h3>
            <div className="space-y-3">
              {todayEvents.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">No events scheduled for today.</p>
              ) : (
                todayEvents.slice(0, 4).map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className={cn('p-1.5 rounded-lg mt-0.5', event.status === 'Confirmed' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600')}>
                      {event.status === 'Confirmed' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm text-slate-900 truncate">{event.title}</h4>
                        <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 ml-2', event.status === 'Confirmed' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700')}>{event.status}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {event.crew}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Upcoming Shoots</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 pr-4">Project</th>
                    <th className="pb-3 pr-4">Location</th>
                    <th className="pb-3 pr-4">Crew</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scheduleTable.map((row, i) => (
                    <tr key={i} className="text-sm hover:bg-slate-50 transition-colors">
                      <td className="py-3 pr-4 font-medium text-slate-900">{row.date}</td>
                      <td className="py-3 pr-4 text-slate-700">{row.project}</td>
                      <td className="py-3 pr-4 text-slate-600">{row.location}</td>
                      <td className="py-3 pr-4 text-slate-600">{row.crew}</td>
                      <td className="py-3 text-right">
                        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', row.status === 'Confirmed' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700')}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Create Schedule Event</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date (day of month)</label>
                <input type="number" value={form.date} onChange={e => setForm(f => ({ ...f, date: parseInt(e.target.value) || 1 }))} min={1} max={31} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]" placeholder="Event title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project</label>
                <input type="text" value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]" placeholder="Project name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]" placeholder="Location" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Crew Count</label>
                <input type="text" value={form.crew} onChange={e => setForm(f => ({ ...f, crew: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]" placeholder="Number of crew" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                <input type="text" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]" placeholder="e.g. 8:00 AM - 6:00 PM" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]">
                  <option value="Confirmed">Confirmed</option>
                  <option value="Tentative">Tentative</option>
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

      {showCallSheet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Call Sheet - {today.toLocaleDateString()}</h3>
              <button onClick={() => setShowCallSheet(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            {todayEvents.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">No events scheduled for today.</p>
            ) : (
              <div className="space-y-3">
                {todayEvents.map(event => (
                  <div key={event.id} className="p-4 rounded-lg border border-slate-200">
                    <div className="font-semibold text-slate-900">{event.title}</div>
                    <div className="text-sm text-slate-600 mt-1">{event.project} &middot; {event.location} &middot; {event.time}</div>
                    <div className="text-sm text-slate-500 mt-1">Crew: {event.crew}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowCallSheet(false)} className="px-4 py-2 text-sm font-medium text-white bg-[#191970] hover:bg-[#121258] rounded-lg transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
