import { PageHeader, EmptyState } from '@/shared/ui/PageHeader';
import { useGuests } from '../hooks/useGuests';

export function GuestsPage() {
  const { data, isFetching, isError, error } = useGuests();
  const count = data?.items?.length ?? 0;

  return (
    <div>
      <PageHeader
        title="Guests"
        description="Guest profiles, stays, and contact details."
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
        title={count ? `${count} record(s)` : 'No guests yet.'}
        description="Wire this view to /api/guests to replace the placeholder."
      />
    </div>
  );
}
