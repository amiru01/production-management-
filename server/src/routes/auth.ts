import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { generateSecret, generateURI, verify as otplibVerify } from 'otplib'
import QRCode from 'qrcode'
import { prisma } from '../db.js'
import { generateToken, authenticate } from '../middleware/auth.js'

export const authRouter = Router()

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }

    const token = generateToken({
      userId: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    })

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

authRouter.get('/me', async (req, res) => {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing token' })
      return
    }
    const jwt = await import('jsonwebtoken')
    const payload = jwt.default.verify(header.split(' ')[1], process.env.JWT_SECRET || 'lumen-studio-jwt-secret-2026') as any
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, role: true, avatar: true, status: true, lastActive: true, twoFactorEnabled: true },
    })
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.json(user)
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
})

authRouter.get('/2fa/status', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { twoFactorEnabled: true, twoFactorSecret: true },
    })
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.json({
      enabled: user.twoFactorEnabled,
      hasSecret: !!user.twoFactorSecret,
    })
  } catch (err) {
    console.error('Error fetching 2FA status:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

authRouter.post('/2fa/generate', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } })
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    if (user.twoFactorEnabled) {
      res.status(400).json({ error: 'Two-factor authentication is already enabled' })
      return
    }

    const secret = generateSecret()
    const otpauth = generateURI({ issuer: 'Lumen Studio', label: user.email, secret })
    const qrCode = await QRCode.toDataURL(otpauth)

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorSecret: secret },
    })

    res.json({ secret, qrCode })
  } catch (err) {
    console.error('Error generating 2FA secret:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

authRouter.post('/2fa/verify', authenticate, async (req, res) => {
  try {
    const { token } = req.body
    if (!token) {
      res.status(400).json({ error: 'Verification token is required' })
      return
    }

    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } })
    if (!user || !user.twoFactorSecret) {
      res.status(400).json({ error: 'No 2FA secret found. Generate one first.' })
      return
    }

    if (user.twoFactorEnabled) {
      res.status(400).json({ error: 'Two-factor authentication is already enabled' })
      return
    }

      const isValid = otplibVerify({ token, secret: user.twoFactorSecret })
    if (!isValid) {
      res.status(400).json({ error: 'Invalid verification code. Please try again.' })
      return
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: true },
    })

    res.json({ success: true, message: 'Two-factor authentication enabled successfully' })
  } catch (err) {
    console.error('Error verifying 2FA:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

authRouter.post('/2fa/disable', authenticate, async (req, res) => {
  try {
    const { token, password } = req.body

    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } })
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    if (!user.twoFactorEnabled) {
      res.status(400).json({ error: 'Two-factor authentication is not enabled' })
      return
    }

    if (user.twoFactorSecret && token) {
    const isValid = otplibVerify({ token, secret: user.twoFactorSecret })
      if (!isValid) {
        res.status(400).json({ error: 'Invalid verification code' })
        return
      }
    } else if (password) {
      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        res.status(400).json({ error: 'Invalid password' })
        return
      }
    } else {
      res.status(400).json({ error: 'Verification code or password is required to disable 2FA' })
      return
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: false, twoFactorSecret: null },
    })

    res.json({ success: true, message: 'Two-factor authentication disabled' })
  } catch (err) {
    console.error('Error disabling 2FA:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})