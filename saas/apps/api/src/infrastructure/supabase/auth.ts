import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../../shared/errors/AppError.js';
import type { RoleCode } from '../../shared/middleware/authMiddleware.js';

export interface AuthUser {
  id: string;
  email?: string;
  organizationId?: string;
  role?: RoleCode;
  appMetadata?: Record<string, unknown>;
  userMetadata?: Record<string, unknown>;
}

let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!supabase) {
    const url = process.env.SUPABASE_URL ?? 'http://localhost:54321';
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.SUPABASE_ANON_KEY ??
      'stub-key';
    supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return supabase;
}

function allowDevAuth(): boolean {
  return process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEV_AUTH === 'true';
}

/**
 * Verifies a Supabase access token and maps claims to AuthUser.
 * Accepts `dev:<userId>[:orgId[:role]]` tokens when not in production,
 * or when ALLOW_DEV_AUTH=true.
 */
export async function verifySupabaseJwt(token: string): Promise<AuthUser> {
  if (allowDevAuth() && token.startsWith('dev:')) {
    const parts = token.slice(4).split(':');
    const orgId = parts[1] || 'org_demo';
    const user: AuthUser = {
      id: parts[0] || 'demo-user',
      email: 'demo@cleanbnb.local',
      organizationId: orgId,
      role: (parts[2] as RoleCode) || 'MANAGER',
      appMetadata: {
        organization_id: orgId,
        role: parts[2] || 'MANAGER',
      },
    };
    return user;
  }

  const { data, error } = await getSupabase().auth.getUser(token);
  if (error || !data.user) {
    throw AppError.unauthorized(error?.message ?? 'Invalid Supabase token');
  }

  const appMetadata = (data.user.app_metadata ?? {}) as Record<string, unknown>;
  const userMetadata = (data.user.user_metadata ?? {}) as Record<string, unknown>;

  const organizationId =
    (appMetadata.organization_id as string | undefined) ??
    (userMetadata.organization_id as string | undefined);
  const role =
    (appMetadata.role as RoleCode | undefined) ??
    (userMetadata.role as RoleCode | undefined);

  const user: AuthUser = {
    id: data.user.id,
    appMetadata,
    userMetadata,
  };
  if (data.user.email) user.email = data.user.email;
  if (organizationId) user.organizationId = organizationId;
  if (role) user.role = role;
  return user;
}

export { getSupabase };
