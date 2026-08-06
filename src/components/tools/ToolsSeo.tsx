import { useEffect } from 'react';
import type { AirbnbTool } from '@/types/airbnbTool';
import type { AirbnbToolCategory } from '@/types/airbnbTool';

type SeoProps =
  | {
      kind: 'hub';
      title: string;
      description: string;
      path: string;
    }
  | {
      kind: 'category';
      category: AirbnbToolCategory;
      path: string;
    }
  | {
      kind: 'tool';
      tool: AirbnbTool;
      path: string;
    };

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertJsonLd(id: string, data: unknown) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function ToolsSeo(props: SeoProps) {
  useEffect(() => {
    const origin = window.location.origin;
    let title = '';
    let description = '';
    let path = '';
    let image = `${origin}/favicon.svg`;

    if (props.kind === 'hub') {
      title = props.title;
      description = props.description;
      path = props.path;
    } else if (props.kind === 'category') {
      title = props.category.seoTitle;
      description = props.category.seoDescription;
      path = props.path;
    } else {
      title = props.tool.seoTitle;
      description = props.tool.seoDescription;
      path = props.path;
      image = props.tool.image.startsWith('http') ? props.tool.image : `${origin}${props.tool.image}`;
    }

    const url = `${origin}${path}`;
    document.title = title;
    upsertMeta('name', 'description', description);
    upsertLink('canonical', url);
    upsertMeta('property', 'og:type', props.kind === 'tool' ? 'product' : 'website');
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', image);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: origin },
        { '@type': 'ListItem', position: 2, name: 'Outils Airbnb', item: `${origin}/outils-airbnb` },
      ],
    };

    if (props.kind === 'category') {
      breadcrumb.itemListElement.push({
        '@type': 'ListItem',
        position: 3,
        name: props.category.name,
        item: url,
      });
    }
    if (props.kind === 'tool') {
      breadcrumb.itemListElement.push(
        {
          '@type': 'ListItem',
          position: 3,
          name: props.tool.category,
          item: `${origin}/outils-airbnb/${props.tool.category}`,
        },
        { '@type': 'ListItem', position: 4, name: props.tool.name, item: url }
      );
    }
    upsertJsonLd('outils-breadcrumb-jsonld', breadcrumb);

    if (props.kind === 'tool') {
      const tool = props.tool;
      upsertJsonLd('outils-software-jsonld', {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: tool.description,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          priceCurrency: tool.currency ?? 'EUR',
          price: tool.priceFrom ?? undefined,
          description: tool.priceLabel,
          url: tool.lienAffiliation,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: tool.note,
          bestRating: 5,
          ratingCount: 12,
        },
      });
      upsertJsonLd('outils-faq-jsonld', {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: tool.faq.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      });
      upsertJsonLd('outils-product-jsonld', {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: tool.name,
        description: tool.description,
        image: image,
        brand: { '@type': 'Brand', name: tool.name },
        review: {
          '@type': 'Review',
          reviewRating: { '@type': 'Rating', ratingValue: tool.note, bestRating: 5 },
          author: { '@type': 'Organization', name: 'Conciergeries France' },
        },
      });
    }

    return () => {
      ['outils-breadcrumb-jsonld', 'outils-software-jsonld', 'outils-faq-jsonld', 'outils-product-jsonld'].forEach(
        (id) => document.getElementById(id)?.remove()
      );
    };
  }, [props]);

  return null;
}
