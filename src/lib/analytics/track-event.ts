type UmamiEventData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: UmamiEventData) => void;
    };
  }
}

export type AnalyticsEvent = "post-read" | "newsletter-signup" | "comment-submitted";

export const trackEvent = (event: AnalyticsEvent, data?: UmamiEventData) => {
  window.umami?.track(event, data);
};
