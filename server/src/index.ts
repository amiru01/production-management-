import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import { prisma } from './db.js'
import { authRouter } from './routes/auth.js'
import { usersRouter } from './routes/users.js'
import { clientsRouter } from './routes/clients.js'
import { projectsRouter } from './routes/projects.js'
import { equipmentRouter } from './routes/equipment.js'
import { planningRouter } from './routes/planning.js'
import { financeRouter } from './routes/finance.js'
import { tasksRouter } from './routes/tasks.js'
import { scheduleRouter } from './routes/schedule.js'
import { assetsRouter } from './routes/assets.js'
import { messagesRouter } from './routes/messages.js'
import { teamRouter } from './routes/team.js'
import { reportsRouter } from './routes/reports.js'
import { settingsRouter } from './routes/settings.js'

const app = express()
const server = createServer(app)
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'lumen-studio-jwt-secret-2026'

const io = new Server(server, {
  cors: { origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true },
})

io.use((socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) return next(new Error('Authentication required'))
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any
    ;(socket as any).user = payload
    next()
  } catch {
    next(new Error('Invalid token'))
  }
})

const onlineUsers = new Map<string, string>()

io.on('connection', (socket) => {
  const userId = (socket as any).user.userId
  const userName = (socket as any).user.name
  onlineUsers.set(String(userId), socket.id)
  io.emit('user_online', { userId, name: userName })

  socket.on('join_conversation', (conversationId: number) => {
    socket.join(`conversation:${conversationId}`)
  })

  socket.on('leave_conversation', (conversationId: number) => {
    socket.leave(`conversation:${conversationId}`)
  })

  socket.on('send_message', async (data: { conversationId: number; text: string }) => {
    try {
      const message = await prisma.message.create({
        data: {
          conversationId: data.conversationId,
          sender: userName,
          text: data.text,
          time: 'Just now',
          isMe: false,
          senderId: userId,
        },
      })
      await prisma.conversation.update({
        where: { id: data.conversationId },
        data: { lastMessage: data.text, time: 'Just now', unread: { increment: 1 } },
      })
      io.to(`conversation:${data.conversationId}`).emit('new_message', {
        conversationId: data.conversationId,
        message: { id: message.id, sender: userName, text: data.text, time: 'Just now', isMe: false },
      })
    } catch (err) {
      socket.emit('error', 'Failed to send message')
    }
  })

  socket.on('typing', (data: { conversationId: number; userId: number; name: string }) => {
    socket.to(`conversation:${data.conversationId}`).emit('user_typing', data)
  })

  socket.on('stop_typing', (data: { conversationId: number; userId: number }) => {
    socket.to(`conversation:${data.conversationId}`).emit('user_stopped_typing', data)
  })

  socket.on('mark_read', async (data: { conversationId: number }) => {
    await prisma.conversation.update({
      where: { id: data.conversationId },
      data: { unread: 0 },
    })
    io.to(`conversation:${data.conversationId}`).emit('conversation_read', {
      conversationId: data.conversationId,
      userId,
    })
  })

  socket.on('disconnect', () => {
    onlineUsers.delete(String(userId))
    io.emit('user_offline', { userId, name: userName })
  })
})

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }))
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/clients', clientsRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/equipment', equipmentRouter)
app.use('/api/planning', planningRouter)
app.use('/api/finance', financeRouter)
app.use('/api/tasks', tasksRouter)
app.use('/api/schedule', scheduleRouter)
app.use('/api/assets', assetsRouter)
app.use('/api/messages', messagesRouter)
app.use('/api/team', teamRouter)
app.use('/api/reports', reportsRouter)
app.use('/api/settings', settingsRouter)

app.set('io', io)

server.listen(PORT, () => {
  console.log(`Lumen Studio API running on http://localhost:${PORT}`)
})
