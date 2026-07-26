import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';
import { verifySupabaseJwt, type AuthUser } from '../../infrastructure/supabase/auth.js';

export type RoleCode =
  | 'SUPER_ADMIN'
  | 'ENTERPRISE'
  | 'MANAGER'
  | 'RECEPTION'
  | 'CLEANING'
  | 'MAINTENANCE'
  | 'OWNER';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      tenant?: {
        organizationId: string;
        role?: RoleCode;
      };
    }
  }
}

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
    'settings:*',
    'pricing:*',
    'automations:*',
    'crm:*',
    'ai:*',
    'channels:*',
  ],
  RECEPTION: [
    'dashboard:read',
    'reservations:read',
    'reservations:write',
    'guests:*',
    'checkin:*',
    'checkout:*',
    'messages:*',
    'calendar:read',
  ],
  CLEANING: ['cleaning:*', 'checkin:read', 'checkout:read', 'inventory:read'],
  MAINTENANCE: ['maintenance:*', 'inventory:read'],
  OWNER: [
    'dashboard:read',
    'properties:read',
    'reservations:read',
    'reports:read',
    'invoices:read',
    'payments:read',
  ],
};

function hasPermission(role: RoleCode | undefined, permission: string): boolean {
  if (!role) return false;
  const granted = ROLE_PERMISSIONS[role] ?? [];
  if (granted.includes('*')) return true;
  if (granted.includes(permission)) return true;
  const [resource] = permission.split(':');
  return granted.includes(`${resource}:*`);
}

/**
 * Verifies Bearer JWT via Supabase and attaches `req.user`.
 */
export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw AppError.unauthorized('Missing Bearer token');
    }
    const token = header.slice('Bearer '.length).trim();
    req.user = await verifySupabaseJwt(token);
    next();
  } catch (err) {
    next(err instanceof AppError ? err : AppError.unauthorized('Invalid token'));
  }
}

/**
 * Factory: require a specific permission for the current tenant role.
 */
export function requirePermission(permission: string) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const role = req.tenant?.role ?? req.user?.role;
    if (!hasPermission(role, permission)) {
      next(AppError.forbidden(`Missing permission: ${permission}`));
      return;
    }
    next();
  };
}

export { hasPermission, ROLE_PERMISSIONS };
