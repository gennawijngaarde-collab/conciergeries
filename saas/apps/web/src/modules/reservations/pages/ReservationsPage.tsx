import { useState, type FormEvent } from 'react';
import { PageHeader, EmptyState } from '@/shared/ui/PageHeader';
import { useReservations } from '../hooks/useReservations';
import { useProperties } from '@/modules/properties/hooks/useProperties';

function formatMoney(value: unknown): string {
  if (value == null || value === '') return '—';
  const n = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
}

function formatDate(value?: string): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('fr-FR');
}

export function ReservationsPage() {
  const { data, isFetching, isError, error, create, remove } = useReservations();
  const { data: propertiesData } = useProperties();
  const items = data?.items ?? [];
  const properties = propertiesData?.items ?? [];

  const [propertyId, setPropertyId] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [formError, setFormError] = useState<string | null>(null);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!propertyId || !checkIn || !checkOut) {
      setFormError('Logement et dates requis.');
      return;
    }
    try {
      await create.mutateAsync({
        propertyId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        checkIn,
        checkOut,
        adults,
        status: 'CONFIRMED',
        channel: 'DIRECT',
      });
      setCheckIn('');
      setCheckOut('');
      setAdults(2);
    } catch (err) {
      setFormError((err as Error).message || 'Création impossible');
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Réservations"
        description="Réservations multi-canaux avec statuts et montants."
      />

      {isFetching ? <p className="text-sm text-slate-400">Chargement…</p> : null}
      {isError ? (
        <p className="text-sm text-amber-700">
          API indisponible. {(error as Error)?.message}
        </p>
      ) : null}

      <form onSubmit={onCreate} className="panel grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <h2 className="sm:col-span-2 lg:col-span-5 text-sm font-semibold text-slate-900">
          Nouvelle réservation
        </h2>
        <div>
          <label className="label-field" htmlFor="propertyId">
            Logement
          </label>
          <select
            id="propertyId"
            className="input-field"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
          >
            <option value="">Sélectionner…</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name || p.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-field" htmlFor="checkIn">
            Arrivée
          </label>
          <input
            id="checkIn"
            type="date"
            className="input-field"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div>
          <label className="label-field" htmlFor="checkOut">
            Départ
          </label>
          <input
            id="checkOut"
            type="date"
            className="input-field"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
        <div>
          <label className="label-field" htmlFor="adults">
            Adultes
          </label>
          <input
            id="adults"
            type="number"
            min={1}
            className="input-field"
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
          />
        </div>
        <div className="flex items-end">
          <button type="submit" className="btn-primary w-full" disabled={create.isPending}>
            {create.isPending ? 'Création…' : 'Créer'}
          </button>
        </div>
        {formError ? (
          <p className="sm:col-span-2 lg:col-span-5 text-sm text-red-600">{formError}</p>
        ) : null}
      </form>

      {items.length === 0 && !isFetching ? (
        <EmptyState
          title="Aucune réservation."
          description="Créez une réservation directe ci-dessus."
        />
      ) : (
        <div className="panel overflow-x-auto p-0">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Logement</th>
                <th className="px-4 py-3 font-medium">Dates</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Canal</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {items.map((r) => {
                const propName =
                  r.property?.name ||
                  properties.find((p) => p.id === r.propertyId)?.name ||
                  r.propertyId ||
                  '—';
                const start = r.checkInDate || r.checkIn;
                const end = r.checkOutDate || r.checkOut;
                return (
                  <tr key={r.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-slate-900">{propName}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(start)} → {formatDate(end)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {r.status || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{r.channel || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatMoney(r.totalAmount ?? r.total)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        className="text-xs font-medium text-red-600 hover:underline"
                        disabled={remove.isPending}
                        onClick={() => void remove.mutateAsync(r.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
