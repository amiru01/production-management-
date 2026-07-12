import { Router } from 'express'
import { prisma } from '../db.js'
import { authenticate, authorize } from '../middleware/auth.js'

export const projectsRouter = Router()

projectsRouter.use(authenticate)

projectsRouter.get('/', async (req, res) => {
  let projects
  if (req.user!.role === 'client') {
    const client = await prisma.client.findFirst({ where: { email: req.user!.email } })
    if (!client) { res.json([]); return }
    projects = await prisma.project.findMany({ where: { clientId: client.id }, include: { client: true, manager: { select: { id: true, name: true } } }, orderBy: { id: 'asc' } })
  } else if (req.user!.role === 'crew') {
    projects = await prisma.project.findMany({ include: { client: true, manager: { select: { id: true, name: true } } }, orderBy: { id: 'asc' } })
  } else if (req.user!.role === 'manager') {
    projects = await prisma.project.findMany({ where: { managerId: req.user!.userId }, include: { client: true, manager: { select: { id: true, name: true } } }, orderBy: { id: 'asc' } })
  } else {
    projects = await prisma.project.findMany({ include: { client: true, manager: { select: { id: true, name: true } } }, orderBy: { id: 'asc' } })
  }
  const mapped = projects.map((p: any) => ({ ...p, clientName: p.client?.name || '', managerName: p.manager?.name || '' }))
  res.json(mapped)
})

projectsRouter.get('/:id', async (req, res) => {
  const project = await prisma.project.findUnique({ where: { id: Number(req.params.id) }, include: { client: true, manager: { select: { id: true, name: true } } } })
  if (!project) { res.status(404).json({ error: 'Project not found' }); return }
  res.json({ ...project, clientName: project.client.name, managerName: project.manager.name })
})

projectsRouter.post('/', authorize('admin', 'manager'), async (req, res) => {
  const { name, clientId, managerId, status, budget, timeline } = req.body
  if (!name) { res.status(400).json({ error: 'Name is required' }); return }
  const project = await prisma.project.create({
    data: {
      name,
      clientId: clientId || 1,
      managerId: managerId || req.user!.userId,
      clientName: '',
      managerName: '',
      status: status || 'Planning',
      budget: budget || 0, spent: 0,
      timeline: timeline || '',
      progress: 0, color: 'bg-blue-500',
    },
    include: { client: true, manager: { select: { id: true, name: true } } },
  })
  await prisma.client.update({ where: { id: project.clientId }, data: { projects: { increment: 1 } } })
  res.status(201).json({ ...project, clientName: project.client?.name || '', managerName: project.manager?.name || '' })
})

projectsRouter.put('/:id', authorize('admin', 'manager'), async (req, res) => {
  const { name, clientName, managerId, status, budget, spent, timeline, progress, color } = req.body
  const data: any = {}
  if (name) data.name = name; if (clientName !== undefined) data.clientName = clientName
  if (managerId) data.managerId = managerId; if (status) data.status = status
  if (budget !== undefined) data.budget = budget; if (spent !== undefined) data.spent = spent
  if (timeline !== undefined) data.timeline = timeline; if (progress !== undefined) data.progress = progress
  if (color) data.color = color
  const project = await prisma.project.update({ where: { id: Number(req.params.id) }, data, include: { client: true, manager: { select: { id: true, name: true } } } })
  res.json({ ...project, clientName: project.client?.name || '', managerName: project.manager?.name || '' })
})

projectsRouter.delete('/:id', authorize('admin'), async (req, res) => {
  await prisma.project.delete({ where: { id: Number(req.params.id) } })
  res.json({ success: true })
})