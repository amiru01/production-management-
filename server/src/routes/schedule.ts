import { Router } from 'express'
import { prisma } from '../db.js'
import { authenticate } from '../middleware/auth.js'

export const scheduleRouter = Router()

scheduleRouter.use(authenticate)

scheduleRouter.get('/', async (req, res) => {
  const events = await prisma.scheduleEvent.findMany({ include: { project: { select: { name: true } } }, orderBy: { id: 'asc' } })
  res.json(events.map((e: any) => ({ ...e, project: e.project?.name || '' })))
})

scheduleRouter.post('/', async (req, res) => {
  const { date, title, projectId, location, crew, time, status } = req.body
  if (!title) { res.status(400).json({ error: 'Title is required' }); return }
  const event = await prisma.scheduleEvent.create({
    data: { date: date || 1, title, projectId: projectId || 1, location: location || '', crew: crew?.toString() || '0', time: time || '', status: status || 'Tentative' },
    include: { project: { select: { name: true } } },
  })
  res.status(201).json({ ...event, project: event.project?.name || '' })
})

scheduleRouter.put('/:id', async (req, res) => {
  const { date, title, location, crew, time, status } = req.body
  const data: any = {}
  if (date) data.date = date; if (title) data.title = title; if (location !== undefined) data.location = location
  if (crew !== undefined) data.crew = crew.toString(); if (time) data.time = time; if (status) data.status = status
  const event = await prisma.scheduleEvent.update({ where: { id: Number(req.params.id) }, data, include: { project: { select: { name: true } } } })
  res.json({ ...event, project: event.project?.name || '' })
})

scheduleRouter.delete('/:id', async (req, res) => {
  await prisma.scheduleEvent.delete({ where: { id: Number(req.params.id) } })
  res.json({ success: true })
})