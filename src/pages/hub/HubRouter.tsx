import { Navigate, Route, Routes } from 'react-router-dom';
import HubHome from '@/pages/hub/pages/HubHome';
import HubContentPage from '@/pages/hub/components/HubContentPage';
import ProfitSimulator from '@/pages/hub/pages/ProfitSimulator';
import { hubPages } from '@/data/hub/hubPages';

export default function HubRouter() {
  return (
    <Routes>
      <Route index element={<HubHome />} />
      <Route path="simulateur-rentabilite" element={<ProfitSimulator />} />
      {hubPages.map((p) => (
        <Route key={p.path} path={p.route} element={<HubContentPage page={p} />} />
      ))}
      <Route path="*" element={<Navigate to="/hub" replace />} />
    </Routes>
  );
}

