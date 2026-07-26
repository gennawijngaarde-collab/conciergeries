import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
};

export function EmptyState({ title, description, actionLabel, actionTo }: EmptyStateProps) {
  return (
    <div className="panel flex flex-col items-start gap-3">
      <div>
        <p className="font-medium text-slate-900">{title}</p>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>
      {actionLabel && actionTo ? (
        <Link to={actionTo} className="btn-primary">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
};

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="panel">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}
