import { Router } from 'express'
import { prisma } from '../db.js'
import { authenticate, authorize } from '../middleware/auth.js'

export const financeRouter = Router()

financeRouter.use(authenticate)

// Expenses
financeRouter.get('/expenses', authorize('admin', 'accountant'), async (_req, res) => {
  const items = await prisma.expense.findMany({ orderBy: { id: 'asc' } })
  res.json(items)
})

financeRouter.post('/expenses', authorize('admin', 'accountant', 'manager'), async (req, res) => {
  const { description, department, amount, requestedBy } = req.body
  if (!description) { res.status(400).json({ error: 'Description is required' }); return }
  const item = await prisma.expense.create({
    data: { description, department: department || '', amount: amount || 0, requestedBy: requestedBy || req.user!.name, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), status: 'Pending' },
  })
  res.status(201).json(item)
})

financeRouter.put('/expenses/:id', authorize('admin', 'accountant'), async (req, res) => {
  const { status } = req.body
  const item = await prisma.expense.update({ where: { id: Number(req.params.id) }, data: { status: status || 'Pending' } })
  res.json(item)
})

// Invoices
financeRouter.get('/invoices', async (req, res) => {
  let invoices
  if (req.user!.role === 'client') {
    const client = await prisma.client.findFirst({ where: { email: req.user!.email } })
    if (!client) { res.json([]); return }
    invoices = await prisma.invoice.findMany({ where: { clientId: client.id }, include: { client: { select: { name: true } } }, orderBy: { id: 'asc' } })
  } else {
    invoices = await prisma.invoice.findMany({ include: { client: { select: { name: true } } }, orderBy: { id: 'asc' } })
  }
  res.json(invoices.map((i: any) => ({ ...i, clientName: i.client?.name || '' })))
})

financeRouter.post('/invoices', authorize('admin', 'accountant'), async (req, res) => {
  const { id, clientId, amount, date, dueDate, status, items } = req.body
  const inv = await prisma.invoice.create({
    data: { id: id || `INV-${Date.now()}`, clientId: clientId || 1, clientName: '', amount: amount || 0, date: date || '', dueDate: dueDate || '', status: status || 'Pending', items: items || '' },
    include: { client: { select: { name: true } } },
  })
  res.status(201).json({ ...inv, clientName: inv.client?.name || '' })
})

financeRouter.put('/invoices/:id', authorize('admin', 'accountant', 'client'), async (req, res) => {
  const { amount, date, dueDate, status, items } = req.body
  const data: any = {}
  if (amount !== undefined) data.amount = amount; if (date) data.date = date; if (dueDate) data.dueDate = dueDate; if (status) data.status = status; if (items !== undefined) data.items = items
  const inv = await prisma.invoice.update({ where: { id: req.params.id }, data, include: { client: { select: { name: true } } } })
  res.json({ ...inv, clientName: inv.client?.name || '' })
})

financeRouter.delete('/invoices/:id', authorize('admin', 'accountant'), async (req, res) => {
  await prisma.invoice.delete({ where: { id: req.params.id } })
  res.json({ success: true })
})

// Payments
financeRouter.get('/payments', authorize('admin', 'accountant'), async (_req, res) => {
  const items = await prisma.payment.findMany({ include: { client: { select: { name: true } }, invoice: { select: { id: true } } }, orderBy: { id: 'asc' } })
  res.json(items.map((p: any) => ({ ...p, clientName: p.client?.name || '' })))
})

financeRouter.post('/payments', authorize('admin', 'accountant'), async (req, res) => {
  const { id, invoiceId, clientId, amount, date, method, status } = req.body
  const pay = await prisma.payment.create({
    data: { id: id || `PAY-${Date.now()}`, invoiceId: invoiceId || '', clientId: clientId || 1, clientName: '', amount: amount || 0, date: date || '', method: method || '', status: status || 'Pending' },
    include: { client: { select: { name: true } } },
  })
  res.status(201).json({ ...pay, clientName: pay.client?.name || '' })
})

financeRouter.put('/payments/:id', authorize('admin', 'accountant'), async (req, res) => {
  const { amount, date, method, status } = req.body
  const data: any = {}
  if (amount !== undefined) data.amount = amount; if (date) data.date = date; if (method) data.method = method; if (status) data.status = status
  const pay = await prisma.payment.update({ where: { id: req.params.id }, data, include: { client: { select: { name: true } } } })
  res.json({ ...pay, clientName: pay.client?.name || '' })
})