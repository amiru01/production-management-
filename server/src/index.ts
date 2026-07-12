import express from 'express'
import cors from 'cors'
import { authRouter } from './routes/auth.js'
import { usersRouter } from './routes/users.js'
import { clientsRouter } from './routes/clients.js'
import { projectsRouter } from './routes/projects.js'
import { equipmentRouter } from './routes/equipment.js'
import { planningRouter } from './routes/planning.js'
import { financeRouter } from './routes/finance.js'
import { tasksRouter } from './routes/tasks.js'
import { scheduleRouter } from './routes/schedule.js'
import { assetsRouter } from './routes/assets.js'
import { messagesRouter } from './routes/messages.js'
import { teamRouter } from './routes/team.js'
import { reportsRouter } from './routes/reports.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }))
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/clients', clientsRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/equipment', equipmentRouter)
app.use('/api/planning', planningRouter)
app.use('/api/finance', financeRouter)
app.use('/api/tasks', tasksRouter)
app.use('/api/schedule', scheduleRouter)
app.use('/api/assets', assetsRouter)
app.use('/api/messages', messagesRouter)
app.use('/api/team', teamRouter)
app.use('/api/reports', reportsRouter)

app.listen(PORT, () => {
  console.log(`Lumen Studio API running on http://localhost:${PORT}`)
})