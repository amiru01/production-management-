import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '../utils'
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Calendar,
  Video,
  Camera,
  DollarSign,
  FileText,
  Settings,
  BarChart3,
  HardDrive,
  CheckSquare,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Building2,
  ClipboardList,
  Wrench,
  Receipt,
  TrendingUp,
  Download,
  Upload,
  GitBranch,
  // Added for new pages
  Shield,
  UserCheck,
  PieChart,
  FileSpreadsheet,
  Clock,
  Headphones,
  Star,
} from 'lucide-react'

type Role = 'admin' | 'manager' | 'crew' | 'accountant' | 'client'

interface LayoutProps {
  children: React.ReactNode
  role: Role
}

interface NavItem {
  name: string
  path: string
  icon: React.ComponentType<{ className?: string }>
}

interface RoleConfig {
  name: string
  color: string
  nav: NavItem[]
}

const roleConfigs: Record<Role, RoleConfig> = {
  admin: {
    name: 'Super Admin',
    color: 'bg-indigo-600',
    nav: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'User Management', path: '/admin/users', icon: Users },
      { name: 'Client Management', path: '/admin/clients', icon: Building2 },
      { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
      { name: 'Production Planning', path: '/admin/planning', icon: ClipboardList },
      { name: 'Equipment', path: '/admin/equipment', icon: Camera },
      { name: 'Finance', path: '/admin/finance', icon: DollarSign },
      { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
      { name: 'Settings', path: '/admin/settings', icon: Settings },
    ],
  },
  manager: {
    name: 'Production Manager',
    color: 'bg-blue-600',
    nav: [
      { name: 'Dashboard', path: '/manager/dashboard', icon: LayoutDashboard },
      { name: 'Projects Board', path: '/manager/projects', icon: FolderKanban },
      { name: 'Production Planning', path: '/manager/planning', icon: ClipboardList },
      { name: 'Scheduling', path: '/manager/scheduling', icon: Calendar },
      { name: 'Team', path: '/manager/team', icon: Users },
      { name: 'Equipment', path: '/manager/equipment', icon: Camera },
      { name: 'Assets', path: '/manager/assets', icon: HardDrive },
    ],
  },
  crew: {
    name: 'Production Team',
    color: 'bg-emerald-600',
    nav: [
      { name: 'Dashboard', path: '/crew/dashboard', icon: LayoutDashboard },
      { name: 'My Tasks', path: '/crew/tasks', icon: CheckSquare },
      { name: 'Schedule', path: '/crew/schedule', icon: Calendar },
      { name: 'Assets', path: '/crew/assets', icon: HardDrive },
    ],
  },
  accountant: {
    name: 'Accountant',
    color: 'bg-amber-600',
    nav: [
      { name: 'Dashboard', path: '/accountant/dashboard', icon: LayoutDashboard },
      { name: 'Invoices', path: '/accountant/invoices', icon: FileText },
      { name: 'Payments', path: '/accountant/payments', icon: DollarSign },
      { name: 'Reports', path: '/accountant/reports', icon: BarChart3 },
    ],
  },
  client: {
    name: 'Client',
    color: 'bg-rose-600',
    nav: [
      { name: 'Dashboard', path: '/client/dashboard', icon: LayoutDashboard },
      { name: 'My Projects', path: '/client/projects', icon: Video },
      { name: 'Deliverables', path: '/client/deliverables', icon: CheckSquare },
      { name: 'Invoices', path: '/client/invoices', icon: FileText },
      { name: 'Messages', path: '/client/messages', icon: MessageSquare },
    ],
  },
}

export function Layout({ children, role }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const config = roleConfigs[role]

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center gap-3 sticky top-0 z-20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 -ml-2"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#191970] rounded-md flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg">Lumen Studio</span>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          'fixed md:sticky top-0 left-0 h-screen bg-white border-r border-slate-200 w-64 flex flex-col transition-transform duration-300 z-30',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <div className="p-6 hidden md:flex items-center gap-3">
          <div className="w-8 h-8 bg-[#191970] rounded-lg flex items-center justify-center shadow-sm">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Lumen Studio</span>
        </div>

        <div className="px-6 pb-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className={cn('w-2 h-2 rounded-full', config.color)} />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Role
              </span>
              <span className="text-sm font-semibold text-slate-900">
                {config.name}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {config.nav.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-[#191970]'
                    : 'text-slate-600 hover:bg-blue-50 hover:text-[#191970]',
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5',
                    isActive ? 'text-[#191970]' : 'text-slate-400',
                  )}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <LogOut className="w-5 h-5 text-slate-400" />
            Sign Out
          </Link>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-slate-800">
            {config.nav.find((n) => location.pathname.startsWith(n.path))
              ?.name || 'Dashboard'}
          </h1>

          <div className="flex items-center gap-4">
            {/* Role Switcher (Prototype feature) */}
            <div className="relative">
              <button
                onClick={() => setSwitcherOpen(!switcherOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition-colors border border-slate-200"
              >
                <div className={cn('w-2 h-2 rounded-full', config.color)} />
                Switch Role
                <ChevronDown className="w-3 h-3" />
              </button>

              {switcherOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                  <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    Prototype Navigation
                  </div>
                  {(Object.entries(roleConfigs) as [Role, RoleConfig][]).map(
                    ([r, c]) => (
                      <button
                        key={r}
                        onClick={() => {
                          setSwitcherOpen(false)
                          navigate(`/${r}/dashboard`)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <div className={cn('w-2 h-2 rounded-full', c.color)} />
                        {c.name}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
