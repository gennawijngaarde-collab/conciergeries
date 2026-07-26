import { PageHeader, EmptyState } from '@/shared/ui/PageHeader';
import { usePayments } from '../hooks/usePayments';

export function PaymentsPage() {
  const { data, isFetching, isError, error } = usePayments();
  const count = data?.items?.length ?? 0;

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Incoming payments, refunds, and settlement status."
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
        title={count ? `${count} record(s)` : 'No payments to display.'}
        description="Wire this view to /api/payments to replace the placeholder."
      />
    </div>
  );
}
