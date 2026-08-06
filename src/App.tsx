import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Conciergeries from '@/pages/Conciergeries';
import ConciergerieDetail from '@/pages/ConciergerieDetail';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Contact from '@/pages/Contact';
import { MentionsLegales, Confidentialite, CGV } from '@/pages/Legal';
import NotFound from '@/pages/NotFound';
import DevenirPartenaire from '@/pages/DevenirPartenaire';
import Devis from '@/pages/Devis';
import Account from '@/pages/Account';
import ResetPassword from '@/pages/ResetPassword';
import PartnerDashboard from '@/pages/PartnerDashboard';
import RequireAuth from '@/components/RequireAuth';
import FAQ from '@/pages/FAQ';
import ScrollToTop from '@/components/ScrollToTop';
import PmsLanding from '@/pms/pages/PmsLanding';
import PmsOnboarding from '@/pms/pages/PmsOnboarding';
import PmsLayout from '@/pms/PmsLayout';
import PmsDashboard from '@/pms/pages/PmsDashboard';
import PmsProperties from '@/pms/pages/PmsProperties';
import PmsCleanings from '@/pms/pages/PmsCleanings';
import ToolsHub from '@/pages/tools/ToolsHub';
import ToolsComparatorPage from '@/pages/tools/ToolsComparatorPage';
import ToolsSlugPage from '@/pages/tools/ToolsSlugPage';
import { SEO_CATCHALL_PATH } from '@/routes/seoRoutes';

const ProgrammaticSeoPage = lazy(() => import('@/pages/seo/ProgrammaticSeoPage'));

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-[4.5rem] lg:pt-24">
        <ScrollToTop />
        <Suspense
          fallback={
            <div className="min-h-[40vh] flex items-center justify-center text-gray-500">Chargement…</div>
          }
        >
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
