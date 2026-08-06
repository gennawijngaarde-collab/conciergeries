import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { resolveSeoPage } from '@/seo/registry/resolve';

/** Hook : page SEO courante (ou null). */
export function useSeoPage() {
  const { pathname } = useLocation();
  return useMemo(() => resolveSeoPage(pathname), [pathname]);
}
