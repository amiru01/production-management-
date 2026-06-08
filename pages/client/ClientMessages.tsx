import React, { useState } from 'react'
import {
  MessageSquare,
  Send,
  Paperclip,
  Search,
  MoreHorizontal,
  CheckCheck,
  Check,
  Building,
  Briefcase,
  DollarSign,
} from 'lucide-react'
import { cn } from '../../utils'

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

const conversations: Contact[] = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Producer',
    avatar: 'SC',
    project: 'All Projects',
    lastMessage: 'Sounds good, I\'ll have the rough cut ready by Friday.',
    time: '2m ago',
    unread: 2,
    online: true,
    messages: [
      { id: 1, sender: 'contact', text: 'Hi Nike team! Just checking in on the Summer Campaign. The edit is coming along nicely.', time: '10:32 AM' },
      { id: 2, sender: 'me', text: 'Great to hear! Can you share a preview of the rough cut?', time: '10:35 AM' },
      { id: 3, sender: 'contact', text: 'Absolutely. We\'re finalizing the color grade today and should have it ready for review.', time: '10:38 AM' },
      { id: 4, sender: 'me', text: 'Perfect. Let us know when it\'s available.', time: '10:40 AM' },
      { id: 5, sender: 'contact', text: 'Will do! Also wanted to mention we found a great location for the beach scene. I\'ll send over the scouting photos.', time: '10:42 AM' },
      { id: 6, sender: 'me', text: 'Excellent! Please do send them over.', time: '10:45 AM' },
      { id: 7, sender: 'contact', text: 'Sounds good, I\'ll have the rough cut ready by Friday.', time: '10:47 AM', status: 'read' },
    ],
  },
  {
    id: 2,
    name: 'Marcus Lee',
    role: 'Project Manager',
    avatar: 'ML',
    project: 'Summer Campaign 2024',
    lastMessage: 'Updated the timeline. Can you take a look?',
    time: '1h ago',
    unread: 0,
    online: true,
    messages: [
      { id: 1, sender: 'contact', text: 'Good morning! I\'ve updated the production schedule for the Summer Campaign.', time: '9:00 AM' },
      { id: 2, sender: 'contact', text: 'We shifted the shoot dates by a week to accommodate the location booking.', time: '9:02 AM' },
      { id: 3, sender: 'me', text: 'That works for us. What does the revised timeline look like?', time: '9:15 AM' },
      { id: 4, sender: 'contact', text: 'Updated the timeline. Can you take a look?', time: '9:20 AM', status: 'read' },
    ],
  },
  {
    id: 3,
    name: 'Lisa Wang',
    role: 'Accountant',
    avatar: 'LW',
    project: 'Billing',
    lastMessage: 'Invoice INV-2024-005 is ready for review.',
    time: '3h ago',
    unread: 1,
    online: false,
    messages: [
      { id: 1, sender: 'contact', text: 'Hello! I\'ve prepared the final invoice for the Brand Documentary project.', time: '2:00 PM' },
      { id: 2, sender: 'contact', text: 'Invoice INV-2024-005 is ready for review.', time: '2:02 PM' },
      { id: 3, sender: 'me', text: 'Thanks Lisa, I\'ll take a look.', time: '2:30 PM', status: 'read' },
    ],
  },
  {
    id: 4,
    name: 'Jake Torres',
    role: 'Editor',
    avatar: 'JT',
    project: 'Social Media Shorts',
    lastMessage: 'Here are the first draft edits for review.',
    time: '1d ago',
    unread: 0,
    online: false,
    messages: [
      { id: 1, sender: 'contact', text: 'Hey! I\'ve finished cutting the first batch of social media shorts.', time: '11:00 AM' },
      { id: 2, sender: 'contact', text: 'Here are the first draft edits for review.', time: '11:05 AM', attachment: { name: 'social_shorts_draft.mp4', size: '245 MB' } },
      { id: 3, sender: 'me', text: 'Awesome, we\'ll review the drafts.', time: '11:30 AM', status: 'read' },
    ],
  },
]

const roleIcon: Record<string, React.ReactNode> = {
  Producer: <Briefcase className="w-3.5 h-3.5" />,
  'Project Manager': <Building className="w-3.5 h-3.5" />,
  Accountant: <DollarSign className="w-3.5 h-3.5" />,
  Editor: <Briefcase className="w-3.5 h-3.5" />,
}

export function ClientMessages() {
  const [activeContactId, setActiveContactId] = useState<number>(conversations[0].id)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const activeContact = conversations.find((c) => c.id === activeContactId)

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSend = () => {
    if (!messageInput.trim() || !activeContact) return
    alert(`Message sent to ${activeContact.name}: "${messageInput}"`)
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
            {filteredConversations.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setActiveContactId(contact.id)}
                className={cn(
                  'w-full text-left p-4 hover:bg-slate-50 transition-colors',
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
                      {roleIcon[contact.role]}
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
            ))}
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
                      {roleIcon[activeContact.role]}
                      <span>{activeContact.role}</span>
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
