import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppStoreProvider } from './store/AppStore'
import { Layout } from './components/Layout'
import { LoginPage } from './pages/LoginPage'
import type { Role } from './lib/permissions'
// Admin
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { UserManagement } from './pages/admin/UserManagement'
import { AdminClientManagement } from './pages/admin/AdminClientManagement'
import { AdminProjectManagement } from './pages/admin/AdminProjectManagement'
import { AdminProductionPlanning } from './pages/admin/AdminProductionPlanning'
import { AdminEquipment } from './pages/admin/AdminEquipment'
import { AdminFinance } from './pages/admin/AdminFinance'
import { AdminReports } from './pages/admin/AdminReports'
import { AdminSettings } from './pages/admin/AdminSettings'
// Manager
import { ManagerDashboard } from './pages/manager/ManagerDashboard'
import { ProjectsBoard } from './pages/manager/ProjectsBoard'
import { ManagerProductionPlanning } from './pages/manager/ManagerProductionPlanning'
import { ManagerScheduling } from './pages/manager/ManagerScheduling'
import { ManagerTeam } from './pages/manager/ManagerTeam'
import { ManagerEquipment } from './pages/manager/ManagerEquipment'
import { ManagerAssets } from './pages/manager/ManagerAssets'
import { ManagerMessages } from './pages/manager/ManagerMessages'
// Crew
import { CrewDashboard } from './pages/crew/CrewDashboard'
import { CrewTasks } from './pages/crew/CrewTasks'
import { CrewSchedule } from './pages/crew/CrewSchedule'
import { CrewAssets } from './pages/crew/CrewAssets'
import { CrewMessages } from './pages/crew/CrewMessages'
// Accountant
import { AccountantDashboard } from './pages/accountant/AccountantDashboard'
import { Invoices } from './pages/accountant/Invoices'
import { AccountantPayments } from './pages/accountant/AccountantPayments'
import { AccountantReports } from './pages/accountant/AccountantReports'
// Client
import { ClientDashboard } from './pages/client/ClientDashboard'
import { ClientProjects } from './pages/client/ClientProjects'
import { ClientDeliverables } from './pages/client/ClientDeliverables'
import { ClientInvoices } from './pages/client/ClientInvoices'
import { ClientMessages } from './pages/client/ClientMessages'

const rolePrefix: Record<Role, string> = {
  admin: '/admin',
  manager: '/manager',
  crew: '/crew',
  accountant: '/accountant',
  client: '/client',
}

function DashboardRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={rolePrefix[user.role] + '/dashboard'} replace />
}

function ProtectedRoutes({ role }: { role: Role }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) return <Navigate to={rolePrefix[user.role] + '/dashboard'} replace />

  const pages: Record<Role, React.ReactNode> = {
    admin: (
      <Routes>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="clients" element={<AdminClientManagement />} />
        <Route path="projects" element={<AdminProjectManagement />} />
        <Route path="planning" element={<AdminProductionPlanning />} />
        <Route path="equipment" element={<AdminEquipment />} />
        <Route path="finance" element={<AdminFinance />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Routes>
    ),
    manager: (
      <Routes>
        <Route path="dashboard" element={<ManagerDashboard />} />
        <Route path="projects" element={<ProjectsBoard />} />
        <Route path="planning" element={<ManagerProductionPlanning />} />
        <Route path="scheduling" element={<ManagerScheduling />} />
        <Route path="team" element={<ManagerTeam />} />
        <Route path="equipment" element={<ManagerEquipment />} />
        <Route path="assets" element={<ManagerAssets />} />
        <Route path="messages" element={<ManagerMessages />} />
      </Routes>
    ),
    crew: (
      <Routes>
        <Route path="dashboard" element={<CrewDashboard />} />
        <Route path="tasks" element={<CrewTasks />} />
        <Route path="schedule" element={<CrewSchedule />} />
        <Route path="assets" element={<CrewAssets />} />
        <Route path="messages" element={<CrewMessages />} />
      </Routes>
    ),
    accountant: (
      <Routes>
        <Route path="dashboard" element={<AccountantDashboard />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="payments" element={<AccountantPayments />} />
        <Route path="reports" element={<AccountantReports />} />
      </Routes>
    ),
    client: (
      <Routes>
        <Route path="dashboard" element={<ClientDashboard />} />
        <Route path="projects" element={<ClientProjects />} />
        <Route path="deliverables" element={<ClientDeliverables />} />
        <Route path="invoices" element={<ClientInvoices />} />
        <Route path="messages" element={<ClientMessages />} />
      </Routes>
    ),
  }

  return <Layout>{pages[role]}</Layout>
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <DashboardRedirect /> : <LoginPage />} />
      <Route path="/" element={<DashboardRedirect />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/*" element={<ProtectedRoutes role="admin" />} />

      {/* Manager Routes */}
      <Route path="/manager" element={<Navigate to="/manager/dashboard" replace />} />
      <Route path="/manager/*" element={<ProtectedRoutes role="manager" />} />

      {/* Crew Routes */}
      <Route path="/crew" element={<Navigate to="/crew/dashboard" replace />} />
      <Route path="/crew/*" element={<ProtectedRoutes role="crew" />} />

      {/* Accountant Routes */}
      <Route path="/accountant" element={<Navigate to="/accountant/dashboard" replace />} />
      <Route path="/accountant/*" element={<ProtectedRoutes role="accountant" />} />

      {/* Client Routes */}
      <Route path="/client" element={<Navigate to="/client/dashboard" replace />} />
      <Route path="/client/*" element={<ProtectedRoutes role="client" />} />
    </Routes>
  )
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <AppStoreProvider>
          <AppRoutes />
        </AppStoreProvider>
      </AuthProvider>
    </Router>
  )
}
