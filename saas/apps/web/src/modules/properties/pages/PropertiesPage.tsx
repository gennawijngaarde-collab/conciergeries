import { Link } from 'react-router-dom';
import { PageHeader, EmptyState } from '@/shared/ui/PageHeader';
import { useProperties, type Property } from '../hooks/useProperties';

function formatPrice(value: Property['basePrice']): string {
  if (value == null || value === '') return '—';
  const n = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
}

export function PropertiesPage() {
  const { data, isFetching, isError, error } = useProperties();
  const items = data?.items ?? [];

  return (
    <div>
      <PageHeader
        title="Logements"
        description="Gérez vos annonces, capacité et tarifs de base."
        actions={
          <Link to="/properties/new" className="btn-primary">
            Ajouter
          </Link>
        }
      />

      {isFetching ? <p className="mb-3 text-sm text-slate-400">Chargement…</p> : null}
      {isError ? (
        <p className="mb-3 text-sm text-amber-700">
          API indisponible. {(error as Error)?.message}
        </p>
      ) : null}

      {items.length === 0 && !isFetching ? (
        <EmptyState
          title="Aucun logement pour le moment."
          description="Créez votre premier logement pour démarrer."
          actionLabel="Ajouter"
          actionTo="/properties/new"
        />
      ) : (
        <div className="panel overflow-x-auto p-0">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Ville</th>
                <th className="px-4 py-3 font-medium">Capacité</th>
                <th className="px-4 py-3 font-medium">Prix de base</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link to={`/properties/${p.id}`} className="hover:text-brand-800">
                      {p.name || p.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.city || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{p.capacity ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{formatPrice(p.basePrice)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/properties/${p.id}`} className="text-xs font-medium text-brand-800 hover:underline">
                        Voir
                      </Link>
                      <Link
                        to={`/properties/${p.id}/edit`}
                        className="text-xs font-medium text-slate-600 hover:underline"
                      >
                        Modifier
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
