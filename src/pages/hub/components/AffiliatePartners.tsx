import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { AffiliatePartner } from '@/data/hub/partners';

function pickHref(p: AffiliatePartner) {
  return p.affiliateUrl?.trim() || p.websiteUrl?.trim() || '';
}

function brandFallback(name: string) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
  return initials || 'PRO';
}

export function AffiliatePartners({
  title,
  partners,
}: {
  title: string;
  partners: AffiliatePartner[];
}) {
  if (!partners.length) return null;
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {partners.map((p) => {
          const href = pickHref(p);
          return (
            <Card key={p.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                    {p.pricing ? <p className="text-sm text-gray-600">{p.pricing}</p> : null}
                  </div>
                  {p.logoSrc ? (
                    <img
                      src={p.logoSrc}
                      alt={p.name}
                      className="w-10 h-10 rounded-md object-contain bg-white border border-gray-200"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                      {brandFallback(p.name)}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{p.description}</p>
                {!!p.features?.length && (
                  <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                    {p.features.slice(0, 4).map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                )}
                {href ? (
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 w-full">
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      Visiter <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                ) : null}
                {p.isAffiliate ? (
                  <p className="text-xs text-gray-500">
                    Certains liens peuvent être affiliés (transparence). Prix inchangé pour l’utilisateur.
                  </p>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

