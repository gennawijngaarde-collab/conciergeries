import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BlogPost } from '@/types/conciergerie';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [post.image]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  // Estimate reading time (200 words per minute)
  const readingTime = Math.ceil(post.content.split(' ').length / 200);
  const imageAlt = useMemo(() => post.imageAlt ?? post.title, [post.imageAlt, post.title]);
  const imageSrc = useMemo(() => {
    if (!post.image) return '';
    if (/^https?:\/\//i.test(post.image)) return post.image;
    const cleaned = post.image.replace(/^\//, '');
    return `${import.meta.env.BASE_URL}${cleaned}`;
  }, [post.image]);

  if (featured) {
    return (
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative h-64 md:h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center overflow-hidden">
              {!imageError && imageSrc && (
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  onError={() => setImageError(true)}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <Badge className="absolute top-4 left-4 bg-white/90 text-gray-900">
                {post.category}
              </Badge>
              <div className="relative z-10 text-center p-8">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📝</span>
                </div>
                <p className="text-white/80 text-sm">Article à la une</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 lg:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {readingTime} min de lecture
                </span>
              </div>

              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>

              <p className="text-gray-600 mb-6 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Lire l'article
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
          {!imageError && imageSrc && (
            <img
              src={imageSrc}
              alt={imageAlt}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <Badge className="absolute top-3 left-3 bg-blue-600 text-white">
            {post.category}
          </Badge>
          <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center">
            <span className="text-3xl">📝</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readingTime} min
            </span>
          </div>

          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>

          <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors mt-auto"
          >
            Lire la suite
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
