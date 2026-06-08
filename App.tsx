import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { Layout } from './components/Layout'
import { RoleSelector } from './pages/RoleSelector'
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
// Crew
import { CrewDashboard } from './pages/crew/CrewDashboard'
import { CrewTasks } from './pages/crew/CrewTasks'
import { CrewSchedule } from './pages/crew/CrewSchedule'
import { CrewAssets } from './pages/crew/CrewAssets'
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

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelector />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/*" element={
          <Layout role="admin">
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
          </Layout>
        } />

        {/* Manager Routes */}
        <Route path="/manager" element={<Navigate to="/manager/dashboard" replace />} />
        <Route path="/manager/*" element={
          <Layout role="manager">
            <Routes>
              <Route path="dashboard" element={<ManagerDashboard />} />
              <Route path="projects" element={<ProjectsBoard />} />
              <Route path="planning" element={<ManagerProductionPlanning />} />
              <Route path="scheduling" element={<ManagerScheduling />} />
              <Route path="team" element={<ManagerTeam />} />
              <Route path="equipment" element={<ManagerEquipment />} />
              <Route path="assets" element={<ManagerAssets />} />
            </Routes>
          </Layout>
        } />

        {/* Crew Routes */}
        <Route path="/crew" element={<Navigate to="/crew/dashboard" replace />} />
        <Route path="/crew/*" element={
          <Layout role="crew">
            <Routes>
              <Route path="dashboard" element={<CrewDashboard />} />
              <Route path="tasks" element={<CrewTasks />} />
              <Route path="schedule" element={<CrewSchedule />} />
              <Route path="assets" element={<CrewAssets />} />
            </Routes>
          </Layout>
        } />

        {/* Accountant Routes */}
        <Route path="/accountant" element={<Navigate to="/accountant/dashboard" replace />} />
        <Route path="/accountant/*" element={
          <Layout role="accountant">
            <Routes>
              <Route path="dashboard" element={<AccountantDashboard />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="payments" element={<AccountantPayments />} />
              <Route path="reports" element={<AccountantReports />} />
            </Routes>
          </Layout>
        } />

        {/* Client Routes */}
        <Route path="/client" element={<Navigate to="/client/dashboard" replace />} />
        <Route path="/client/*" element={
          <Layout role="client">
            <Routes>
              <Route path="dashboard" element={<ClientDashboard />} />
              <Route path="projects" element={<ClientProjects />} />
              <Route path="deliverables" element={<ClientDeliverables />} />
              <Route path="invoices" element={<ClientInvoices />} />
              <Route path="messages" element={<ClientMessages />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  )
}
