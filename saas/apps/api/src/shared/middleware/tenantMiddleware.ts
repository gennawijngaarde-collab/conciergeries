import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';
import type { RoleCode } from './authMiddleware.js';

const ORG_HEADER = 'x-organization-id';

/**
 * Resolves tenant organizationId from `x-organization-id` header
 * or from the authenticated JWT claims (`app_metadata.organization_id`).
 */
export function tenantMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  try {
    const fromHeader = req.header(ORG_HEADER)?.trim();
    const fromJwt =
      req.user?.organizationId ??
      (req.user?.appMetadata?.organization_id as string | undefined);

    const organizationId = fromHeader || fromJwt;
    if (!organizationId) {
      throw AppError.validation(
        `Organization required: set ${ORG_HEADER} header or include organization_id in JWT`,
      );
    }

    const role =
      (req.user?.role as RoleCode | undefined) ??
      (req.user?.appMetadata?.role as RoleCode | undefined);

    req.tenant = {
      organizationId,
      ...(role ? { role } : {}),
    };
    next();
  } catch (err) {
    next(err);
  }
}
