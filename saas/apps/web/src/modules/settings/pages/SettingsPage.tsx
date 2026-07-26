import { PageHeader, EmptyState } from '@/shared/ui/PageHeader';
import { useSettings } from '../hooks/useSettings';

export function SettingsPage() {
  const { data, isFetching, isError, error } = useSettings();
  const count = data?.items?.length ?? 0;

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Organization preferences, taxes, and integrations."
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
        title={count ? `${count} record(s)` : 'Settings will load from the API.'}
        description="Wire this view to /api/settings to replace the placeholder."
      />
    </div>
  );
}
