import { PageHeader, EmptyState } from '@/shared/ui/PageHeader';
import { useEmployees } from '../hooks/useEmployees';

export function EmployeesPage() {
  const { data, isFetching, isError, error } = useEmployees();
  const count = data?.items?.length ?? 0;

  return (
    <div>
      <PageHeader
        title="Employees"
        description="Team members, roles, and operational assignments."
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
        title={count ? `${count} record(s)` : 'No employees yet.'}
        description="Wire this view to /api/employees to replace the placeholder."
      />
    </div>
  );
}
