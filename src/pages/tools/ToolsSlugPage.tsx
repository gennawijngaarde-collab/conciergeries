import { useParams } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import ToolPage from '@/pages/tools/ToolPage';
import ToolsCategoryPage from '@/pages/tools/ToolsCategoryPage';
import { resolveSlug } from '@/utils/airbnbTools';
import type { AirbnbTool } from '@/types/airbnbTool';
import type { AirbnbToolCategory } from '@/types/airbnbTool';

/**
 * Résout `/outils-airbnb/:slug` vers une page catégorie ou une fiche outil,
 * générée automatiquement depuis la configuration.
 */
export default function ToolsSlugPage() {
  const { slug = '' } = useParams();
  const resolved = resolveSlug(slug);

  if (!resolved) return <NotFound />;

  if (resolved.type === 'category') {
    return <ToolsCategoryPage category={resolved.value as AirbnbToolCategory} />;
  }

  return <ToolPage tool={resolved.value as AirbnbTool} />;
}
