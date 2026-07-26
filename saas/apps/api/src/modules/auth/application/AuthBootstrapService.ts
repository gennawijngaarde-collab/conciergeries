import { isMemoryStoreEnabled } from '../../../infrastructure/memory/store.js';
import type { AuthUser } from '../../../infrastructure/supabase/auth.js';
import { AppError } from '../../../shared/errors/AppError.js';

const DEMO_ORG_ID = 'org_demo';
const DEMO_ORG_SLUG = 'demo';

type RoleCode =
  | 'SUPER_ADMIN'
  | 'ENTERPRISE'
  | 'MANAGER'
  | 'RECEPTION'
  | 'CLEANING'
  | 'MAINTENANCE'
  | 'OWNER';

const ROLE_SEED: Array<{ code: RoleCode; name: string; description: string }> = [
  { code: 'SUPER_ADMIN', name: 'Super Admin', description: 'Platform admin' },
  { code: 'ENTERPRISE', name: 'Enterprise', description: 'Enterprise tenant admin' },
  { code: 'MANAGER', name: 'Manager', description: 'Conciergerie manager' },
  { code: 'RECEPTION', name: 'Reception', description: 'Front desk' },
  { code: 'CLEANING', name: 'Cleaning', description: 'Cleaning staff' },
  { code: 'MAINTENANCE', name: 'Maintenance', description: 'Maintenance staff' },
  { code: 'OWNER', name: 'Owner', description: 'Property owner' },
];

export class AuthBootstrapService {
  async ensureUserFromAuth(authUser: AuthUser) {
    const { prisma } = await import('../../../infrastructure/prisma/client.js');
    const email = authUser.email ?? `${authUser.id}@users.local`;
    return prisma.user.upsert({
      where: { supabaseUserId: authUser.id },
      create: {
        supabaseUserId: authUser.id,
        email,
        lastLoginAt: new Date(),
      },
      update: {
        email,
        lastLoginAt: new Date(),
        isActive: true,
      },
    });
  }

  async ensureRoles(): Promise<void> {
    const { prisma } = await import('../../../infrastructure/prisma/client.js');
    const count = await prisma.role.count();
    if (count > 0) return;
    await prisma.role.createMany({
      data: ROLE_SEED,
      skipDuplicates: true,
    });
  }

  async ensureDemoOrg() {
    const { prisma } = await import('../../../infrastructure/prisma/client.js');
    await this.ensureRoles();

    let org = await prisma.organization.findUnique({ where: { id: DEMO_ORG_ID } });
    if (!org) {
      org = await prisma.organization.findUnique({ where: { slug: DEMO_ORG_SLUG } });
    }
    if (!org) {
      org = await prisma.organization.create({
        data: {
          id: DEMO_ORG_ID,
          name: 'Demo Conciergerie',
          slug: DEMO_ORG_SLUG,
          timezone: 'Europe/Paris',
          currency: 'EUR',
          locale: 'fr',
        },
      });
    }
    return org;
  }

  async bootstrap(authUser: AuthUser) {
    if (!authUser?.id) throw AppError.unauthorized('Missing auth user');

    if (isMemoryStoreEnabled()) {
      const roleCode = (authUser.role as RoleCode | undefined) ?? 'MANAGER';
      return {
        user: {
          id: authUser.id,
          supabaseUserId: authUser.id,
          email: authUser.email ?? 'demo@cleanbnb.local',
          firstName: 'Demo',
          lastName: 'Manager',
          locale: 'fr',
        },
        organization: {
          id: DEMO_ORG_ID,
          name: 'Demo Conciergerie',
          slug: DEMO_ORG_SLUG,
          timezone: 'Europe/Paris',
          currency: 'EUR',
        },
        role: {
          id: `role_${roleCode}`,
          code: roleCode,
          name: roleCode,
        },
        memberships: [
          {
            id: 'mem_demo',
            organizationId: DEMO_ORG_ID,
            organizationName: 'Demo Conciergerie',
            roleCode,
            status: 'ACTIVE',
          },
        ],
        storage: 'memory' as const,
      };
    }

    const { prisma } = await import('../../../infrastructure/prisma/client.js');
    const { MemberStatus, RoleCode: RC } = await import('@prisma/client');

    const user = await this.ensureUserFromAuth(authUser);
    const demoOrg = await this.ensureDemoOrg();

    const preferredOrgId = authUser.organizationId || DEMO_ORG_ID;
    let organization = await prisma.organization.findUnique({
      where: { id: preferredOrgId },
    });
    if (!organization) organization = demoOrg;

    const managerRole = await prisma.role.findUnique({
      where: { code: RC.MANAGER },
    });
    if (!managerRole) throw AppError.internal('MANAGER role missing');

    const requestedRoleCode = (authUser.role as string | undefined) ?? RC.MANAGER;
    const role =
      (await prisma.role.findUnique({ where: { code: requestedRoleCode as never } })) ??
      managerRole;

    let membership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: organization.id,
          userId: user.id,
        },
      },
      include: { role: true },
    });

    if (!membership) {
      membership = await prisma.organizationMember.create({
        data: {
          organizationId: organization.id,
          userId: user.id,
          roleId: role.id,
          status: MemberStatus.ACTIVE,
          joinedAt: new Date(),
        },
        include: { role: true },
      });
    } else if (membership.status !== MemberStatus.ACTIVE) {
      membership = await prisma.organizationMember.update({
        where: { id: membership.id },
        data: { status: MemberStatus.ACTIVE, joinedAt: membership.joinedAt ?? new Date() },
        include: { role: true },
      });
    }

    const memberships = await prisma.organizationMember.findMany({
      where: { userId: user.id, status: MemberStatus.ACTIVE },
      include: {
        organization: true,
        role: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return {
      user: {
        id: user.id,
        supabaseUserId: user.supabaseUserId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        locale: user.locale,
      },
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        timezone: organization.timezone,
        currency: organization.currency,
      },
      role: {
        id: membership.role.id,
        code: membership.role.code,
        name: membership.role.name,
      },
      memberships: memberships.map((m) => ({
        id: m.id,
        organizationId: m.organizationId,
        organizationName: m.organization.name,
        roleCode: m.role.code,
        status: m.status,
      })),
      storage: 'postgres' as const,
    };
  }
}

export const DEMO_ORG = { id: DEMO_ORG_ID, slug: DEMO_ORG_SLUG };
