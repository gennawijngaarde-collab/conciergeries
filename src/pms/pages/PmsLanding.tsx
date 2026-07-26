import { Link } from 'react-router-dom';
import { ArrowRight, CalendarSync, CheckCircle2, Sparkles, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getProfile } from '../storage';
import { subscriptionPlans, siteConfig } from '@/data/site';

const features = [
  {
    icon: CalendarSync,
    title: 'Sync iCal Airbnb',
    text: 'Reliez le calendrier de chaque logement et générez les ménages au checkout.',
  },
  {
    icon: Workflow,
    title: 'Workflow opérationnel',
    text: 'Suivez pending → en cours → terminé pour chaque intervention.',
  },
  {
    icon: Sparkles,
    title: 'Dashboard conciergerie',
    text: 'Vue du jour, propriétés actives et priorités ménage en un coup d’œil.',
  },
];

export default function PmsLanding() {
  const profile = getProfile();
  const ctaTo = profile?.onboarded ? '/pms/dashboard' : '/pms/onboarding';
  const { premium, pms, trialDays } = subscriptionPlans;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="bg-[#0f1f12] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <Badge className="mb-4 bg-[#c9a57a] text-[#114c09] hover:bg-[#c9a57a]">
            Module intégré · {siteConfig.cleanbnb.label} PMS
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-bold max-w-3xl leading-tight mb-5">
            Le PMS ménage de votre annuaire, pour industrialiser les turnovers Airbnb
          </h1>
          <p className="text-lg text-white/75 max-w-2xl mb-4">
            Inclus dans l’abonnement Premium de l’annuaire, ou disponible en abonnement PMS dédié.
            Essai gratuit {trialDays} jours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="bg-[#c9a57a] text-[#114c09] hover:bg-[#b89268]">
              <Link to={ctaTo}>
                {profile?.onboarded ? 'Ouvrir mon PMS' : 'Démarrer la démo / onboarding'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/50 bg-transparent text-white hover:bg-white/15 hover:text-white"
            >
              <Link to="/devenir-partenaire">Voir les abonnements</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((f) => (
            <Card key={f.title} className="border-slate-200">
              <CardContent className="p-6">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#114c09] flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5" />
                </div>
                <h2 className="font-semibold text-lg mb-2">{f.title}</h2>
                <p className="text-sm text-gray-600">{f.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="border-amber-200">
            <CardContent className="p-6">
              <Badge className="mb-3 bg-yellow-400 text-yellow-900 hover:bg-yellow-400">Premium annuaire</Badge>
              <h2 className="text-xl font-bold mb-1">{premium.priceLabel} / mois</h2>
              <p className="text-sm text-gray-600 mb-4">
                Mise en avant dans l’annuaire <strong>et</strong> Cleanbnb PMS inclus.
                Essai {trialDays} jours.
              </p>
              <ul className="space-y-2 text-sm text-gray-700 mb-5">
                {premium.features.slice(0, 4).map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#114c09] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full bg-amber-500 hover:bg-amber-600 text-amber-950">
                <Link to="/devenir-partenaire">Essayer Premium</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-emerald-200">
            <CardContent className="p-6">
              <Badge className="mb-3 bg-emerald-100 text-emerald-900 hover:bg-emerald-100">PMS seul</Badge>
              <h2 className="text-xl font-bold mb-1">{pms.priceLabel} / mois</h2>
              <p className="text-sm text-gray-600 mb-4">
                Abonnement Cleanbnb dédié, sans pack annuaire Premium. Essai {trialDays} jours.
              </p>
              <ul className="space-y-2 text-sm text-gray-700 mb-5">
                {pms.features.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#114c09] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full bg-[#114c09] hover:bg-[#0c3a07]">
                <Link to="/devenir-partenaire">Essayer le PMS</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#114c09] text-white border-0">
          <CardContent className="p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Onboarding en 3 minutes</h2>
              <ul className="space-y-2 text-white/85 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#c9a57a]" /> Créer votre espace conciergerie
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#c9a57a]" /> Ajouter un premier logement + iCal
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#c9a57a]" /> Planifier un ménage et suivre le statut
                </li>
              </ul>
            </div>
            <Button asChild size="lg" className="bg-[#c9a57a] text-[#114c09] hover:bg-[#b89268]">
              <Link to="/pms/onboarding">Lancer l’onboarding</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
