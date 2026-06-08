import React from 'react'
import { Plus, MoreHorizontal, Calendar, Users, MessageSquare } from 'lucide-react'
import { cn } from '../../utils'

const columns = [
  { id: 'planning', title: 'Planning', count: 2, color: 'bg-slate-100 border-slate-200 text-slate-700' },
  { id: 'pre-prod', title: 'Pre-Production', count: 3, color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { id: 'shooting', title: 'Shooting', count: 1, color: 'bg-rose-50 border-rose-200 text-rose-700' },
  { id: 'post-prod', title: 'Post-Production', count: 4, color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { id: 'delivered', title: 'Delivered', count: 12, color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
]

const projects = [
  { id: 1, title: 'Spotify Spotlight', client: 'Spotify', column: 'planning', date: 'Nov 2', team: 2, comments: 4, tags: ['Docu', 'Music'] },
  { id: 2, title: 'Local Coffee Brand Story', client: 'Local Coffee', column: 'planning', date: 'Oct 25', team: 3, comments: 1, tags: ['Commercial'] },
  { id: 3, title: 'TechCorp Launch', client: 'TechCorp', column: 'pre-prod', date: 'Oct 20', team: 4, comments: 8, tags: ['Product'] },
  { id: 4, title: 'Nike Summer Campaign', client: 'Nike', column: 'shooting', date: 'Oct 15', team: 8, comments: 12, tags: ['Commercial', 'High Budget'] },
  { id: 5, title: 'Adidas Winter Promo', client: 'Adidas', column: 'post-prod', date: 'Oct 10', team: 2, comments: 5, tags: ['Promo'] },
  { id: 6, title: 'Indie Short Film', client: 'Internal', column: 'post-prod', date: 'Oct 5', team: 5, comments: 22, tags: ['Narrative'] },
]

export function ProjectsBoard() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Projects Board</h2>
          <p className="text-slate-500">Manage production pipeline and project statuses.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-slate-50 flex items-center justify-center text-xs font-medium text-slate-600 z-10 relative">U{i}</div>
            ))}
            <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-50 flex items-center justify-center text-xs font-medium text-slate-500 z-10 relative">+3</div>
          </div>
          <button className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 h-full min-w-max">
          {columns.map((column) => (
            <div key={column.id} className="w-80 flex flex-col h-full">
              <div className={cn('px-3 py-2 rounded-lg border mb-4 flex items-center justify-between', column.color)}>
                <h3 className="font-semibold text-sm">{column.title}</h3>
                <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-bold">{column.count}</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px] bg-slate-100/50 rounded-xl p-2 border border-slate-200/50">
                {projects.filter(p => p.column === column.id).map((project) => (
                  <div key={project.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-wrap gap-1">
                        {project.tags.map((tag) => (
                          <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md uppercase tracking-wider">{tag}</span>
                        ))}
                      </div>
                      <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">{project.title}</h4>
                    <p className="text-xs text-slate-500 mb-4">{project.client}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {project.date}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {project.comments}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">
                        <Users className="w-3.5 h-3.5" /> {project.team}
                      </div>
                    </div>
                  </div>
                ))}
                <button className="w-full py-2 flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors border border-transparent border-dashed hover:border-slate-300">
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
