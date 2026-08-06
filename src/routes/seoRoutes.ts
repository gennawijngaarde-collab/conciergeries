/**
 * Routes SEO programmatiques — à monter APRÈS les routes métier spécifiques,
 * et AVANT le catch-all 404.
 *
 * Pattern : un seul segment `/…` résolu par le registry (ville, service×ville, guide, top…).
 */
export const SEO_CATCHALL_PATH = '/:seoSlug' as const;

export { resolveSeoPage, enumerateSeoPaths, isSeoPath } from '@/seo/registry/resolve';
