import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../db.js'
import { authenticate, authorize } from '../middleware/auth.js'

export const usersRouter = Router()

usersRouter.use(authenticate)

usersRouter.get('/', authorize('admin', 'manager'), async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, status: true, lastActive: true, avatar: true },
    orderBy: { id: 'asc' },
  })
  res.json(users)
})

usersRouter.get('/:id', authorize('admin', 'manager'), async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
    select: { id: true, name: true, email: true, role: true, status: true, lastActive: true, avatar: true },
  })
  if (!user) { res.status(404).json({ error: 'User not found' }); return }
  res.json(user)
})

usersRouter.post('/', authorize('admin'), async (req, res) => {
  const { name, email, password, role, status } = req.body
  if (!name || !email || !password || !role) {
    res.status(400).json({ error: 'Name, email, password, and role are required' })
    return
  }
  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role, status: status || 'Active', avatar: name.split(' ').map((s: string) => s[0]).join('').toUpperCase() },
    select: { id: true, name: true, email: true, role: true, status: true, lastActive: true, avatar: true },
  })
  res.status(201).json(user)
})

usersRouter.put('/:id', authorize('admin'), async (req, res) => {
  const { name, email, role, status } = req.body
  const data: any = {}
  if (name) data.name = name
  if (email) data.email = email
  if (role) data.role = role
  if (status) data.status = status
  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data,
    select: { id: true, name: true, email: true, role: true, status: true, lastActive: true, avatar: true },
  })
  res.json(user)
})

usersRouter.delete('/:id', authorize('admin'), async (req, res) => {
  await prisma.user.delete({ where: { id: Number(req.params.id) } })
  res.json({ success: true })
})