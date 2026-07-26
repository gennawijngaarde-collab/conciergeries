import { PageHeader, EmptyState } from '@/shared/ui/PageHeader';
import { useMessages } from '../hooks/useMessages';

export function MessagesPage() {
  const { data, isFetching, isError, error } = useMessages();
  const count = data?.items?.length ?? 0;

  return (
    <div>
      <PageHeader
        title="Messages"
        description="Unified guest messaging across channels."
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
        title={count ? `${count} record(s)` : 'No threads yet.'}
        actionLabel="Open inbox"
        actionTo="/messages/inbox"
        description="Wire this view to /api/messages to replace the placeholder."
      />
    </div>
  );
}
