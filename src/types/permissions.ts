export const PERMISSIONS = {
  admin: ['*'],
  employee: [
    'task:read:own',
    'task:update:own',
    'project:read:assigned',
    'employee:read:projectMembers'
  ]
} as const;

export type Permission = typeof PERMISSIONS.admin[number] | typeof PERMISSIONS.employee[number];

export type Role = keyof typeof PERMISSIONS;
