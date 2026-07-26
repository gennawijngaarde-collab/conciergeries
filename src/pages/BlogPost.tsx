import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Tag, Twitter, Facebook, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import blogPosts from '@/data/blog-posts';
import AdSenseUnit from '@/components/AdSenseUnit';
import { resolvePublicAssetUrl } from '@/utils/publicAssetUrl';
import { fetchBlogHtml } from '@/utils/blogHtml';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const post = useMemo(() => blogPosts.find((p) => p.slug === slug) ?? null, [slug]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return blogPosts
      .filter(
        (p) =>
          p.id !== post.id &&
          (p.category === post.category || p.tags.some((tag) => post.tags.includes(tag)))
      )
      .slice(0, 5);
  }, [post]);

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateString));

  const readingTime = useMemo(() => {
    if (!post) return 0;
    if (typeof post.readingTimeMinutes === 'number' && Number.isFinite(post.readingTimeMinutes)) {
      return Math.max(1, Math.round(post.readingTimeMinutes));
    }
    return Math.ceil(post.content.split(' ').length / 200);
  }, [post]);

  const imageAlt = useMemo(() => (post ? post.imageAlt ?? post.title : ''), [post]);
  const isProductCoverHero = post?.slug === 'formation-conciergerie-airbnb-livre-numerique';
  const imageSrc = useMemo(() => {
    if (!post?.image) return '';
    return resolvePublicAssetUrl(post.image);
  }, [post?.image]);
  const fallbackSrc = useMemo(
    () => resolvePublicAssetUrl(`/images/blog/${post?.slug ?? 'default'}.svg`),
    [post?.slug]
  );

  const [resolvedSrc, setResolvedSrc] = useState('');
  const [htmlBody, setHtmlBody] = useState('');
  const [htmlStyles, setHtmlStyles] = useState<string[]>([]);
  const [htmlJsonLd, setHtmlJsonLd] = useState<string[]>([]);
  const [htmlLoading, setHtmlLoading] = useState(false);
  const [htmlError, setHtmlError] = useState<string | null>(null);

  const isHtml = post?.contentFormat === 'html';

  useEffect(() => {
    if (!post) return;
    setResolvedSrc(imageSrc || fallbackSrc);
  }, [imageSrc, fallbackSrc, post]);

  useEffect(() => {
    if (!post || !isHtml) {
      setHtmlBody('');
      setHtmlStyles([]);
      setHtmlJsonLd([]);
      setHtmlError(null);
      return;
    }

    let cancelled = false;
    setHtmlLoading(true);
    setHtmlError(null);

    const load = async () => {
      try {
        if (post.htmlPath) {
          const parsed = await fetchBlogHtml(post.htmlPath);
          if (cancelled) return;
          setHtmlBody(parsed.bodyHtml);
          setHtmlStyles(parsed.styles);
          setHtmlJsonLd(parsed.jsonLd ?? []);
        } else if (post.content) {
          setHtmlBody(post.content);
          setHtmlStyles([]);
          setHtmlJsonLd([]);
        } else {
          throw new Error('Contenu HTML manquant');
        }
      } catch (err) {
        if (!cancelled) {
          setHtmlError(err instanceof Error ? err.message : 'Erreur de chargement');
          setHtmlBody('');
          setHtmlStyles([]);
          setHtmlJsonLd([]);
        }
      } finally {
        if (!cancelled) setHtmlLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [post, isHtml]);

  useEffect(() => {
    if (!post) return;

    const title = post.metaTitle ?? post.title;
    document.title = title;

    const ensureMeta = (name: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      return tag;
    };

    ensureMeta('description').setAttribute('content', post.metaDescription ?? post.excerpt ?? '');
    if (post.metaKeywords?.length) {
      ensureMeta('keywords').setAttribute('content', post.metaKeywords.join(', '));
    }

    const canonicalHref = `${window.location.origin}/blog/${post.slug}`;
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalHref;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.metaDescription ?? post.excerpt,
      datePublished: post.date,
      author: { '@type': 'Organization', name: post.author },
      image: post.image ? [resolvePublicAssetUrl(post.image)] : undefined,
      mainEntityOfPage: canonicalHref,
      publisher: {
        '@type': 'Organization',
        name: 'Conciergeries France',
        url: window.location.origin,
      },
    };

    const scriptId = 'blog-article-jsonld';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);

    htmlJsonLd.forEach((payload, index) => {
      try {
        JSON.parse(payload);
      } catch {
        return;
      }
      const id = `blog-html-jsonld-${index}`;
      let node = document.getElementById(id) as HTMLScriptElement | null;
      if (!node) {
        node = document.createElement('script');
        node.id = id;
        node.type = 'application/ld+json';
        document.head.appendChild(node);
      }
      node.textContent = payload;
    });

    return () => {
      document.getElementById(scriptId)?.remove();
      htmlJsonLd.forEach((_, index) => {
        document.getElementById(`blog-html-jsonld-${index}`)?.remove();
      });
    };
  }, [post, htmlJsonLd]);

  const handleImgError = () => {
    if (resolvedSrc && resolvedSrc !== fallbackSrc) {
      setResolvedSrc(fallbackSrc);
      return;
    }
    setResolvedSrc('');
  };

  if (!post) return <Navigate to="/blog" replace />;

  const formatContent = (content: string) => {
    const withLinks = (text: string) =>
      text.replace(
        /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
        (_match, label: string, url: string) => {
          const isAffiliate = /join\.guesty\.com|gumroad\.com|airdna\.co/i.test(url);
          const rel = isAffiliate ? 'noopener noreferrer sponsored' : 'noopener noreferrer';
          return `<a href="${url}" target="_blank" rel="${rel}" class="text-blue-700 font-semibold underline underline-offset-2">${label}</a>`;
        }
      );

    return content
      .split('\n\n')
      .map((paragraph) => {
        if (paragraph.startsWith('## ')) {
          return `<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">${withLinks(paragraph.replace('## ', ''))}</h2>`;
        }
        if (paragraph.startsWith('### ')) {
          return `<h3 class="text-xl font-bold text-gray-900 mt-8 mb-3">${withLinks(paragraph.replace('### ', ''))}</h3>`;
        }
        if (paragraph.startsWith('- ')) {
          const items = paragraph.split('\n').filter((line) => line.startsWith('- '));
          return `<ul class="list-disc pl-6 space-y-2 my-5 text-gray-800">${items.map((item) => `<li>${withLinks(item.replace('- ', ''))}</li>`).join('')}</ul>`;
        }
        if (paragraph.startsWith('| ')) {
          return `<div class="overflow-x-auto my-6"><table class="min-w-full border-collapse border border-gray-300"><tbody>${paragraph
            .split('\n')
            .map(
              (row) =>
                `<tr>${row
                  .split('|')
                  .filter(Boolean)
                  .map((cell) => `<td class="border border-gray-300 px-4 py-2">${withLinks(cell.trim())}</td>`)
                  .join('')}</tr>`
            )
            .join('')}</tbody></table></div>`;
        }
        if (paragraph.startsWith('> ')) {
          return `<blockquote class="border-l-4 border-blue-600 pl-4 italic text-gray-700 my-6">${withLinks(paragraph.replace('> ', ''))}</blockquote>`;
        }
        if (paragraph.match(/^\d+\./)) {
          const items = paragraph.split('\n').filter((line) => line.match(/^\d+\./));
          return `<ol class="list-decimal pl-6 space-y-2 my-5 text-gray-800">${items.map((item) => `<li>${withLinks(item.replace(/^\d+\./, ''))}</li>`).join('')}</ol>`;
        }
        return `<p class="text-gray-800 leading-relaxed mb-5 text-[1.075rem]">${withLinks(paragraph)}</p>`;
      })
      .join('');
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100" aria-label="Fil d'Ariane">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>
        </div>
      </nav>

      {isHtml ? (
        <article itemScope itemType="https://schema.org/Article" className="blog-html-article">
          <meta itemProp="headline" content={post.title} />
          <meta itemProp="datePublished" content={post.date} />
          <meta itemProp="author" content={post.author} />

          {htmlStyles.map((css, i) => (
            <style key={`${post.slug}-style-${i}`}>{css}</style>
          ))}

          {htmlLoading && (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-500">
              Chargement de l’article…
            </div>
          )}

          {htmlError && (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center">
              <p className="text-red-600 mb-4">{htmlError}</p>
              <Button asChild variant="outline">
                <Link to="/blog">Retour au blog</Link>
              </Button>
            </div>
          )}

          {!htmlLoading && !htmlError && htmlBody && (
            <>
              <div
                className="blog-html-body"
                itemProp="articleBody"
                dangerouslySetInnerHTML={{ __html: htmlBody }}
              />
              <div className="max-w-[900px] mx-auto px-5 py-8">
                <AdSenseUnit key={`ads-${post.slug}`} />
              </div>
            </>
          )}
        </article>
      ) : (
        <article itemScope itemType="https://schema.org/Article">
          <header className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-8">
            <p className="text-sm font-medium text-blue-700 mb-3">{post.category}</p>
            <h1 itemProp="headline" className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-gray-900 leading-tight mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <time dateTime={post.date} itemProp="datePublished" className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </time>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {readingTime} min de lecture
              </span>
              <span itemProp="author" className="inline-flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {post.author}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="font-normal">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          {resolvedSrc && (
            <figure
              className={
                isProductCoverHero
                  ? 'bg-[#0f1f3d] flex items-center justify-center px-4 py-10'
                  : 'max-w-3xl mx-auto px-4 sm:px-6 mb-8'
              }
            >
              <img
                src={resolvedSrc}
                alt={imageAlt}
                itemProp="image"
                className={
                  isProductCoverHero
                    ? 'max-h-[min(70vh,520px)] w-auto max-w-full object-contain'
                    : 'w-full h-auto max-h-[420px] object-cover'
                }
                loading="eager"
                onError={handleImgError}
              />
            </figure>
          )}

          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div
              className="blog-md-body"
              itemProp="articleBody"
              dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
            />

            <div className="my-10">
              <AdSenseUnit key={`ads-md-${post.slug}`} />
            </div>

            <Separator className="my-8" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
              <span className="text-gray-600 font-medium">Partager cet article</span>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" asChild>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Partager sur X"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Partager sur Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Partager sur LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </article>
      )}

      <aside className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-start gap-4 mb-10">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900">{post.author}</h2>
              <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                Conseils pratiques sur la conciergerie Airbnb et la location courte durée en France.
              </p>
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <section aria-labelledby="related-heading">
              <h2 id="related-heading" className="text-xl font-bold text-gray-900 mb-4">
                Continuer la lecture
              </h2>
              <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
                {relatedPosts.map((related) => (
                  <li key={related.id}>
                    <Link
                      to={`/blog/${related.slug}`}
                      className="block py-4 hover:bg-white/80 -mx-2 px-2 transition-colors"
                    >
                      <span className="text-xs font-medium text-blue-700">{related.category}</span>
                      <span className="block font-semibold text-gray-900 mt-0.5 leading-snug">
                        {related.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </aside>
    </div>
  );
};

export default BlogPost;
