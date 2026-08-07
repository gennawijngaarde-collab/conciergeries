import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import ScrollToTop from '@/components/ScrollToTop';
import RequireAuth from '@/components/RequireAuth';
import { SEO_CATCHALL_PATH } from '@/routes/seoRoutes';

const Conciergeries = lazy(() => import('@/pages/Conciergeries'));
const ConciergerieDetail = lazy(() => import('@/pages/ConciergerieDetail'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));
const Contact = lazy(() => import('@/pages/Contact'));
const MentionsLegales = lazy(() =>
  import('@/pages/Legal').then((m) => ({ default: m.MentionsLegales })),
);
const Confidentialite = lazy(() =>
  import('@/pages/Legal').then((m) => ({ default: m.Confidentialite })),
);
const CGV = lazy(() => import('@/pages/Legal').then((m) => ({ default: m.CGV })));
const NotFound = lazy(() => import('@/pages/NotFound'));
const DevenirPartenaire = lazy(() => import('@/pages/DevenirPartenaire'));
const Devis = lazy(() => import('@/pages/Devis'));
const Account = lazy(() => import('@/pages/Account'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const PartnerDashboard = lazy(() => import('@/pages/PartnerDashboard'));
const FAQ = lazy(() => import('@/pages/FAQ'));
const PmsLanding = lazy(() => import('@/pms/pages/PmsLanding'));
const PmsOnboarding = lazy(() => import('@/pms/pages/PmsOnboarding'));
const PmsLayout = lazy(() => import('@/pms/PmsLayout'));
const PmsDashboard = lazy(() => import('@/pms/pages/PmsDashboard'));
const PmsProperties = lazy(() => import('@/pms/pages/PmsProperties'));
const PmsCleanings = lazy(() => import('@/pms/pages/PmsCleanings'));
const ToolsHub = lazy(() => import('@/pages/tools/ToolsHub'));
const ToolsComparatorPage = lazy(() => import('@/pages/tools/ToolsComparatorPage'));
const ToolsSlugPage = lazy(() => import('@/pages/tools/ToolsSlugPage'));
const ProgrammaticSeoPage = lazy(() => import('@/pages/seo/ProgrammaticSeoPage'));

function RouteFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center text-gray-500 text-sm px-4">
      Chargement…
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 pt-[4.5rem] lg:pt-24 min-w-0">
        <ScrollToTop />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/index.html" element={<Navigate to="/" replace />} />
            <Route path="/conciergeries" element={<Conciergeries />} />
            <Route path="/conciergerie/:slug" element={<ConciergerieDetail />} />
            <Route path="/outils-airbnb" element={<ToolsHub />} />
            <Route path="/outils-airbnb/comparateur" element={<ToolsComparatorPage />} />
            <Route path="/outils-airbnb/:slug" element={<ToolsSlugPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/devenir-partenaire" element={<DevenirPartenaire />} />
            <Route path="/devis" element={<Devis />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/pms" element={<PmsLanding />} />
            <Route path="/pms/onboarding" element={<PmsOnboarding />} />
            <Route element={<PmsLayout />}>
              <Route path="/pms/dashboard" element={<PmsDashboard />} />
              <Route path="/pms/properties" element={<PmsProperties />} />
              <Route path="/pms/cleanings" element={<PmsCleanings />} />
            </Route>
            <Route path="/compte" element={<Account />} />
            <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />
            <Route
              path="/espace-partenaire"
              element={
                <RequireAuth>
                  <PartnerDashboard />
                </RequireAuth>
              }
            />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/confidentialite" element={<Confidentialite />} />
            <Route path="/cgv" element={<CGV />} />
            <Route path={SEO_CATCHALL_PATH} element={<ProgrammaticSeoPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
