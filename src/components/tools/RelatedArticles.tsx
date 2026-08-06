import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import blogPosts from '@/data/blog-posts';
import { Card, CardContent } from '@/components/ui/card';

const FALLBACK_SLUGS = [
  'channel-manager-guide-complet',
  'comparaison-channel-managers-2026',
  'guesty-channel-manager-location-courte-duree',
  'airdna-avis-investissement-airbnb',
  'optimiser-annonce-airbnb-reservations',
];

const EDITORIAL_LINKS = [
  { label: 'Comment choisir un PMS ?', to: '/outils-airbnb/pms' },
  { label: 'Quel est le meilleur Channel Manager ?', to: '/outils-airbnb/channel-manager' },
  { label: 'Comment automatiser Airbnb ?', to: '/outils-airbnb/automatisation' },
  { label: 'PriceLabs ou Wheelhouse ?', to: '/outils-airbnb/pricing-dynamique' },
  { label: 'Guesty vs Hostaway', to: '/outils-airbnb/comparateur' },
];

type Props = {
  relatedBlogSlugs?: string[];
};

export function RelatedArticles({ relatedBlogSlugs }: Props) {
  const slugs = relatedBlogSlugs?.length ? relatedBlogSlugs : FALLBACK_SLUGS;
  const posts = slugs
    .map((slug) => blogPosts.find((p) => p.slug === slug))
    .filter(Boolean)
    .slice(0, 4);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Articles associés</h2>
        <p className="text-gray-600">Guides pour choisir et automatiser votre stack Airbnb.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {EDITORIAL_LINKS.map((l) => (
          <Link
            key={l.to + l.label}
            to={l.to}
            className="text-sm px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </div>

      {posts.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {posts.map((post) => (
            <Card key={post!.slug} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <Link to={`/blog/${post!.slug}`} className="group block">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2 line-clamp-2">
                    {post!.title}
                  </h3>
                  <span className="inline-flex items-center text-sm text-blue-600">
                    Lire l’article <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
