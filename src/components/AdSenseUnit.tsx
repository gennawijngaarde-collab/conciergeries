import { useEffect, useRef } from 'react';
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

const AdSenseUnit = ({ className = '' }: AdSenseUnitProps) => {
  const insRef = useRef<HTMLElement>(null);
  const { client, slot, format } = siteConfig.adSense;

  useEffect(() => {
    const ins = insRef.current;
    if (!ins || ins.dataset.adsenseFilled === 'true') return;

    loadAdSenseScript(client)
      .then(() => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          ins.dataset.adsenseFilled = 'true';
        } catch {
          // Ignore duplicate fill errors (e.g. React Strict Mode)
        }
      })
      .catch(() => {});
  }, [client, slot]);

  return (
    <div className={`overflow-hidden ${className}`} aria-label="Publicité">
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSenseUnit;
