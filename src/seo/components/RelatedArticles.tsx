import { Link } from 'react-router-dom';
import blogPosts from '@/data/blog-posts';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const FALLBACK = [
  'comment-choisir-conciergerie-airbnb-2025',
  'choisir-conciergerie-airbnb-2026',
  'conciergerie-airbnb-combien-ca-coute',
  'channel-manager-guide-complet',
];

type Props = {
  cityName?: string;
  slugs?: string[];
};

export function RelatedArticles({ cityName, slugs }: Props) {
  let posts = (slugs?.length ? slugs : FALLBACK)
    .map((s) => blogPosts.find((p) => p.slug === s))
    .filter(Boolean);

  if (cityName) {
    const local = blogPosts.filter((p) =>
      `${p.title} ${p.slug}`.toLowerCase().includes(cityName.toLowerCase())
    );
    posts = [...local, ...posts].filter(
      (p, i, arr) => arr.findIndex((x) => x!.slug === p!.slug) === i
    );
  }

  posts = posts.slice(0, 4);
  if (!posts.length) return null;

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Articles associés</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {posts.map((post) => (
          <Card key={post!.slug} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <Link to={`/blog/${post!.slug}`} className="group block">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2 line-clamp-2">
                  {post!.title}
                </h3>
                <span className="inline-flex items-center text-sm text-blue-600">
                  Lire <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
