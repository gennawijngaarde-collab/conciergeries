import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Fixed header height (matches Header: h-16 / lg:h-20) + small breathing room */
function headerOffsetPx(): number {
  if (typeof window === 'undefined') return 80;
  return window.matchMedia('(min-width: 1024px)').matches ? 96 : 80;
}

export function scrollToElementWithOffset(el: HTMLElement, behavior: ScrollBehavior = 'smooth') {
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffsetPx();
  window.scrollTo({ top: Math.max(0, top), left: 0, behavior });
}

export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.replace('#', ''));
      // Wait a tick so the target is in the DOM after route render
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          scrollToElementWithOffset(el, 'smooth');
          return;
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search, location.hash]);

  return null;
}
