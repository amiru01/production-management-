import { Router } from 'express'
import { prisma } from '../db.js'
import { authenticate, authorize } from '../middleware/auth.js'

export const equipmentRouter = Router()

equipmentRouter.use(authenticate)

equipmentRouter.get('/', async (_req, res) => {
  const items = await prisma.equipment.findMany({ orderBy: { id: 'asc' } })
  res.json(items)
})

equipmentRouter.post('/', authorize('admin', 'manager'), async (req, res) => {
  const { name, category, status, assignedTo, location, returnDate } = req.body
  if (!name) { res.status(400).json({ error: 'Name is required' }); return }
  const item = await prisma.equipment.create({
    data: { name, category: category || '', status: status || 'Available', assignedTo: assignedTo || '-', location: location || '', returnDate: returnDate || '-' },
  })
  res.status(201).json(item)
})

equipmentRouter.put('/:id', authorize('admin', 'manager'), async (req, res) => {
  const { name, category, status, assignedTo, location, returnDate } = req.body
  const data: any = {}
  if (name) data.name = name; if (category !== undefined) data.category = category
  if (status) data.status = status; if (assignedTo !== undefined) data.assignedTo = assignedTo
  if (location !== undefined) data.location = location; if (returnDate !== undefined) data.returnDate = returnDate
  const item = await prisma.equipment.update({ where: { id: Number(req.params.id) }, data })
  res.json(item)
})

equipmentRouter.delete('/:id', authorize('admin', 'manager'), async (req, res) => {
  await prisma.equipment.delete({ where: { id: Number(req.params.id) } })
  res.json({ success: true })
})