import React from 'react'
import {
  Video,
  Calendar as CalendarIcon,
  Users,
  Camera,
  AlertCircle,
  Clock,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'
import { cn } from '../../utils'

const activeProductions = [
  { id: 1, name: 'Nike Summer Campaign', phase: 'Shooting', progress: 65, team: 8, daysLeft: 3 },
  { id: 2, name: 'TechCorp Launch', phase: 'Pre-Production', progress: 25, team: 4, daysLeft: 12 },
  { id: 3, name: 'Spotify Spotlight', phase: 'Planning', progress: 10, team: 2, daysLeft: 28 },
]

const teamAvailability = [
  { name: 'Elena R.', role: 'Director', status: 'On Set', project: 'Nike Summer' },
  { name: 'David K.', role: 'DP', status: 'Available', project: '-' },
  { name: 'Sarah J.', role: 'Editor', status: 'Editing', project: 'Local Coffee' },
  { name: 'Mike T.', role: 'Sound', status: 'On Set', project: 'Nike Summer' },
]

const equipmentStatus = [
  { item: 'RED V-Raptor', status: 'In Use', location: 'Studio A' },
  { item: 'ARRI Alexa Mini', status: 'Available', location: 'Gear Room' },
  { item: 'Cooke Lenses Set', status: 'In Use', location: 'Studio A' },
  { item: 'DJI Ronin 4D', status: 'Maintenance', location: 'Repair Shop' },
]

const recentActivity = [
  { id: 1, user: 'Elena R.', action: 'uploaded new storyboard for', project: 'TechCorp Launch', time: '2 hours ago', isAlert: false },
  { id: 2, user: 'Sarah J.', action: 'completed rough cut for', project: 'Local Coffee', time: '4 hours ago', isAlert: false },
  { id: 3, user: 'System', action: 'flagged equipment delay for', project: 'Spotify Spotlight', time: '5 hours ago', isAlert: true },
  { id: 4, user: 'Marcus C.', action: 'approved call sheet for', project: 'Nike Summer', time: '1 day ago', isAlert: false },
]

export function ManagerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Production Overview</h2>
          <p className="text-slate-500">Track active projects, team, and equipment.</p>
        </div>
        <button className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">New Project</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-4">
          <div className="p-2 bg-rose-100 rounded-lg text-rose-600 mt-0.5"><AlertCircle className="w-5 h-5" /></div>
          <div>
            <h4 className="font-semibold text-rose-900">Delayed Tasks (2)</h4>
            <p className="text-sm text-rose-700 mt-1">Location scouting for Spotify Spotlight is 2 days behind schedule. Gear maintenance for Ronin 4D is delayed.</p>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-4">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-600 mt-0.5"><Clock className="w-5 h-5" /></div>
          <div>
            <h4 className="font-semibold text-amber-900">Upcoming Deadlines</h4>
            <p className="text-sm text-amber-700 mt-1">TechCorp Launch script lock due tomorrow. Nike Summer Campaign wrap in 3 days.</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Active Productions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeProductions.map((prod) => (
            <div key={prod.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Video className="w-5 h-5" /></div>
                <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">{prod.phase}</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-lg mb-1">{prod.name}</h4>
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {prod.team}</span>
                <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4" /> {prod.daysLeft} days left</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Progress</span>
                  <span className="text-blue-600">{prod.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${prod.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Users className="w-4 h-4 text-slate-500" /> Team Availability</h3>
              <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Manage</button>
            </div>
            <div className="divide-y divide-slate-100">
              {teamAvailability.map((member, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-slate-900">{member.name}</div>
                      <div className="text-xs text-slate-500">{member.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn('text-xs font-medium px-2 py-0.5 rounded-full inline-block mb-1', member.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : member.status === 'On Set' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700')}>{member.status}</div>
                    <div className="text-xs text-slate-500">{member.project}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Camera className="w-4 h-4 text-slate-500" /> Equipment Status</h3>
              <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Inventory</button>
            </div>
            <div className="divide-y divide-slate-100">
              {equipmentStatus.map((eq, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="font-medium text-sm text-slate-900">{eq.item}</div>
                    <div className="text-xs text-slate-500">{eq.location}</div>
                  </div>
                  <div className={cn('text-xs font-medium px-2 py-1 rounded-md', eq.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : eq.status === 'In Use' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700')}>{eq.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="font-semibold text-slate-900">Recent Activity</h3>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={cn('flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10', activity.isAlert ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600')}>
                    {activity.isAlert ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-slate-900">{activity.user}</span>
                      <span className="text-xs text-slate-400">{activity.time}</span>
                    </div>
                    <p className="text-sm text-slate-600">{activity.action} <span className="font-medium text-slate-900">{activity.project}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 border-t border-slate-200 text-center">
            <button className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center justify-center w-full">View All Activity <ChevronRight className="w-4 h-4 ml-1" /></button>
          </div>
        </div>
      </div>
    </div>
  )
}
