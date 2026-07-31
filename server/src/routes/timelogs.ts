import { Router } from 'express'
import { prisma } from '../db.js'
import { authenticate } from '../middleware/auth.js'

export const timelogsRouter = Router()

timelogsRouter.use(authenticate)

timelogsRouter.get('/', async (req, res) => {
  const isCrew = req.user!.role === 'crew'
  const logs = await prisma.timeLog.findMany({
    where: isCrew ? { userId: req.user!.userId } : undefined,
    include: { user: { select: { name: true } } },
    orderBy: { id: 'desc' },
  })
  res.json(logs.map((l: any) => ({ ...l, userName: l.user?.name || '' })))
})

timelogsRouter.get('/active', async (req, res) => {
  const log = await prisma.timeLog.findFirst({
    where: { userId: req.user!.userId, clockOut: null },
    include: { user: { select: { name: true } } },
    orderBy: { id: 'desc' },
  })
  res.json(log ? { ...log, userName: log.user?.name || '' } : null)
})

timelogsRouter.post('/clock-in', async (req, res) => {
  const existing = await prisma.timeLog.findFirst({ where: { userId: req.user!.userId, clockOut: null } })
  if (existing) { res.status(400).json({ error: 'Already clocked in' }); return }
  const log = await prisma.timeLog.create({ data: { userId: req.user!.userId } })
  res.status(201).json(log)
})

timelogsRouter.post('/:id/clock-out', async (req, res) => {
  const log = await prisma.timeLog.findUnique({ where: { id: Number(req.params.id) } })
  if (!log) { res.status(404).json({ error: 'Time log not found' }); return }
  if (log.userId !== req.user!.userId) { res.status(403).json({ error: 'Forbidden' }); return }
  if (log.clockOut) { res.status(400).json({ error: 'Already clocked out' }); return }
  const updated = await prisma.timeLog.update({ where: { id: log.id }, data: { clockOut: new Date() } })
  res.json(updated)
})
