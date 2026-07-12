import { Router } from 'express'
import { prisma } from '../db.js'
import { authenticate, authorize } from '../middleware/auth.js'

export const reportsRouter = Router()

reportsRouter.use(authenticate)

reportsRouter.get('/overview', authorize('admin', 'manager', 'accountant'), async (_req, res) => {
  const [projects, invoices, expenses, users] = await Promise.all([
    prisma.project.findMany(),
    prisma.invoice.findMany(),
    prisma.expense.findMany(),
    prisma.user.findMany(),
  ])

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0)
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0)
  const totalRevenue = invoices.reduce((s, i) => s + (i.status === 'Paid' ? i.amount : 0), 0)
  const totalExpenses = expenses.reduce((s, e) => s + (e.status === 'Approved' ? e.amount : 0), 0)

  res.json({
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'In Production' || p.status === 'Pre-Production').length,
    completedProjects: projects.filter(p => p.status === 'Completed').length,
    totalBudget,
    totalSpent,
    totalRevenue,
    totalExpenses,
    netProfit: totalRevenue - totalExpenses,
    totalUsers: users.length,
    projectsByStatus: projects.reduce((acc: Record<string, number>, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1
      return acc
    }, {} as Record<string, number>),
  })
})

reportsRouter.get('/finance', authorize('admin', 'accountant'), async (_req, res) => {
  const [invoices, expenses] = await Promise.all([
    prisma.invoice.findMany(),
    prisma.expense.findMany(),
  ])
  res.json({
    totalInvoiced: invoices.reduce((s, i) => s + i.amount, 0),
    totalPaid: invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0),
    totalPending: invoices.filter(i => i.status === 'Pending').reduce((s, i) => s + i.amount, 0),
    totalOverdue: invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0),
    totalExpenses: expenses.reduce((s, e) => s + e.amount, 0),
    approvedExpenses: expenses.filter(e => e.status === 'Approved').reduce((s, e) => s + e.amount, 0),
    pendingExpenses: expenses.filter(e => e.status === 'Pending').reduce((s, e) => s + e.amount, 0),
  })
})