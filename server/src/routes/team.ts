import { Router } from 'express'
import { prisma } from '../db.js'
import { authenticate, authorize } from '../middleware/auth.js'

export const teamRouter = Router()

teamRouter.use(authenticate)

teamRouter.get('/', authorize('admin', 'manager'), async (_req, res) => {
  const members = await prisma.teamMember.findMany({ include: { project: { select: { name: true } } }, orderBy: { id: 'asc' } })
  res.json(members.map((m: any) => ({ ...m, project: m.project?.name || '' })))
})

teamRouter.post('/', authorize('admin', 'manager'), async (req, res) => {
  const { name, role, projectId, status, contact } = req.body
  if (!name) { res.status(400).json({ error: 'Name is required' }); return }
  const member = await prisma.teamMember.create({
    data: { name, role: role || '', projectId: projectId || 1, status: status || 'Available', tasks: 0, availability: 100, contact: contact || '' },
    include: { project: { select: { name: true } } },
  })
  res.status(201).json({ ...member, project: member.project?.name || '' })
})

teamRouter.put('/:id', authorize('admin', 'manager'), async (req, res) => {
  const { name, role, status, tasks, availability, contact } = req.body
  const data: any = {}
  if (name) data.name = name; if (role !== undefined) data.role = role; if (status) data.status = status
  if (tasks !== undefined) data.tasks = tasks; if (availability !== undefined) data.availability = availability; if (contact !== undefined) data.contact = contact
  const member = await prisma.teamMember.update({ where: { id: Number(req.params.id) }, data, include: { project: { select: { name: true } } } })
  res.json({ ...member, project: member.project?.name || '' })
})

teamRouter.delete('/:id', authorize('admin', 'manager'), async (req, res) => {
  await prisma.teamMember.delete({ where: { id: Number(req.params.id) } })
  res.json({ success: true })
})