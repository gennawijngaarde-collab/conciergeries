import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AdSenseUnit from '@/components/AdSenseUnit';
import blogPosts from '@/data/blog-posts';
import { resolvePublicAssetUrl } from '@/utils/publicAssetUrl';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    blogPosts.forEach((p) => cats.add(p.category));
    return [...cats].sort();
  }, []);

  const filteredPosts = useMemo(() => {
    return blogPosts
      .filter((post) => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesSearch =
            post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query) ||
            post.tags.some((tag) => tag.toLowerCase().includes(query));
          if (!matchesSearch) return false;
        }
        if (selectedCategory && post.category !== selectedCategory) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchQuery, selectedCategory]);

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateString));

  const readingTime = (post: (typeof blogPosts)[number]) => {
    if (typeof post.readingTimeMinutes === 'number' && Number.isFinite(post.readingTimeMinutes)) {
      return Math.max(1, Math.round(post.readingTimeMinutes));
    }
    return Math.max(1, Math.ceil(post.content.split(' ').length / 200));
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <p className="text-sm font-medium tracking-wide text-blue-700 mb-3">Blog</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
            Guides et conseils location courte durée
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Articles complets pour choisir une conciergerie, optimiser vos annonces et gérer vos
            locations Airbnb en France.
          </p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher un article…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 text-base border-gray-300"
              aria-label="Rechercher un article"
            />
          </div>
        </div>
      </header>

      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500 mr-1">Catégories</span>
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 text-sm transition-colors ${
              selectedCategory === null
                ? 'text-blue-700 font-semibold underline underline-offset-4'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tous
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 text-sm transition-colors ${
                selectedCategory === category
                  ? 'text-blue-700 font-semibold underline underline-offset-4'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-sm text-gray-500 mb-6">
          {filteredPosts.length} article{filteredPosts.length > 1 ? 's' : ''}
        </p>

        {filteredPosts.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucun article trouvé</h2>
            <p className="text-gray-600 mb-6">Modifiez votre recherche ou la catégorie.</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
            >
              Réinitialiser
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPosts.map((post, index) => (
              <div key={post.id}>
                <article className="py-8 first:pt-0">
                  <div className="flex flex-col gap-4 sm:flex-row sm:gap-5 sm:items-stretch">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="block shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-slate-900 sm:w-[200px]"
                    >
                      <img
                        src={resolvePublicAssetUrl(post.image || `/images/blog/${post.slug}.svg`)}
                        alt={post.imageAlt ?? post.title}
                        className={
                          post.slug === 'formation-conciergerie-airbnb-livre-numerique'
                            ? 'h-40 w-full object-contain bg-[#0f1f3d] sm:h-[132px]'
                            : 'h-40 w-full object-cover sm:h-[132px]'
                        }
                        width={200}
                        height={132}
                        loading="lazy"
                        onError={(e) => {
                          const img = e.currentTarget;
                          const fallback = resolvePublicAssetUrl(`/images/blog/${post.slug}.svg`);
                          if (img.src !== fallback && !img.dataset.fallbackTried) {
                            img.dataset.fallbackTried = '1';
                            img.src = fallback;
                          }
                        }}
                      />
                    </Link>
                    <div className="min-w-0 flex-1 flex flex-col">
                      <p className="text-sm text-blue-700 font-medium mb-1.5">{post.category}</p>
                      <h2 className="text-xl sm:text-[1.35rem] font-bold text-gray-900 leading-snug mb-2 line-clamp-2">
                        <Link to={`/blog/${post.slug}`} className="hover:text-blue-700 transition-colors">
                          {post.title}
                        </Link>
                      </h2>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-2">
                        <time dateTime={post.date} className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(post.date)}
                        </time>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {readingTime(post)} min de lecture
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-3 text-[0.975rem] line-clamp-2 sm:line-clamp-3">
                        {post.excerpt}
                      </p>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:underline mt-auto"
                      >
                        Lire l’article
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </article>
                {/* Pub entre articles (évite un grand vide en haut si AdSense ne charge pas) */}
                {index === 1 && <AdSenseUnit className="py-6" />}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Blog;
