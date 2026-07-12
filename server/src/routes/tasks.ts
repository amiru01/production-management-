import { Router } from 'express'
import { prisma } from '../db.js'
import { authenticate } from '../middleware/auth.js'

export const tasksRouter = Router()

tasksRouter.use(authenticate)

tasksRouter.get('/', async (req, res) => {
  let tasks
  if (req.user!.role === 'crew') {
    tasks = await prisma.task.findMany({ where: { userId: req.user!.userId }, include: { project: { select: { name: true } } }, orderBy: { id: 'asc' } })
  } else if (req.user!.role === 'manager') {
    tasks = await prisma.task.findMany({ include: { project: { select: { name: true } } }, orderBy: { id: 'asc' } })
  } else {
    tasks = await prisma.task.findMany({ include: { project: { select: { name: true } } }, orderBy: { id: 'asc' } })
  }
  res.json(tasks.map((t: any) => ({ ...t, project: t.project?.name || '' })))
})

tasksRouter.post('/', async (req, res) => {
  const { title, projectId, priority, status, dueDate, assignee, userId } = req.body
  if (!title) { res.status(400).json({ error: 'Title is required' }); return }
  const task = await prisma.task.create({
    data: { title, projectId: projectId || 1, priority: priority || 'Medium', status: status || 'To Do', dueDate: dueDate || '', assignee: assignee || '', userId: userId || null },
    include: { project: { select: { name: true } } },
  })
  res.status(201).json({ ...task, project: task.project?.name || '' })
})

tasksRouter.put('/:id', async (req, res) => {
  const { title, priority, status, dueDate, assignee, userId } = req.body
  const data: any = {}
  if (title) data.title = title; if (priority) data.priority = priority; if (status) data.status = status
  if (dueDate !== undefined) data.dueDate = dueDate; if (assignee !== undefined) data.assignee = assignee; if (userId !== undefined) data.userId = userId
  const task = await prisma.task.update({ where: { id: Number(req.params.id) }, data, include: { project: { select: { name: true } } } })
  res.json({ ...task, project: task.project?.name || '' })
})

tasksRouter.delete('/:id', async (req, res) => {
  await prisma.task.delete({ where: { id: Number(req.params.id) } })
  res.json({ success: true })
})