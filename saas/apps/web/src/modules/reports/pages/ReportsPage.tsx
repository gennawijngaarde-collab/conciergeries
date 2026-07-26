import { PageHeader, StatCard } from '@/shared/ui/PageHeader';
import { useReports } from '../hooks/useReports';
import { KpiCharts } from '../components/KpiCharts';

export function ReportsPage() {
  const { isError, error } = useReports();

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Portfolio performance — ADR, RevPAR, and occupancy stubs until the reports API is connected."
      />
      {isError ? (
        <p className="mb-3 text-sm text-amber-700">
          Reports API unavailable — demo KPIs shown. {(error as Error)?.message}
        </p>
      ) : null}

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="ADR" value="€142" hint="Trailing 30 days" />
        <StatCard label="RevPAR" value="€105" hint="Trailing 30 days" />
        <StatCard label="Occupancy" value="74%" hint="Trailing 30 days" />
      </div>

      <KpiCharts />
    </div>
  );
}
