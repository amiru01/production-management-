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
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { cn } from '../../utils'
import { useStore } from '../../store/AppStore'

type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue'
type Priority = 'High' | 'Medium' | 'Low'
type Tab = 'All Tasks' | 'Today' | 'This Week' | 'Overdue'

interface LocalTask {
  id: number
  title: string
  project: string
  deadline: string
  priority: Priority
  status: TaskStatus
  time?: string
}

const priorityStyles: Record<Priority, { dot: string; label: string }> = {
  High: { dot: 'bg-rose-500', label: 'text-rose-700 bg-rose-50' },
  Medium: { dot: 'bg-amber-500', label: 'text-amber-700 bg-amber-50' },
  Low: { dot: 'bg-emerald-500', label: 'text-emerald-700 bg-emerald-50' },
}

const statusOptions: TaskStatus[] = ['Pending', 'In Progress', 'Completed']

export function CrewTasks() {
  const { tasks, addTask, updateTask, deleteTask } = useStore()
  const [activeTab, setActiveTab] = useState<Tab>('All Tasks')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTaskForm, setNewTaskForm] = useState({ title: '', project: '', priority: 'Medium', dueDate: '', status: 'Pending' })

  const mappedTasks: LocalTask[] = tasks.map(t => ({
    id: t.id,
    title: t.title,
    project: t.project,
    deadline: t.dueDate,
    priority: t.priority as Priority,
    status: (t.status === 'To Do' ? 'Pending' : t.status) as TaskStatus,
  }))

  const updateStatus = (id: number, status: TaskStatus) => {
    const storeStatus = status === 'Pending' ? 'To Do' : status
    updateTask(id, { status: storeStatus })
  }

  const toggleComplete = (id: number) => {
    const task = tasks.find(t => t.id === id)
    if (task) {
      updateTask(id, { status: task.status === 'Completed' ? 'To Do' : 'Completed' })
    }
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(id)
    }
  }

  const handleAddTask = () => {
    if (!newTaskForm.title.trim()) return
    addTask({
      title: newTaskForm.title,
      project: newTaskForm.project || 'General',
      priority: newTaskForm.priority,
      status: newTaskForm.status === 'Pending' ? 'To Do' : newTaskForm.status,
      dueDate: newTaskForm.dueDate || 'TBD',
      assignee: 'Me'
    })
    setNewTaskForm({ title: '', project: '', priority: 'Medium', dueDate: '', status: 'Pending' })
    setShowAddModal(false)
  }

  const today = new Date()
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const todayLabel = `${monthNames[today.getMonth()]} ${today.getDate()}`

  function getFilteredTasks(tab: Tab): LocalTask[] {
    switch (tab) {
      case 'Today':
        return mappedTasks.filter(t => t.deadline === todayLabel)
      case 'This Week':
        return mappedTasks.filter(t => t.status !== 'Completed')
      case 'Overdue':
        return mappedTasks.filter(t => t.status === 'Overdue')
      default:
        return mappedTasks
    }
  }

  const displayedTasks = getFilteredTasks(activeTab)
  const stats = {
    total: tasks.length,
    completedToday: tasks.filter(t => t.status === 'Completed').length,
    pending: tasks.filter(t => t.status === 'To Do').length,
    overdue: tasks.filter(t => t.status !== 'Completed').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Tasks</h2>
          <p className="text-slate-500">Manage your assignments and track progress.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Task
        </button>
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
                <div className="flex items-center gap-1">
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
                  <button onClick={() => handleDelete(task.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
          <span>Showing {displayedTasks.length} of {tasks.length} tasks</span>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Add New Task</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input type="text" value={newTaskForm.title} onChange={e => setNewTaskForm(f => ({ ...f, title: e.target.value }))} placeholder="Enter task title" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project</label>
                <input type="text" value={newTaskForm.project} onChange={e => setNewTaskForm(f => ({ ...f, project: e.target.value }))} placeholder="Project name" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select value={newTaskForm.priority} onChange={e => setNewTaskForm(f => ({ ...f, priority: e.target.value }))} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <input type="text" value={newTaskForm.dueDate} onChange={e => setNewTaskForm(f => ({ ...f, dueDate: e.target.value }))} placeholder="e.g. Oct 20" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={newTaskForm.status} onChange={e => setNewTaskForm(f => ({ ...f, status: e.target.value }))} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 mt-4">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleAddTask} disabled={!newTaskForm.title.trim()} className="px-4 py-2 text-sm font-medium text-white bg-[#191970] rounded-lg hover:bg-[#121258] transition-colors disabled:opacity-50">Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
