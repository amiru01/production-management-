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
} from 'lucide-react'
import { cn } from '../../utils'

const folders = [
  { id: 'footage', label: 'Footage', icon: FileVideo, count: 128, size: '256 GB', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { id: 'photos', label: 'Photos', icon: FileImage, count: 342, size: '48 GB', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { id: 'audio', label: 'Audio', icon: FileAudio, count: 89, size: '12 GB', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  { id: 'graphics', label: 'Graphics', icon: FileImage, count: 56, size: '8 GB', color: 'bg-amber-50 text-amber-600 border-amber-200' },
  { id: 'documents', label: 'Documents', icon: FileText, count: 34, size: '256 MB', color: 'bg-rose-50 text-rose-600 border-rose-200' },
  { id: 'edits', label: 'Edits', icon: Film, count: 21, size: '420 GB', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
]

const fileData: Record<string, Array<{ name: string; type: string; project: string; uploadedBy: string; date: string; size: string }>> = {
  footage: [
    { name: 'Nike_Shoot_Day1.mov', type: 'Video', project: 'Nike Summer', uploadedBy: 'Elena R.', date: 'Jun 5', size: '24.5 GB' },
    { name: 'Nike_Shoot_Day2.mov', type: 'Video', project: 'Nike Summer', uploadedBy: 'David K.', date: 'Jun 6', size: '31.2 GB' },
    { name: 'TechCorp_Broll.mp4', type: 'Video', project: 'TechCorp Launch', uploadedBy: 'Sarah J.', date: 'Jun 3', size: '8.7 GB' },
    { name: 'Spotify_Interview_ProRes.mov', type: 'Video', project: 'Spotify Spotlight', uploadedBy: 'Mike T.', date: 'Jun 1', size: '45.0 GB' },
    { name: 'LocalCoffee_A_Roll.mp4', type: 'Video', project: 'Local Coffee', uploadedBy: 'Elena R.', date: 'May 28', size: '12.3 GB' },
  ],
  photos: [
    { name: 'Nike_Location_Scout_01.jpg', type: 'Image', project: 'Nike Summer', uploadedBy: 'Anna P.', date: 'Jun 4', size: '8.2 MB' },
    { name: 'TechCorp_Product_Shots.zip', type: 'Archive', project: 'TechCorp Launch', uploadedBy: 'Marcus C.', date: 'Jun 2', size: '156 MB' },
    { name: 'Spotify_BTS_Photos.zip', type: 'Archive', project: 'Spotify Spotlight', uploadedBy: 'Tom S.', date: 'May 30', size: '342 MB' },
  ],
  audio: [
    { name: 'Nike_VO_Take1.wav', type: 'Audio', project: 'Nike Summer', uploadedBy: 'Mike T.', date: 'Jun 7', size: '245 MB' },
    { name: 'Spotify_Narration_Final.wav', type: 'Audio', project: 'Spotify Spotlight', uploadedBy: 'Sarah J.', date: 'Jun 4', size: '512 MB' },
    { name: 'LocalCoffee_Ambient.wav', type: 'Audio', project: 'Local Coffee', uploadedBy: 'Mike T.', date: 'May 25', size: '89 MB' },
  ],
  graphics: [
    { name: 'Nike_Logo_Animation.mov', type: 'Motion', project: 'Nike Summer', uploadedBy: 'Lisa M.', date: 'Jun 6', size: '1.2 GB' },
    { name: 'TechCorp_Slides.pptx', type: 'Presentation', project: 'TechCorp Launch', uploadedBy: 'Marcus C.', date: 'Jun 1', size: '45 MB' },
    { name: 'Spotify_Thumbnails.psd', type: 'PSD', project: 'Spotify Spotlight', uploadedBy: 'Sarah J.', date: 'May 29', size: '212 MB' },
  ],
  documents: [
    { name: 'Nike_Call_Sheet_Day1.pdf', type: 'PDF', project: 'Nike Summer', uploadedBy: 'Elena R.', date: 'Jun 5', size: '2.4 MB' },
    { name: 'TechCorp_Script_V3.docx', type: 'Document', project: 'TechCorp Launch', uploadedBy: 'Marcus C.', date: 'Jun 2', size: '1.8 MB' },
    { name: 'Spotify_Run_of_Show.pdf', type: 'PDF', project: 'Spotify Spotlight', uploadedBy: 'Elena R.', date: 'May 28', size: '3.1 MB' },
  ],
  edits: [
    { name: 'Nike_Summer_Rough_Cut.mov', type: 'Video', project: 'Nike Summer', uploadedBy: 'Sarah J.', date: 'Jun 7', size: '156 GB' },
    { name: 'Spotify_Doc_Assembly.mov', type: 'Video', project: 'Spotify Spotlight', uploadedBy: 'Sarah J.', date: 'Jun 5', size: '89 GB' },
    { name: 'LocalCoffee_Final_Cut.mov', type: 'Video', project: 'Local Coffee', uploadedBy: 'David K.', date: 'Jun 2', size: '45 GB' },
  ],
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

  const currentFiles = activeFolder ? fileData[activeFolder] || [] : []
  const filteredFiles = currentFiles.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalAssets = Object.values(fileData).flat().length
  const thisWeekUploads = Object.values(fileData).flat().filter((f) =>
    f.date.startsWith('Jun 5') || f.date.startsWith('Jun 6') || f.date.startsWith('Jun 7')
  ).length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Asset Library</h2>
          <p className="text-slate-500">Browse, upload, and manage production assets.</p>
        </div>
        <button className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
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
            <p className="text-2xl font-bold text-slate-900">745 GB</p>
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
                          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Download className="w-4 h-4" /></button>
                          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Share2 className="w-4 h-4" /></button>
                          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><MoreHorizontal className="w-4 h-4" /></button>
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
    </div>
  )
}
