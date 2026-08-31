import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SeoGenerator } from '@/seo/components/SeoGenerator';
import { BreadcrumbGenerator } from '@/seo/components/BreadcrumbGenerator';

function toNumber(v: string) {
  const n = Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function euros(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

function pct(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'percent', maximumFractionDigits: 0 }).format(n);
}

export default function ProfitSimulator() {
  const path = '/hub/simulateur-rentabilite';
  const title = 'Simulateur rentabilité conciergerie : calcul CA, charges, marge (2026)';
  const description =
    "Simulez le chiffre d’affaires et la marge d’une conciergerie selon vos hypothèses (logements, revenus, commission, charges). Simulation indicative.";

  const [mode, setMode] = useState<'logements' | 'reservations'>('logements');
  const [logements, setLogements] = useState('10');
  const [revenuMensuelParLogement, setRevenuMensuelParLogement] = useState('1800');
  const [reservationsMensuelles, setReservationsMensuelles] = useState('35');
  const [prixMoyenReservation, setPrixMoyenReservation] = useState('320');

  const [tauxCommission, setTauxCommission] = useState('20');
  const [fraisMenageMensuels, setFraisMenageMensuels] = useState('1800');
  const [logicielsMensuels, setLogicielsMensuels] = useState('250');
  const [assuranceMensuelle, setAssuranceMensuelle] = useState('80');
  const [comptaMensuelle, setComptaMensuelle] = useState('150');
  const [publiciteMensuelle, setPubliciteMensuelle] = useState('200');
  const [autresChargesMensuelles, setAutresChargesMensuelles] = useState('120');

  const computed = useMemo(() => {
    const nbLogements = Math.max(0, Math.floor(toNumber(logements)));
    const revParLogement = Math.max(0, toNumber(revenuMensuelParLogement));
    const resas = Math.max(0, Math.floor(toNumber(reservationsMensuelles)));
    const adr = Math.max(0, toNumber(prixMoyenReservation));
    const commissionRate = Math.min(100, Math.max(0, toNumber(tauxCommission))) / 100;

    const gmv =
      mode === 'logements'
        ? nbLogements * revParLogement
        : resas * adr;

    const caConciergerie = gmv * commissionRate;

    const charges =
      Math.max(0, toNumber(fraisMenageMensuels)) +
      Math.max(0, toNumber(logicielsMensuels)) +
      Math.max(0, toNumber(assuranceMensuelle)) +
      Math.max(0, toNumber(comptaMensuelle)) +
      Math.max(0, toNumber(publiciteMensuelle)) +
      Math.max(0, toNumber(autresChargesMensuelles));

    const resultat = caConciergerie - charges;
    const marge = caConciergerie > 0 ? resultat / caConciergerie : 0;

    return {
      gmv,
      caConciergerie,
      charges,
      resultat,
      marge,
      annuel: {
        gmv: gmv * 12,
        caConciergerie: caConciergerie * 12,
        charges: charges * 12,
        resultat: resultat * 12,
      },
    };
  }, [
    mode,
    logements,
    revenuMensuelParLogement,
    reservationsMensuelles,
    prixMoyenReservation,
    tauxCommission,
    fraisMenageMensuels,
    logicielsMensuels,
    assuranceMensuelle,
    comptaMensuelle,
    publiciteMensuelle,
    autresChargesMensuelles,
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SeoGenerator
        title={title}
        description={description}
        path={path}
        type="guide"
        robots="index,follow"
        breadcrumbs={[
          { name: 'Accueil', path: '/' },
          { name: 'Hub', path: '/hub' },
          { name: 'Simulateur de rentabilité', path },
        ]}
      />

      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <BreadcrumbGenerator
            items={[
              { name: 'Accueil', path: '/' },
              { name: 'Hub', path: '/hub' },
              { name: 'Simulateur', path },
            ]}
            variant="dark"
          />
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-white/15 text-white border-white/20 hover:bg-white/20">Outil · MOFU</Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Simulateur de rentabilité conciergerie
              </h1>
              <p className="text-lg text-blue-100 leading-relaxed mb-6">{description}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                  <Link to="/devis">Parler à des pros (devis)</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
                >
                  <Link to="/hub">Retour Hub</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="/images/hub/hub-hero.svg"
                alt="Illustration: simulateur de rentabilité"
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
        <Card>
          <CardContent className="p-6 lg:p-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Simulation indicative</h2>
            <p className="text-gray-700 leading-relaxed">
              Cette simulation aide à tester des hypothèses (volumes, commission, charges). Les résultats réels dépendent
              fortement de la qualité opérationnelle, du marché local et de votre modèle (ménage inclus, options, sous-traitance…).
            </p>
          </CardContent>
        </Card>

        <section className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardContent className="p-6 lg:p-8 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMode('logements')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                    mode === 'logements'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Par logements
                </button>
                <button
                  type="button"
                  onClick={() => setMode('reservations')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                    mode === 'reservations'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Par réservations
                </button>
              </div>

              {mode === 'logements' ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Nombre de logements</label>
                    <Input value={logements} onChange={(e) => setLogements(e.target.value)} inputMode="numeric" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900">Revenu mensuel moyen par logement (GMV)</label>
                    <Input
                      value={revenuMensuelParLogement}
                      onChange={(e) => setRevenuMensuelParLogement(e.target.value)}
                      inputMode="decimal"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Nombre de réservations mensuelles</label>
                    <Input value={reservationsMensuelles} onChange={(e) => setReservationsMensuelles(e.target.value)} inputMode="numeric" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900">Prix moyen par réservation</label>
                    <Input value={prixMoyenReservation} onChange={(e) => setPrixMoyenReservation(e.target.value)} inputMode="decimal" />
                  </div>
                </div>
              )}

              <DividerLine />

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-900">Taux de commission (%)</label>
                  <Input value={tauxCommission} onChange={(e) => setTauxCommission(e.target.value)} inputMode="decimal" />
                </div>
                <div className="text-sm text-gray-600 flex items-end">
                  Le CA conciergerie est calculé sur \(GMV × commission\). Ajuste ensuite les charges.
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <MoneyField label="Frais ménage (mensuels)" value={fraisMenageMensuels} onChange={setFraisMenageMensuels} />
                <MoneyField label="Logiciels (mensuels)" value={logicielsMensuels} onChange={setLogicielsMensuels} />
                <MoneyField label="Assurance (mensuelle)" value={assuranceMensuelle} onChange={setAssuranceMensuelle} />
                <MoneyField label="Comptabilité (mensuelle)" value={comptaMensuelle} onChange={setComptaMensuelle} />
                <MoneyField label="Publicité (mensuelle)" value={publiciteMensuelle} onChange={setPubliciteMensuelle} />
                <MoneyField label="Autres charges (mensuelles)" value={autresChargesMensuelles} onChange={setAutresChargesMensuelles} />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Résultats (mensuel)</h3>
                <StatRow label="GMV (revenus locatifs gérés)" value={euros(computed.gmv)} />
                <StatRow label="CA conciergerie estimé" value={euros(computed.caConciergerie)} strong />
                <StatRow label="Charges estimées" value={euros(computed.charges)} />
                <StatRow label="Résultat estimé" value={euros(computed.resultat)} strong tone={computed.resultat >= 0 ? 'good' : 'bad'} />
                <StatRow label="Marge" value={pct(computed.marge)} />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Résultats (annuel)</h3>
                <StatRow label="GMV annuel" value={euros(computed.annuel.gmv)} />
                <StatRow label="CA conciergerie annuel" value={euros(computed.annuel.caConciergerie)} strong />
                <StatRow label="Charges annuelles" value={euros(computed.annuel.charges)} />
                <StatRow
                  label="Résultat annuel"
                  value={euros(computed.annuel.resultat)}
                  strong
                  tone={computed.annuel.resultat >= 0 ? 'good' : 'bad'}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-gray-900">Pages utiles</h3>
                <div className="flex flex-col gap-2 text-sm">
                  <Link className="text-blue-700 hover:underline" to="/hub/creation-entreprise/business-plan-conciergerie">
                    Business plan conciergerie
                  </Link>
                  <Link className="text-blue-700 hover:underline" to="/hub/creation-entreprise/cout-creation-conciergerie">
                    Coût création conciergerie
                  </Link>
                  <Link className="text-blue-700 hover:underline" to="/hub/assurance/rc-pro-conciergerie">
                    RC Pro conciergerie
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

function DividerLine() {
  return <div className="h-px bg-gray-200" />;
}

function MoneyField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-900">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} inputMode="decimal" />
    </div>
  );
}

function StatRow({
  label,
  value,
  strong,
  tone,
}: {
  label: string;
  value: string;
  strong?: boolean;
  tone?: 'good' | 'bad';
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`${strong ? 'font-semibold' : 'font-medium'} ${tone === 'bad' ? 'text-red-700' : tone === 'good' ? 'text-emerald-700' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  );
}

