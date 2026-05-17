type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    va?: (eventName: string, payload?: AnalyticsPayload) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(eventName: string, payload: AnalyticsPayload = {}) {
  window.va?.(eventName, payload);

  if (window.gtag) {
    window.gtag('event', eventName, payload);
  }
}

export function readUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || '',
    utmMedium: params.get('utm_medium') || '',
    utmCampaign: params.get('utm_campaign') || '',
    utmTerm: params.get('utm_term') || '',
    utmContent: params.get('utm_content') || '',
  };
}
