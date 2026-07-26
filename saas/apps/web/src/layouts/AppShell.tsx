import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  CalendarRange,
  Users,
  CreditCard,
  FileText,
  ScrollText,
  UserCog,
  Sparkles,
  Wrench,
  LogIn,
  LogOut,
  Boxes,
  MessageSquare,
  BarChart3,
  Settings,
  Contact,
  Tag,
  Zap,
  Radio,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/shared/auth/AuthProvider';

const PHASE1 = new Set(['/dashboard', '/properties', '/reservations', '/calendar', '/cleaning']);

const NAV = [
  { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/calendar', label: 'Calendrier', icon: CalendarRange },
  { to: '/reservations', label: 'Réservations', icon: CalendarDays },
  { to: '/properties', label: 'Logements', icon: Building2 },
  { to: '/guests', label: 'Voyageurs', icon: Users },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
  { to: '/checkin', label: 'Check-in', icon: LogIn },
  { to: '/checkout', label: 'Check-out', icon: LogOut },
  { to: '/cleaning', label: 'Ménage', icon: Sparkles },
  { to: '/maintenance', label: 'Maintenance', icon: Wrench },
  { to: '/inventory', label: 'Inventaire', icon: Boxes },
  { to: '/payments', label: 'Paiements', icon: CreditCard },
  { to: '/invoices', label: 'Factures', icon: FileText },
  { to: '/contracts', label: 'Contrats', icon: ScrollText },
  { to: '/employees', label: 'Équipe', icon: UserCog },
  { to: '/crm', label: 'CRM', icon: Contact },
  { to: '/pricing', label: 'Tarification', icon: Tag },
  { to: '/automations', label: 'Automations', icon: Zap },
  { to: '/channels', label: 'Canaux', icon: Radio },
  { to: '/reports', label: 'Rapports', icon: BarChart3 },
  { to: '/settings', label: 'Paramètres', icon: Settings },
] as const;

export function AppShell() {
  const { user, signOut, isDevMode } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-slate-100 px-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-800 text-sm font-bold text-white">
              P
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">PMS Ops</p>
              <p className="text-[11px] text-slate-400">Location saisonnière</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded p-1 text-slate-500 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <p className="mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Phase 1 MVP
          </p>
          <ul className="mb-3 space-y-0.5">
            {NAV.filter((item) => PHASE1.has(item.to)).map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition ${
                      isActive
                        ? 'bg-brand-50 font-medium text-brand-800'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-80" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <p className="mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            À venir
          </p>
          <ul className="space-y-0.5">
            {NAV.filter((item) => !PHASE1.has(item.to)).map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition ${
                      isActive
                        ? 'bg-brand-50 font-medium text-brand-800'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-70" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-slate-100 p-3">
          {isDevMode ? (
            <span className="mb-2 inline-flex rounded bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
              Mode démo
            </span>
          ) : null}
          <p className="truncate text-xs text-slate-500">
            {user?.email ?? 'Session locale'}
          </p>
          <button
            type="button"
            className="btn-secondary mt-2 w-full"
            onClick={() => void signOut()}
          >
            Se déconnecter
          </button>
        </div>
      </aside>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
          aria-label="Fermer le fond"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur">
          <button
            type="button"
            className="rounded-md border border-slate-200 p-1.5 text-slate-600 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="text-sm text-slate-500">Console opérations</p>
          {isDevMode ? (
            <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
              Mode démo
            </span>
          ) : null}
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
