/**
 * Moteur SEO programmatique — exports publics.
 *
 * Ajouter une ville / service / outil / catégorie dans `src/data/**`
 * régénère automatiquement les pages via `resolveSeoPage` + `enumerateSeoPaths`.
 */
export type * from '@/seo/types';
export { resolveSeoPage, enumerateSeoPaths, isSeoPath, toolComparePairs } from '@/seo/registry/resolve';
export { PageBuilder } from '@/seo/components/PageBuilder';
export { SeoGenerator } from '@/seo/components/SeoGenerator';
export { FaqGenerator } from '@/seo/components/FaqGenerator';
export { BreadcrumbGenerator } from '@/seo/components/BreadcrumbGenerator';
export { RelatedArticles } from '@/seo/components/RelatedArticles';
export { RelatedCities } from '@/seo/components/RelatedCities';
export { DynamicCTA } from '@/seo/components/DynamicCTA';
export { InternalLinks } from '@/seo/components/InternalLinks';
