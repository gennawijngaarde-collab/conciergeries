import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

const schema = z
  .object({
    password: z.string().min(6, 'Mot de passe trop court (min. 6)').max(200),
    confirm: z.string().min(6).max(200),
  })
  .refine((v) => v.password === v.confirm, { message: 'Les mots de passe ne correspondent pas', path: ['confirm'] });

type FormValues = z.infer<typeof schema>;

export default function ResetPassword() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const hasSession = useMemo(() => Boolean(session?.access_token), [session?.access_token]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirm: '' },
    mode: 'onTouched',
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: values.password });
      if (error) throw error;
      navigate('/espace-partenaire', { replace: true });
    } catch (e: any) {
      setError(e?.message ?? 'Erreur inconnue');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-xl border-0">
          <CardContent className="p-6 lg:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Réinitialiser le mot de passe</h1>
              <p className="text-sm text-gray-600 mt-1">
                Choisis un nouveau mot de passe pour ton compte partenaire.
              </p>
            </div>

            {!hasSession && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 mb-6">
                Le lien de réinitialisation est invalide ou expiré. Retourne à la page compte pour refaire une demande.
                <div className="mt-3">
                  <Button asChild variant="outline">
                    <Link to="/compte">Aller à la page compte</Link>
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-5">
                {error}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nouveau mot de passe</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmer</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={busy || !hasSession}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                >
                  {busy ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
                </Button>

                <div className="text-xs text-gray-500">
                  Retour à{' '}
                  <Link to="/compte" className="text-blue-600 hover:underline">
                    Compte partenaire
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

