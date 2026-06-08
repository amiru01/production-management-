export type Role = 'admin' | 'manager' | 'crew' | 'accountant' | 'client'

export type Permission =
  | 'user.create' | 'user.view' | 'user.edit' | 'user.delete' | 'role.assign'
  | 'client.create' | 'client.view' | 'client.edit' | 'client.delete'
  | 'project.create' | 'project.view' | 'project.edit' | 'project.delete' | 'project.assign'
  | 'script.manage' | 'storyboard.manage' | 'shotlist.manage' | 'permit.manage'
  | 'schedule.create' | 'schedule.edit' | 'callsheet.create' | 'callsheet.view'
  | 'team.assign' | 'task.assign' | 'task.complete'
  | 'asset.upload' | 'asset.view' | 'asset.download' | 'asset.delete'
  | 'equipment.create' | 'equipment.edit' | 'equipment.assign' | 'equipment.maintenance'
  | 'budget.manage' | 'expense.manage' | 'invoice.manage' | 'report.finance'
  | 'report.project' | 'report.team' | 'report.equipment' | 'report.general'

const permissionsMap: Record<Role, Permission[]> = {
  admin: [
    'user.create', 'user.view', 'user.edit', 'user.delete', 'role.assign',
    'client.create', 'client.view', 'client.edit', 'client.delete',
    'project.create', 'project.view', 'project.edit', 'project.delete', 'project.assign',
    'script.manage', 'storyboard.manage', 'shotlist.manage', 'permit.manage',
    'schedule.create', 'schedule.edit', 'callsheet.create', 'callsheet.view',
    'team.assign', 'task.assign', 'task.complete',
    'asset.upload', 'asset.view', 'asset.download', 'asset.delete',
    'equipment.create', 'equipment.edit', 'equipment.assign', 'equipment.maintenance',
    'budget.manage', 'expense.manage', 'invoice.manage', 'report.finance',
    'report.project', 'report.team', 'report.equipment', 'report.general',
  ],
  manager: [
    'client.view',
    'project.create', 'project.view', 'project.edit', 'project.delete', 'project.assign',
    'script.manage', 'storyboard.manage', 'shotlist.manage', 'permit.manage',
    'schedule.create', 'schedule.edit', 'callsheet.create', 'callsheet.view',
    'team.assign', 'task.assign', 'task.complete',
    'asset.upload', 'asset.view', 'asset.download', 'asset.delete',
    'equipment.create', 'equipment.edit', 'equipment.assign', 'equipment.maintenance',
    'report.project', 'report.team', 'report.equipment',
  ],
  crew: [
    'task.complete',
    'asset.upload', 'asset.view', 'asset.download',
    'callsheet.view',
  ],
  accountant: [
    'client.view',
    'project.view',
    'budget.manage', 'expense.manage', 'invoice.manage', 'report.finance',
    'report.general',
  ],
  client: [
    'project.view',
    'asset.view', 'asset.download',
    'invoice.manage',
  ],
}

export function getPermissions(role: Role): Permission[] {
  return permissionsMap[role] ?? []
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return getPermissions(role).includes(permission)
}

export function usePermissions(role: Role) {
  const perms = getPermissions(role)
  return {
    can: (permission: Permission) => perms.includes(permission),
    permissions: perms,
  }
}
