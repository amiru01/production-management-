import React, { useState, useEffect } from 'react'
import {
  MessageSquare,
  Send,
  Paperclip,
  Search,
  MoreHorizontal,
  CheckCheck,
  Check,
  Briefcase,
  DollarSign,
  Video,
  Camera,
  Headphones,
  Lightbulb,
  Shield,
  Users,
  UserCheck,
} from 'lucide-react'
import { cn } from '../utils'
import { useStore } from '../store/AppStore'

const API = 'http://localhost:3001/api'

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : {}
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

interface ApiConversation {
  id: number; name: string; role: string; project: string; avatar: string
  lastMessage: string; time: string; unread: number; online: boolean
  messages: { id: number; sender: string; text: string; time: string; isMe: boolean }[]
}

interface Message {
  id: number
  sender: 'me' | 'contact'
  text: string
  time: string
  status?: 'sent' | 'delivered' | 'read'
  attachment?: { name: string; size: string }
}

interface ApiUser {
  id: number; name: string; email: string; role: string; status: string; lastActive: string; avatar: string
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
  category: 'admin' | 'crew' | 'accountant' | 'client'
  conversationId: number | null
}

const roleIcon: Record<string, React.ReactNode> = {
  Producer: <Briefcase className="w-3.5 h-3.5" />,
  'Production Manager': <Briefcase className="w-3.5 h-3.5" />,
  'Project Manager': <Briefcase className="w-3.5 h-3.5" />,
  Accountant: <DollarSign className="w-3.5 h-3.5" />,
  Editor: <Briefcase className="w-3.5 h-3.5" />,
  Director: <Video className="w-3.5 h-3.5" />,
  DP: <Camera className="w-3.5 h-3.5" />,
  'Sound Engineer': <Headphones className="w-3.5 h-3.5" />,
  Gaffer: <Lightbulb className="w-3.5 h-3.5" />,
  PA: <Briefcase className="w-3.5 h-3.5" />,
  'Super Admin': <Shield className="w-3.5 h-3.5" />,
  'Studio Admin': <Shield className="w-3.5 h-3.5" />,
}

const categoryConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  admin: { label: 'Administration', icon: <Shield className="w-3.5 h-3.5" /> },
  crew: { label: 'Crew Members', icon: <Users className="w-3.5 h-3.5" /> },
  accountant: { label: 'Finance', icon: <DollarSign className="w-3.5 h-3.5" /> },
  client: { label: 'Clients', icon: <UserCheck className="w-3.5 h-3.5" /> },
}

export function MessagesPage() {
  const { conversations: storeConversations, sendMessage: storeSendMessage } = useStore()
  const [apiUsers, setApiUsers] = useState<ApiUser[] | null>(null)
  const [apiConversations, setApiConversations] = useState<ApiConversation[] | null>(null)
  const [localMessages, setLocalMessages] = useState<Record<number, Message[]>>({})
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set(['Summer Campaign']))
  const [creatingConv, setCreatingConv] = useState<number | null>(null)

  const useApi = apiConversations !== null && apiUsers !== null

  useEffect(() => {
    const headers = authHeaders()
    if (!headers.Authorization) { setApiUsers([]); setApiConversations([]); return }
    Promise.all([
      fetch(`${API}/messages/users`, { headers }).then(r => r.ok ? r.json() : Promise.reject()),
      fetch(`${API}/messages/conversations`, { headers }).then(r => r.ok ? r.json() : Promise.reject()),
    ])
      .then(([users, convs]) => { setApiUsers(users); setApiConversations(convs) })
      .catch(() => { setApiUsers([]); setApiConversations([]) })
  }, [])

  const conversations: Contact[] = (useApi ? apiUsers! : storeConversations).map(c => {
    const roleStr = 'role' in c ? (c as any).role : ''
    const nameStr = 'name' in c ? (c as any).name : ''
    const avatarStr = 'avatar' in c ? (c as any).avatar : ''
    const userOrStore = c as any

    let category: Contact['category'] = 'crew'
    const r = roleStr.toLowerCase()
    if (r === 'admin') category = 'admin'
    else if (r === 'accountant') category = 'accountant'
    else if (r === 'client') category = 'client'
    else if (r === 'manager') category = 'crew'
    else category = 'crew'

    const matchingConv = useApi
      ? apiConversations!.find(conv => conv.name.toLowerCase() === nameStr.toLowerCase())
      : null

    return {
      id: userOrStore.id,
      name: nameStr,
      role: roleStr,
      avatar: avatarStr || nameStr.split(' ').map((s: string) => s[0]).join('').toUpperCase().slice(0, 2),
      project: matchingConv?.project || (useApi ? 'All Projects' : (userOrStore.project || 'All Projects')),
      lastMessage: matchingConv?.lastMessage || (useApi ? '' : (userOrStore.lastMessage || '')),
      time: matchingConv?.time || (useApi ? '' : (userOrStore.time || '')),
      unread: matchingConv?.unread || 0,
      online: useApi ? (c as ApiUser).status === 'Active' : !!userOrStore.online,
      messages: (matchingConv?.messages || userOrStore.messages || []).map((m: any) => ({
        id: m.id,
        sender: m.isMe ? 'me' as const : 'contact' as const,
        text: m.text,
        time: m.time,
        status: (m.isMe ? 'sent' : undefined) as 'sent' | undefined,
      })),
      category,
      conversationId: matchingConv?.id ?? null,
    }
  })

  const [activeContactId, setActiveContactId] = useState<number>(conversations[0]?.id || 0)

  useEffect(() => {
    if (!useApi || !activeContactId) return
    const contact = conversations.find(c => c.id === activeContactId)
    if (!contact) return
    if (contact.conversationId) {
      const headers = authHeaders()
      fetch(`${API}/messages/conversations/${contact.conversationId}`, { headers })
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => {
          if (data?.messages) {
            setApiConversations(prev => prev ? prev.map(c => c.id === contact.conversationId ? { ...c, messages: data.messages } : c) : prev)
          }
        })
        .catch(() => {})
    }
  }, [activeContactId, useApi])

  const activeContact = conversations.find((c) => c.id === activeContactId) ?? null

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedConversations = filteredConversations.reduce((acc, contact) => {
    const projectKey = contact.project
    if (!acc[projectKey]) acc[projectKey] = []
    acc[projectKey].push(contact)
    return acc
  }, {} as Record<string, Contact[]>)

  const crewByProject = Object.entries(groupedConversations)
    .filter(([_, contacts]) => contacts[0].category === 'crew')
    .sort(([a], [b]) => a.localeCompare(b))

  const adminConversations = filteredConversations.filter(c => c.category === 'admin')
  const accountantConversations = filteredConversations.filter(c => c.category === 'accountant')
  const clientConversations = filteredConversations.filter(c => c.category === 'client')

  const handleSend = async () => {
    if (!messageInput.trim() || !activeContact) return
    const text = messageInput
    setMessageInput('')

    let convId = activeContact.conversationId

    if (useApi && convId === null) {
      setCreatingConv(activeContact.id)
      try {
        const res = await fetch(`${API}/messages/conversations`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ name: activeContact.name, role: activeContact.role, avatar: activeContact.avatar }),
        })
        if (!res.ok) throw new Error()
        const conv = await res.json()
        convId = conv.id
        setApiConversations(prev => prev ? [...prev, { ...conv, project: '', messages: [] }] : prev)
      } catch {
        storeSendMessage(activeContact.id, text)
        setCreatingConv(null)
        return
      }
      setCreatingConv(null)
    }

    if (!(activeContact.id in localMessages)) {
      setLocalMessages((prev) => ({ ...prev, [activeContact.id]: [] }))
    }
    const optimistic = { id: Date.now(), sender: 'me' as const, text, time: formatTime(Date.now()), status: 'sent' as const }
    setLocalMessages((prev) => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || activeContact.messages), optimistic],
    }))
    if (useApi && convId) {
      try {
        const res = await fetch(`${API}/messages/conversations/${convId}/messages`, {
          method: 'POST', headers: authHeaders(), body: JSON.stringify({ text }),
        })
        if (!res.ok) throw new Error()
      } catch {
        storeSendMessage(activeContact.id, text)
      }
    } else {
      storeSendMessage(activeContact.id, text)
    }
  }

  const handleAttachment = () => {
    alert('File attachment dialog would open here.')
  }

  const toggleProject = (project: string) => {
    setExpandedProjects(prev => {
      const next = new Set(prev)
      if (next.has(project)) next.delete(project)
      else next.add(project)
      return next
    })
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

  const renderContactItem = (contact: Contact) => (
    <button
      key={contact.id}
      onClick={() => setActiveContactId(contact.id)}
      className={cn(
        'w-full text-left p-4 hover:bg-slate-50 transition-colors border-b border-slate-50',
        activeContactId === contact.id && 'bg-rose-50/50'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-sm font-bold">
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
              <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shrink-0">
                {contact.unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  )

  const renderCategorySection = (title: string, icon: React.ReactNode, contacts: Contact[]) => {
    if (contacts.length === 0) return null
    return (
      <div>
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {icon}
            <span>{title}</span>
            <span className="text-slate-300">({contacts.length})</span>
          </div>
        </div>
        {contacts.map(renderContactItem)}
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex">
        <div className="w-80 border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-rose-600" /> Messages
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {searchQuery ? (
              filteredConversations.map(renderContactItem)
            ) : (
              <>
                {renderCategorySection('Administration', <Shield className="w-3.5 h-3.5" />, adminConversations)}
                {renderCategorySection('Finance', <DollarSign className="w-3.5 h-3.5" />, accountantConversations)}

                {crewByProject.map(([project, contacts]) => (
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
                    {expandedProjects.has(project) && contacts.map(renderContactItem)}
                  </div>
                ))}

                {renderCategorySection('Clients', <UserCheck className="w-3.5 h-3.5" />, clientConversations)}
              </>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {activeContact ? (
            <>
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-sm font-bold">
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
                {(activeContact.id in localMessages ? localMessages[activeContact.id] : activeContact.messages).map((msg) => (
                  <div key={msg.id} className={cn('flex', msg.sender === 'me' ? 'justify-end' : 'justify-start')}>
                    <div className={cn('max-w-[70%] space-y-1', msg.sender === 'me' && 'items-end')}>
                      {msg.sender === 'contact' && (
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[8px] font-bold">
                            {activeContact.avatar}
                          </div>
                          <span className="text-[10px] font-medium text-slate-400">{activeContact.name}</span>
                        </div>
                      )}
                      <div
                        className={cn(
                          'rounded-2xl px-4 py-2.5 text-sm',
                          msg.sender === 'me'
                            ? 'bg-rose-600 text-white rounded-br-md'
                            : 'bg-slate-100 text-slate-900 rounded-bl-md'
                        )}
                      >
                        <p>{msg.text}</p>
                        {msg.attachment && (
                          <div className={cn('mt-2 flex items-center gap-2 p-2 rounded-lg', msg.sender === 'me' ? 'bg-rose-500' : 'bg-slate-200')}>
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
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
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
                        ? 'bg-rose-600 text-white hover:bg-rose-700'
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
                <p className="text-sm font-medium">Select a conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
