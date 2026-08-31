import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BreadcrumbGenerator } from '@/seo/components/BreadcrumbGenerator';
import type { SeoBreadcrumbItem } from '@/seo/types';

type Props = {
  badge?: string;
  h1: string;
  intro: string;
  breadcrumbs: SeoBreadcrumbItem[];
  heroImageSrc?: string;
  heroImageAlt?: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  children: React.ReactNode;
};

export function HubPageShell({
  badge = 'Hub',
  h1,
  intro,
  breadcrumbs,
  heroImageSrc = '/images/hub/hub-hero.svg',
  heroImageAlt = 'Illustration du hub création d’entreprise',
  ctaPrimary,
  ctaSecondary,
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <BreadcrumbGenerator items={breadcrumbs} variant="dark" />
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-white/15 text-white border-white/20 hover:bg-white/20">{badge}</Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">{h1}</h1>
              <p className="text-lg text-blue-100 leading-relaxed mb-6">{intro}</p>
              {(ctaPrimary || ctaSecondary) && (
                <div className="flex flex-col sm:flex-row gap-3">
                  {ctaPrimary && (
                    <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                      <Link to={ctaPrimary.href}>{ctaPrimary.label}</Link>
                    </Button>
                  )}
                  {ctaSecondary && (
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
                    >
                      <Link to={ctaSecondary.href}>{ctaSecondary.label}</Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div className="hidden lg:block">
              <img
                src={heroImageSrc}
                alt={heroImageAlt}
                width={1200}
                height={600}
                loading="lazy"
                decoding="async"
                className="w-full max-w-[560px] ml-auto rounded-2xl border border-white/15 bg-white/5"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">{children}</div>
    </div>
  );
}

export function HubNotice({
  affiliateDisclosure,
  legalDisclaimer,
}: {
  affiliateDisclosure?: boolean;
  legalDisclaimer?: boolean;
}) {
  if (!affiliateDisclosure && !legalDisclaimer) return null;
  return (
    <Card>
      <CardContent className="p-6 lg:p-8 space-y-3 text-sm text-gray-700">
        {affiliateDisclosure && (
          <p>
            <strong>Transparence affiliation</strong> — certains liens présents sur cette page peuvent être affiliés. Cela
            ne modifie pas le prix payé par l’utilisateur et peut nous permettre de percevoir une commission.
          </p>
        )}
        {legalDisclaimer && (
          <p>
            <strong>Information générale</strong> — les règles fiscales, sociales et juridiques peuvent évoluer. Vérifiez
            les informations auprès des organismes officiels ou d’un professionnel.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

