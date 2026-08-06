import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ConciergerieCard from '@/components/ConciergerieCard';
import { ToolCard } from '@/components/tools/ToolCard';
import { ToolsComparator } from '@/components/tools/ToolsComparator';
import { BreadcrumbGenerator } from '@/seo/components/BreadcrumbGenerator';
import { DynamicCTA } from '@/seo/components/DynamicCTA';
import { FaqGenerator } from '@/seo/components/FaqGenerator';
import { InternalLinks } from '@/seo/components/InternalLinks';
import { RelatedArticles } from '@/seo/components/RelatedArticles';
import { RelatedCities } from '@/seo/components/RelatedCities';
import { SeoGenerator } from '@/seo/components/SeoGenerator';
import type { SeoPageDefinition } from '@/seo/types';
import type { Conciergerie } from '@/types/conciergerie';
import type { AirbnbTool } from '@/types/airbnbTool';
import type { GeoCity } from '@/seo/types';
import { Check } from 'lucide-react';

type Props = { page: SeoPageDefinition };

/**
 * Compose une page SEO à partir de blocs réutilisables.
 * Le design suit le thème existant (gradients blue/indigo, cards, accordion).
 */
export function PageBuilder({ page }: Props) {
  const city = page.context.city as GeoCity | undefined;
  const conciergeries = (page.context.conciergeries as Conciergerie[] | undefined) ?? [];
  const tools = (page.context.tools as AirbnbTool[] | undefined) ?? [];
  const toolA = page.context.toolA as AirbnbTool | undefined;
  const toolB = page.context.toolB as AirbnbTool | undefined;

  const whyPoints = [
    'Comparaison transparente des prestataires',
    'Maillage local (ville, département, région)',
    'Outils Airbnb et guides associés',
    'Demande de devis en quelques clics',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SeoGenerator
        title={page.title}
        description={page.description}
        path={page.path}
        type={page.type}
        faqs={page.faqs}
        breadcrumbs={page.breadcrumbs}
        extraJsonLd={
          conciergeries.length
            ? [
                {
                  '@context': 'https://schema.org',
                  '@type': 'ItemList',
                  name: page.h1,
                  itemListElement: conciergeries.slice(0, 10).map((c, i) => ({
                    '@type': 'ListItem',
                    position: i + 1,
                    name: c.name,
                    url: `https://ma-conciergerie-annuaire.com/conciergerie/${c.slug}`,
                  })),
                },
              ]
            : toolA && toolB
              ? [
                  {
                    '@context': 'https://schema.org',
                    '@type': 'SoftwareApplication',
                    name: `${toolA.name} vs ${toolB.name}`,
                    applicationCategory: 'BusinessApplication',
                  },
                ]
              : tools.length
                ? [
                    {
                      '@context': 'https://schema.org',
                      '@type': 'ItemList',
                      name: page.h1,
                      itemListElement: tools.slice(0, 10).map((t, i) => ({
                        '@type': 'ListItem',
                        position: i + 1,
                        name: t.name,
                        url: `https://ma-conciergerie-annuaire.com/outils-airbnb/${t.slug}`,
                      })),
                    },
                  ]
                : []
        }
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <BreadcrumbGenerator items={page.breadcrumbs} variant="dark" />
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white/15 text-white border-white/20 hover:bg-white/20">
              SEO · {page.type}
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">{page.h1}</h1>
            <p className="text-lg text-blue-100 leading-relaxed mb-6">{page.intro}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                <Link to={city ? `/conciergeries?city=${encodeURIComponent(city.name)}` : '/conciergeries'}>
                  Voir l’annuaire
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
              >
                <Link to="/devis">Demander un devis</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* Présentation */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Présentation</h2>
          <p className="text-gray-700 leading-relaxed max-w-3xl">{page.description}</p>
        </section>

        {/* Conciergeries */}
        {conciergeries.length > 0 && (
          <section>
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Conciergeries recommandées</h2>
                <p className="text-gray-600 text-sm mt-1">{conciergeries.length} résultat{conciergeries.length > 1 ? 's' : ''}</p>
              </div>
              {city && (
                <Button asChild variant="outline" size="sm">
                  <Link to={`/conciergeries?city=${encodeURIComponent(city.name)}`}>Tout voir</Link>
                </Button>
              )}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {conciergeries.slice(0, 9).map((c) => (
                <ConciergerieCard key={c.id} conciergerie={c} />
              ))}
            </div>
          </section>
        )}

        {/* Comparatif outils */}
        {toolA && toolB && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comparatif détaillé</h2>
            <ToolsComparator tools={[toolA, toolB]} />
            <div className="flex flex-wrap gap-3 mt-6">
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to={`/outils-airbnb/${toolA.slug}`}>Fiche {toolA.name}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={`/outils-airbnb/${toolB.slug}`}>Fiche {toolB.name}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/outils-airbnb/comparateur">Comparateur complet</Link>
              </Button>
            </div>
          </section>
        )}

        {/* Top tools */}
        {tools.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Classement</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tools.slice(0, 9).map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </section>
        )}

        {/* Pourquoi */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pourquoi utiliser notre annuaire</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {whyPoints.map((p) => (
              <div key={p} className="flex items-start gap-2 text-gray-700">
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                {p}
              </div>
            ))}
          </div>
        </section>

        {/* Guide body */}
        {(page.type === 'guide' || page.type === 'pays' || page.type === 'dom-tom') && (
          <Card>
            <CardContent className="p-6 lg:p-8 prose prose-blue max-w-none text-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Guide pratique</h2>
              <p>
                Cette page est générée automatiquement par notre moteur SEO programmatique à partir des
                données géographiques et métier de l’annuaire. Elle vous oriente vers les conciergeries,
                services et outils les plus pertinents pour votre contexte.
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>Définissez votre besoin (gestion complète, ménage, check-in, pricing…).</li>
                <li>Comparez les prestataires locaux et les avis.</li>
                <li>Équipez-vous d’un PMS / channel manager si vous scalez.</li>
                <li>Demandez plusieurs devis avant de signer.</li>
              </ul>
            </CardContent>
          </Card>
        )}

        <RelatedCities city={city} />
        <InternalLinks city={city} />
        <RelatedArticles cityName={city?.name} />
        <FaqGenerator faqs={page.faqs} />
        <DynamicCTA />
      </div>
    </div>
  );
}
