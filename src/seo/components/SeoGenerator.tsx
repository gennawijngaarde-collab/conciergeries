import { useEffect } from 'react';
import type { SeoFaqItem, SeoBreadcrumbItem, SeoPageType } from '@/seo/types';
import { SITE_ORIGIN } from '@/utils/seo/slugify';

type Props = {
  title: string;
  description: string;
  path: string;
  type: SeoPageType;
  faqs?: SeoFaqItem[];
  breadcrumbs?: SeoBreadcrumbItem[];
  image?: string;
  /** Extra JSON-LD graphs merged into the page */
  extraJsonLd?: Record<string, unknown>[];
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

const JSON_LD_IDS = [
  'seo-engine-breadcrumb',
  'seo-engine-faq',
  'seo-engine-article',
  'seo-engine-local',
  'seo-engine-extra',
];

/** Générateur SEO universel (title, meta, OG, Twitter, JSON-LD). */
export function SeoGenerator({
  title,
  description,
  path,
  type,
  faqs = [],
  breadcrumbs = [],
  image,
  extraJsonLd = [],
}: Props) {
  useEffect(() => {
    const url = `${SITE_ORIGIN}${path}`;
    const ogImage = image?.startsWith('http') ? image : `${SITE_ORIGIN}${image || '/favicon.svg'}`;

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertLink('canonical', url);
    upsertMeta('property', 'og:type', type === 'guide' || type === 'comparatif' ? 'article' : 'website');
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', ogImage);

    if (breadcrumbs.length) {
      upsertJsonLd('seo-engine-breadcrumb', {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: b.name,
          item: `${SITE_ORIGIN}${b.path}`,
        })),
      });
    }

    if (faqs.length) {
      upsertJsonLd('seo-engine-faq', {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      });
    }

    if (type === 'guide' || type === 'comparatif') {
      upsertJsonLd('seo-engine-article', {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        mainEntityOfPage: url,
        author: { '@type': 'Organization', name: 'Conciergeries France' },
        publisher: { '@type': 'Organization', name: 'Conciergeries France' },
      });
    }

    if (type === 'conciergerie-ville' || type === 'ville' || type === 'service-ville') {
      upsertJsonLd('seo-engine-local', {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: title,
        description,
        url,
        areaServed: breadcrumbs[breadcrumbs.length - 1]?.name,
      });
    }

    if (extraJsonLd.length) {
      upsertJsonLd('seo-engine-extra', extraJsonLd.length === 1 ? extraJsonLd[0] : extraJsonLd);
    }

    return () => {
      JSON_LD_IDS.forEach((id) => document.getElementById(id)?.remove());
    };
  }, [title, description, path, type, faqs, breadcrumbs, image, extraJsonLd]);

  return null;
}
