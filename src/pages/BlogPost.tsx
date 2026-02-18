import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Tag, Twitter, Facebook, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import blogPosts from '@/data/blog-posts';
import BlogCard from '@/components/BlogCard';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [imageError, setImageError] = useState(false);
  
  const post = blogPosts.find(p => p.slug === slug);
  
  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  useEffect(() => {
    setImageError(false);
  }, [post.image]);

  // Get related posts (same category or tags)
  const relatedPosts = blogPosts
    .filter(p => 
      p.id !== post.id && 
      (p.category === post.category || 
       p.tags.some(tag => post.tags.includes(tag)))
    )
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  // Estimate reading time
  const readingTime = Math.ceil(post.content.split(' ').length / 200);
  const imageAlt = useMemo(() => post.imageAlt ?? post.title, [post.imageAlt, post.title]);
  const imageSrc = useMemo(() => {
    if (!post.image) return '';
    if (/^https?:\/\//i.test(post.image)) return post.image;
    const cleaned = post.image.replace(/^\//, '');
    return `${import.meta.env.BASE_URL}${cleaned}`;
  }, [post.image]);

  // Convert markdown-like content to HTML
  const formatContent = (content: string) => {
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        if (paragraph.startsWith('## ')) {
          return `<h2 key=${index} class="text-2xl font-bold text-gray-900 mt-8 mb-4">${paragraph.replace('## ', '')}</h2>`;
        }
        if (paragraph.startsWith('### ')) {
          return `<h3 key=${index} class="text-xl font-bold text-gray-900 mt-6 mb-3">${paragraph.replace('### ', '')}</h3>`;
        }
        if (paragraph.startsWith('- ')) {
          const items = paragraph.split('\n').filter(line => line.startsWith('- '));
          return `<ul key=${index} class="list-disc list-inside space-y-2 my-4 text-gray-700">${items.map(item => `<li>${item.replace('- ', '')}</li>`).join('')}</ul>`;
        }
        if (paragraph.startsWith('| ')) {
          // Simple table handling
          return `<div key=${index} class="overflow-x-auto my-6"><table class="min-w-full border-collapse border border-gray-300"><tbody>${paragraph.split('\n').map(row => `<tr>${row.split('|').filter(Boolean).map(cell => `<td class="border border-gray-300 px-4 py-2">${cell.trim()}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
        }
        if (paragraph.startsWith('> ')) {
          return `<blockquote key=${index} class="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-6">${paragraph.replace('> ', '')}</blockquote>`;
        }
        if (paragraph.match(/^\d+\./)) {
          const items = paragraph.split('\n').filter(line => line.match(/^\d+\./));
          return `<ol key=${index} class="list-decimal list-inside space-y-2 my-4 text-gray-700">${items.map(item => `<li>${item.replace(/^\d+\./, '')}</li>`).join('')}</ol>`;
        }
        return `<p key=${index} class="text-gray-700 leading-relaxed mb-4">${paragraph}</p>`;
      })
      .join('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
            {post.category}
          </Badge>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {readingTime} min de lecture
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative h-64 sm:h-80 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center overflow-hidden">
        {!imageError && imageSrc && (
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            onError={() => setImageError(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="relative z-10 text-center text-white p-8">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">📝</span>
          </div>
          <p className="text-white/80">
            {imageError ? "Illustration indisponible" : "Illustration de l'article"}
          </p>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12">
          <article 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
          />

          <Separator className="my-8" />

          {/* Share */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Partager cet article</span>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" asChild>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Author Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{post.author}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Expert en conciergerie Airbnb et location courte durée. 
                  Nous partageons nos conseils pour vous aider à maximiser 
                  vos revenus locatifs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Articles similaires
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPost;
