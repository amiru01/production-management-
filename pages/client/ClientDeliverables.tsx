import React, { useState } from 'react'
import {
  FileText,
  Video,
  Image,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Clock,
  Eye,
  History,
} from 'lucide-react'
import { cn } from '../../utils'

interface Revision {
  version: string
  status: string
  date: string
  notes: string
}

interface Deliverable {
  id: number
  name: string
  project: string
  type: 'Video' | 'PDF' | 'Image'
  version: string
  status: 'Pending Review' | 'Approved' | 'Needs Revision'
  date: string
  description: string
  revisions: Revision[]
}

const deliverables: Deliverable[] = [
  {
    id: 1,
    name: 'Rough Cut - Summer Campaign',
    project: 'Summer Campaign 2024',
    type: 'Video',
    version: 'V3',
    status: 'Pending Review',
    date: 'Oct 15',
    description: 'Third revision of the rough cut incorporating feedback on pacing and color grading.',
    revisions: [
      { version: 'V1', status: 'Needs Revision', date: 'Oct 01', notes: 'Pacing too slow, color grade needs adjustment' },
      { version: 'V2', status: 'Needs Revision', date: 'Oct 08', notes: 'Improved pacing, but audio levels inconsistent' },
      { version: 'V3', status: 'Pending Review', date: 'Oct 15', notes: 'Addressed all feedback' },
    ],
  },
  {
    id: 2,
    name: 'Storyboard - Social Shorts',
    project: 'Social Media Shorts',
    type: 'PDF',
    version: 'V2',
    status: 'Pending Review',
    date: 'Oct 12',
    description: 'Updated storyboard with revised shot list and transitions.',
    revisions: [
      { version: 'V1', status: 'Needs Revision', date: 'Oct 05', notes: 'Add more establishing shots' },
      { version: 'V2', status: 'Pending Review', date: 'Oct 12', notes: 'Expanded shot list as requested' },
    ],
  },
  {
    id: 3,
    name: 'Moodboard Final',
    project: 'Social Media Shorts',
    type: 'PDF',
    version: 'V1',
    status: 'Approved',
    date: 'Oct 08',
    description: 'Final moodboard with approved color palette and visual references.',
    revisions: [
      { version: 'V1', status: 'Approved', date: 'Oct 08', notes: 'Approved by client' },
    ],
  },
  {
    id: 4,
    name: 'Product Hero Shot',
    project: 'Product Launch Video',
    type: 'Image',
    version: 'V2',
    status: 'Approved',
    date: 'Oct 05',
    description: 'High-resolution product hero image for the campaign.',
    revisions: [
      { version: 'V1', status: 'Needs Revision', date: 'Sep 28', notes: 'Adjust lighting and background' },
      { version: 'V2', status: 'Approved', date: 'Oct 05', notes: 'Final version approved' },
    ],
  },
  {
    id: 5,
    name: 'Casting Tape - Lead Role',
    project: 'Summer Campaign 2024',
    type: 'Video',
    version: 'V1',
    status: 'Needs Revision',
    date: 'Oct 10',
    description: 'Audition tape for the lead role in the summer campaign.',
    revisions: [
      { version: 'V1', status: 'Needs Revision', date: 'Oct 10', notes: 'Request additional takes with different wardrobe' },
    ],
  },
  {
    id: 6,
    name: 'Location Scouting Photos',
    project: 'Summer Campaign 2024',
    type: 'Image',
    version: 'V2',
    status: 'Approved',
    date: 'Oct 02',
    description: 'Location scouting photographs for principal photography.',
    revisions: [
      { version: 'V1', status: 'Needs Revision', date: 'Sep 25', notes: 'Need more outdoor options' },
      { version: 'V2', status: 'Approved', date: 'Oct 02', notes: 'Locations approved' },
    ],
  },
]

const typeIcon: Record<string, React.ReactNode> = {
  Video: <Video className="w-4 h-4" />,
  PDF: <FileText className="w-4 h-4" />,
  Image: <Image className="w-4 h-4" />,
}

const typeColor: Record<string, string> = {
  Video: 'bg-purple-50 text-purple-600',
  PDF: 'bg-blue-50 text-blue-600',
  Image: 'bg-emerald-50 text-emerald-600',
}

const statusColor: Record<string, string> = {
  'Pending Review': 'bg-amber-50 text-amber-700',
  Approved: 'bg-emerald-50 text-emerald-700',
  'Needs Revision': 'bg-red-50 text-red-700',
}

const statusIcon: Record<string, React.ReactNode> = {
  'Pending Review': <Clock className="w-3.5 h-3.5" />,
  Approved: <CheckCircle2 className="w-3.5 h-3.5" />,
  'Needs Revision': <AlertCircle className="w-3.5 h-3.5" />,
}

export function ClientDeliverables() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [commentText, setCommentText] = useState('')
  const [showCommentField, setShowCommentField] = useState<number | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('All')

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
    setShowCommentField(null)
    setCommentText('')
  }

  const filtered = filterStatus === 'All' ? deliverables : deliverables.filter((d) => d.status === filterStatus)

  const stats = {
    pending: deliverables.filter((d) => d.status === 'Pending Review').length,
    approved: deliverables.filter((d) => d.status === 'Approved').filter((d) => {
      const dDate = new Date(d.date + ', 2024')
      const now = new Date()
      return dDate.getMonth() === now.getMonth()
    }).length,
    rejected: deliverables.filter((d) => d.status === 'Needs Revision').length,
  }

  const handleApprove = (id: number) => {
    alert(`Deliverable #${id} approved${commentText ? ' with comment.' : '.'}`)
    setExpandedId(null)
    setCommentText('')
    setShowCommentField(null)
  }

  const handleReject = (id: number) => {
    if (!commentText.trim()) {
      alert('Please provide a comment explaining what needs revision.')
      return
    }
    alert(`Deliverable #${id} sent back for revision with your feedback.`)
    setExpandedId(null)
    setCommentText('')
    setShowCommentField(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Deliverables &amp; Approvals</h2>
          <p className="text-slate-500 mt-1">Review, approve, or request revisions on deliverables.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500">Pending Review</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Clock className="w-4 h-4" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500">Approved This Month</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 className="w-4 h-4" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500">Needs Revision</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><XCircle className="w-4 h-4" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.rejected}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {['All', 'Pending Review', 'Approved', 'Needs Revision'].map((f) => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
              filterStatus === f
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((del) => {
          const isExpanded = expandedId === del.id
          return (
            <div key={del.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                onClick={() => toggleExpand(del.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={cn('p-2 rounded-lg shrink-0', typeColor[del.type])}>
                      {typeIcon[del.type]}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-slate-900 truncate">{del.name}</h4>
                      <p className="text-sm text-slate-500">{del.project} &middot; v{del.version}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1', statusColor[del.status])}>
                      {statusIcon[del.status]} {del.status}
                    </span>
                    <span className="text-xs text-slate-400">{del.date}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-200 p-5 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className={cn('p-4 rounded-xl shrink-0', typeColor[del.type])}>
                      {del.type === 'Video' ? <Video className="w-10 h-10" /> : del.type === 'PDF' ? <FileText className="w-10 h-10" /> : <Image className="w-10 h-10" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-600 mb-3">{del.description}</p>
                      <div className="flex items-center gap-3">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                          <Eye className="w-4 h-4" /> Preview
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                          <Download className="w-4 h-4" /> Download
                        </button>
                      </div>
                    </div>
                  </div>

                  {del.revisions.length > 1 && (
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2"><History className="w-4 h-4" /> Revision History</h5>
                      <div className="space-y-1.5">
                        {[...del.revisions].reverse().map((rev) => (
                          <div key={rev.version} className="flex items-center justify-between text-sm bg-slate-50 rounded-lg px-3 py-2">
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-slate-900">{rev.version}</span>
                              <span className="text-slate-400">&mdash;</span>
                              <span className="text-slate-500">{rev.notes}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', statusColor[rev.status])}>{rev.status}</span>
                              <span className="text-xs text-slate-400">{rev.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-200">
                    {del.status === 'Pending Review' && (
                      <>
                        <button
                          onClick={() => handleApprove(del.id)}
                          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Approve
                        </button>
                        <button
                          onClick={() => setShowCommentField(showCommentField === del.id ? null : del.id)}
                          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="w-4 h-4" /> Request Revision
                        </button>
                      </>
                    )}
                  </div>

                  {showCommentField === del.id && (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-slate-400 mt-2 shrink-0" />
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Describe what needs to be revised..."
                          rows={3}
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => { setShowCommentField(null); setCommentText('') }}
                          className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleReject(del.id)}
                          className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Send Feedback
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
