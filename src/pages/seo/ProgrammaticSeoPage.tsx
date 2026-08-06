import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import { PageBuilder } from '@/seo/components/PageBuilder';
import { resolveSeoPage } from '@/seo/registry/resolve';

/**
 * Point d’entrée unique des pages SEO programmatiques.
 * Aucune page n’est codée en dur : résolution via le registry.
 */
export default function ProgrammaticSeoPage() {
  const { pathname } = useLocation();
  const page = useMemo(() => resolveSeoPage(pathname), [pathname]);

  if (!page) return <NotFound />;
  return <PageBuilder page={page} />;
}
