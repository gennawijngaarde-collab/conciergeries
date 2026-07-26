import { PageHeader, EmptyState } from '@/shared/ui/PageHeader';
import { usePricing } from '../hooks/usePricing';

export function PricingPage() {
  const { data, isFetching, isError, error } = usePricing();
  const count = data?.items?.length ?? 0;

  return (
    <div>
      <PageHeader
        title="Pricing"
        description="Nightly rates, seasons, min-stay, and promotions."
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
        title={count ? `${count} record(s)` : 'No pricing rules yet.'}
        description="Wire this view to /api/pricing to replace the placeholder."
      />
    </div>
  );
}
