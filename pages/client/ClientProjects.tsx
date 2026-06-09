import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Users,
  FileText,
  Calendar,
  ListTodo,
  PlayCircle,
  FileCheck,
} from 'lucide-react'
import { cn } from '../../utils'
import { useStore } from '../../store/AppStore'

interface Milestone {
  name: string
  due: string
  status: 'completed' | 'in-progress' | 'upcoming'
}

interface TeamMember {
  name: string
  role: string
}

interface Project {
  id: number
  name: string
  status: 'Active' | 'Completed' | 'In Review' | 'Planning'
  progress: number
  startDate: string
  endDate: string
  nextMilestone: string
  nextMilestoneDate: string
  milestones: Milestone[]
  team: TeamMember[]
  deliverablesCount: number
}

const statusColor: Record<string, string> = {
  Active: 'bg-blue-50 text-blue-700',
  Completed: 'bg-emerald-50 text-emerald-700',
  'In Review': 'bg-amber-50 text-amber-700',
  Planning: 'bg-purple-50 text-purple-700',
}

const statusIcon: Record<string, React.ReactNode> = {
  Active: <PlayCircle className="w-3.5 h-3.5" />,
  Completed: <FileCheck className="w-3.5 h-3.5" />,
  'In Review': <AlertCircle className="w-3.5 h-3.5" />,
  Planning: <ListTodo className="w-3.5 h-3.5" />,
}

const milestoneStatusIcon: Record<string, React.ReactNode> = {
  completed: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  'in-progress': <Clock className="w-4 h-4 text-amber-500" />,
  upcoming: <Calendar className="w-4 h-4 text-slate-300" />,
}

const milestoneStatusLine: Record<string, string> = {
  completed: 'bg-emerald-500',
  'in-progress': 'bg-amber-500',
  upcoming: 'bg-slate-200',
}

const storeStatusToLocal: Record<string, 'Active' | 'Completed' | 'In Review' | 'Planning'> = {
  'In Production': 'Active',
  'Planning': 'Planning',
  'Post-Production': 'In Review',
  'Pre-Production': 'Planning',
  'Completed': 'Completed',
}

export function ClientProjects() {
  const navigate = useNavigate()
  const { projects: storeProjects } = useStore()
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const projects: Project[] = storeProjects.map(p => ({
    id: p.id,
    name: p.name,
    status: storeStatusToLocal[p.status] || 'Active',
    progress: p.progress,
    startDate: p.timeline?.split(' - ')[0] || 'TBD',
    endDate: p.timeline?.split(' - ')[1] || 'TBD',
    nextMilestone: p.status,
    nextMilestoneDate: p.timeline?.split(' - ')[1] || 'TBD',
    milestones: [],
    team: [],
    deliverablesCount: 0,
  }))

  const stats = {
    active: projects.filter((p) => p.status === 'Active').length,
    completed: projects.filter((p) => p.status === 'Completed').length,
    inReview: projects.filter((p) => p.status === 'In Review').length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">My Projects</h2>
        <p className="text-slate-500 mt-1">Projects assigned to Nike by Lumen Studio.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500">Active Projects</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><PlayCircle className="w-4 h-4" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500">Completed</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 className="w-4 h-4" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500">In Review</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><AlertCircle className="w-4 h-4" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.inReview}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => {
          const isExpanded = expandedId === project.id
          return (
            <div key={project.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div
                className="p-5 cursor-pointer hover:bg-slate-50/50 transition-colors"
                onClick={() => toggleExpand(project.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-rose-50 text-rose-600 rounded-lg shrink-0">
                        <FolderKanban className="w-5 h-5" />
                      </div>
                      <h4 className="font-semibold text-slate-900 text-lg truncate">{project.name}</h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mb-3">
                      <span>{project.startDate} - {project.endDate}</span>
                      <span className="text-slate-300">|</span>
                      <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {project.deliverablesCount} deliverables</span>
                      <span className="text-slate-300">|</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {project.team.length} team members</span>
                    </div>
                    <div className="space-y-1.5 mb-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-500">Overall Progress</span>
                        <span className={cn('font-semibold', project.progress === 100 ? 'text-emerald-600' : 'text-rose-600')}>{project.progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full transition-all duration-500', project.progress === 100 ? 'bg-emerald-500' : 'bg-rose-600')}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      Next milestone: <span className="font-medium text-slate-900">{project.nextMilestone}</span>
                      <span className="text-slate-400">({project.nextMilestoneDate})</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1', statusColor[project.status])}>
                      {statusIcon[project.status]} {project.status}
                    </span>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-200 bg-slate-50/50 p-5 space-y-6">
                  <div>
                    <h5 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2"><ListTodo className="w-4 h-4" /> Milestones</h5>
                    <div className="space-y-1">
                      {project.milestones.length > 0 ? (
                        project.milestones.map((ms, i) => (
                          <div key={ms.name} className="flex items-center gap-3">
                            <div className="flex flex-col items-center">
                              {milestoneStatusIcon[ms.status]}
                              {i < project.milestones.length - 1 && <div className={cn('w-0.5 h-6', milestoneStatusLine[ms.status])} />}
                            </div>
                            <div className={cn('flex-1 flex items-center justify-between py-1', ms.status === 'upcoming' && 'opacity-50')}>
                              <span className={cn('text-sm', ms.status === 'completed' ? 'text-emerald-700 line-through' : 'text-slate-900')}>{ms.name}</span>
                              <span className="text-xs text-slate-400">{ms.due}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-400">No milestones data available.</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2"><Users className="w-4 h-4" /> Team Assigned</h5>
                      <div className="space-y-1.5">
                        {project.team.length > 0 ? (
                          project.team.map((member) => (
                            <div key={member.name} className="flex items-center gap-2 text-sm">
                              <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <span className="text-slate-900 font-medium">{member.name}</span>
                                <span className="text-slate-400 ml-1.5">({member.role})</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-400">No team data available.</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2"><FileText className="w-4 h-4" /> Deliverables</h5>
                      <p className="text-slate-600 text-sm">{project.deliverablesCount} total deliverables across this project.</p>
                      <button onClick={() => navigate('/client/deliverables')} className="mt-3 text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors">View All Deliverables &rarr;</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
