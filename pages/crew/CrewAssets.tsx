import React, { useState } from 'react'
import {
  UploadCloud,
  FileVideo,
  FileAudio,
  FileImage,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Download,
  RefreshCw,
} from 'lucide-react'
import { cn } from '../../utils'

type FileStatus = 'Uploading' | 'Uploaded' | 'Failed'
type FileType = 'Video' | 'Audio' | 'Photo' | 'Document'
type FeedbackStatus = 'Pending Review' | 'Approved' | 'Needs Revision'

interface AssetFile {
  id: number
  name: string
  type: FileType
  project: string
  uploadedAt: string
  status: FileStatus
  size: string
  version: number
  feedbackStatus: FeedbackStatus
  feedback?: { from: string; comment: string; date: string }[]
}

const initialFiles: AssetFile[] = [
  { id: 1, name: 'Nike_Summer_BRoll_01.mp4', type: 'Video', project: 'Nike Summer Campaign', uploadedAt: 'Oct 12, 2023', status: 'Uploaded', size: '2.4 GB', version: 1, feedbackStatus: 'Approved', feedback: [{ from: 'Director', comment: 'Great coverage, love the lighting.', date: 'Oct 13' }] },
  { id: 2, name: 'TechCorp_Launch_Interview.wav', type: 'Audio', project: 'TechCorp Launch', uploadedAt: 'Oct 11, 2023', status: 'Uploaded', size: '845 MB', version: 2, feedbackStatus: 'Needs Revision', feedback: [{ from: 'Client', comment: 'Please re-record the intro, audio levels are off.', date: 'Oct 12' }] },
  { id: 3, name: 'LocalCoffee_BehindScenes.jpg', type: 'Photo', project: 'Local Coffee', uploadedAt: 'Oct 10, 2023', status: 'Uploaded', size: '12 MB', version: 1, feedbackStatus: 'Pending Review' },
  { id: 4, name: 'Adidas_Promo_Storyboard.pdf', type: 'Document', project: 'Adidas Winter Promo', uploadedAt: 'Oct 09, 2023', status: 'Uploaded', size: '4.2 MB', version: 3, feedbackStatus: 'Approved', feedback: [{ from: 'Manager', comment: 'Final version looks solid. Proceed.', date: 'Oct 10' }] },
  { id: 5, name: 'Spotify_Spotlight_BTS.mp4', type: 'Video', project: 'Spotify Spotlight', uploadedAt: 'Oct 08, 2023', status: 'Failed', size: '1.8 GB', version: 1, feedbackStatus: 'Pending Review' },
  { id: 6, name: 'Nike_Summer_Aerials.mp4', type: 'Video', project: 'Nike Summer Campaign', uploadedAt: 'Oct 07, 2023', status: 'Uploaded', size: '3.1 GB', version: 2, feedbackStatus: 'Needs Revision', feedback: [{ from: 'Director', comment: 'Add more dynamic shots of the city skyline.', date: 'Oct 09' }] },
]

const fileTypeIcons: Record<FileType, any> = {
  Video: FileVideo,
  Audio: FileAudio,
  Photo: FileImage,
  Document: FileText,
}

const feedbackStatusStyles: Record<FeedbackStatus, { icon: any; color: string; bg: string }> = {
  'Pending Review': { icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50' },
  'Approved': { icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50' },
  'Needs Revision': { icon: RefreshCw, color: 'text-rose-700', bg: 'bg-rose-50' },
}

const fileTypeFilters: FileType[] = ['Video', 'Audio', 'Photo', 'Document']

export function CrewAssets() {
  const [files, setFiles] = useState<AssetFile[]>(initialFiles)
  const [dragOver, setDragOver] = useState(false)
  const [typeFilter, setTypeFilter] = useState<FileType | 'All'>('All')
  const [uploadingFile, setUploadingFile] = useState<string | null>(null)

  const simulateUpload = (name: string) => {
    setUploadingFile(name)
    const newFile: AssetFile = {
      id: Date.now(),
      name,
      type: 'Video' as FileType,
      project: 'Nike Summer Campaign',
      uploadedAt: 'Just now',
      status: 'Uploading',
      size: '0 MB',
      version: 1,
      feedbackStatus: 'Pending Review',
    }
    setFiles(prev => [newFile, ...prev])
    setTimeout(() => {
      setFiles(prev => prev.map(f => f.id === newFile.id ? { ...f, status: 'Uploaded' as FileStatus, size: '1.2 GB' } : f))
      setUploadingFile(null)
    }, 2500)
  }

  const incrementVersion = (id: number) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, version: f.version + 1, status: 'Uploaded', feedbackStatus: 'Pending Review', feedback: [] } : f))
  }

  const submitForReview = (id: number) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, feedbackStatus: 'Pending Review' } : f))
  }

  const filteredFiles = typeFilter === 'All' ? files : files.filter(f => f.type === typeFilter)

  const stats = {
    total: files.length,
    pendingReview: files.filter(f => f.feedbackStatus === 'Pending Review' || f.feedbackStatus === 'Needs Revision').length,
    approved: files.filter(f => f.feedbackStatus === 'Approved').length,
    needsRevision: files.filter(f => f.feedbackStatus === 'Needs Revision').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Assets</h2>
          <p className="text-slate-500">Upload, manage, and review production files.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-500">Total Uploads</span>
            <UploadCloud className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-500">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{stats.pendingReview}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-500">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{stats.approved}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-500">Needs Revision</span>
            <RefreshCw className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600">{stats.needsRevision}</div>
        </div>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); simulateUpload('Dropped_File.mp4') }}
        className={cn(
          'border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer',
          dragOver ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-300 hover:border-slate-400 bg-white'
        )}
        onClick={() => simulateUpload('New_Upload_Asset.mp4')}
      >
        <UploadCloud className={cn('w-10 h-10 mx-auto mb-3 transition-colors', dragOver ? 'text-emerald-500' : 'text-slate-400')} />
        <p className="text-sm font-medium text-slate-700 mb-1">Drag & drop files here, or click to browse</p>
        <p className="text-xs text-slate-400">Supports MP4, MOV, WAV, JPG, PNG, PDF up to 10GB</p>
        <div className="flex items-center justify-center gap-3 mt-4">
          {fileTypeFilters.map((ft) => {
            const Icon = fileTypeIcons[ft]
            return (
              <span key={ft} className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                <Icon className="w-3 h-3" /> {ft}
              </span>
            )
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2"><UploadCloud className="w-4 h-4 text-emerald-600" /> All Files</h3>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
            {(['All', ...fileTypeFilters] as (FileType | 'All')[]).map((ft) => (
              <button
                key={ft}
                onClick={() => setTypeFilter(ft)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium transition-all',
                  typeFilter === ft ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                )}
              >
                {ft === 'All' ? 'All' : ft}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">File</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Project</th>
                <th className="p-4 font-medium">Uploaded</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Size</th>
                <th className="p-4 font-medium">Version</th>
                <th className="p-4 font-medium">Feedback</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredFiles.map((file) => {
                const TypeIcon = fileTypeIcons[file.type]
                const fbStyle = feedbackStatusStyles[file.feedbackStatus]
                const FeedbackIcon = fbStyle.icon
                return (
                  <tr key={file.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center',
                          file.type === 'Video' && 'bg-blue-50', file.type === 'Audio' && 'bg-purple-50',
                          file.type === 'Photo' && 'bg-green-50', file.type === 'Document' && 'bg-amber-50'
                        )}>
                          <TypeIcon className="w-4 h-4 text-slate-600" />
                        </div>
                        <div className="font-medium text-slate-900 text-sm truncate max-w-[200px]">{file.name}</div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{file.type}</td>
                    <td className="p-4 text-sm text-slate-600">{file.project}</td>
                    <td className="p-4 text-sm text-slate-600">{file.uploadedAt}</td>
                    <td className="p-4">
                      <div className={cn(
                        'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                        file.status === 'Uploaded' && 'text-emerald-700 bg-emerald-50',
                        file.status === 'Uploading' && 'text-blue-700 bg-blue-50',
                        file.status === 'Failed' && 'text-rose-700 bg-rose-50'
                      )}>
                        {file.status === 'Uploading' && <RefreshCw className="w-3 h-3 animate-spin" />}
                        {file.status === 'Failed' && <AlertCircle className="w-3 h-3" />}
                        {file.status === 'Uploaded' && <CheckCircle2 className="w-3 h-3" />}
                        {file.status}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 font-mono">{file.size}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: file.version }, (_, i) => (
                          <span key={i} className={cn(
                            'text-xs font-mono px-1.5 py-0.5 rounded',
                            i === file.version - 1 ? 'bg-amber-100 text-amber-800 font-semibold' : 'bg-slate-100 text-slate-500'
                          )}>V{i + 1}</span>
                        ))}
                        <button onClick={() => incrementVersion(file.id)} className="ml-1 text-xs text-slate-400 hover:text-slate-600 p-0.5 rounded">
                          <UploadCloud className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full', fbStyle.bg, fbStyle.color)}>
                        <FeedbackIcon className="w-3 h-3" />
                        {file.feedbackStatus}
                      </div>
                      {file.feedback && file.feedback.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {file.feedback.map((fb, i) => (
                            <div key={i} className="text-xs text-slate-500 bg-slate-50 p-2 rounded-md border border-slate-100">
                              <span className="font-medium text-slate-700">{fb.from}:</span> "{fb.comment}"
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {file.status === 'Uploaded' && (
                          <>
                            <button onClick={() => submitForReview(file.id)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Submit for Review">
                              <Send className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download">
                              <Download className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {file.status === 'Failed' && (
                          <button onClick={() => incrementVersion(file.id)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Retry">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
          <span>Showing {filteredFiles.length} of {files.length} files</span>
        </div>
      </div>
    </div>
  )
}
