import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/lib/analytics';

/**
 * Hook pour tracker automatiquement les changements de page
 * Utilise React Router pour détecter les changements de route
 */
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Attendre un court délai pour que le titre de la page soit mis à jour
    const timer = setTimeout(() => {
      trackPageView(location.pathname + location.search, document.title);
    }, 100);

    return () => clearTimeout(timer);
  }, [location]);
}
