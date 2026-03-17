import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CheckCircle, Home, Mail, Phone, Send, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const LEADS_EMAIL = 'genna.wijngaarde@gmail.com';

const schema = z.object({
  ownerName: z.string().min(2, 'Nom requis').max(80),
  email: z.string().email('Email invalide').max(120),
  phone: z.string().max(40).optional().or(z.literal('')),
  city: z.string().min(2, 'Ville requise').max(80),
  propertyType: z.string().min(2, 'Type de bien requis').max(80),
  bedrooms: z.string().max(20).optional().or(z.literal('')),
  message: z.string().min(20, 'Message requis (min. 20 caractères)').max(800),
  services: z.array(z.string()).min(1, 'Choisis au moins un service'),
  acceptContact: z.boolean().refine((v) => v, 'Vous devez accepter d’être recontacté'),
});

type FormValues = z.infer<typeof schema>;

const SERVICE_OPTIONS = [
  'Gestion complète',
  'Ménage',
  'Check-in / Check-out',
  'Optimisation des prix',
  'Maintenance',
  'Photos / annonce',
];

function toMailto(values: FormValues) {
  const subject = `Demande de devis — ${values.city} — ${values.ownerName}`;
  const bodyLines = [
    `Nom: ${values.ownerName}`,
    `Email: ${values.email}`,
    `Téléphone: ${values.phone || '-'}`,
    `Ville: ${values.city}`,
    `Type de bien: ${values.propertyType}`,
    `Chambres: ${values.bedrooms || '-'}`,
    `Services souhaités: ${values.services.join(', ')}`,
    '',
    'Message:',
    values.message,
  ];
  const body = bodyLines.join('\n');
  return `mailto:${encodeURIComponent(LEADS_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const Devis = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      ownerName: '',
      email: '',
      phone: '',
      city: '',
      propertyType: '',
      bedrooms: '',
      message: '',
      services: [],
      acceptContact: false,
    },
    mode: 'onTouched',
  });

  const mailtoHref = useMemo(() => toMailto(form.getValues()), [form]);

  const onSubmit = (values: FormValues) => {
    setSubmitError(null);
    setIsSubmitted(true);

    try {
      localStorage.setItem(
        'lead:last',
        JSON.stringify({ ...values, submittedAt: new Date().toISOString(), sourceUrl: window.location.href })
      );
    } catch {
      // ignore
    }

    // Most reliable without backend: open user's mail client
    const href = toMailto(values);
    window.location.href = href;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-white/90 text-sm font-medium">Devis gratuit — propriétaires</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
              Obtenir des devis de conciergeries
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed">
              Décris ton bien et tes besoins. Nous te recontactons rapidement avec des conciergeries adaptées.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild className="bg-white text-blue-700 hover:bg-blue-50">
                <a href="#formulaire">
                  <Send className="w-4 h-4 mr-2" />
                  Demander un devis
                </a>
              </Button>
              <Button asChild variant="outline" className="border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white">
                <Link to="/conciergeries">
                  Voir l&apos;annuaire
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Contact</h3>
                <div className="space-y-3 text-sm">
                  <a
                    href={`mailto:${LEADS_EMAIL}`}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {LEADS_EMAIL}
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
                  En soumettant ce formulaire, tu acceptes d’être recontacté pour recevoir des devis.
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-5 h-5" />
                  <h3 className="font-bold text-lg">Conseil</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Plus ta demande est précise (ville, type de bien, services), plus les devis seront pertinents.
                </p>
              </CardContent>
            </Card>
          </div>

          <div id="formulaire" className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Demande de devis</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Nous utilisons ces informations uniquement pour te recontacter.
                    </p>
                  </div>
                  {isSubmitted && (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Envoyé
                    </Badge>
                  )}
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="ownerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom *</FormLabel>
                            <FormControl>
                              <Input placeholder="Votre nom" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ville du bien *</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Arpajon" {...field} />
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
                              <Input type="email" placeholder="vous@exemple.fr" {...field} />
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
                              <Input type="tel" placeholder="06 12 34 56 78" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="propertyType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type de bien *</FormLabel>
                            <FormControl>
                              <Input placeholder="Studio, T2, Maison…" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bedrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chambres</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: 1, 2, 3…" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="services"
                      render={({ field }) => (
                        <FormItem className="rounded-lg border p-4">
                          <FormLabel>Services souhaités *</FormLabel>
                          <FormDescription>Choisis au moins un service.</FormDescription>
                          <div className="grid sm:grid-cols-2 gap-3 mt-3">
                            {SERVICE_OPTIONS.map((opt) => {
                              const checked = field.value.includes(opt);
                              return (
                                <label key={opt} className="flex items-start gap-3 rounded-md p-2 hover:bg-gray-50 cursor-pointer">
                                  <Checkbox
                                    checked={checked}
                                    onCheckedChange={(v) => {
                                      const next = Boolean(v)
                                        ? [...field.value, opt]
                                        : field.value.filter((x) => x !== opt);
                                      field.onChange(next);
                                    }}
                                  />
                                  <span className="text-sm text-gray-800">{opt}</span>
                                </label>
                              );
                            })}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message *</FormLabel>
                          <FormControl>
                            <Textarea rows={6} placeholder="Décris ton bien, tes contraintes, la date de démarrage…" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="acceptContact"
                      render={({ field }) => (
                        <FormItem className="rounded-lg border p-4">
                          <div className="flex items-start gap-3">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(Boolean(v))} />
                            </FormControl>
                            <div>
                              <FormLabel className="cursor-pointer">J’accepte d’être recontacté *</FormLabel>
                              <FormDescription>Nous n’utiliserons pas ces infos à d’autres fins.</FormDescription>
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
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-6"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer ma demande
                    </Button>

                    <div className="text-xs text-gray-500">
                      Si rien ne se passe au clic, c’est que ton navigateur n’a pas de client mail configuré.
                      Dans ce cas, utilise ce lien:{' '}
                      <a className="text-blue-600 hover:underline" href={mailtoHref}>
                        envoyer par email
                      </a>
                      .
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

export default Devis;

