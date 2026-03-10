import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
  const [pwdBusy, setPwdBusy] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);
  const [pwdDraft, setPwdDraft] = useState({ password: '', confirm: '' });

  const [profile, setProfile] = useState<PartnerProfileRow | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileBusy, setProfileBusy] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [profileTableMissing, setProfileTableMissing] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);

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
      window.dispatchEvent(new Event('partner-profile:changed'));
    } catch (e: any) {
      setProfileMsg(e?.message ?? 'Impossible d’enregistrer la fiche');
    } finally {
      setProfileBusy(false);
    }
  }, [user, draft, profile?.slug, profile?.plan, profile?.subscription_status, profile?.stripe_customer_id, profile?.stripe_subscription_id, sub?.plan, sub?.status, sub?.stripe_customer_id, sub?.stripe_subscription_id]);

  const deleteProfile = useCallback(async () => {
    if (!user) return;
    setProfileMsg(null);
    setDeleteBusy(true);
    try {
      const { error } = await supabase.from('partner_profiles').delete().eq('user_id', user.id);
      if (error) throw error;
      setProfile(null);
      setDraft({
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
      setProfileMsg('Fiche supprimée.');
      window.dispatchEvent(new Event('partner-profile:changed'));
    } catch (e: any) {
      setProfileMsg(e?.message ?? 'Impossible de supprimer la fiche');
    } finally {
      setDeleteBusy(false);
    }
  }, [user]);

  const updatePassword = useCallback(async () => {
    setPwdMsg(null);
    const p = pwdDraft.password.trim();
    const c = pwdDraft.confirm.trim();
    if (p.length < 6) {
      setPwdMsg('Mot de passe trop court (min. 6 caractères).');
      return;
    }
    if (p !== c) {
      setPwdMsg('Les mots de passe ne correspondent pas.');
      return;
    }
    setPwdBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: p });
      if (error) throw error;
      setPwdDraft({ password: '', confirm: '' });
      setPwdMsg('Mot de passe mis à jour.');
    } catch (e: any) {
      setPwdMsg(e?.message ?? 'Impossible de changer le mot de passe');
    } finally {
      setPwdBusy(false);
    }
  }, [pwdDraft.password, pwdDraft.confirm]);

  const isActive = ['active', 'trialing'].includes((sub?.status ?? '').toLowerCase());
  const canOpenPortal = Boolean(sub?.stripe_customer_id);
  const planLabel = (sub?.plan ?? '').toLowerCase() === 'premium' ? 'Premium' : 'Standard';
  const listingStatus = String(profile?.subscription_status ?? sub?.status ?? 'inactive').toLowerCase();
  const listingVisible = ['active', 'trialing'].includes(listingStatus);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Espace partenaire</h1>
            <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
            <div className="flex items-center gap-2 mt-3">
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
              <Badge className={listingVisible ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-100'}>
                {listingVisible ? 'Fiche visible' : 'Fiche inactive'}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild variant="outline">
              <Link to="/conciergeries">Voir l&apos;annuaire</Link>
            </Button>
            <Button variant="outline" onClick={() => void signOut()}>
              Se déconnecter
            </Button>
          </div>
        </div>

        {(error || syncNote) && (
          <div className="space-y-3 mb-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}
            {syncNote && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                {syncNote}
              </div>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xl border-0">
              <CardHeader className="border-b">
                <CardTitle>Abonnement</CardTitle>
                <CardDescription>Gère ton abonnement Stripe et vérifie le statut.</CardDescription>
                <CardAction>
                  <div className="flex items-center gap-2">
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
                </CardAction>
              </CardHeader>

              <CardContent className="space-y-4">
                {!loading && !sub ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700">
                      Aucun abonnement détecté. Pour apparaître dans l&apos;annuaire avec un badge, choisissez Standard ou Premium.
                    </p>
                    {lastSessionId && (
                      <Button variant="outline" onClick={() => void syncFromStripe()} disabled={syncing}>
                        {syncing ? 'Synchronisation…' : 'Synchroniser mon paiement'}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div className="rounded-lg border bg-white p-4">
                      <div className="text-gray-500">Plan</div>
                      <div className="font-semibold text-gray-900">{sub?.plan ? planLabel : '—'}</div>
                    </div>
                    <div className="rounded-lg border bg-white p-4">
                      <div className="text-gray-500">Prochaine échéance</div>
                      <div className="font-semibold text-gray-900">
                        {sub?.current_period_end ? new Date(sub.current_period_end).toLocaleDateString('fr-FR') : '—'}
                      </div>
                    </div>
                    <div className="rounded-lg border bg-white p-4">
                      <div className="text-gray-500">Référence Stripe</div>
                      <div className="font-mono text-xs text-gray-800 break-all">
                        {sub?.stripe_subscription_id ?? '—'}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0">
              <CardHeader className="border-b">
                <CardTitle>Ma fiche conciergerie</CardTitle>
                <CardDescription>Renseigne les infos qui apparaissent dans l’annuaire.</CardDescription>
                <CardAction>
                  {profile?.slug ? (
                    <Button asChild variant="outline">
                      <Link to={`/conciergerie/${profile.slug}`}>Aperçu</Link>
                    </Button>
                  ) : null}
                </CardAction>
              </CardHeader>

              <CardContent className="space-y-4">
                {profileMsg && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                    {profileMsg}
                  </div>
                )}

                {profileLoading ? (
                  <div className="text-sm text-gray-600">Chargement de la fiche…</div>
                ) : profileTableMissing ? (
                  <div className="text-sm text-gray-700 space-y-3">
                    <p>Une configuration Supabase est requise pour activer les fiches conciergerie.</p>
                    <p className="text-gray-600">
                      Exécute <code className="bg-gray-100 px-2 py-1 rounded">supabase/partner_profiles.sql</code> dans Supabase,
                      puis clique sur <strong>Recharger</strong>.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Nom *</label>
                        <Input
                          value={draft.name}
                          onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                          placeholder="Nom de la conciergerie"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Villes / zones *</label>
                        <Input
                          value={draft.city}
                          onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))}
                          placeholder="Ex: Paris, Lyon, Bordeaux…"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Description *</label>
                        <Textarea
                          value={draft.description}
                          onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                          rows={6}
                          placeholder="Présente tes services, ton positionnement, tes points forts…"
                        />
                        <div className="mt-2 text-xs text-gray-500">
                          Minimum recommandé: 30 caractères. Actuel: <strong>{draft.description.trim().length}</strong>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Site web</label>
                        <Input
                          value={draft.website}
                          onChange={(e) => setDraft((d) => ({ ...d, website: e.target.value }))}
                          placeholder="https://…"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Logo (URL)</label>
                        <Input
                          value={draft.logoUrl}
                          onChange={(e) => setDraft((d) => ({ ...d, logoUrl: e.target.value }))}
                          placeholder="https://…/logo.png"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Téléphone</label>
                        <Input
                          value={draft.phone}
                          onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                          placeholder="+33…"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <Input
                          value={draft.email}
                          onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                          placeholder="contact@…"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Adresse</label>
                        <Input
                          value={draft.address}
                          onChange={(e) => setDraft((d) => ({ ...d, address: e.target.value }))}
                          placeholder="Adresse (optionnel)"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Services (séparés par des virgules)</label>
                        <Input
                          value={draft.servicesCsv}
                          onChange={(e) => setDraft((d) => ({ ...d, servicesCsv: e.target.value }))}
                          placeholder="Gestion complète, Ménage, Accueil…"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Plateformes (séparées par des virgules)</label>
                        <Input
                          value={draft.platformsCsv}
                          onChange={(e) => setDraft((d) => ({ ...d, platformsCsv: e.target.value }))}
                          placeholder="Airbnb, Booking.com, Abritel…"
                        />
                      </div>
                    </div>

                    {profile?.slug && (
                      <div className="text-xs text-gray-500">
                        URL de votre fiche:{' '}
                        <code className="bg-gray-100 px-2 py-1 rounded">/conciergerie/{profile.slug}</code>
                      </div>
                    )}
                  </>
                )}
              </CardContent>

              {!profileTableMissing && !profileLoading && (
                <CardFooter className="border-t flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => void saveProfile()}
                    disabled={profileBusy || !draft.name.trim() || !draft.city.trim() || draft.description.trim().length < 30}
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 w-full sm:w-auto"
                  >
                    {profileBusy ? 'Enregistrement…' : 'Enregistrer'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => void fetchProfile()}
                    disabled={profileBusy}
                    className="w-full sm:w-auto"
                  >
                    Recharger
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-xl border-0">
              <CardHeader className="border-b">
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>Les actions les plus utiles, au même endroit.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {sub && canOpenPortal ? (
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 w-full"
                    onClick={() => void openCustomerPortal()}
                    disabled={portalBusy}
                  >
                    {portalBusy ? 'Ouverture…' : isActive ? 'Gérer mon abonnement' : 'Se réabonner / gérer'}
                  </Button>
                ) : (
                  <Button
                    asChild
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 w-full"
                  >
                    <Link to="/devenir-partenaire">S&apos;abonner</Link>
                  </Button>
                )}

                {lastSessionId && (
                  <Button variant="outline" onClick={() => void syncFromStripe()} disabled={syncing} className="w-full">
                    {syncing ? 'Synchronisation…' : 'Synchroniser mon paiement'}
                  </Button>
                )}

                <Separator />

                {profile?.slug && (
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/conciergerie/${profile.slug}`}>Voir ma fiche publique</Link>
                  </Button>
                )}

                <Button variant="outline" onClick={() => void fetchProfile()} disabled={profileBusy} className="w-full">
                  Recharger la fiche
                </Button>

                {profile && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={profileBusy || deleteBusy} className="w-full">
                        Supprimer ma fiche
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer votre fiche ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action retire votre conciergerie de l’annuaire. Votre abonnement Stripe n’est pas annulé.
                          Vous pourrez recréer une fiche plus tard depuis cet espace.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-white hover:bg-destructive/90"
                          onClick={() => void deleteProfile()}
                        >
                          {deleteBusy ? 'Suppression…' : 'Supprimer'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0">
              <CardHeader className="border-b">
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>Change ton mot de passe à tout moment.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pwdMsg && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                    {pwdMsg}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                    <Input
                      type="password"
                      value={pwdDraft.password}
                      onChange={(e) => setPwdDraft((d) => ({ ...d, password: e.target.value }))}
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Confirmer</label>
                    <Input
                      type="password"
                      value={pwdDraft.confirm}
                      onChange={(e) => setPwdDraft((d) => ({ ...d, confirm: e.target.value }))}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <Button onClick={() => void updatePassword()} disabled={pwdBusy} className="w-full">
                  {pwdBusy ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

