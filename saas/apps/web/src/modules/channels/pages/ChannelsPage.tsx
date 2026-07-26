import { PageHeader, EmptyState } from '@/shared/ui/PageHeader';
import { useChannels } from '../hooks/useChannels';

export function ChannelsPage() {
  const { data, isFetching, isError, error } = useChannels();
  const count = data?.items?.length ?? 0;

  return (
    <div>
      <PageHeader
        title="Channels"
        description="Channel manager connections and listing mappings."
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
        title={count ? `${count} record(s)` : 'No channel connections yet.'}
        description="Wire this view to /api/channels to replace the placeholder."
      />
    </div>
  );
}
