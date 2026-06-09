import React, { useState } from 'react'
import {
  MessageSquare,
  Send,
  Paperclip,
  Search,
  MoreHorizontal,
  CheckCheck,
  Check,
  Briefcase,
  Video,
  Camera,
  Headphones,
  Lightbulb,
  Users,
} from 'lucide-react'
import { cn } from '../../utils'
import { useStore } from '../../store/AppStore'

interface Message {
  id: number
  sender: 'me' | 'contact'
  text: string
  time: string
  status?: 'sent' | 'delivered' | 'read'
  attachment?: { name: string; size: string }
}

interface Contact {
  id: number
  name: string
  role: string
  avatar: string
  project: string
  lastMessage: string
  time: string
  unread: number
  online: boolean
  messages: Message[]
}

const roleIcon: Record<string, React.ReactNode> = {
  Director: <Video className="w-3.5 h-3.5" />,
  DP: <Camera className="w-3.5 h-3.5" />,
  'Sound Engineer': <Headphones className="w-3.5 h-3.5" />,
  Gaffer: <Lightbulb className="w-3.5 h-3.5" />,
  PA: <Briefcase className="w-3.5 h-3.5" />,
}

export function CrewMessages() {
  const { conversations: storeConversations, sendMessage: storeSendMessage } = useStore()
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set(['Summer Campaign']))

  const crewOnly = storeConversations.filter(c => {
    if (c.role === 'Super Admin' || c.role === 'Studio Admin') return false
    if (c.role === 'Accountant') return false
    if (c.role?.startsWith('Client')) return false
    return true
  })

  const conversations: Contact[] = crewOnly.map(c => ({
    id: c.id,
    name: c.name,
    role: c.role,
    avatar: c.avatar,
    project: c.project || 'All Projects',
    lastMessage: c.lastMessage,
    time: c.time,
    unread: c.unread,
    online: c.online,
    messages: c.messages.map(m => ({
      id: m.id,
      sender: m.isMe ? 'me' as const : 'contact' as const,
      text: m.text,
      time: m.time,
      status: (m.isMe ? 'sent' : undefined) as 'sent' | undefined,
    })),
  }))

  const [activeContactId, setActiveContactId] = useState<number>(conversations[0]?.id || 0)
  const activeContact = conversations.find((c) => c.id === activeContactId)

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const crewByProject = filteredConversations.reduce((acc, contact) => {
    const projectKey = contact.project
    if (!acc[projectKey]) acc[projectKey] = []
    acc[projectKey].push(contact)
    return acc
  }, {} as Record<string, Contact[]>)

  const toggleProject = (project: string) => {
    setExpandedProjects(prev => {
      const next = new Set(prev)
      if (next.has(project)) next.delete(project)
      else next.add(project)
      return next
    })
  }

  const handleSend = () => {
    if (!messageInput.trim() || !activeContact) return
    storeSendMessage(activeContact.id, messageInput)
    setMessageInput('')
  }

  const handleAttachment = () => {
    alert('File attachment dialog would open here.')
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'read':
        return <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
      case 'delivered':
        return <CheckCheck className="w-3.5 h-3.5 text-slate-400" />
      default:
        return <Check className="w-3.5 h-3.5 text-slate-400" />
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex">
        <div className="w-80 border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-emerald-600" /> Team Chat
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search team members..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {searchQuery ? (
              filteredConversations.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setActiveContactId(contact.id)}
                  className={cn(
                    'w-full text-left p-4 hover:bg-slate-50 transition-colors',
                    activeContactId === contact.id && 'bg-emerald-50/50'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
                        {contact.avatar}
                      </div>
                      {contact.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-sm font-semibold text-slate-900 truncate">{contact.name}</h4>
                        <span className="text-xs text-slate-400 shrink-0">{contact.time}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                        {roleIcon[contact.role] || <Briefcase className="w-3.5 h-3.5" />}
                        <span>{contact.role}</span>
                        <span className="text-slate-300">&middot;</span>
                        <span>{contact.project}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-500 truncate flex-1">{contact.lastMessage}</p>
                        {contact.unread > 0 && (
                          <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shrink-0">
                            {contact.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              Object.entries(crewByProject).map(([project, contacts]) => (
                <div key={project}>
                  <button
                    onClick={() => toggleProject(project)}
                    className="w-full px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <Users className="w-3.5 h-3.5" />
                      <span>{project}</span>
                      <span className="text-slate-300">({contacts.length})</span>
                    </div>
                    <svg
                      className={cn('w-3.5 h-3.5 text-slate-400 transition-transform', expandedProjects.has(project) && 'rotate-180')}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedProjects.has(project) && contacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => setActiveContactId(contact.id)}
                      className={cn(
                        'w-full text-left p-4 hover:bg-slate-50 transition-colors border-b border-slate-50',
                        activeContactId === contact.id && 'bg-emerald-50/50'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
                            {contact.avatar}
                          </div>
                          {contact.online && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h4 className="text-sm font-semibold text-slate-900 truncate">{contact.name}</h4>
                            <span className="text-xs text-slate-400 shrink-0">{contact.time}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                            {roleIcon[contact.role] || <Briefcase className="w-3.5 h-3.5" />}
                            <span>{contact.role}</span>
                            <span className="text-slate-300">&middot;</span>
                            <span>{contact.project}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-slate-500 truncate flex-1">{contact.lastMessage}</p>
                            {contact.unread > 0 && (
                              <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shrink-0">
                                {contact.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {activeContact ? (
            <>
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
                    {activeContact.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{activeContact.name}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      {roleIcon[activeContact.role] || <Briefcase className="w-3.5 h-3.5" />}
                      <span>{activeContact.role}</span>
                      <span className="text-slate-300">&middot;</span>
                      <span>{activeContact.project}</span>
                      <span className={cn('w-1.5 h-1.5 rounded-full', activeContact.online ? 'bg-emerald-500' : 'bg-slate-300')} />
                      <span>{activeContact.online ? 'Online' : 'Offline'}</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeContact.messages.map((msg) => (
                  <div key={msg.id} className={cn('flex', msg.sender === 'me' ? 'justify-end' : 'justify-start')}>
                    <div className={cn('max-w-[70%] space-y-1', msg.sender === 'me' && 'items-end')}>
                      {msg.sender === 'contact' && (
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[8px] font-bold">
                            {activeContact.avatar}
                          </div>
                          <span className="text-[10px] font-medium text-slate-400">{activeContact.name}</span>
                        </div>
                      )}
                      <div
                        className={cn(
                          'rounded-2xl px-4 py-2.5 text-sm',
                          msg.sender === 'me'
                            ? 'bg-emerald-600 text-white rounded-br-md'
                            : 'bg-slate-100 text-slate-900 rounded-bl-md'
                        )}
                      >
                        <p>{msg.text}</p>
                        {msg.attachment && (
                          <div className={cn('mt-2 flex items-center gap-2 p-2 rounded-lg', msg.sender === 'me' ? 'bg-emerald-500' : 'bg-slate-200')}>
                            <Paperclip className="w-3.5 h-3.5 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-medium truncate">{msg.attachment.name}</p>
                              <p className="text-[10px] opacity-70">{msg.attachment.size}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className={cn('flex items-center gap-1 px-1', msg.sender === 'me' ? 'justify-end' : 'justify-start')}>
                        <span className="text-[10px] text-slate-400">{msg.time}</span>
                        {msg.sender === 'me' && msg.status && getStatusIcon(msg.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                <div className="flex items-end gap-2">
                  <button
                    onClick={handleAttachment}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                    title="Attach file"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1">
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder={`Message ${activeContact.name}...`}
                      rows={1}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSend()
                        }
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!messageInput.trim()}
                    className={cn(
                      'p-2.5 rounded-lg transition-colors shrink-0',
                      messageInput.trim()
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    )}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-medium">Select a team member</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
