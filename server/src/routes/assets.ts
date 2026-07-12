import { Router } from 'express'
import { prisma } from '../db.js'
import { authenticate } from '../middleware/auth.js'

export const assetsRouter = Router()

assetsRouter.use(authenticate)

assetsRouter.get('/', async (_req, res) => {
  const items = await prisma.asset.findMany({ include: { project: { select: { name: true } } }, orderBy: { id: 'asc' } })
  const grouped: Record<string, any[]> = {}
  for (const a of items) {
    const folder = a.folder
    if (!grouped[folder]) grouped[folder] = []
    grouped[folder].push({ ...a, project: a.project?.name || '' })
  }
  res.json(grouped)
})

assetsRouter.post('/', async (req, res) => {
  const { name, type, folder, projectId, uploadedBy, date, size } = req.body
  if (!name) { res.status(400).json({ error: 'Name is required' }); return }
  const asset = await prisma.asset.create({
    data: { name, type: type || '', folder: folder || 'footage', projectId: projectId || 1, uploadedBy: uploadedBy || req.user!.name, date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), size: size || '' },
    include: { project: { select: { name: true } } },
  })
  res.status(201).json({ ...asset, project: asset.project?.name || '' })
})

assetsRouter.delete('/:id', async (req, res) => {
  await prisma.asset.delete({ where: { id: Number(req.params.id) } })
  res.json({ success: true })
})