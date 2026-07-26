import { useState, type FormEvent } from 'react';
import { PageHeader, EmptyState } from '@/shared/ui/PageHeader';
import { useCleaning, type CleaningTaskStatus } from '../hooks/useCleaning';
import { useProperties } from '@/modules/properties/hooks/useProperties';

const STATUS_ACTIONS: { status: CleaningTaskStatus; label: string }[] = [
  { status: 'PENDING', label: 'En attente' },
  { status: 'IN_PROGRESS', label: 'En cours' },
  { status: 'COMPLETED', label: 'Terminé' },
];

const BADGE: Record<string, string> = {
  PENDING: 'bg-slate-100 text-slate-700',
  ASSIGNED: 'bg-indigo-100 text-indigo-800',
  IN_PROGRESS: 'bg-amber-100 text-amber-800',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
  INSPECTED: 'bg-sky-100 text-sky-800',
  FAILED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-slate-200 text-slate-600',
};

export function CleaningPage() {
  const { data, isFetching, isError, error, create, updateStatus } = useCleaning();
  const { data: propertiesData } = useProperties();
  const items = data?.items ?? [];
  const properties = propertiesData?.items ?? [];

  const [propertyId, setPropertyId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!propertyId || !scheduledAt) {
      setFormError('Logement et date requis.');
      return;
    }
    try {
      await create.mutateAsync({
        propertyId,
        scheduledAt: new Date(scheduledAt).toISOString(),
        notes,
        status: 'PENDING',
      });
      setNotes('');
      setScheduledAt('');
    } catch (err) {
      setFormError((err as Error).message || 'Création impossible');
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ménage"
        description="Tâches de turnover, checklists et suivi de statut."
      />

      {isFetching ? <p className="text-sm text-slate-400">Chargement…</p> : null}
      {isError ? (
        <p className="text-sm text-amber-700">
          API indisponible. {(error as Error)?.message}
        </p>
      ) : null}

      <form onSubmit={onCreate} className="panel grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <h2 className="sm:col-span-2 lg:col-span-4 text-sm font-semibold text-slate-900">
          Nouvelle tâche
        </h2>
        <div>
          <label className="label-field" htmlFor="cleanProperty">
            Logement
          </label>
          <select
            id="cleanProperty"
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
          <label className="label-field" htmlFor="scheduledAt">
            Planifié le
          </label>
          <input
            id="scheduledAt"
            type="datetime-local"
            className="input-field"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
        </div>
        <div>
          <label className="label-field" htmlFor="cleanNotes">
            Notes
          </label>
          <input
            id="cleanNotes"
            className="input-field"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <button type="submit" className="btn-primary w-full" disabled={create.isPending}>
            {create.isPending ? 'Création…' : 'Créer'}
          </button>
        </div>
        {formError ? (
          <p className="sm:col-span-2 lg:col-span-4 text-sm text-red-600">{formError}</p>
        ) : null}
      </form>

      {items.length === 0 && !isFetching ? (
        <EmptyState
          title="Aucune tâche de ménage."
          description="Planifiez une tâche pour un logement."
        />
      ) : (
        <ul className="space-y-3">
          {items.map((task) => {
            const status = String(task.status || 'PENDING');
            const propName =
              task.property?.name ||
              properties.find((p) => p.id === task.propertyId)?.name ||
              task.propertyId ||
              '—';
            return (
              <li key={task.id} className="panel flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-slate-900">{propName}</p>
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-medium ${BADGE[status] || BADGE.PENDING}`}
                    >
                      {status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {task.scheduledAt
                      ? new Date(task.scheduledAt).toLocaleString('fr-FR')
                      : 'Non planifié'}
                    {task.notes ? ` · ${task.notes}` : ''}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {STATUS_ACTIONS.map(({ status: next, label }) => (
                    <button
                      key={next}
                      type="button"
                      className="btn-secondary text-xs"
                      disabled={updateStatus.isPending || status === next}
                      onClick={() => void updateStatus.mutateAsync({ id: task.id, status: next })}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
