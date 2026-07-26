import { Link } from 'react-router-dom';
import { PageHeader, StatCard } from '@/shared/ui/PageHeader';
import { useDashboard } from '../hooks/useDashboard';
import { usePermissions } from '@/shared/hooks/usePermissions';

const SHORTCUTS = [
  { to: '/calendar', label: 'Calendar' },
  { to: '/reservations', label: 'Reservations' },
  { to: '/checkin', label: 'Arrivals' },
  { to: '/cleaning', label: 'Cleaning' },
  { to: '/messages/inbox', label: 'Inbox' },
  { to: '/reports', label: 'Reports' },
];

export function DashboardPage() {
  const { isError, error, isFetching } = useDashboard();
  const { role, can } = usePermissions();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Ops overview for role ${role}. Occupancy, arrivals, tasks, and revenue snapshots.`}
      />

      {isFetching ? <p className="mb-3 text-sm text-slate-400">Loading…</p> : null}
      {isError ? (
        <p className="mb-3 text-sm text-amber-700">
          Dashboard API unavailable — demo metrics shown. {(error as Error)?.message}
        </p>
      ) : null}

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Occupancy (30d)" value="74%" hint="Demo" />
        <StatCard label="Arrivals today" value="3" hint="Demo" />
        <StatCard label="Open cleaning" value="5" hint="Demo" />
        <StatCard label="Unread messages" value="2" hint="Demo" />
      </div>

      <div className="panel">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Quick links</h2>
        <div className="flex flex-wrap gap-2">
          {SHORTCUTS.filter(() => can('dashboard:read')).map((s) => (
            <Link key={s.to} to={s.to} className="btn-secondary">
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
