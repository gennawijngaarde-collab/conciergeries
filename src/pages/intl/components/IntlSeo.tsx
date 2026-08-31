import { SeoGenerator } from '@/seo/components/SeoGenerator';
import type { SeoBreadcrumbItem } from '@/seo/types';

type Props = {
  title: string;
  description: string;
  path: string;
  h1: string;
  breadcrumbs: SeoBreadcrumbItem[];
  /** Businesses count in this locality (used for thin content rule) */
  businessesCount: number;
  /** If true, allow index even with low count (when we add strong local content) */
  hasSubstantialLocalContent?: boolean;
};

function computeRobots(count: number, hasSubstantialLocalContent?: boolean): string {
  if (count <= 0) return 'noindex,follow';
  if (count <= 2 && !hasSubstantialLocalContent) return 'noindex,follow';
  return 'index,follow';
}

export default function IntlSeo({
  title,
  description,
  path,
  breadcrumbs,
  businessesCount,
  hasSubstantialLocalContent,
}: Props) {
  return (
    <SeoGenerator
      title={title}
      description={description}
      path={path}
      type="pays"
      breadcrumbs={breadcrumbs}
      robots={computeRobots(businessesCount, hasSubstantialLocalContent)}
    />
  );
}

