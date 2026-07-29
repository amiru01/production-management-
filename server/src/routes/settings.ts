import { Router } from 'express'
import { prisma } from '../db.js'
import { authenticate, authorize } from '../middleware/auth.js'

export const settingsRouter = Router()

settingsRouter.use(authenticate)
settingsRouter.use(authorize('admin'))

settingsRouter.get('/slack', async (_req, res) => {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: 'slack_webhook_url' } })
    const events = await prisma.setting.findUnique({ where: { key: 'slack_notification_events' } })
    res.json({
      connected: !!setting,
      webhookUrl: setting?.value || '',
      events: events ? JSON.parse(events.value) : [],
    })
  } catch (err) {
    console.error('Error fetching Slack settings:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

settingsRouter.post('/slack', async (req, res) => {
  try {
    const { webhookUrl, events } = req.body
    if (!webhookUrl) {
      res.status(400).json({ error: 'Webhook URL is required' })
      return
    }

    await prisma.setting.upsert({
      where: { key: 'slack_webhook_url' },
      update: { value: webhookUrl },
      create: { key: 'slack_webhook_url', value: webhookUrl },
    })

    if (events) {
      await prisma.setting.upsert({
        where: { key: 'slack_notification_events' },
        update: { value: JSON.stringify(events) },
        create: { key: 'slack_notification_events', value: JSON.stringify(events) },
      })
    }

    res.json({ success: true, message: 'Slack webhook configured successfully' })
  } catch (err) {
    console.error('Error saving Slack settings:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

settingsRouter.post('/slack/test', async (req, res) => {
  try {
    const { webhookUrl } = req.body
    if (!webhookUrl) {
      res.status(400).json({ error: 'Webhook URL is required' })
      return
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: '✅ Lumen Studio: Slack integration test successful!' }),
    })

    if (!response.ok) {
      res.status(400).json({ error: `Slack webhook test failed: ${response.statusText}` })
      return
    }

    res.json({ success: true, message: 'Slack webhook test successful!' })
  } catch (err) {
    res.status(400).json({ error: `Slack webhook test failed: ${err instanceof Error ? err.message : 'Unknown error'}` })
  }
})

settingsRouter.delete('/slack', async (_req, res) => {
  try {
    await prisma.setting.deleteMany({ where: { key: { in: ['slack_webhook_url', 'slack_notification_events'] } } })
    res.json({ success: true, message: 'Slack integration disconnected' })
  } catch (err) {
    console.error('Error disconnecting Slack:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

settingsRouter.get('/logo', async (_req, res) => {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: 'company_logo' } })
    res.json({ logo: setting?.value || null })
  } catch (err) {
    console.error('Error fetching logo:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

settingsRouter.post('/logo', async (req, res) => {
  try {
    const { logo } = req.body
    if (!logo) {
      res.status(400).json({ error: 'Logo data is required' })
      return
    }

    await prisma.setting.upsert({
      where: { key: 'company_logo' },
      update: { value: logo },
      create: { key: 'company_logo', value: logo },
    })

    res.json({ success: true, logo })
  } catch (err) {
    console.error('Error saving logo:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})
