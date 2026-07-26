import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader, EmptyState, StatCard } from '@/shared/ui/PageHeader';
import { api } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/AuthProvider';
import type { Property } from '../hooks/useProperties';

function formatPrice(value: Property['basePrice']): string {
  if (value == null || value === '') return '—';
  const n = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
}

export function PropertyDetailPage() {
  const { id } = useParams();
  const { accessToken } = useAuth();

  const { data, isError, isFetching, error } = useQuery({
    queryKey: ['properties', id],
    queryFn: () => api.get<Property>(`/api/v1/properties/${id}`, { token: accessToken }),
    enabled: Boolean(id && accessToken),
    retry: false,
  });

  return (
    <div>
      <PageHeader
        title={data?.name ?? `Logement ${id}`}
        description={data?.city ? String(data.city) : 'Détail du logement'}
        actions={
          <>
            <Link to="/properties" className="btn-secondary">
              Retour
            </Link>
            <Link to={`/properties/${id}/edit`} className="btn-primary">
              Modifier
            </Link>
          </>
        }
      />

      {isFetching ? <p className="mb-3 text-sm text-slate-400">Chargement…</p> : null}
      {isError ? (
        <p className="mb-3 text-sm text-amber-700">
          Impossible de charger le logement. {(error as Error)?.message}
        </p>
      ) : null}

      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <StatCard label="Capacité" value={String(data?.capacity ?? '—')} />
        <StatCard label="Chambres" value={String(data?.bedrooms ?? '—')} />
        <StatCard label="Salles de bain" value={String(data?.bathrooms ?? '—')} />
        <StatCard label="Prix de base" value={formatPrice(data?.basePrice)} />
      </div>

      <div className="panel mb-4 grid gap-3 sm:grid-cols-2 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Type</p>
          <p className="mt-1 text-slate-800">{data?.propertyType || '—'}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Adresse</p>
          <p className="mt-1 text-slate-800">
            {[data?.addressLine1, data?.postalCode, data?.city, data?.country]
              .filter(Boolean)
              .join(', ') || '—'}
          </p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">Description</p>
          <p className="mt-1 text-slate-800 whitespace-pre-wrap">
            {data?.description || '—'}
          </p>
        </div>
      </div>

      <EmptyState
        title="Raccourcis opérations"
        description={`Arrivée ${data?.checkInTime ?? '16:00'} · Départ ${data?.checkOutTime ?? '11:00'}.`}
        actionLabel="Ouvrir le calendrier"
        actionTo="/calendar"
      />
    </div>
  );
}
