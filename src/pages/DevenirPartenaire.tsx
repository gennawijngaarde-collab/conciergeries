import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import {
  BadgeCheck,
  Building2,
  Check,
  Crown,
  Mail,
  Phone,
  Sparkles,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/context/AuthContext';

const planSchema = z.enum(['standard', 'premium']);

const schema = z.object({
  plan: planSchema,
  conciergerieName: z.string().min(2, 'Nom de la conciergerie requis').max(80),
  contactName: z.string().min(2, 'Nom du contact requis').max(80),
  email: z.string().email('Email invalide'),
  phone: z.string().max(40).optional().or(z.literal('')),
  website: z.string().url('URL invalide').max(200).optional().or(z.literal('')),
  cities: z.string().min(2, 'Villes couvertes requises').max(200),
  address: z.string().max(200).optional().or(z.literal('')),
  description: z
    .string()
    .min(30, 'Décrivez votre conciergerie (min. 30 caractères)')
    .max(450, 'Description trop longue (max. 450 caractères)'),
  logoUrl: z.string().url('URL invalide').max(250).optional().or(z.literal('')),
  siret: z.string().max(40).optional().or(z.literal('')),
  notes: z.string().max(450).optional().or(z.literal('')),
  acceptTerms: z.boolean().refine((v) => v, 'Vous devez accepter la politique de confidentialité'),
});

type FormValues = z.infer<typeof schema>;

const DevenirPartenaire = () => {
  const [isRedirectingToStripe, setIsRedirectingToStripe] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { user, session, loading: authLoading } = useAuth();

  const accountLink = useMemo(() => {
    const redirect = encodeURIComponent(location.pathname + location.search + location.hash);
    return `/compte?redirect=${redirect}`;
  }, [location.pathname, location.search, location.hash]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      plan: 'standard',
      conciergerieName: '',
      contactName: '',
      email: '',
      phone: '',
      website: '',
      cities: '',
      address: '',
      description: '',
      logoUrl: '',
      siret: '',
      notes: '',
      acceptTerms: false,
    },
    mode: 'onTouched',
  });

  const plan = useWatch({ control: form.control, name: 'plan' }) ?? 'standard';
  const planLabel = plan === 'premium' ? 'Premium' : 'Standard';

  const success = searchParams.get('success') === '1';
  const canceled = searchParams.get('canceled') === '1';
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!success || !sessionId) return;
    try {
      localStorage.setItem('stripe:lastCheckoutSessionId', sessionId);
    } catch {
      // ignore
    }
  }, [success, sessionId]);

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    setIsRedirectingToStripe(true);

    try {
      const token = session?.access_token;
      if (!token) {
        throw new Error('Connectez-vous avant de payer.');
      }

      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        const data = (() => {
          try {
            return text ? JSON.parse(text) : null;
          } catch {
            return null;
          }
        })();

        const baseMsg =
          typeof data?.error === 'string' && data.error
            ? data.error
            : text?.trim()
              ? text.trim()
              : 'Impossible de démarrer le paiement';

        if (res.status === 404) {
          throw new Error(
            "API Stripe introuvable (404). Vérifie que le projet Vercel déployé contient bien le dossier `api/` et redeploie."
          );
        }
        if (res.status === 401) {
          throw new Error('Veuillez vous connecter avant de payer.');
        }

        throw new Error(`${baseMsg} (HTTP ${res.status})`);
      }

      const data = (await res.json()) as { url?: string };
      if (!data.url) throw new Error('URL de paiement manquante');

      // keep a local copy for support/debug if needed
      try {
        localStorage.setItem('partnerApplication:last', JSON.stringify(values));
      } catch {
        // ignore
      }

      window.location.href = data.url;
    } catch (e: any) {
      setSubmitError(e?.message ?? 'Erreur inconnue');
      setIsRedirectingToStripe(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-white/90 text-sm font-medium">
                Abonnement conciergerie — Standard & Premium
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
              Inscrivez votre conciergerie sur l&apos;annuaire
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed">
              Gagnez en visibilité auprès des propriétaires. Créez une fiche complète (coordonnées, logo,
              description, services, zones couvertes) et obtenez un badge Standard ou Premium.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild className="bg-white text-blue-700 hover:bg-blue-50">
                <a href="#formulaire">
                  <BadgeCheck className="w-4 h-4 mr-2" />
                  Demander l&apos;inscription
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
              >
                <Link to="/conciergeries">
                  <Building2 className="w-4 h-4 mr-2" />
                  Voir l&apos;annuaire
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Success */}
      {(success || canceled) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
          <Card className="shadow-xl border-0">
            <CardContent className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      className={
                        success
                          ? 'bg-green-100 text-green-700 hover:bg-green-100'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                      }
                    >
                      {success ? 'Paiement reçu' : 'Paiement annulé'}
                    </Badge>
                    <Badge
                      className={
                        plan === 'premium'
                          ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-400'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                      }
                    >
                      {planLabel}
                    </Badge>
                  </div>
                  {success ? (
                    <div className="text-gray-700 space-y-2">
                      <p>
                        Merci. Votre paiement a été validé et votre abonnement est en cours d’activation.
                        Accédez à votre <strong>espace partenaire</strong> pour voir le statut (cela peut prendre
                        quelques secondes après le paiement).
                      </p>
                      {sessionId && (
                        <p className="text-sm text-gray-500">
                          Référence: <code className="bg-gray-100 px-2 py-1 rounded">{sessionId}</code>
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-700">
                      Le paiement a été annulé. Vous pouvez réessayer quand vous voulez en renvoyant le
                      formulaire.
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  {success ? (
                    <Button
                      asChild
                      className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                    >
                      <Link to="/espace-partenaire">Aller à l’espace partenaire</Link>
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                    >
                      <a href="#formulaire">Aller au formulaire</a>
                    </Button>
                  )}
                  <Button asChild variant="outline">
                    <a href="mailto:contact@conciergeries-france.fr">
                      <Mail className="w-4 h-4 mr-2" />
                      Contacter support
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pricing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <Badge className="mb-3 bg-blue-100 text-blue-700 hover:bg-blue-100">Abonnements</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Standard ou Premium (avec badges)
          </h2>
          <p className="text-gray-600 mt-2">
            Le Premium ajoute de la mise en avant et un badge visible dans l&apos;annuaire.
          </p>
        </div>

        {!authLoading && !user && (
          <div className="mb-8">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="font-semibold">Connexion requise</div>
                <div className="text-amber-800">
                  Pour payer et créer votre accès à l&apos;espace partenaire, connectez-vous (ou créez un compte).
                </div>
              </div>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
                <Link to={accountLink}>Se connecter</Link>
              </Button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Standard */}
          <Card className={`overflow-hidden ${plan === 'standard' ? 'ring-2 ring-blue-500' : ''}`}>
            <CardContent className="p-6 lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Standard</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Fiche complète</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Pour être présent dans l&apos;annuaire avec vos coordonnées.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-gray-900">29€</div>
                  <div className="text-sm text-gray-500">/ mois</div>
                </div>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                {[
                  'Fiche conciergerie (logo, description, services, plateformes)',
                  'Coordonnées (téléphone, email, site web, adresse)',
                  'Apparition dans la recherche et la carte',
                  'Badge Standard',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => {
                  form.setValue('plan', 'standard', { shouldDirty: true, shouldTouch: true, shouldValidate: true });
                  document.getElementById('formulaire')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                variant={plan === 'standard' ? 'default' : 'outline'}
                className="w-full mt-6"
              >
                Choisir Standard
              </Button>
            </CardContent>
          </Card>

          {/* Premium */}
          <Card className={`overflow-hidden ${plan === 'premium' ? 'ring-2 ring-yellow-400' : ''}`}>
            <CardContent className="p-6 lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Mise en avant</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Pour maximiser votre visibilité (badge + priorisation).
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-gray-900">79€</div>
                  <div className="text-sm text-gray-500">/ mois</div>
                </div>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                {[
                  'Tout le Standard',
                  'Badge Premium (visible sur les cartes et la fiche)',
                  'Mise en avant dans l’annuaire (priorité d’affichage)',
                  'Bloc “Conciergeries Premium” (si activé)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => {
                  form.setValue('plan', 'premium', { shouldDirty: true, shouldTouch: true, shouldValidate: true });
                  document.getElementById('formulaire')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-amber-950"
              >
                Choisir Premium
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Form */}
      <div id="formulaire" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Besoin d&apos;aide ?</h3>
                <div className="space-y-3 text-sm">
                  <a
                    href="mailto:contact@conciergeries-france.fr"
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    contact@conciergeries-france.fr
                  </a>
                  <a
                    href="tel:+33768661848"
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    07 68 66 18 48
                  </a>
                </div>
                <div className="mt-5 text-sm text-gray-600">
                  Après paiement, votre abonnement est synchronisé automatiquement. Si le statut n’apparaît pas
                  tout de suite dans l’espace partenaire, rafraîchissez la page après quelques secondes.
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  {plan === 'premium' ? <Crown className="w-5 h-5" /> : <BadgeCheck className="w-5 h-5" />}
                  <h3 className="font-bold text-lg">Plan sélectionné: {planLabel}</h3>
                </div>
                <p className="text-blue-100 text-sm">
                  Remplissez le formulaire et envoyez-nous les infos. Une fois validé, votre badge apparaîtra
                  dans l&apos;annuaire.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Formulaire d&apos;inscription</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Coordonnées, logo, description… pour créer votre fiche sur l&apos;annuaire.
                    </p>
                  </div>
                  <Badge
                    className={
                      plan === 'premium'
                        ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-400'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                    }
                  >
                    {planLabel}
                  </Badge>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="plan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Abonnement</FormLabel>
                          <FormControl>
                            <RadioGroup
                              value={field.value}
                              onValueChange={field.onChange}
                              className="grid sm:grid-cols-2 gap-3"
                            >
                              <label className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
                                <RadioGroupItem value="standard" className="mt-1" />
                                <div>
                                  <div className="font-semibold text-gray-900">Standard</div>
                                  <div className="text-sm text-gray-600">Fiche complète + badge Standard</div>
                                </div>
                              </label>
                              <label className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
                                <RadioGroupItem value="premium" className="mt-1" />
                                <div>
                                  <div className="font-semibold text-gray-900">Premium</div>
                                  <div className="text-sm text-gray-600">Mise en avant + badge Premium</div>
                                </div>
                              </label>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="conciergerieName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom de la conciergerie *</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: HostnFly" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom du contact *</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Marie Dupont" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="contact@votre-conciergerie.fr" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+33 6 12 34 56 78" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Site web</FormLabel>
                            <FormControl>
                              <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="logoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Logo (URL)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://.../logo.svg" {...field} />
                            </FormControl>
                            <FormDescription>Optionnel. Vous pouvez aussi nous l&apos;envoyer par email.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="cities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Villes / zones couvertes *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Paris, Lyon, Bordeaux..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 91290 Arpajon" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea rows={6} placeholder="Présentez vos services, votre spécialité, votre zone..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="siret"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SIRET</FormLabel>
                            <FormControl>
                              <Input placeholder="Optionnel" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Input placeholder="Infos complémentaires (optionnel)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <FormItem className="rounded-lg border p-4">
                          <div className="flex items-start gap-3">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(Boolean(v))} />
                            </FormControl>
                            <div>
                              <FormLabel className="cursor-pointer">
                                J&apos;accepte la{' '}
                                <Link to="/confidentialite" className="text-blue-600 hover:underline">
                                  politique de confidentialité
                                </Link>
                                .
                              </FormLabel>
                              <FormDescription>
                                Ces informations servent uniquement à créer votre fiche conciergerie.
                              </FormDescription>
                              <FormMessage />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />

                    {submitError && (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {submitError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isRedirectingToStripe || authLoading || !user}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-6 disabled:opacity-70"
                    >
                      <BadgeCheck className="w-4 h-4 mr-2" />
                      {authLoading
                        ? 'Chargement…'
                        : !user
                          ? 'Connectez-vous pour payer'
                          : isRedirectingToStripe
                            ? 'Redirection vers Stripe…'
                            : 'Payer et envoyer la demande'}
                    </Button>

                    <div className="text-xs text-gray-500">
                      Paiement sécurisé via Stripe. Une fois le paiement validé, nous recevons automatiquement
                      votre demande par email pour activer votre fiche et le badge.
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevenirPartenaire;

