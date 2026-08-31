import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Building2, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MyProfileButton from '@/components/MyProfileButton';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/conciergeries', label: 'Conciergeries' },
    { path: '/hub', label: 'Créer sa conciergerie' },
    { path: '/outils-airbnb', label: 'Outils Airbnb' },
    { path: '/devis', label: 'Devis' },
    { path: '/blog', label: 'Blog' },
    { path: '/faq', label: 'FAQ' },
    { path: '/devenir-partenaire', label: 'Devenir partenaire' },
    { path: '/contact', label: 'Contact' },
  ];

  const desktopNavLinks = navLinks.filter((l) => l.path !== '/devenir-partenaire');

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileMenu();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2 group min-w-0" onClick={closeMobileMenu}>
            <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-base sm:text-lg leading-tight text-gray-900 block truncate">
                Conciergeries
              </span>
              <span className="block text-xs text-blue-600">France</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Navigation principale">
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
            {!user && (
              <Button asChild variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-gray-100">
                <Link to="/compte">Connexion</Link>
              </Button>
            )}
            {user && (
              <Button asChild variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-gray-100">
                <Link to="/espace-partenaire">Espace partenaire</Link>
              </Button>
            )}
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
            type="button"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center min-h-11 min-w-11 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
            aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <>
          <button
            type="button"
            className="lg:hidden fixed inset-0 top-16 z-40 bg-black/40"
            aria-label="Fermer le menu"
            onClick={closeMobileMenu}
          />
          <div
            id="mobile-nav"
            className="lg:hidden absolute left-0 right-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto bg-white border-t shadow-xl"
          >
            <nav className="flex flex-col p-4 space-y-1" aria-label="Navigation mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-all min-h-11 flex items-center ${
                    isActive(link.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-gray-100 my-2 pt-2 space-y-1">
                {user ? (
                  <>
                    <Link
                      to="/espace-partenaire"
                      onClick={closeMobileMenu}
                      className={`px-4 py-3 rounded-lg text-base font-medium transition-all min-h-11 flex items-center gap-2 ${
                        isActive('/espace-partenaire')
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                      }`}
                    >
                      <UserRound className="w-5 h-5 shrink-0" />
                      Espace partenaire
                    </Link>
                    <div className="px-1" onClick={closeMobileMenu}>
                      <MyProfileButton className="w-full justify-start shadow-none border-0 bg-gray-50 hover:bg-gray-100 h-11" />
                    </div>
                  </>
                ) : (
                  <Link
                    to="/compte"
                    onClick={closeMobileMenu}
                    className={`px-4 py-3 rounded-lg text-base font-medium transition-all min-h-11 flex items-center gap-2 ${
                      isActive('/compte')
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                    }`}
                  >
                    <UserRound className="w-5 h-5 shrink-0" />
                    Connexion / Inscription
                  </Link>
                )}
                <Link
                  to="/pms"
                  onClick={closeMobileMenu}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-all min-h-11 flex items-center ${
                    isActive('/pms')
                      ? 'bg-emerald-700 text-white'
                      : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                >
                  PMS Cleanbnb
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
