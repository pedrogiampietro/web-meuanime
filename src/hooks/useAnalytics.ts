interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export function useAnalytics() {
  const trackPageView = (page_path: string) => {
    if (typeof gtag !== "undefined") {
      gtag("config", "G-7P9PH5SRGM", {
        page_path,
      });
    }
  };

  const trackEvent = ({ action, category, label, value }: AnalyticsEvent) => {
    if (typeof gtag !== "undefined") {
      gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  return { trackPageView, trackEvent };
}
