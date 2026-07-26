import { PageHeader, EmptyState } from '@/shared/ui/PageHeader';
import { useAutomations } from '../hooks/useAutomations';

export function AutomationsPage() {
  const { data, isFetching, isError, error } = useAutomations();
  const count = data?.items?.length ?? 0;

  return (
    <div>
      <PageHeader
        title="Automations"
        description="Triggered workflows for messaging, cleaning, and pricing."
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
        title={count ? `${count} record(s)` : 'No automations configured.'}
        description="Wire this view to /api/automations to replace the placeholder."
      />
    </div>
  );
}
