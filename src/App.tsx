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

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16 lg:pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/index.html" element={<Navigate to="/" replace />} />
          <Route path="/conciergeries" element={<Conciergeries />} />
          <Route path="/conciergerie/:slug" element={<ConciergerieDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/devenir-partenaire" element={<DevenirPartenaire />} />
          <Route path="/devis" element={<Devis />} />
          <Route path="/faq" element={<FAQ />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
