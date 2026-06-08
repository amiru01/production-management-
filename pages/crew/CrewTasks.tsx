import React, { useState } from 'react'
import {
  CheckSquare,
  Calendar,
  Clock,
  AlertCircle,
  ChevronDown,
  ListTodo,
  CheckCircle2,
  Timer,
  Flag,
} from 'lucide-react'
import { cn } from '../../utils'

type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue'
type Priority = 'High' | 'Medium' | 'Low'
type Tab = 'All Tasks' | 'Today' | 'This Week' | 'Overdue'

interface Task {
  id: number
  title: string
  project: string
  deadline: string
  priority: Priority
  status: TaskStatus
  time?: string
}

const allTasks: Task[] = [
  { id: 1, title: 'Shoot B-Roll at Downtown Location', project: 'Nike Summer Campaign', deadline: 'Oct 15', priority: 'High', status: 'In Progress', time: '09:00 AM - 12:00 PM' },
  { id: 2, title: 'Upload footage to Asset Library', project: 'Nike Summer Campaign', deadline: 'Oct 15', priority: 'Medium', status: 'Pending', time: '01:00 PM' },
  { id: 3, title: 'Review rough cut with Director', project: 'Local Coffee', deadline: 'Oct 14', priority: 'High', status: 'Completed', time: '03:30 PM' },
  { id: 4, title: 'Color grade interview footage', project: 'TechCorp Launch', deadline: 'Oct 18', priority: 'Medium', status: 'Pending' },
  { id: 5, title: 'Sync audio for podcast episode', project: 'Spotify Spotlight', deadline: 'Oct 12', priority: 'Low', status: 'Pending' },
  { id: 6, title: 'Export final cut for client review', project: 'Adidas Winter Promo', deadline: 'Oct 13', priority: 'High', status: 'In Progress' },
  { id: 7, title: 'Organize drive folder structure', project: 'Nike Summer Campaign', deadline: 'Oct 11', priority: 'Low', status: 'Completed' },
  { id: 8, title: 'Backup raw files to NAS', project: 'TechCorp Launch', deadline: 'Oct 10', priority: 'Medium', status: 'Pending' },
  { id: 9, title: 'Transcribe interview SRT files', project: 'Local Coffee', deadline: 'Oct 09', priority: 'Low', status: 'Overdue' },
  { id: 10, title: 'Clean up proxy files', project: 'Spotify Spotlight', deadline: 'Oct 08', priority: 'Medium', status: 'Overdue' },
]

const priorityStyles: Record<Priority, { dot: string; label: string }> = {
  High: { dot: 'bg-rose-500', label: 'text-rose-700 bg-rose-50' },
  Medium: { dot: 'bg-amber-500', label: 'text-amber-700 bg-amber-50' },
  Low: { dot: 'bg-emerald-500', label: 'text-emerald-700 bg-emerald-50' },
}

const statusOptions: TaskStatus[] = ['Pending', 'In Progress', 'Completed']

function getFilteredTasks(tab: Tab): Task[] {
  const today = new Date()
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const todayMonth = monthNames[today.getMonth()]
  const todayDay = today.getDate()
  const todayLabel = `${todayMonth} ${todayDay}`

  const endOfWeek = new Date(today)
  endOfWeek.setDate(today.getDate() + (7 - today.getDay()))
  const endMonth = monthNames[endOfWeek.getMonth()]
  const endDay = endOfWeek.getDate()
  const endLabel = `${endMonth} ${endDay}`

  switch (tab) {
    case 'Today':
      return allTasks.filter(t => t.deadline === todayLabel)
    case 'This Week':
      return allTasks.filter(t => t.status !== 'Completed')
    case 'Overdue':
      return allTasks.filter(t => t.status === 'Overdue')
    default:
      return allTasks
  }
}

export function CrewTasks() {
  const [activeTab, setActiveTab] = useState<Tab>('All Tasks')
  const [tasks, setTasks] = useState<Task[]>(allTasks)

  const updateStatus = (id: number, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
  }

  const toggleComplete = (id: number) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t
    ))
  }

  const displayedTasks = getFilteredTasks(activeTab)
  const stats = {
    total: tasks.length,
    completedToday: tasks.filter(t => t.status === 'Completed').length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    overdue: tasks.filter(t => t.status !== 'Completed').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Tasks</h2>
          <p className="text-slate-500">Manage your assignments and track progress.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-500">Total Tasks</span>
            <ListTodo className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-500">Completed Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{stats.completedToday}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-500">Pending</span>
            <Timer className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-500">Overdue</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600">{stats.overdue}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
            {(['All Tasks', 'Today', 'This Week', 'Overdue'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                  activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {displayedTasks.map((task) => {
            const pStyle = priorityStyles[task.priority]
            return (
              <div key={task.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4 group">
                <button
                  onClick={() => toggleComplete(task.id)}
                  className={cn(
                    'mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0',
                    task.status === 'Completed'
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-slate-300 group-hover:border-emerald-500'
                  )}
                >
                  {task.status === 'Completed' && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={cn('font-medium text-sm', task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900')}>
                      {task.title}
                    </h4>
                    <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full', pStyle.label)}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', pStyle.dot)} />
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1"><Flag className="w-3.5 h-3.5" /> {task.project}</span>
                    {task.deadline && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {task.deadline}</span>}
                    {task.time && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {task.time}</span>}
                  </div>
                </div>
                <div className="relative">
                  <select
                    value={task.status}
                    onChange={(e) => updateStatus(task.id, e.target.value as TaskStatus)}
                    className={cn(
                      'text-xs font-medium px-2.5 py-1 rounded-full border appearance-none cursor-pointer pr-6 outline-none',
                      task.status === 'Completed' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
                      task.status === 'In Progress' && 'bg-blue-50 text-blue-700 border-blue-200',
                      task.status === 'Pending' && 'bg-slate-100 text-slate-600 border-slate-200'
                    )}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )
          })}
        </div>

        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
          <span>Showing {displayedTasks.length} of {tasks.length} tasks</span>
        </div>
      </div>
    </div>
  )
}
