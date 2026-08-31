import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SeoGenerator } from '@/seo/components/SeoGenerator';

type Props = {
  path: string;
  title: string;
  h1: string;
  description: string;
  platformLabel: 'Booking' | 'Abritel';
  ctaHref: string;
  ctaLabel: string;
  sections: { title: string; body: string[] }[];
};

export default function PlatformIntentPage({
  path,
  title,
  h1,
  description,
  platformLabel,
  ctaHref,
  ctaLabel,
  sections,
}: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SeoGenerator
        title={title}
        description={description}
        path={path}
        type="guide"
        breadcrumbs={[
          { name: 'Accueil', path: '/' },
          { name: platformLabel, path: `/${platformLabel.toLowerCase()}` },
          { name: h1, path },
        ]}
      />

      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <Badge className="mb-4 bg-white/15 text-white border-white/20 hover:bg-white/20">
            {platformLabel} · Guide
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">{h1}</h1>
          <p className="text-lg text-blue-100 leading-relaxed max-w-3xl">{description}</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              <Link to={ctaHref}>{ctaLabel}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
            >
              <Link to={`/${platformLabel.toLowerCase()}`}>Retour {platformLabel}</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {sections.map((s) => (
          <Card key={s.title}>
            <CardContent className="p-6 lg:p-8 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">{s.title}</h2>
              {s.body.map((p) => (
                <p key={p} className="text-gray-700 leading-relaxed">
                  {p}
                </p>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

