import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

type PartnerProfileRow = {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  city: string;
  description: string;
  logo_url: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  services: string[] | null;
  platforms: string[] | null;
  plan: string;
  subscription_status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
};

function slugify(input: string) {
  return String(input || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function statusBadge(status: string) {
  const s = (status || '').toLowerCase();
  if (s === 'active' || s === 'trialing') return 'bg-green-100 text-green-700 hover:bg-green-100';
  if (s === 'canceled' || s === 'incomplete_expired') return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
  if (s === 'past_due' || s === 'unpaid') return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
  return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
}

export default function PartnerDashboard() {
  const { user, session, signOut } = useAuth();
  const [sub, setSub] = useState<SubscriptionRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncNote, setSyncNote] = useState<string | null>(null);
  const [portalBusy, setPortalBusy] = useState(false);

  const [profile, setProfile] = useState<PartnerProfileRow | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileBusy, setProfileBusy] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [profileTableMissing, setProfileTableMissing] = useState(false);

  const [draft, setDraft] = useState({
    name: '',
    city: '',
    description: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    logoUrl: '',
    servicesCsv: '',
    platformsCsv: '',
  });

  const lastSessionId = useMemo(() => {
    try {
      return localStorage.getItem('stripe:lastCheckoutSessionId') || '';
    } catch {
      return '';
    }
  }, []);

  const fetchSubscription = useCallback(async () => {
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
      setSub((data as any) ?? null);
    } catch (e: any) {
      setError(e?.message ?? 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void fetchSubscription();
  }, [fetchSubscription]);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setProfileMsg(null);
    setProfileTableMissing(false);
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('partner_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      setProfile((data as any) ?? null);
      const row = (data as any) as PartnerProfileRow | null;
      if (row) {
        setDraft({
          name: row.name ?? '',
          city: row.city ?? '',
          description: row.description ?? '',
          website: row.website ?? '',
          phone: row.phone ?? '',
          email: row.email ?? '',
          address: row.address ?? '',
          logoUrl: row.logo_url ?? '',
          servicesCsv: (row.services ?? []).join(', '),
          platformsCsv: (row.platforms ?? []).join(', '),
        });
      }
    } catch (e: any) {
      const msg = e?.message ?? 'Impossible de charger votre fiche';
      if (
        e?.code === 'PGRST205' ||
        /schema cache/i.test(msg) ||
        /Could not find the table/i.test(msg) ||
        /partner_profiles/i.test(msg)
      ) {
        setProfileTableMissing(true);
        setProfileMsg(
          "La table Supabase `partner_profiles` n'existe pas encore. Ouvre Supabase → SQL Editor et exécute le fichier `supabase/partner_profiles.sql`, puis rafraîchis cette page."
        );
      } else {
        setProfileMsg(msg);
      }
    } finally {
      setProfileLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const syncFromStripe = useCallback(async () => {
    setSyncNote(null);
    setError(null);
    const token = session?.access_token;
    if (!token) {
      setSyncNote('Veuillez vous reconnecter pour synchroniser.');
      return;
    }
    if (!lastSessionId) {
      setSyncNote("Aucune référence de paiement trouvée. Revenez depuis la page de paiement après validation.");
      return;
    }

    setSyncing(true);
    try {
      const res = await fetch('/api/stripe/sync-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId: lastSessionId }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        const msg = text?.trim() ? text.trim() : `Erreur HTTP ${res.status}`;
        throw new Error(msg);
      }

      setSyncNote('Synchronisation effectuée. Rafraîchissement du statut…');
      await fetchSubscription();
    } catch (e: any) {
      setSyncNote(e?.message ?? 'Synchronisation impossible');
    } finally {
      setSyncing(false);
    }
  }, [session?.access_token, lastSessionId, fetchSubscription]);

  const openCustomerPortal = useCallback(async () => {
    setSyncNote(null);
    setError(null);
    const token = session?.access_token;
    if (!token) {
      setSyncNote('Veuillez vous reconnecter pour gérer votre abonnement.');
      return;
    }
    setPortalBusy(true);
    try {
      const res = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const text = await res.text().catch(() => '');
      const data = (() => {
        try {
          return text ? JSON.parse(text) : null;
        } catch {
          return null;
        }
      })();
      if (!res.ok) {
        const msg = typeof data?.error === 'string' ? data.error : text?.trim() ? text.trim() : `Erreur HTTP ${res.status}`;
        throw new Error(msg);
      }
      if (!data?.url) throw new Error('URL du portail manquante');
      window.location.href = data.url as string;
    } catch (e: any) {
      setSyncNote(e?.message ?? 'Impossible d’ouvrir le portail');
    } finally {
      setPortalBusy(false);
    }
  }, [session?.access_token]);

  const saveProfile = useCallback(async () => {
    if (!user) return;
    setProfileMsg(null);
    setProfileBusy(true);
    try {
      const services = draft.servicesCsv
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const platforms = draft.platformsCsv
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const slug = profile?.slug || slugify(draft.name) || `conciergerie-${user.id.slice(0, 8)}`;

      const payload: any = {
        user_id: user.id,
        slug,
        name: draft.name.trim(),
        city: draft.city.trim(),
        description: draft.description.trim(),
        website: draft.website.trim() || null,
        phone: draft.phone.trim() || null,
        email: draft.email.trim() || null,
        address: draft.address.trim() || null,
        logo_url: draft.logoUrl.trim() || null,
        services,
        platforms,
        // keep in sync with subscription when possible
        plan: (sub?.plan ?? profile?.plan ?? 'standard').toLowerCase(),
        subscription_status: sub?.status ?? profile?.subscription_status ?? 'inactive',
        stripe_customer_id: sub?.stripe_customer_id ?? profile?.stripe_customer_id ?? null,
        stripe_subscription_id: sub?.stripe_subscription_id ?? profile?.stripe_subscription_id ?? null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from('partner_profiles').upsert(payload, { onConflict: 'user_id' }).select('*').maybeSingle();
      if (error) throw error;
      setProfile((data as any) ?? null);
      setProfileMsg('Fiche enregistrée.');
    } catch (e: any) {
      setProfileMsg(e?.message ?? 'Impossible d’enregistrer la fiche');
    } finally {
      setProfileBusy(false);
    }
  }, [user, draft, profile?.slug, profile?.plan, profile?.subscription_status, profile?.stripe_customer_id, profile?.stripe_subscription_id, sub?.plan, sub?.status, sub?.stripe_customer_id, sub?.stripe_subscription_id]);

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
                {syncNote && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 mb-4">
                    {syncNote}
                  </div>
                )}

                {!loading && !sub && (
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      Aucun abonnement actif détecté. Pour apparaître dans l&apos;annuaire avec un badge, choisissez
                      Standard ou Premium.
                    </p>
                    {lastSessionId && (
                      <Button variant="outline" onClick={() => void syncFromStripe()} disabled={syncing}>
                        {syncing ? 'Synchronisation…' : 'Synchroniser mon paiement'}
                      </Button>
                    )}
                  </div>
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
                {isActive ? (
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                    onClick={() => void openCustomerPortal()}
                    disabled={portalBusy}
                  >
                    {portalBusy ? 'Ouverture…' : 'Gérer mon abonnement'}
                  </Button>
                ) : (
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
                    <Link to="/devenir-partenaire">S'abonner</Link>
                  </Button>
                )}
                <Button asChild variant="outline">
                  <Link to="/conciergeries">Voir l&apos;annuaire</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 mt-8">
          <CardContent className="p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Ma fiche conciergerie</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Complète ta fiche pour apparaître dans l’annuaire avec ton badge {planLabel}.
                </p>
              </div>
              {profile?.slug && (
                <Button asChild variant="outline">
                  <Link to={`/conciergerie/${profile.slug}`}>Aperçu dans l’annuaire</Link>
                </Button>
              )}
            </div>

            {profileMsg && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 mb-4">
                {profileMsg}
              </div>
            )}

            {profileLoading ? (
              <div className="text-sm text-gray-600">Chargement de la fiche…</div>
            ) : profileTableMissing ? (
              <div className="text-sm text-gray-700 space-y-3">
                <p>
                  Une configuration Supabase est requise pour activer les fiches conciergerie.
                </p>
                <p className="text-gray-600">
                  Exécute <code className="bg-gray-100 px-2 py-1 rounded">supabase/partner_profiles.sql</code> dans Supabase,
                  puis clique sur <strong>Recharger</strong>.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nom *</label>
                  <Input value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} placeholder="Nom de la conciergerie" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Villes / zones *</label>
                  <Input value={draft.city} onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))} placeholder="Ex: Paris, Lyon, Bordeaux…" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Description *</label>
                  <Textarea value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} rows={5} placeholder="Présente tes services, ton positionnement, tes points forts…" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Site web</label>
                  <Input value={draft.website} onChange={(e) => setDraft((d) => ({ ...d, website: e.target.value }))} placeholder="https://…" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Logo (URL)</label>
                  <Input value={draft.logoUrl} onChange={(e) => setDraft((d) => ({ ...d, logoUrl: e.target.value }))} placeholder="https://…/logo.png" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Téléphone</label>
                  <Input value={draft.phone} onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))} placeholder="+33…" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input value={draft.email} onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))} placeholder="contact@…" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Adresse</label>
                  <Input value={draft.address} onChange={(e) => setDraft((d) => ({ ...d, address: e.target.value }))} placeholder="Adresse (optionnel)" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Services (séparés par des virgules)</label>
                  <Input value={draft.servicesCsv} onChange={(e) => setDraft((d) => ({ ...d, servicesCsv: e.target.value }))} placeholder="Gestion complète, Ménage, Accueil…" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Plateformes (séparées par des virgules)</label>
                  <Input value={draft.platformsCsv} onChange={(e) => setDraft((d) => ({ ...d, platformsCsv: e.target.value }))} placeholder="Airbnb, Booking.com, Abritel…" />
                </div>

                <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={() => void saveProfile()}
                    disabled={profileBusy || !draft.name.trim() || !draft.city.trim() || draft.description.trim().length < 30}
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                  >
                    {profileBusy ? 'Enregistrement…' : 'Enregistrer la fiche'}
                  </Button>
                  <Button variant="outline" onClick={() => void fetchProfile()} disabled={profileBusy}>
                    Recharger
                  </Button>
                </div>

                {profile?.slug && (
                  <div className="sm:col-span-2 text-xs text-gray-500">
                    URL de votre fiche: <code className="bg-gray-100 px-2 py-1 rounded">/conciergerie/{profile.slug}</code>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

