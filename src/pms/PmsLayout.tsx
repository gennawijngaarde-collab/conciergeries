import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Building2, CalendarCheck2, LayoutDashboard, LogOut, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProfile, resetPmsData } from './storage';

const nav = [
  { to: '/pms/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pms/properties', label: 'Propriétés', icon: Building2 },
  { to: '/pms/cleanings', label: 'Ménages', icon: CalendarCheck2 },
];

export default function PmsLayout() {
  const navigate = useNavigate();
  const profile = getProfile();

  const quitDemo = () => {
    resetPmsData();
    navigate('/pms');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-[#114c09] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c9a57a] text-[#114c09] flex items-center justify-center font-bold">
              C
            </div>
            <div>
              <p className="font-semibold leading-tight">Cleanbnb PMS</p>
              <p className="text-xs text-white/70">
                {profile?.businessName || 'Espace opérations ménage'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="secondary" size="sm" className="bg-white/10 text-white border-0 hover:bg-white/20">
              <Link to="/pms">
                <Sparkles className="w-4 h-4 mr-1" />
                Présentation
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent text-white border-white/30 hover:bg-white/10"
              onClick={quitDemo}
            >
              <LogOut className="w-4 h-4 mr-1" />
              Réinitialiser
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-56 shrink-0">
            <nav className="bg-white border rounded-2xl p-2 space-y-1 sticky top-24">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#114c09] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
