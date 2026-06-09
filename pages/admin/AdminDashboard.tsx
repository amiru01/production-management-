import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/AppStore'
import {
  DollarSign,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  Users,
  Camera,
  UserPlus,
  Calendar,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { cn } from '../../utils'

const revenueData = [
  { name: 'Jan', revenue: 45000, expenses: 28000 },
  { name: 'Feb', revenue: 52000, expenses: 30000 },
  { name: 'Mar', revenue: 48000, expenses: 29000 },
  { name: 'Apr', revenue: 61000, expenses: 32000 },
  { name: 'May', revenue: 59000, expenses: 31000 },
  { name: 'Jun', revenue: 75000, expenses: 35000 },
]

const projectStatusData = [
  { name: 'Planning', value: 4 },
  { name: 'Pre-Prod', value: 3 },
  { name: 'Shooting', value: 5 },
  { name: 'Post-Prod', value: 8 },
  { name: 'Review', value: 2 },
]

export function AdminDashboard() {
  const { projects } = useStore()
  const navigate = useNavigate()

  const activeProjects = projects.filter(p => p.status !== 'Completed').length
  const completedYTD = projects.filter(p => p.status === 'Completed').length
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0)
  const totalRevenue = 340000

  const kpis = [
    { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: '+12%', icon: DollarSign, trend: 'up' as const, path: '/admin/finance' },
    { title: 'Total Expenses', value: '$185,000', change: '+5%', icon: TrendingUp, trend: 'down' as const, path: '/admin/finance' },
    { title: 'Active Projects', value: `${activeProjects}`, change: '+3', icon: Briefcase, trend: 'up' as const, path: '/admin/projects' },
    { title: 'Completed (YTD)', value: `${completedYTD}`, change: '+15%', icon: CheckCircle2, trend: 'up' as const, path: '/admin/projects' },
    { title: 'Team Utilization', value: '85%', change: '+2%', icon: Users, trend: 'up' as const, path: '/admin/users' },
    { title: 'Eq. Utilization', value: '72%', change: '-4%', icon: Camera, trend: 'down' as const, path: '/admin/equipment' },
    { title: 'Client Growth', value: '+8', change: 'This Month', icon: UserPlus, trend: 'neutral' as const, path: '/admin/clients' },
    { title: 'Monthly Profit', value: '$40,000', change: '+18%', icon: DollarSign, trend: 'up' as const, path: '/admin/finance' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
          <p className="text-slate-500">Company performance and high-level metrics.</p>
        </div>
        <button onClick={() => navigate('/admin/reports')} className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <button key={i} onClick={() => navigate(kpi.path)} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all text-left w-full cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 rounded-lg">
                <kpi.icon className="w-5 h-5 text-slate-600" />
              </div>
              <span className={cn(
                'text-xs font-medium px-2 py-1 rounded-full',
                kpi.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : kpi.trend === 'down' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-700',
              )}>
                {kpi.change}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{kpi.title}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{kpi.value}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Revenue vs Expenses (YTD)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]} />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Active Projects Pipeline</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectStatusData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12 }} width={80} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={24} name="Projects" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900">Upcoming Productions</h3>
          <button onClick={() => navigate('/admin/projects')} className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Client / Project</th>
                <th className="p-4 font-medium">Dates</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {projects.slice(0, 4).map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-slate-900">{prod.client}</div>
                    <div className="text-sm text-slate-500">{prod.name}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                      {prod.timeline}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{prod.status}</span>
                  </td>
                  <td className="p-4 text-right font-medium text-slate-900">${prod.budget.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
