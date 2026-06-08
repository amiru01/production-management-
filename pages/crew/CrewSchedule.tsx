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
} from 'lucide-react'
import { cn } from '../../utils'

interface ScheduleEvent {
  id: number
  title: string
  project: string
  location: string
  day: string
  time: string
  type: 'shoot' | 'meeting' | 'review'
}

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const allEvents: ScheduleEvent[] = [
  { id: 1, title: 'Studio Shoot - Day 1', project: 'TechCorp Launch', location: 'Studio A', day: 'Mon', time: '08:00 - 17:00', type: 'shoot' },
  { id: 2, title: 'Pre-pro Meeting', project: 'Spotify Spotlight', location: 'Conference Room B', day: 'Mon', time: '14:00 - 15:00', type: 'meeting' },
  { id: 3, title: 'Location Scout', project: 'Nike Summer Campaign', location: 'Downtown NYC', day: 'Tue', time: '09:00 - 12:00', type: 'shoot' },
  { id: 4, title: 'Rough Cut Review', project: 'Local Coffee', location: 'Edit Bay 3', day: 'Tue', time: '15:00 - 16:30', type: 'review' },
  { id: 5, title: 'B-Roll Shoot', project: 'Nike Summer Campaign', location: 'Brooklyn Bridge Park', day: 'Wed', time: '07:00 - 11:00', type: 'shoot' },
  { id: 6, title: 'Client Check-in', project: 'Adidas Winter Promo', location: 'Zoom Call', day: 'Wed', time: '13:00 - 14:00', type: 'meeting' },
  { id: 7, title: 'Color Grade Session', project: 'TechCorp Launch', location: 'Edit Bay 1', day: 'Thu', time: '10:00 - 16:00', type: 'review' },
  { id: 8, title: 'Equipment Return', project: 'Nike Summer Campaign', location: 'Gear Room', day: 'Thu', time: '17:00 - 17:30', type: 'meeting' },
  { id: 9, title: 'Sound Mix Review', project: 'Spotify Spotlight', location: 'Audio Suite', day: 'Fri', time: '11:00 - 12:30', type: 'review' },
  { id: 10, title: 'Wrap Meeting', project: 'TechCorp Launch', location: 'Main Office', day: 'Fri', time: '16:00 - 17:00', type: 'meeting' },
]

const nextEvent = allEvents[0]

const typeStyles: Record<string, { icon: any; bg: string; dot: string }> = {
  shoot: { icon: Video, bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500' },
  meeting: { icon: Users, bg: 'bg-purple-50 border-purple-200', dot: 'bg-purple-500' },
  review: { icon: FileText, bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
}

export function CrewSchedule() {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Schedule</h2>
          <p className="text-slate-500">Weekly calendar and upcoming events.</p>
        </div>
        <button className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
          <Download className="w-4 h-4" /> Download Call Sheet
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-500">Today's Events</span>
            <CalendarIcon className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{allEvents.filter(e => e.day === weekDays[new Date().getDay()]).length || 2}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-500">This Week</span>
            <Briefcase className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{allEvents.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-500">Next Event In</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-amber-600">2h 15m</div>
          <div className="text-xs text-slate-400 mt-0.5">{nextEvent.title}</div>
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
            const dayEvents = allEvents.filter(e => e.day === day)
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
                      <div key={event.id} className={cn('text-xs p-2 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow', style.bg)}>
                        <div className="flex items-center gap-1 mb-1">
                          <Icon className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="font-medium text-slate-700 truncate">{event.title}</span>
                        </div>
                        <div className="text-slate-500 truncate flex items-center gap-1">
                          <Clock className="w-3 h-3 shrink-0" /> {event.time}
                        </div>
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
          {allEvents.map((event) => {
            const style = typeStyles[event.type]
            const Icon = style.icon
            return (
              <div key={event.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
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
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
