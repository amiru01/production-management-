import { Router } from 'express'
import { prisma } from '../db.js'
import { authenticate, authorize } from '../middleware/auth.js'

export const clientsRouter = Router()

clientsRouter.use(authenticate)

clientsRouter.get('/', authorize('admin', 'manager', 'accountant'), async (_req, res) => {
  const clients = await prisma.client.findMany({ orderBy: { id: 'asc' } })
  res.json(clients)
})

clientsRouter.get('/:id', authorize('admin', 'manager', 'accountant', 'client'), async (req, res) => {
  const client = await prisma.client.findUnique({ where: { id: Number(req.params.id) } })
  if (!client) { res.status(404).json({ error: 'Client not found' }); return }
  res.json(client)
})

clientsRouter.post('/', authorize('admin'), async (req, res) => {
  const { name, company, email, phone, status } = req.body
  if (!name) { res.status(400).json({ error: 'Name is required' }); return }
  const client = await prisma.client.create({
    data: { name, company: company || '', email: email || '', phone: phone || '', status: status || 'Active', avatar: name.split(' ').map((s: string) => s[0]).join('').toUpperCase() },
  })
  res.status(201).json(client)
})

clientsRouter.put('/:id', authorize('admin'), async (req, res) => {
  const { name, company, email, phone, status } = req.body
  const data: any = {}
  if (name) data.name = name; if (company !== undefined) data.company = company
  if (email) data.email = email; if (phone !== undefined) data.phone = phone
  if (status) data.status = status
  const client = await prisma.client.update({ where: { id: Number(req.params.id) }, data })
  res.json(client)
})

clientsRouter.delete('/:id', authorize('admin'), async (req, res) => {
  await prisma.client.delete({ where: { id: Number(req.params.id) } })
  res.json({ success: true })
})