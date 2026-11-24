/**
 * Service Analytics GA4 centralisé
 * Gère tous les événements de tracking pour l'annuaire de conciergeries
 */

// Types pour les paramètres des événements
export interface ListingParams {
  listing_id?: string;
  listing_name?: string;
  city?: string;
  department?: string;
  country?: string;
  premium?: boolean;
}

export interface SearchParams {
  search_term?: string;
  city?: string;
  department?: string;
}

export interface QuoteParams {
  listing_id?: string;
  listing_name?: string;
  city?: string;
}

export interface PMSParams {
  plan?: string;
  price?: number;
  currency?: string;
}

// Vérifier si GA4 est disponible
function isGA4Available(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

/**
 * Fonction générique pour envoyer un événement
 */
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (!isGA4Available()) {
    if (import.meta.env.DEV) {
      console.log('[Analytics] GA4 not available, event:', eventName, params);
    }
    return;
  }

  try {
    window.gtag('event', eventName, params);
    if (import.meta.env.DEV) {
      console.log('[Analytics] Event tracked:', eventName, params);
    }
  } catch (error) {
    console.error('[Analytics] Error tracking event:', error);
  }
}

/**
 * Track page view
 */
export function trackPageView(path: string, title?: string) {
  if (!isGA4Available()) {
    return;
  }

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
  });
}

/**
 * Track directory view (page principale de l'annuaire)
 */
export function trackDirectoryView() {
  trackEvent('view_directory');
}

/**
 * Track listing view (fiche conciergerie)
 */
export function trackListingView(params: ListingParams) {
  trackEvent('view_listing', params);
}

/**
 * Track directory search
 */
export function trackDirectorySearch(params: SearchParams) {
  trackEvent('search_directory', params);
}

/**
 * Track phone click
 */
export function trackPhoneClick(params: ListingParams) {
  trackEvent('click_phone', params);
}

/**
 * Track email click
 */
export function trackEmailClick(params: ListingParams) {
  trackEvent('click_email', params);
}

/**
 * Track website click
 */
export function trackWebsiteClick(params: ListingParams) {
  trackEvent('click_website', params);
}

/**
 * Track quote click (demande de devis)
 */
export function trackQuoteClick(params: QuoteParams) {
  trackEvent('click_quote', params);
}

/**
 * Track quote submit (soumission du devis)
 */
export function trackQuoteSubmit(params: QuoteParams) {
  trackEvent('quote_submit', params);
}

/**
 * Track premium click (clic sur un élément premium)
 */
export function trackPremiumClick(params: ListingParams) {
  trackEvent('premium_click', params);
}

/**
 * Track PMS view (visite de la page PMS)
 */
export function trackPmsView() {
  trackEvent('pms_view');
}

/**
 * Track PMS signup (début inscription PMS)
 */
export function trackPmsSignup(params: PMSParams) {
  trackEvent('pms_signup', params);
}

/**
 * Track PMS checkout (début du paiement)
 */
export function trackPmsCheckout(params: PMSParams) {
  trackEvent('pms_checkout', params);
}

/**
 * Track PMS purchase (achat confirmé)
 * ATTENTION: N'envoyer cet événement QUE si le paiement est réellement confirmé
 */
export function trackPmsPurchase(params: PMSParams) {
  trackEvent('pms_purchase', params);
}

// Type pour gtag global
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}
