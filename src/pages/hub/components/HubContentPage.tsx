import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SeoGenerator } from '@/seo/components/SeoGenerator';
import type { HubPageDefinition } from '@/data/hub/hubPages';
import { getHubBreadcrumbs } from '@/data/hub/hubPages';
import { HubNotice, HubPageShell } from '@/pages/hub/components/HubPageShell';
import { getPartnersByCategory } from '@/data/hub/partners';
import { AffiliatePartners } from '@/pages/hub/components/AffiliatePartners';

function computeRobots(indexable: boolean) {
  return indexable ? 'index,follow' : 'noindex,follow';
}

export default function HubContentPage({ page }: { page: HubPageDefinition }) {
  const breadcrumbs = getHubBreadcrumbs(page);
  const partners = page.partnerCategory ? getPartnersByCategory(page.partnerCategory) : [];
  return (
    <>
      <SeoGenerator
        title={page.title}
        description={page.description}
        path={page.path}
        type={page.type}
        breadcrumbs={breadcrumbs}
        faqs={page.faqs}
        robots={computeRobots(page.indexable)}
        extraJsonLd={
          page.comparisonTable
            ? [
                {
                  '@context': 'https://schema.org',
                  '@type': 'Article',
                  headline: page.title,
                  description: page.description,
                  mainEntityOfPage: `https://ma-conciergerie-annuaire.com${page.path}`,
                },
              ]
            : []
        }
      />

      <HubPageShell
        badge={`${page.cluster} · ${page.funnel}`}
        h1={page.h1}
        intro={page.intro ?? page.description}
        breadcrumbs={breadcrumbs}
        ctaPrimary={page.ctaPrimary}
        ctaSecondary={page.ctaSecondary}
      >
        <HubNotice affiliateDisclosure={page.affiliateDisclosure} legalDisclaimer={page.legalDisclaimer} />

        {partners.length > 0 && (
          <AffiliatePartners
            title={page.partnerCategory === 'banque-professionnelle' ? 'Banques/solutions à comparer' : 'Partenaires'}
            partners={partners}
          />
        )}

        {page.comparisonTable && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tableau comparatif</h2>
            {page.comparisonTable.caption && <p className="text-sm text-gray-600 mb-3">{page.comparisonTable.caption}</p>}
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="min-w-[900px] w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {page.comparisonTable.headers.map((h) => (
                      <th key={h} className="text-left font-semibold text-gray-900 px-4 py-3 border-b border-gray-200">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {page.comparisonTable.rows.map((r, idx) => (
                    <tr key={idx} className="odd:bg-white even:bg-gray-50">
                      {r.map((cell, cidx) => (
                        <td key={cidx} className="px-4 py-3 border-b border-gray-200 text-gray-700">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {page.sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{s.title}</h2>
            {s.paragraphs?.map((p) => (
              <p key={p} className="text-gray-700 leading-relaxed max-w-3xl mb-3">
                {p}
              </p>
            ))}
            {s.bullets?.length ? (
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <Card>
          <CardContent className="p-6 lg:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Besoin d’une conciergerie (au lieu d’en créer une) ?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Si tu es propriétaire et que tu veux déléguer, l’annuaire existant te permet de comparer les conciergeries (Airbnb,
              Booking, Abritel) et de demander des devis.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/conciergeries">Voir l’annuaire</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/devis">Demander des devis</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {page.parent?.path && (
          <div className="text-sm">
            <Link to={page.parent.path} className="text-blue-700 hover:underline">
              ← Retour {page.parent.name}
            </Link>
          </div>
        )}
      </HubPageShell>
    </>
  );
}

