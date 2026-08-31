import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { getCountryBySlug } from '@/data/intl/countries';
import CountryPage from '@/pages/intl/pages/CountryPage';
import RegionPage from '@/pages/intl/pages/RegionPage';
import CityPage from '@/pages/intl/pages/CityPage';
import CityCategoryPage from '@/pages/intl/pages/CityCategoryPage';
import NotFound from '@/pages/NotFound';

/**
 * Router pour l'architecture internationale par répertoire.
 * IMPORTANT: monté uniquement sur des préfixes explicites (/france/*, /belgique/*, ...)
 * pour ne jamais intercepter les routes existantes.
 */
export default function IntlRouter() {
  const { countrySlug } = useParams();
  const country = countrySlug ? getCountryBySlug(countrySlug) : null;

  if (!country || !country.active) return <NotFound />;

  return (
    <Routes>
      <Route index element={<CountryPage country={country} />} />
      <Route path=":regionSlug" element={<RegionPage country={country} />} />
      <Route path=":regionSlug/:citySlug" element={<CityPage country={country} />} />
      <Route path=":regionSlug/:citySlug/:categorySlug" element={<CityCategoryPage country={country} />} />
      {/* canonical trailing slash normalization is handled by Vercel/SPA; keep client-side simple */}
      <Route path="*" element={<Navigate to={`/${country.slug}`} replace />} />
    </Routes>
  );
}

