import React from 'react'
import {
  CheckSquare,
  Calendar as CalendarIcon,
  Video,
  MessageSquare,
  Clock,
  AlertCircle,
  UploadCloud,
  PlayCircle,
} from 'lucide-react'
import { cn } from '../../utils'

const todayTasks = [
  { id: 1, title: 'Shoot B-Roll at Downtown Location', project: 'Nike Summer Campaign', time: '09:00 AM - 12:00 PM', status: 'In Progress', type: 'shoot' },
  { id: 2, title: 'Upload footage to Asset Library', project: 'Nike Summer Campaign', time: '01:00 PM', status: 'Pending', type: 'upload' },
  { id: 3, title: 'Review rough cut with Director', project: 'Local Coffee', time: '03:30 PM', status: 'Pending', type: 'review' },
]

const upcomingSchedule = [
  { date: 'Tomorrow', title: 'Studio Shoot - Day 1', project: 'TechCorp Launch', location: 'Studio A' },
  { date: 'Oct 18', title: 'Wrap Party', project: 'Nike Summer Campaign', location: 'Main Office' },
  { date: 'Oct 20', title: 'Pre-pro Meeting', project: 'Spotify Spotlight', location: 'Conference Room B' },
]

const assignedEquipment = [
  { item: 'RED V-Raptor', project: 'Nike Summer', returnDate: 'Oct 18' },
  { item: 'Cooke Lenses Set', project: 'Nike Summer', returnDate: 'Oct 18' },
  { item: 'Teradek Bolt 4K', project: 'Nike Summer', returnDate: 'Oct 18' },
]

const recentFeedback = [
  { project: 'Local Coffee', from: 'Director', comment: 'Color grading looks great, just warm up the final shot a bit.', time: '1 hour ago' },
  { project: 'Adidas Promo', from: 'Client', comment: 'Can we swap the music track in the second half?', time: '3 hours ago' },
]

export function CrewDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back, David</h2>
          <p className="text-slate-500">Here's your schedule and tasks for today.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            <UploadCloud className="w-4 h-4" /> Upload Assets
          </button>
          <button className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">Clock In</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2"><CheckSquare className="w-4 h-4 text-emerald-600" /> Today's Tasks</h3>
              <span className="text-sm text-slate-500 font-medium">3 Remaining</span>
            </div>
            <div className="divide-y divide-slate-100">
              {todayTasks.map((task) => (
                <div key={task.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4 group">
                  <button className="mt-1 w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center group-hover:border-emerald-500 transition-colors">
                    {task.status === 'Completed' && <div className="w-3 h-3 bg-emerald-500 rounded-sm" />}
                  </button>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 text-sm">{task.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5" /> {task.project}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {task.time}</span>
                    </div>
                  </div>
                  <div className={cn('text-xs font-medium px-2.5 py-1 rounded-full', task.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600')}>{task.status}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-emerald-600" /> Upcoming Schedule</h3>
              <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">View Calendar</button>
            </div>
            <div className="p-4 space-y-4">
              {upcomingSchedule.map((event, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-16 shrink-0 text-center">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{event.date === 'Tomorrow' ? 'TMRW' : event.date.split(' ')[0]}</div>
                    <div className="text-lg font-bold text-slate-900">{event.date === 'Tomorrow' ? '' : event.date.split(' ')[1]}</div>
                  </div>
                  <div className="flex-1 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <h4 className="font-medium text-slate-900 text-sm">{event.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{event.project} &bull; {event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-emerald-600" /> My Equipment</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {assignedEquipment.map((eq, i) => (
                <div key={i} className="p-3 hover:bg-slate-50 transition-colors">
                  <div className="font-medium text-sm text-slate-900">{eq.item}</div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-slate-500">{eq.project}</span>
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Return: {eq.returnDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-emerald-600" /> Recent Feedback</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {recentFeedback.map((fb, i) => (
                <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">{fb.project}</span>
                    <span className="text-xs text-slate-400">{fb.time}</span>
                  </div>
                  <p className="text-sm text-slate-700 mb-2">&quot;{fb.comment}&quot;</p>
                  <div className="text-xs text-slate-500 flex items-center gap-1">From: <span className="font-medium text-slate-900">{fb.from}</span></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <h3 className="font-semibold text-lg mb-2 relative z-10">Review Dailies</h3>
            <p className="text-slate-300 text-sm mb-4 relative z-10">New footage available for Nike Summer Campaign.</p>
            <button className="w-full bg-white text-slate-900 hover:bg-slate-100 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 relative z-10">
              <PlayCircle className="w-4 h-4" /> Watch Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
