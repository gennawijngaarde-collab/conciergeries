import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '@/data/site';

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

let scriptPromise: Promise<void> | null = null;

function loadAdSenseScript(client: string): Promise<void> {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-adsense-client="${client}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.dataset.adsenseClient = client;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('AdSense script failed to load'));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

type AdSenseUnitProps = {
  className?: string;
};

/**
 * Affiche une pub AdSense sans réserver un grand vide si aucune annonce
 * n’est servie (localhost, bloqueur, compte non validé, etc.).
 */
const AdSenseUnit = ({ className = '' }: AdSenseUnitProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);
  const [visible, setVisible] = useState(true);
  const { client, slot, format } = siteConfig.adSense;

  useEffect(() => {
    const ins = insRef.current;
    if (!ins || ins.dataset.adsenseFilled === 'true') return;

    let cancelled = false;

    loadAdSenseScript(client)
      .then(() => {
        if (cancelled) return;
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          ins.dataset.adsenseFilled = 'true';
        } catch {
          // Ignore duplicate fill errors (e.g. React Strict Mode)
        }
      })
      .catch(() => {
        if (!cancelled) setVisible(false);
      });

    // Si aucune pub ne remplit le slot, on retire le bloc pour éviter le “trou” blanc
    const timer = window.setTimeout(() => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const h = wrap.getBoundingClientRect().height;
      const hasIframe = Boolean(wrap.querySelector('iframe'));
      if (!hasIframe || h < 40) setVisible(false);
    }, 2500);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [client, slot]);

  if (!visible) return null;

  return (
    <div
      ref={wrapRef}
      className={`overflow-hidden max-h-[280px] ${className}`}
      aria-label="Publicité"
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block', minHeight: 0 }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSenseUnit;
