import React from 'react'
import { Link } from 'react-router-dom'
import {
  Shield,
  Briefcase,
  Video,
  Calculator,
  UserCircle,
  ArrowRight,
} from 'lucide-react'
import { cn } from '../utils'

const roles = [
  {
    id: 'admin',
    name: 'Super Admin',
    description:
      'Company owner with complete system control and financial oversight.',
    icon: Shield,
    color: 'bg-blue-50 text-[#191970]',
    borderColor: 'hover:border-[#191970]',
    path: '/admin/dashboard',
  },
  {
    id: 'manager',
    name: 'Production Manager',
    description:
      'Oversee operations, manage projects, scheduling, and team assignments.',
    icon: Briefcase,
    color: 'bg-blue-50 text-[#191970]',
    borderColor: 'hover:border-[#191970]',
    path: '/manager/dashboard',
  },
  {
    id: 'crew',
    name: 'Production Team',
    description:
      'Crew and editors executing production and post-production tasks.',
    icon: Video,
    color: 'bg-blue-50 text-[#191970]',
    borderColor: 'hover:border-[#191970]',
    path: '/crew/dashboard',
  },
  {
    id: 'accountant',
    name: 'Accountant',
    description: 'Manage finances, billing, invoices, and financial reporting.',
    icon: Calculator,
    color: 'bg-blue-50 text-[#191970]',
    borderColor: 'hover:border-[#191970]',
    path: '/accountant/dashboard',
  },
  {
    id: 'client',
    name: 'Client',
    description:
      'Track own projects, review deliverables, and manage invoices.',
    icon: UserCircle,
    color: 'bg-blue-50 text-[#191970]',
    borderColor: 'hover:border-[#191970]',
    path: '/client/dashboard',
  },
]

export function RoleSelector() {
  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#191970] rounded-2xl shadow-lg mb-6">
            <Video className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#191970] mb-4 tracking-tight">
            Welcome to Lumen Studio
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Select a role below to experience the tailored interface and
            workflows designed specifically for that position.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Link
              key={role.id}
              to={role.path}
              className={cn(
                'group bg-white rounded-2xl p-6 border-2 border-transparent shadow-sm hover:shadow-md transition-all duration-200 flex flex-col',
                role.borderColor,
              )}
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                  role.color,
                )}
              >
                <role.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-[#191970] mb-2">
                {role.name}
              </h3>
              <p className="text-sm text-slate-500 flex-1 mb-6 leading-relaxed">
                {role.description}
              </p>
              <div className="flex items-center text-sm font-medium text-[#191970] group-hover:text-[#191970] transition-colors mt-auto">
                Enter as {role.name}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center text-sm text-slate-400">
          <p>
            This is a prototype demonstrating role-based access control and
            tailored UI experiences.
          </p>
        </div>
      </div>
    </div>
  )
}
