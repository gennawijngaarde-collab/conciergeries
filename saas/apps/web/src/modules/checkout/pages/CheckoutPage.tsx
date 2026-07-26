import { PageHeader, EmptyState } from '@/shared/ui/PageHeader';
import { useCheckout } from '../hooks/useCheckout';

export function CheckoutPage() {
  const { data, isFetching, isError, error } = useCheckout();
  const count = data?.items?.length ?? 0;

  return (
    <div>
      <PageHeader
        title="Check-out"
        description="Departures, late check-outs, and damage reports."
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
        title={count ? `${count} record(s)` : 'No check-outs scheduled.'}
        description="Wire this view to /api/checkout to replace the placeholder."
      />
    </div>
  );
}
