import { Router } from 'express'
import { prisma } from '../db.js'
import { authenticate } from '../middleware/auth.js'

export const messagesRouter = Router()

messagesRouter.use(authenticate)

messagesRouter.get('/conversations', async (_req, res) => {
  const conversations = await prisma.conversation.findMany({
    include: { project: { select: { name: true } }, messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
    orderBy: { updatedAt: 'desc' },
  })
  const mapped = conversations.map((c: any) => {
    const last = c.messages[0]
    return {
      id: c.id, name: c.name, role: c.role, project: c.project?.name || '', avatar: c.avatar,
      lastMessage: last?.text || c.lastMessage, time: last?.time || c.time,
      unread: c.unread, online: c.online,
      messages: [],
    }
  })
  res.json(mapped)
})

messagesRouter.get('/conversations/:id', async (req, res) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: Number(req.params.id) },
    include: { project: { select: { name: true } }, messages: { orderBy: { createdAt: 'asc' } } },
  })
  if (!conversation) { res.status(404).json({ error: 'Conversation not found' }); return }
  res.json({
    id: conversation.id, name: conversation.name, role: conversation.role, project: conversation.project?.name || '',
    avatar: conversation.avatar, lastMessage: conversation.lastMessage, time: conversation.time,
    unread: conversation.unread, online: conversation.online,
    messages: conversation.messages.map((m: any) => ({
      id: m.id, sender: m.sender, text: m.text, time: m.time, isMe: m.isMe,
    })),
  })
})

messagesRouter.post('/conversations/:id/messages', async (req, res) => {
  const { text } = req.body
  if (!text) { res.status(400).json({ error: 'Text is required' }); return }
  const message = await prisma.message.create({
    data: { conversationId: Number(req.params.id), sender: req.user!.name, text, time: 'Just now', isMe: true, senderId: req.user!.userId },
  })
  await prisma.conversation.update({
    where: { id: Number(req.params.id) },
    data: { lastMessage: text, time: 'Just now', unread: { increment: 1 } },
  })
  res.status(201).json(message)
})