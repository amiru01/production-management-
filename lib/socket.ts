import { useEffect, useRef, useState, useCallback } from 'react'
import { io, type Socket } from 'socket.io-client'
import { getToken } from './api'

export function useSocket() {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUserIds, setOnlineUserIds] = useState<Set<number>>(new Set())
  const [typingUsers, setTypingUsers] = useState<Record<number, number[]>>({})
  const listenersRef = useRef<{ newMessage?: (data: any) => void }>({})

  useEffect(() => {
    const token = getToken()
    if (!token) return

    const socket = io('/', {
      auth: { token },
      transports: ['websocket', 'polling'],
    })

    socket.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))

    socket.on('user_online', (data: { userId: number }) => {
      setOnlineUserIds(prev => new Set(prev).add(data.userId))
    })

    socket.on('user_offline', (data: { userId: number }) => {
      setOnlineUserIds(prev => { const next = new Set(prev); next.delete(data.userId); return next })
    })

    socket.on('new_message', (data: any) => {
      if (listenersRef.current.newMessage) {
        listenersRef.current.newMessage(data)
      }
    })

    socket.on('user_typing', (data: { conversationId: number; userId: number }) => {
      setTypingUsers(prev => {
        const existing = prev[data.conversationId] || []
        if (existing.includes(data.userId)) return prev
        return { ...prev, [data.conversationId]: [...existing, data.userId] }
      })
    })

    socket.on('user_stopped_typing', (data: { conversationId: number; userId: number }) => {
      setTypingUsers(prev => {
        const existing = (prev[data.conversationId] || []).filter(id => id !== data.userId)
        return { ...prev, [data.conversationId]: existing }
      })
    })

    socketRef.current = socket

    return () => { socket.disconnect() }
  }, [])

  const joinConversation = useCallback((id: number) => {
    socketRef.current?.emit('join_conversation', id)
  }, [])

  const leaveConversation = useCallback((id: number) => {
    socketRef.current?.emit('leave_conversation', id)
  }, [])

  const emitTyping = useCallback((conversationId: number, userId: number, name: string) => {
    socketRef.current?.emit('typing', { conversationId, userId, name })
  }, [])

  const emitStopTyping = useCallback((conversationId: number, userId: number) => {
    socketRef.current?.emit('stop_typing', { conversationId, userId })
  }, [])

  const markConversationRead = useCallback((conversationId: number) => {
    socketRef.current?.emit('mark_read', { conversationId })
  }, [])

  const onNewMessage = useCallback((cb: (data: any) => void) => {
    listenersRef.current.newMessage = cb
  }, [])

  return {
    isConnected,
    onlineUserIds,
    typingUsers,
    joinConversation,
    leaveConversation,
    emitTyping,
    emitStopTyping,
    markConversationRead,
    onNewMessage,
  }
}
