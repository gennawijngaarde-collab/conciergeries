import { useState, type FormEvent } from 'react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { useCalendar } from '../hooks/useCalendar';
import { CalendarBoard } from '../components/CalendarBoard';
import { useProperties } from '@/modules/properties/hooks/useProperties';

export function CalendarPage() {
  const { data, isError, error, isFetching, create } = useCalendar();
  const { data: propertiesData } = useProperties();
  const events = data?.items ?? [];
  const properties = propertiesData?.items ?? [];

  const propertyNames = Object.fromEntries(
    properties.map((p) => [p.id, p.name || p.id]),
  );

  const [propertyId, setPropertyId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  async function onCreateBlock(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!propertyId || !startDate || !endDate) {
      setFormError('Logement et dates requis.');
      return;
    }
    try {
      await create.mutateAsync({
        propertyId,
        startDate,
        endDate,
        notes,
        type: 'block',
        reason: 'MANUAL',
        title: notes || 'Blocage',
      });
      setNotes('');
      setStartDate('');
      setEndDate('');
    } catch (err) {
      setFormError((err as Error).message || 'Création du blocage impossible');
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendrier"
        description="Vue multi-logements — réservations, blocages et ménage."
      />
      {isFetching ? <p className="text-sm text-slate-400">Synchronisation…</p> : null}
      {isError ? (
        <p className="text-sm text-amber-700">
          Calendrier API indisponible. {(error as Error)?.message}
        </p>
      ) : null}

      <form onSubmit={onCreateBlock} className="panel grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <h2 className="sm:col-span-2 lg:col-span-5 text-sm font-semibold text-slate-900">
          Ajouter un blocage
        </h2>
        <div>
          <label className="label-field" htmlFor="blockProperty">
            Logement
          </label>
          <select
            id="blockProperty"
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
          <label className="label-field" htmlFor="startDate">
            Début
          </label>
          <input
            id="startDate"
            type="date"
            className="input-field"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="label-field" htmlFor="endDate">
            Fin
          </label>
          <input
            id="endDate"
            type="date"
            className="input-field"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <label className="label-field" htmlFor="notes">
            Notes
          </label>
          <input
            id="notes"
            className="input-field"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Propriétaire, travaux…"
          />
        </div>
        <div className="flex items-end">
          <button type="submit" className="btn-primary w-full" disabled={create.isPending}>
            {create.isPending ? 'Ajout…' : 'Bloquer'}
          </button>
        </div>
        {formError ? (
          <p className="sm:col-span-2 lg:col-span-5 text-sm text-red-600">{formError}</p>
        ) : null}
      </form>

      <CalendarBoard events={events} propertyNames={propertyNames} />
    </div>
  );
}
