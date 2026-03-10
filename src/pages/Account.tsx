import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

const schema = z.object({
  email: z.string().email('Email invalide').max(120),
  password: z.string().min(6, 'Mot de passe trop court (min. 6)').max(200),
});

type FormValues = z.infer<typeof schema>;

export default function Account() {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);
  const [resetNote, setResetNote] = useState<string | null>(null);

  const redirectTo = useMemo(() => {
    const q = searchParams.get('redirect');
    return q && q.startsWith('/') ? q : '/espace-partenaire';
  }, [searchParams]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  // Already signed in → redirect
  useEffect(() => {
    if (loading || !user) return;
    const from = (location.state as any)?.from as string | undefined;
    const target = from && typeof from === 'string' && from.startsWith('/') ? from : redirectTo;
    navigate(target, { replace: true });
  }, [loading, user, location.state, redirectTo, navigate]);

  if (loading) return null;
  if (user) return null;

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setResetNote(null);
    setBusy(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (error) throw error;
      }

      navigate(redirectTo, { replace: true });
    } catch (e: any) {
      setError(e?.message ?? 'Erreur inconnue');
    } finally {
      setBusy(false);
    }
  };

  const sendReset = async () => {
    setError(null);
    setResetNote(null);
    const email = String(form.getValues('email') ?? '').trim();
    if (!email) {
      setResetNote('Renseignez votre email pour recevoir le lien.');
      return;
    }
    setResetBusy(true);
    try {
      const redirectTo = `${window.location.origin}/reinitialiser-mot-de-passe`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
      setResetNote('Email envoyé. Vérifiez votre boîte de réception (et vos spams).');
    } catch (e: any) {
      setResetNote(e?.message ?? "Impossible d'envoyer l'email");
    } finally {
      setResetBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-xl border-0">
          <CardContent className="p-6 lg:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Compte partenaire</h1>
              <p className="text-sm text-gray-600 mt-1">
                Connectez-vous pour gérer votre abonnement et accéder à l&apos;espace partenaire.
              </p>
            </div>

            <div className="flex gap-2 mb-6">
              <Button
                type="button"
                variant={mode === 'login' ? 'default' : 'outline'}
                onClick={() => setMode('login')}
                className="flex-1"
              >
                Se connecter
              </Button>
              <Button
                type="button"
                variant={mode === 'signup' ? 'default' : 'outline'}
                onClick={() => setMode('signup')}
                className="flex-1"
              >
                Créer un compte
              </Button>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-5">
                {error}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@votre-conciergerie.fr" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {mode === 'login' && (
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => void sendReset()}
                      disabled={resetBusy}
                      className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                    >
                      {resetBusy ? 'Envoi…' : 'Mot de passe oublié ?'}
                    </button>
                    {resetNote && <span className="text-xs text-gray-600">{resetNote}</span>}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={busy}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                >
                  {busy ? 'Veuillez patienter…' : mode === 'signup' ? 'Créer le compte' : 'Se connecter'}
                </Button>

                <div className="text-xs text-gray-500">
                  En continuant, vous acceptez nos{' '}
                  <Link to="/cgv" className="text-blue-600 hover:underline">
                    CGV
                  </Link>{' '}
                  et notre{' '}
                  <Link to="/confidentialite" className="text-blue-600 hover:underline">
                    politique de confidentialité
                  </Link>
                  .
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

