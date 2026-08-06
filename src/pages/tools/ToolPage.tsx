import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Heart, Star, ThumbsDown, ThumbsUp, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AffiliateButton } from '@/components/tools/AffiliateButton';
import { ToolCard } from '@/components/tools/ToolCard';
import { ToolsSeo } from '@/components/tools/ToolsSeo';
import { RelatedArticles } from '@/components/tools/RelatedArticles';
import { ToolsComparator } from '@/components/tools/ToolsComparator';
import { getCategoryBySlug } from '@/data/airbnbToolCategories';
import type { AirbnbTool } from '@/types/airbnbTool';
import {
  getAlternatives,
  getFavorites,
  getToolBySlug,
  toggleFavorite,
} from '@/utils/airbnbTools';

type Props = {
  tool: AirbnbTool;
};

export default function ToolPage({ tool }: Props) {
  const category = getCategoryBySlug(tool.category);
  const alternatives = getAlternatives(tool);
  const [favorites, setFavorites] = useState<string[]>([]);
  const isFav = favorites.includes(tool.slug);

  useEffect(() => {
    setFavorites(getFavorites());
  }, [tool.slug]);

  const compareSlugs = [tool.slug, ...(tool.alternatives ?? []).slice(0, 3)];
  const compareTools = compareSlugs.map((s) => getToolBySlug(s)).filter(Boolean) as AirbnbTool[];

  return (
    <div className="min-h-screen bg-gray-50">
      <ToolsSeo kind="tool" tool={tool} path={`/outils-airbnb/${tool.slug}`} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={tool.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/75 to-blue-900/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <nav className="text-sm text-white/70 mb-6 flex flex-wrap gap-2">
            <Link to="/outils-airbnb" className="hover:text-white">
              Outils Airbnb
            </Link>
            <span>/</span>
            {category && (
              <>
                <Link to={`/outils-airbnb/${category.slug}`} className="hover:text-white">
                  {category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-white">{tool.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8 lg:items-end justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={tool.logo}
                  alt=""
                  className="w-14 h-14 rounded-xl bg-white object-contain p-1.5 shadow-lg"
                />
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">{tool.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-white font-semibold">{tool.note.toFixed(1)}/5</span>
                    <span className="text-white/60">·</span>
                    <span className="text-white/80">{tool.priceLabel}</span>
                  </div>
                </div>
              </div>
              <p className="text-lg text-white/85 leading-relaxed mb-4">{tool.description}</p>
              <div className="flex flex-wrap gap-2">
                {(tool.badges ?? []).map((b) => (
                  <Badge key={b} className="bg-white/15 text-white border-white/20">
                    {b}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <AffiliateButton
                toolSlug={tool.slug}
                href={tool.lienAffiliation}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 shadow-xl"
              >
                Essayer gratuitement
              </AffiliateButton>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="border-white/40 text-white bg-transparent hover:bg-white/10"
                onClick={() => setFavorites(toggleFavorite(tool.slug))}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFav ? 'fill-red-400 text-red-400' : ''}`} />
                {isFav ? 'Favori' : 'Favoris'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Présentation */}
        <section className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Présentation</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{tool.longDescription}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0 overflow-hidden">
                <img
                  src={tool.image}
                  alt={`${tool.name} — aperçu`}
                  className="w-full aspect-[16/9] object-cover"
                  loading="lazy"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {tool.fonctionnalites.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-gray-700">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="border-emerald-100">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 inline-flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5 text-emerald-600" /> Avantages
                  </h3>
                  <ul className="space-y-2">
                    {tool.avantages.map((a) => (
                      <li key={a} className="flex gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-red-100">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 inline-flex items-center gap-2">
                    <ThumbsDown className="w-5 h-5 text-red-500" /> Inconvénients
                  </h3>
                  <ul className="space-y-2">
                    {tool.inconvenients.map((a) => (
                      <li key={a} className="flex gap-2 text-sm text-gray-700">
                        <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <aside className="space-y-4">
            <Card className="sticky top-28 shadow-lg border-blue-100">
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Tarif indicatif</p>
                  <p className="text-xl font-bold text-gray-900">{tool.priceLabel}</p>
                </div>
                <AffiliateButton
                  toolSlug={tool.slug}
                  href={tool.lienAffiliation}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Essayer gratuitement
                </AffiliateButton>
                {(tool.liensAffiliation ?? []).map((l) => (
                  <AffiliateButton
                    key={l.url}
                    toolSlug={tool.slug}
                    href={l.url}
                    variant="outline"
                    className="w-full"
                  >
                    {l.label}
                  </AffiliateButton>
                ))}
                <Button asChild variant="outline" className="w-full">
                  <a href={tool.site} target="_blank" rel="noopener noreferrer">
                    Site officiel
                  </a>
                </Button>
                <p className="text-xs text-gray-500">
                  Liens d’affiliation : <code className="text-[10px]">rel=&quot;nofollow sponsored&quot;</code>
                </p>
              </CardContent>
            </Card>
          </aside>
        </section>

        {/* Comparatif */}
        {compareTools.length > 1 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Comparatif</h2>
            <p className="text-gray-600 mb-6">
              {tool.name} face à ses alternatives proches.
            </p>
            <ToolsComparator tools={compareTools} />
          </section>
        )}

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">FAQ</h2>
          <Accordion type="single" collapsible className="bg-white rounded-xl border px-4">
            {tool.faq.map((f, i) => (
              <AccordionItem key={f.question} value={`t-faq-${i}`}>
                <AccordionTrigger>{f.question}</AccordionTrigger>
                <AccordionContent>{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Avis */}
        <section>
          <Card>
            <CardContent className="p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Avis éditorial</h2>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-lg">{tool.note.toFixed(1)}/5</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Notre équipe note {tool.name} à {tool.note.toFixed(1)}/5 au regard de ses fonctionnalités,
                de son adoption chez les hôtes / conciergeries, et de son positionnement tarifaire (
                {tool.priceLabel}). Utilisez le comparatif et les alternatives pour valider le fit avec votre volume de logements.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Alternatives */}
        {alternatives.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Alternatives</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {alternatives.map((alt) => (
                <ToolCard key={alt.slug} tool={alt} />
              ))}
            </div>
          </section>
        )}

        <RelatedArticles relatedBlogSlugs={tool.relatedBlogSlugs} />

        {/* CTA */}
        <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 lg:p-10 text-center">
          <h2 className="text-2xl font-bold mb-3">Prêt à tester {tool.name} ?</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            Lancez un essai et comparez avec d’autres solutions de la même catégorie.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <AffiliateButton
              toolSlug={tool.slug}
              href={tool.lienAffiliation}
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50"
            >
              Essayer gratuitement
            </AffiliateButton>
            {category && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
              >
                <Link to={`/outils-airbnb/${category.slug}`}>Voir la catégorie</Link>
              </Button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
