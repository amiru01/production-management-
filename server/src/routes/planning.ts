import { Router } from 'express'
import { prisma } from '../db.js'
import { authenticate, authorize } from '../middleware/auth.js'

export const planningRouter = Router()

planningRouter.use(authenticate)

const MODELS = ['script', 'storyboard', 'shotList', 'permit'] as const
const PRISMA_MAP: Record<string, any> = { script: prisma.script, storyboard: prisma.storyboard, shotList: prisma.shotList, permit: prisma.permit }

planningRouter.get('/:type', authorize('admin', 'manager', 'crew'), async (req, res) => {
  const type = req.params.type as string
  const model = PRISMA_MAP[type]
  if (!model) { res.status(400).json({ error: 'Invalid planning type' }); return }
  const items = await model.findMany({ include: { project: { select: { name: true } } }, orderBy: { id: 'asc' } })
  const mapped = items.map((i: any) => ({ ...i, project: i.project?.name || '' }))
  res.json(mapped)
})

planningRouter.post('/:type', authorize('admin', 'manager'), async (req, res) => {
  const type = req.params.type
  const model = PRISMA_MAP[type]
  if (!model) { res.status(400).json({ error: 'Invalid planning type' }); return }
  const { title, projectId, status, assignee } = req.body
  if (!title) { res.status(400).json({ error: 'Title is required' }); return }
  const item = await model.create({
    data: { title, projectId: projectId || 1, status: status || 'Draft', assignee: assignee || '', lastUpdated: 'Just now' },
    include: { project: { select: { name: true } } },
  })
  res.status(201).json({ ...item, project: item.project?.name || '' })
})

planningRouter.put('/:type/:id', authorize('admin', 'manager'), async (req, res) => {
  const type = req.params.type
  const model = PRISMA_MAP[type]
  if (!model) { res.status(400).json({ error: 'Invalid planning type' }); return }
  const { title, status, assignee } = req.body
  const data: any = { lastUpdated: 'Just now' }
  if (title) data.title = title; if (status) data.status = status; if (assignee !== undefined) data.assignee = assignee
  const item = await model.update({ where: { id: Number(req.params.id) }, data, include: { project: { select: { name: true } } } })
  res.json({ ...item, project: item.project?.name || '' })
})

planningRouter.delete('/:type/:id', authorize('admin', 'manager'), async (req, res) => {
  const type = req.params.type
  const model = PRISMA_MAP[type]
  if (!model) { res.status(400).json({ error: 'Invalid planning type' }); return }
  await model.delete({ where: { id: Number(req.params.id) } })
  res.json({ success: true })
})