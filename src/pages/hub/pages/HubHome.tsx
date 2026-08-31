import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SeoGenerator } from '@/seo/components/SeoGenerator';
import { BreadcrumbGenerator } from '@/seo/components/BreadcrumbGenerator';

export default function HubHome() {
  const path = '/hub';
  const title = "Création d'une conciergerie Airbnb : guide complet 2026";
  const description =
    "Le hub pour créer et développer une conciergerie (Airbnb, Booking, Abritel): création d’entreprise, statut, banque pro, assurance, comptabilité, financement, logiciels et simulateur de rentabilité.";

  return (
    <div className="min-h-screen bg-gray-50">
      <SeoGenerator
        title={title}
        description={description}
        path={path}
        type="guide"
        breadcrumbs={[
          { name: 'Accueil', path: '/' },
          { name: 'Hub', path },
        ]}
      />

      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <BreadcrumbGenerator
            items={[
              { name: 'Accueil', path: '/' },
              { name: 'Hub', path },
            ]}
            variant="dark"
          />
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-white/15 text-white border-white/20 hover:bg-white/20">
                Hub · Création & Finance
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Créer et développer une conciergerie Airbnb : le guide complet
              </h1>
              <p className="text-lg text-blue-100 leading-relaxed mb-6">{description}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                  <Link to="/hub/simulateur-rentabilite">Simulateur de rentabilité</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
                >
                  <Link to="/conciergeries">Annuaire conciergeries</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="/images/hub/hub-hero.svg"
                alt="Illustration: création d’entreprise et finance"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <section className="grid lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2">
            <CardContent className="p-6 lg:p-8 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Choisis ton parcours</h2>
              <p className="text-gray-700 leading-relaxed">
                Le Hub est organisé pour répondre à une intention précise (informationnelle + commerciale) sans pages clonées.
                Commence par le parcours qui te correspond, puis approfondis.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/hub/creation-entreprise/creer-conciergerie-airbnb">Je démarre (plan d’action)</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/hub/banque-professionnelle">Je choisis une banque pro</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/hub/simulateur-rentabilite">Je simule ma rentabilité</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 lg:p-8 space-y-3">
              <h3 className="text-lg font-bold text-gray-900">Règle anti “contenu générique”</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                On évite les “guides SEO” vagues. Chaque page doit avoir une intention, un CTA clair et des checklists actionnables.
              </p>
              <p className="text-xs text-gray-600">
                Certaines pages comparatives peuvent être en <strong>noindex</strong> tant qu’elles n’ont pas assez de données vérifiées.
              </p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardContent className="p-6 lg:p-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Les étapes (vue d’ensemble)</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Étude de marché et choix du modèle économique.</li>
              <li>Statut juridique + banque pro + assurance.</li>
              <li>Process opérationnels (ménage, check-in, incidents).</li>
              <li>Comptabilité, facturation et pilotage.</li>
              <li>Outils (PMS, channel manager) et acquisition de clients.</li>
              <li>Rentabilité: hypothèses, charges, marge (simulateur).</li>
            </ul>
            <p className="text-sm text-gray-600">
              Note: on évite les conseils juridiques/fiscaux “définitifs”. Les règles peuvent évoluer — vérifie auprès
              d’organismes officiels ou d’un professionnel.
            </p>
          </CardContent>
        </Card>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { href: '/hub/creation-entreprise', title: "Création d’entreprise", desc: 'Offre, process, acquisition, business plan.' },
            { href: '/hub/statut-juridique', title: 'Statut juridique', desc: 'Micro, SASU, EURL… méthode de comparaison.' },
            { href: '/hub/banque-professionnelle', title: 'Banque pro', desc: 'Compte pro, encaissements, exports compta.' },
            { href: '/hub/assurance', title: 'Assurance', desc: 'RC Pro, risques, méthode de comparaison.' },
            { href: '/hub/comptabilite', title: 'Comptabilité', desc: 'Comptable, logiciels, TVA, pilotage.' },
            { href: '/hub/financement', title: 'Financement', desc: 'Dossier, prêt, microcrédit, aides (sans promesse).' },
            { href: '/hub/logiciels', title: 'Logiciels', desc: 'Stack conciergerie: PMS, channel manager, automatisation.' },
            { href: '/hub/facturation', title: 'Facturation', desc: 'Commission, forfait, modèles simples.' },
            { href: '/hub/aides-creation-entreprise', title: 'Aides', desc: 'Méthode + sources fiables.' },
          ].map((c) => (
            <Card key={c.href} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-gray-900">{c.title}</h3>
                <p className="text-sm text-gray-600">{c.desc}</p>
                <Button asChild variant="outline">
                  <Link to={c.href}>Voir</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card>
          <CardContent className="p-6 lg:p-8 space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Affiliation & transparence</h2>
            <p className="text-gray-700 leading-relaxed">
              Certains liens sur les pages “banque/assurance/comptabilité/logiciels” peuvent être affiliés. Cela ne change pas le prix
              et peut financer le site.
            </p>
            <p className="text-sm text-gray-600">
              Nous n’affichons pas de tarifs ou de “classements” sans informations vérifiables. Les fiches partenaires doivent être
              modifiables facilement (code puis future base de données).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

