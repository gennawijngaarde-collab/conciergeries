import { PageHeader, EmptyState } from '@/shared/ui/PageHeader';
import { useInventory } from '../hooks/useInventory';

export function InventoryPage() {
  const { data, isFetching, isError, error } = useInventory();
  const count = data?.items?.length ?? 0;

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Stock levels for linen, amenities, and consumables."
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
        title={count ? `${count} record(s)` : 'Inventory is empty.'}
        description="Wire this view to /api/inventory to replace the placeholder."
      />
    </div>
  );
}
