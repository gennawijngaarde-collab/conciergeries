import { PageHeader, EmptyState } from '@/shared/ui/PageHeader';
import { useCrm } from '../hooks/useCrm';

export function CrmPage() {
  const { data, isFetching, isError, error } = useCrm();
  const count = data?.items?.length ?? 0;

  return (
    <div>
      <PageHeader
        title="CRM"
        description="Owners, vendors, and guest pipeline."
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
        title={count ? `${count} record(s)` : 'CRM contacts will appear here.'}
        description="Wire this view to /api/crm to replace the placeholder."
      />
    </div>
  );
}
