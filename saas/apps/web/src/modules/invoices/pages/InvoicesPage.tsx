import { PageHeader, EmptyState } from '@/shared/ui/PageHeader';
import { useInvoices } from '../hooks/useInvoices';

export function InvoicesPage() {
  const { data, isFetching, isError, error } = useInvoices();
  const count = data?.items?.length ?? 0;

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Guest and owner invoices with line items."
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
        title={count ? `${count} record(s)` : 'No invoices yet.'}
        description="Wire this view to /api/invoices to replace the placeholder."
      />
    </div>
  );
}
