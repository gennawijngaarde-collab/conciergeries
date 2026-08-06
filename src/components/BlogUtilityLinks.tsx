import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  cityHint?: string | null;
};

/**
 * Bloc d’utilité publique + maillage interne (AdSense / qualité éditoriale).
 * Liens vers services réellement utiles, pas du spam de mots-clés.
 */
export default function BlogUtilityLinks({ cityHint }: Props) {
  const cityPages = [
    { label: 'Paris', to: '/conciergerie-paris' },
    { label: 'Lyon', to: '/conciergerie-lyon' },
    { label: 'Marseille', to: '/conciergerie-marseille' },
    { label: 'Bordeaux', to: '/conciergerie-bordeaux' },
  ];

  const guides = [
    { label: 'Choisir une conciergerie (2026)', to: '/blog/choisir-conciergerie-airbnb-2026' },
    { label: 'Prix d’une conciergerie', to: '/blog/conciergerie-airbnb-combien-ca-coute' },
    { label: 'Outils Airbnb', to: '/outils-airbnb' },
    { label: 'Top PMS', to: '/top-pms-airbnb' },
  ];

  return (
    <section
      className="my-10 rounded-xl border border-blue-100 bg-blue-50/60 p-6 sm:p-8"
      aria-labelledby="blog-utility-heading"
    >
      <h2 id="blog-utility-heading" className="text-xl font-bold text-gray-900 mb-2">
        Passer à l’action
      </h2>
      <p className="text-gray-700 text-sm sm:text-base mb-5 leading-relaxed">
        Cet article est informatif. Pour aller plus loin : comparez des prestataires locaux, demandez
        des devis gratuits, ou explorez les outils pour automatiser votre location.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link to="/devis">
            Obtenir des devis gratuits <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to={cityHint ? `/conciergeries?city=${encodeURIComponent(cityHint)}` : '/conciergeries'}>
            Voir l’annuaire
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/outils-airbnb">Marketplace outils</Link>
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-semibold text-gray-800 mb-2">Conciergeries par ville</p>
          <ul className="space-y-1.5">
            {cityPages.map((c) => (
              <li key={c.to}>
                <Link to={c.to} className="text-blue-700 hover:underline">
                  Conciergerie Airbnb {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-gray-800 mb-2">Guides utiles</p>
          <ul className="space-y-1.5">
            {guides.map((g) => (
              <li key={g.to}>
                <Link to={g.to} className="text-blue-700 hover:underline">
                  {g.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/contact" className="text-blue-700 hover:underline">
                Contact
              </Link>
              {' · '}
              <Link to="/confidentialite" className="text-blue-700 hover:underline">
                Confidentialité
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
