import { PageHeader, EmptyState } from '@/shared/ui/PageHeader';
import { useMaintenance } from '../hooks/useMaintenance';

export function MaintenancePage() {
  const { data, isFetching, isError, error } = useMaintenance();
  const count = data?.items?.length ?? 0;

  return (
    <div>
      <PageHeader
        title="Maintenance"
        description="Tickets by priority — assign vendors and track resolution."
      />
      {isFetching ? (
        <p className="mb-3 text-sm text-slate-400">Loading…</p>
      ) : null}
      {isError ? (
        <p className="mb-3 text-sm text-amber-700">
          API unavailable — showing shell. {(error as Error)?.message}
        </p>
      ) : null}
      <EmptyState
        title={count ? `${count} record(s)` : 'No open maintenance tickets.'}
        description="Wire this view to /api/maintenance to replace the placeholder."
      />
    </div>
  );
}
