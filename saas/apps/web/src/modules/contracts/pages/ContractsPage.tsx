import { PageHeader, EmptyState } from '@/shared/ui/PageHeader';
import { useContracts } from '../hooks/useContracts';

export function ContractsPage() {
  const { data, isFetching, isError, error } = useContracts();
  const count = data?.items?.length ?? 0;

  return (
    <div>
      <PageHeader
        title="Contracts"
        description="Owner management contracts and guest agreements."
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
        title={count ? `${count} record(s)` : 'No contracts yet.'}
        description="Wire this view to /api/contracts to replace the placeholder."
      />
    </div>
  );
}
