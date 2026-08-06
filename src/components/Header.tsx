import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MyProfileButton from '@/components/MyProfileButton';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/conciergeries', label: 'Conciergeries' },
    { path: '/outils-airbnb', label: 'Outils Airbnb' },
    { path: '/devis', label: 'Devis' },
    { path: '/blog', label: 'Blog' },
    { path: '/faq', label: 'FAQ' },
    { path: '/devenir-partenaire', label: 'Devenir partenaire' },
    { path: '/contact', label: 'Contact' },
  ];

  // Desktop: CTA buttons for partenaire + PMS (avoid duplicates in nav)
  const desktopNavLinks = navLinks.filter((l) => l.path !== '/devenir-partenaire');

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg leading-tight text-gray-900">Conciergeries</span>
              <span className="block text-xs text-blue-600">France</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {desktopNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <MyProfileButton />
            <Button
              asChild
              variant="outline"
              className="shadow-lg hover:shadow-xl transition-all border-emerald-200 text-emerald-800 hover:bg-emerald-50"
            >
              <Link to="/pms">PMS Cleanbnb</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="shadow-lg hover:shadow-xl transition-all border-gray-200 text-gray-800 hover:bg-gray-100"
            >
              <Link to="/devenir-partenaire">Devenir partenaire</Link>
            </Button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
            aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-xl">
          <nav className="flex flex-col p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/pms"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive('/pms')
                  ? 'bg-emerald-700 text-white'
                  : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
              }`}
            >
              PMS Cleanbnb
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
