import { PageHeader, EmptyState } from '@/shared/ui/PageHeader';
import { useCheckin } from '../hooks/useCheckin';

export function CheckinPage() {
  const { data, isFetching, isError, error } = useCheckin();
  const count = data?.items?.length ?? 0;

  return (
    <div>
      <PageHeader
        title="Check-in"
        description="Today arrivals, access codes, and arrival instructions."
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
        title={count ? `${count} record(s)` : 'No check-ins scheduled.'}
        description="Wire this view to /api/checkin to replace the placeholder."
      />
    </div>
  );
}
