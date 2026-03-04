import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

type SubscriptionRow = {
  id: string;
  user_id: string;
  plan: 'standard' | 'premium' | string;
  status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};

function statusBadge(status: string) {
  const s = (status || '').toLowerCase();
  if (s === 'active' || s === 'trialing') return 'bg-green-100 text-green-700 hover:bg-green-100';
  if (s === 'canceled' || s === 'incomplete_expired') return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
  if (s === 'past_due' || s === 'unpaid') return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
  return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
}

export default function PartnerDashboard() {
  const { user, signOut } = useAuth();
  const [sub, setSub] = useState<SubscriptionRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!user) return;
      setError(null);
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (error) throw error;
        if (!mounted) return;
        setSub((data as any) ?? null);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? 'Erreur inconnue');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [user]);

  const isActive = ['active', 'trialing'].includes((sub?.status ?? '').toLowerCase());
  const planLabel = (sub?.plan ?? '').toLowerCase() === 'premium' ? 'Premium' : 'Standard';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Espace partenaire</h1>
            <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
          </div>
          <Button variant="outline" onClick={() => void signOut()}>
            Se déconnecter
          </Button>
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={statusBadge(sub?.status ?? 'inconnu')}>
                    {loading ? 'Chargement…' : sub?.status ?? 'Aucun abonnement'}
                  </Badge>
                  {sub?.plan && (
                    <Badge
                      className={
                        planLabel === 'Premium'
                          ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-400'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                      }
                    >
                      {planLabel}
                    </Badge>
                  )}
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-4">
                    {error}
                  </div>
                )}

                {!loading && !sub && (
                  <p className="text-gray-700">
                    Aucun abonnement actif détecté. Pour apparaître dans l&apos;annuaire avec un badge, choisissez
                    Standard ou Premium.
                  </p>
                )}

                {!loading && sub && (
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>
                      <span className="text-gray-500">Plan</span> : <strong>{planLabel}</strong>
                    </div>
                    {sub.current_period_end && (
                      <div>
                        <span className="text-gray-500">Prochaine échéance</span> :{' '}
                        <strong>{new Date(sub.current_period_end).toLocaleDateString('fr-FR')}</strong>
                      </div>
                    )}
                    {sub.stripe_subscription_id && (
                      <div className="text-xs text-gray-500">
                        Référence Stripe: <code className="bg-gray-100 px-2 py-1 rounded">{sub.stripe_subscription_id}</code>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:min-w-56">
                <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
                  <Link to="/devenir-partenaire">{isActive ? 'Gérer mon abonnement' : "S'abonner"}</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/conciergeries">Voir l&apos;annuaire</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

