import { useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Building2, CalendarCheck2, Clock3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCleanings, getProfile, getProperties } from '../storage';

export default function PmsDashboard() {
  const profile = getProfile();
  const properties = getProperties();
  const cleanings = getCleanings();
  const today = new Date().toISOString().slice(0, 10);

  const todayCleanings = useMemo(
    () => cleanings.filter((c) => c.cleaningDate === today),
    [cleanings, today]
  );
  const pending = useMemo(
    () => cleanings.filter((c) => c.status === 'pending' || c.status === 'in_progress'),
    [cleanings]
  );

  if (!profile?.onboarded) return <Navigate to="/pms/onboarding" replace />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bonjour {profile.businessName} — vue opérations du jour.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-[#114c09]" />
            <div>
              <p className="text-2xl font-bold">{properties.length}</p>
              <p className="text-sm text-gray-500">Propriétés</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <CalendarCheck2 className="w-8 h-8 text-[#114c09]" />
            <div>
              <p className="text-2xl font-bold">{todayCleanings.length}</p>
              <p className="text-sm text-gray-500">Ménages aujourd’hui</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <Clock3 className="w-8 h-8 text-[#114c09]" />
            <div>
              <p className="text-2xl font-bold">{pending.length}</p>
              <p className="text-sm text-gray-500">À traiter</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Prochains ménages</h2>
            <Button asChild variant="outline" size="sm">
              <Link to="/pms/cleanings">Voir tout</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {cleanings.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3 border rounded-xl px-3 py-2.5">
                <div>
                  <p className="font-medium text-sm">{c.propertyName}</p>
                  <p className="text-xs text-gray-500">{c.cleaningDate} · {c.notes || 'Sans note'}</p>
                </div>
                <Badge
                  className={
                    c.status === 'done'
                      ? 'bg-emerald-100 text-emerald-800'
                      : c.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                  }
                >
                  {c.status}
                </Badge>
              </div>
            ))}
            {cleanings.length === 0 && (
              <p className="text-sm text-gray-500">Aucun ménage. Ajoutez-en depuis l’onglet Ménages.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
