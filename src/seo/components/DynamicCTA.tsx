import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

type Props = {
  title?: string;
  subtitle?: string;
  primaryTo?: string;
  primaryLabel?: string;
  secondaryTo?: string;
  secondaryLabel?: string;
};

export function DynamicCTA({
  title = 'Obtenez des devis de conciergeries',
  subtitle = 'Comparez gratuitement les prestataires adaptés à votre bien.',
  primaryTo = '/devis',
  primaryLabel = 'Obtenir des devis',
  secondaryTo = '/outils-airbnb',
  secondaryLabel = 'Voir les outils Airbnb',
}: Props) {
  return (
    <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 lg:p-10 text-center">
      <h2 className="text-2xl font-bold mb-3">{title}</h2>
      <p className="text-blue-100 mb-6 max-w-xl mx-auto">{subtitle}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
          <Link to={primaryTo}>{primaryLabel}</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
        >
          <Link to={secondaryTo}>{secondaryLabel}</Link>
        </Button>
      </div>
    </section>
  );
}
