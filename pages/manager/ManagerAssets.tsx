import React, { useState } from 'react'
import {
  Folder,
  FileImage,
  FileAudio,
  FileVideo,
  FileText,
  Film,
  Search,
  Upload,
  Download,
  Share2,
  MoreHorizontal,
  HardDrive,
  Clock,
  BarChart3,
  X,
} from 'lucide-react'
import { cn } from '../../utils'
import { useStore } from '../../store/AppStore'

const folderMeta: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  footage: { label: 'Footage', icon: FileVideo, color: 'bg-blue-50 text-blue-600 border-blue-200' },
  photos: { label: 'Photos', icon: FileImage, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  audio: { label: 'Audio', icon: FileAudio, color: 'bg-purple-50 text-purple-600 border-purple-200' },
  graphics: { label: 'Graphics', icon: FileImage, color: 'bg-amber-50 text-amber-600 border-amber-200' },
  documents: { label: 'Documents', icon: FileText, color: 'bg-rose-50 text-rose-600 border-rose-200' },
  edits: { label: 'Edits', icon: Film, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
}

const assetTypeIcons: Record<string, React.ElementType> = {
  Video: FileVideo,
  Image: FileImage,
  Audio: FileAudio,
  Archive: FileImage,
  Motion: Film,
  Presentation: FileText,
  PSD: FileImage,
  PDF: FileText,
  Document: FileText,
}

export function ManagerAssets() {
  const [activeFolder, setActiveFolder] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'Video', project: '', folder: 'footage' })
  const { assets, addAsset, deleteAsset } = useStore()

  const folders = Object.entries(folderMeta).map(([id, meta]) => {
    const files = assets[id] || []
    const totalSize = files.reduce((acc, f) => {
      const match = f.size.match(/^([\d.]+)\s*(GB|MB|KB|B)/)
      if (!match) return acc
      const num = parseFloat(match[1])
      const unit = match[2]
      const bytes = unit === 'GB' ? num * 1024 * 1024 * 1024 : unit === 'MB' ? num * 1024 * 1024 : unit === 'KB' ? num * 1024 : num
      return acc + bytes
    }, 0)
    const sizeStr = totalSize > 1024 * 1024 * 1024 ? `${(totalSize / (1024 * 1024 * 1024)).toFixed(1)} GB` : totalSize > 1024 * 1024 ? `${(totalSize / (1024 * 1024)).toFixed(1)} MB` : `${(totalSize / 1024).toFixed(0)} KB`
    return { id, ...meta, count: files.length, size: files.length > 0 ? sizeStr : '0 B' }
  })

  const currentFiles = activeFolder ? assets[activeFolder] || [] : []
  const filteredFiles = currentFiles.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalAssets = Object.values(assets).flat().length
  const thisWeekUploads = Object.values(assets).flat().filter((f) =>
    f.date.startsWith('Jun 5') || f.date.startsWith('Jun 6') || f.date.startsWith('Jun 7')
  ).length

  const allSizes = Object.values(assets).flat().reduce((acc, f) => {
    const match = f.size.match(/^([\d.]+)\s*(GB|MB|KB|B)/)
    if (!match) return acc
    const num = parseFloat(match[1])
    const unit = match[2]
    return acc + (unit === 'GB' ? num * 1024 * 1024 * 1024 : unit === 'MB' ? num * 1024 * 1024 : unit === 'KB' ? num * 1024 : num)
  }, 0)
  const storageUsed = allSizes > 1024 * 1024 * 1024 ? `${(allSizes / (1024 * 1024 * 1024)).toFixed(0)} GB` : `${(allSizes / (1024 * 1024)).toFixed(0)} MB`

  const openUploadModal = () => {
    setForm({ name: '', type: 'Video', project: '', folder: 'footage' })
    setShowModal(true)
  }

  const handleUpload = () => {
    if (!form.name.trim()) return
    addAsset(form.folder, { name: form.name, type: form.type, project: form.project, uploadedBy: 'Current User', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), size: '0 B' })
    setShowModal(false)
  }

  const handleDelete = (folder: string, name: string) => {
    if (confirm(`Delete ${name}?`)) deleteAsset(folder, name)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Asset Library</h2>
          <p className="text-slate-500">Browse, upload, and manage production assets.</p>
        </div>
        <button onClick={openUploadModal} className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
          <Upload className="w-4 h-4" /> Upload Asset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><BarChart3 className="w-5 h-5" /></div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{totalAssets}</p>
            <p className="text-sm text-slate-500">Total Assets</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><Clock className="w-5 h-5" /></div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{thisWeekUploads}</p>
            <p className="text-sm text-slate-500">This Week Uploads</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg"><HardDrive className="w-5 h-5" /></div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{storageUsed}</p>
            <p className="text-sm text-slate-500">Storage Used</p>
          </div>
        </div>
      </div>

      {!activeFolder ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => setActiveFolder(folder.id)}
              className={cn('bg-white rounded-xl border-2 p-5 shadow-sm hover:shadow-md transition-all text-left group', folder.color)}
            >
              <div className={cn('p-3 rounded-xl w-fit mb-4', folder.color.replace('border-', 'bg-').replace('text-', 'text-'))}>
                <folder.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 text-lg">{folder.label}</h3>
              <div className="flex items-center justify-between mt-2 text-sm text-slate-500">
                <span>{folder.count} files</span>
                <span>{folder.size}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setActiveFolder(null); setSearchQuery('') }}
                className="text-sm text-slate-500 hover:text-slate-700 font-medium flex items-center gap-1"
              >
                <Folder className="w-4 h-4" /> All Folders
              </button>
              <span className="text-slate-300">/</span>
              <span className="font-semibold text-slate-900 text-sm capitalize">{activeFolder}</span>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970] w-56"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Uploaded By</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFiles.map((file, i) => {
                  const Icon = assetTypeIcons[file.type] || FileText
                  return (
                    <tr key={i} className="text-sm hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500"><Icon className="w-4 h-4" /></div>
                          <span className="font-medium text-slate-900">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{file.type}</td>
                      <td className="px-4 py-3 text-slate-600">{file.project}</td>
                      <td className="px-4 py-3 text-slate-600">{file.uploadedBy}</td>
                      <td className="px-4 py-3 text-slate-500">{file.date}</td>
                      <td className="px-4 py-3 text-slate-500">{file.size}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => alert(`Downloading: ${file.name}`)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Download className="w-4 h-4" /></button>
                          <button onClick={() => alert(`Share: ${file.name}`)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Share2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(activeFolder!, file.name)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><MoreHorizontal className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {filteredFiles.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No files found</p>
              <p className="text-sm">Try a different search or folder.</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Upload Asset</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">File Name</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]" placeholder="e.g. filename.mov" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]">
                  <option value="Video">Video</option>
                  <option value="Audio">Audio</option>
                  <option value="Image">Image</option>
                  <option value="Document">Document</option>
                  <option value="Archive">Archive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project</label>
                <input type="text" value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]" placeholder="Project name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Folder</label>
                <select value={form.folder} onChange={e => setForm(f => ({ ...f, folder: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#191970]/20 focus:border-[#191970]">
                  {Object.entries(folderMeta).map(([id, meta]) => <option key={id} value={id}>{meta.label}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleUpload} className="px-4 py-2 text-sm font-medium text-white bg-[#191970] hover:bg-[#121258] rounded-lg transition-colors">Upload</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
