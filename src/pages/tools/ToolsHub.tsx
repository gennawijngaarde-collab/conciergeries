import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GitCompare, Search, Sparkles, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ToolCard } from '@/components/tools/ToolCard';
import { ToolFilters } from '@/components/tools/ToolFilters';
import { ToolsSeo } from '@/components/tools/ToolsSeo';
import { ToolsComparator } from '@/components/tools/ToolsComparator';
import { getCategoryIcon } from '@/components/tools/categoryIcons';
import { airbnbToolCategories } from '@/data/airbnbToolCategories';
import type { AirbnbToolCategorySlug } from '@/types/airbnbTool';
import {
  comparatorToolSlugs,
  getFavorites,
  getFeaturedTools,
  getTopTools,
  getToolBySlug,
  searchTools,
  sortTools,
  toggleFavorite,
  type SortKey,
} from '@/utils/airbnbTools';

const PAGE_SIZE = 9;

const hubFaq = [
  {
    q: 'Qu’est-ce qu’un outil Airbnb ?',
    a: 'Un logiciel ou service qui aide à gérer, automatiser ou optimiser une location courte durée : PMS, channel manager, pricing, serrures, ménage, messagerie, etc.',
  },
  {
    q: 'Comment choisir un PMS ou channel manager ?',
    a: 'Comparez le nombre de logements, les plateformes (Airbnb, Booking), le budget, l’automatisation et le support. Utilisez notre comparateur Guesty / Hostaway / Lodgify / Smoobu.',
  },
  {
    q: 'Les liens sont-ils d’affiliation ?',
    a: 'Oui, certains liens sont sponsorisés (nofollow sponsored). Cela ne change pas nos critères éditoriaux : nous sélectionnons des outils réellement utiles aux hôtes et conciergeries.',
  },
  {
    q: 'Puis-je ajouter un outil ?',
    a: 'Contactez-nous via la page Contact. Les fiches sont centralisées dans une configuration unique pour rester à jour.',
  },
];

export default function ToolsHub() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<AirbnbToolCategorySlug | null>(null);
  const [sort, setSort] = useState<SortKey>('note');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query, category, sort, favoritesOnly]);

  const filtered = useMemo(() => {
    let list = searchTools(query, category);
    if (favoritesOnly) list = list.filter((t) => favorites.includes(t.slug));
    return sortTools(list, sort);
  }, [query, category, sort, favoritesOnly, favorites]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const featured = getFeaturedTools(8);
  const top10 = getTopTools(10);
  const comparatorTools = comparatorToolSlugs.map((s) => getToolBySlug(s)).filter(Boolean);

  const onToggleFavorite = (slug: string) => {
    setFavorites(toggleFavorite(slug));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToolsSeo
        kind="hub"
        title="Outils Airbnb 2026 — PMS, Channel Managers, Pricing & Automatisation"
        description="Comparez les meilleurs logiciels Airbnb : PMS, channel managers, serrures connectées, pricing dynamique et automatisation. Guides et liens d’essai."
        path="/outils-airbnb"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#60a5fa,transparent_40%),radial-gradient(circle_at_80%_0%,#818cf8,transparent_35%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white/15 text-white border-white/20 hover:bg-white/20">
              Marketplace outils Airbnb
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
              Les meilleurs outils Airbnb pour automatiser votre location saisonnière
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Comparez les meilleurs logiciels, PMS, Channel Managers, serrures connectées et outils d’automatisation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                <a href="#catalogue">
                  <Search className="w-5 h-5 mr-2" />
                  Explorer le catalogue
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
              >
                <Link to="/outils-airbnb/comparateur">
                  <GitCompare className="w-5 h-5 mr-2" />
                  Comparateur
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {airbnbToolCategories.map((cat) => {
            const Icon = getCategoryIcon(cat.slug);
            return (
              <Link
                key={cat.slug}
                to={`/outils-airbnb/${cat.slug}`}
                className="group rounded-xl border bg-white p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="font-semibold text-gray-900 text-sm mb-1">{cat.name}</h2>
                <p className="text-xs text-gray-500 line-clamp-2">{cat.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Top tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-blue-700 font-medium text-sm mb-2">
              <Sparkles className="w-4 h-4" /> Top outils
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Sélection éditoriale</h2>
          </div>
          <Button asChild variant="outline">
            <Link to="/outils-airbnb/comparateur">
              Comparer <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((tool) => (
            <ToolCard
              key={tool.slug}
              tool={tool}
              favorite={favorites.includes(tool.slug)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* Top 10 */}
      <section className="bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Top 10 des meilleurs outils Airbnb</h2>
          <p className="text-gray-600 mb-8">Classement basé sur notre note éditoriale (fonctionnalités, adoption, rapport qualité/prix).</p>
          <ol className="space-y-3">
            {top10.map((tool, i) => (
              <li key={tool.slug}>
                <Link
                  to={`/outils-airbnb/${tool.slug}`}
                  className="flex items-center gap-4 rounded-xl border bg-gray-50 hover:bg-blue-50/50 hover:border-blue-200 p-4 transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                    {i + 1}
                  </span>
                  <img src={tool.logo} alt="" className="w-9 h-9 rounded-lg border bg-white object-contain p-1" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{tool.name}</p>
                    <p className="text-sm text-gray-500 truncate">{tool.priceLabel}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-amber-600 font-semibold shrink-0">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {tool.note.toFixed(1)}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Comparator preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Comparatif Guesty, Hostaway, Lodgify, Smoobu</h2>
          <p className="text-gray-600">Prix, essai gratuit, sync Airbnb/Booking, API, paiements et automatisation.</p>
        </div>
        <ToolsComparator tools={comparatorTools as NonNullable<(typeof comparatorTools)[number]>[]} />
        <div className="mt-6 text-center">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/outils-airbnb/comparateur">Ouvrir le comparateur complet</Link>
          </Button>
        </div>
      </section>

      {/* Catalogue */}
      <section id="catalogue" className="bg-gray-50 border-t scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Catalogue d’outils</h2>
          <ToolFilters
            query={query}
            onQueryChange={setQuery}
            category={category}
            onCategoryChange={setCategory}
            sort={sort}
            onSortChange={setSort}
            favoritesOnly={favoritesOnly}
            onFavoritesOnlyChange={setFavoritesOnly}
          />
          <p className="text-sm text-gray-500 mt-4 mb-6">{filtered.length} outil{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pageItems.map((tool) => (
              <ToolCard
                key={tool.slug}
                tool={tool}
                favorite={favorites.includes(tool.slug)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
          {filtered.length === 0 && (
            <Card className="mt-6">
              <CardContent className="p-8 text-center text-gray-600">Aucun outil ne correspond à votre recherche.</CardContent>
            </Card>
          )}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Précédent
              </Button>
              <span className="inline-flex items-center px-3 text-sm text-gray-600">
                {page} / {totalPages}
              </span>
              <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Suivant
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">FAQ outils Airbnb</h2>
        <Accordion type="single" collapsible className="bg-white rounded-xl border px-4">
          {hubFaq.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Besoin d’une conciergerie en plus des outils ?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Comparez les conciergeries de votre ville ou lancez Cleanbnb PMS pour gérer ménages et logements.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              <Link to="/devis">Obtenir des devis</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
            >
              <Link to="/pms">Découvrir Cleanbnb PMS</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
