import { useMemo } from 'react';
import { useAuth } from '@/shared/auth/AuthProvider';

/** Role codes aligned with API RBAC. */
export type RoleCode =
  | 'SUPER_ADMIN'
  | 'ENTERPRISE'
  | 'MANAGER'
  | 'RECEPTION'
  | 'CLEANING'
  | 'MAINTENANCE'
  | 'OWNER';

const ROLE_PERMISSIONS: Record<RoleCode, string[]> = {
  SUPER_ADMIN: ['*'],
  ENTERPRISE: ['*'],
  MANAGER: [
    'dashboard:read',
    'properties:*',
    'reservations:*',
    'calendar:*',
    'guests:*',
    'payments:*',
    'invoices:*',
    'contracts:*',
    'employees:*',
    'cleaning:*',
    'maintenance:*',
    'checkin:*',
    'checkout:*',
    'inventory:*',
    'messages:*',
    'reports:*',
    'settings:read',
    'crm:*',
    'pricing:*',
    'automations:*',
    'channels:*',
  ],
  RECEPTION: [
    'dashboard:read',
    'reservations:read',
    'calendar:read',
    'guests:*',
    'messages:*',
    'checkin:*',
    'checkout:*',
  ],
  CLEANING: ['cleaning:*', 'inventory:read', 'calendar:read'],
  MAINTENANCE: ['maintenance:*', 'inventory:read', 'calendar:read'],
  OWNER: [
    'dashboard:read',
    'properties:read',
    'reservations:read',
    'calendar:read',
    'reports:read',
    'payments:read',
    'invoices:read',
  ],
};

function matches(granted: string[], permission: string): boolean {
  if (granted.includes('*')) return true;
  if (granted.includes(permission)) return true;
  const [resource] = permission.split(':');
  return granted.includes(`${resource}:*`);
}

/**
 * Stub permissions hook. Reads `app_metadata.role` from Supabase user when present;
 * defaults to MANAGER for local scaffolding.
 */
export function usePermissions() {
  const { user } = useAuth();

  const role = useMemo<RoleCode>(() => {
    const meta = user?.app_metadata as { role?: string } | undefined;
    const raw = meta?.role?.toUpperCase();
    if (raw && raw in ROLE_PERMISSIONS) return raw as RoleCode;
    return 'MANAGER';
  }, [user]);

  const permissions = ROLE_PERMISSIONS[role];

  return {
    role,
    permissions,
    can: (permission: string) => matches(permissions, permission),
    canAny: (...perms: string[]) => perms.some((p) => matches(permissions, p)),
  };
}
