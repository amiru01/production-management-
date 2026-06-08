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
} from 'lucide-react'
import { cn } from '../../utils'

const today = new Date()
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const events = [
  { id: 1, date: 8, title: 'Nike Summer - Studio Shoot', project: 'Nike Summer Campaign', location: 'Studio A', crew: 8, time: '8:00 AM - 6:00 PM', status: 'Confirmed' },
  { id: 2, date: 8, title: 'TechCorp Location Scout', project: 'TechCorp Launch', location: 'Riverside Park', crew: 3, time: '10:00 AM - 12:00 PM', status: 'Tentative' },
  { id: 3, date: 9, title: 'Spotify Spotlight - Interview', project: 'Spotify Spotlight', location: 'Warehouse', crew: 5, time: '9:00 AM - 3:00 PM', status: 'Confirmed' },
  { id: 4, date: 10, title: 'Local Coffee - Product Shoot', project: 'Local Coffee', location: 'Coffee Shop', crew: 4, time: '11:00 AM - 5:00 PM', status: 'Confirmed' },
  { id: 5, date: 12, title: 'Adidas Winter Promo Prep', project: 'Adidas Winter Promo', location: 'Studio B', crew: 2, time: '1:00 PM - 4:00 PM', status: 'Tentative' },
  { id: 6, date: 15, title: 'Nike Summer - Final Day', project: 'Nike Summer Campaign', location: 'Studio A', crew: 10, time: '7:00 AM - 8:00 PM', status: 'Confirmed' },
]

const scheduleTable = [
  { date: 'Jun 8', project: 'Nike Summer Campaign', location: 'Studio A', crew: 'Elena R., David K., Mike T., +5', status: 'Shooting Today' },
  { date: 'Jun 9', project: 'Spotify Spotlight', location: 'Sunset Warehouse', crew: 'Sarah J., Marcus C., +3', status: 'Scheduled' },
  { date: 'Jun 10', project: 'Local Coffee', location: 'Coffee Shop Interior', crew: 'Elena R., Tom S., +2', status: 'Scheduled' },
  { date: 'Jun 12', project: 'Adidas Winter Promo', location: 'Studio B', crew: 'David K., Anna P.', status: 'Pending' },
  { date: 'Jun 15', project: 'Nike Summer Campaign', location: 'Studio A', crew: 'Full Team (10)', status: 'Confirmed' },
]

export function ManagerScheduling() {
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Production Scheduling</h2>
          <p className="text-slate-500">Calendar and timeline for upcoming shoots and events.</p>
        </div>
        <div className="flex gap-3">
          <button className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            <FileText className="w-4 h-4" /> Call Sheet
          </button>
          <button className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Schedule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><Camera className="w-5 h-5" /></div>
          <div>
            <p className="text-2xl font-bold text-slate-900">2</p>
            <p className="text-sm text-slate-500">Today's Shoots</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><Calendar className="w-5 h-5" /></div>
          <div>
            <p className="text-2xl font-bold text-slate-900">5</p>
            <p className="text-sm text-slate-500">This Week</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg"><Users className="w-5 h-5" /></div>
          <div>
            <p className="text-2xl font-bold text-slate-900">11</p>
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
              const dayEvents = events.filter((e) => e.date === day)
              const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
              return (
                <div key={day} className={cn('h-20 p-1 border border-slate-100 rounded-lg overflow-hidden', isToday && 'bg-[#191970]/5 border-[#191970]/30')}>
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
              {events.filter((e) => e.date === today.getDate()).length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">No events scheduled for today.</p>
              ) : (
                events.filter((e) => e.date === today.getDate() || (e.date >= today.getDate() && e.date <= today.getDate() + 2)).slice(0, 4).map((event) => (
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
                        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', row.status === 'Shooting Today' ? 'bg-blue-50 text-blue-700' : row.status === 'Scheduled' ? 'bg-emerald-50 text-emerald-700' : row.status === 'Confirmed' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700')}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
