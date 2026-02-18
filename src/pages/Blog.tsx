import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BlogCard from '@/components/BlogCard';
import blogPosts from '@/data/blog-posts';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    blogPosts.forEach(p => cats.add(p.category));
    return [...cats].sort();
  }, []);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory && post.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  // Get featured post (most recent)
  const featuredPost = useMemo(() => {
    return [...blogPosts].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  }, []);

  // Get other posts
  const otherPosts = useMemo(() => {
    return filteredPosts.filter(p => p.id !== featuredPost?.id);
  }, [filteredPosts, featuredPost]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
              Blog & Conseils
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Le blog de la conciergerie Airbnb
            </h1>
            <p className="text-lg text-blue-100 mb-8">
              Conseils, guides et actualités pour réussir votre location courte durée 
              et choisir la meilleure conciergerie pour votre bien.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-6 text-lg bg-white/95 backdrop-blur-sm border-0 rounded-xl shadow-xl placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 mr-2">Catégories:</span>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{filteredPosts.length}</span>{' '}
            article{filteredPosts.length > 1 ? 's' : ''} trouvé
            {filteredPosts.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Featured Post (only when no filters) */}
        {!searchQuery && !selectedCategory && featuredPost && (
          <div className="mb-12">
            <BlogCard post={featuredPost} featured />
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun article trouvé
            </h3>
            <p className="text-gray-600 mb-4">
              Essayez de modifier vos critères de recherche ou de sélectionner une autre catégorie.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Réinitialiser les filtres
            </button>
          </Card>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Restez informé des dernières actualités
            </h2>
            <p className="text-gray-600 mb-8">
              Inscrivez-vous à notre newsletter pour recevoir nos conseils et guides 
              directement dans votre boîte mail.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white">
                S'inscrire
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
