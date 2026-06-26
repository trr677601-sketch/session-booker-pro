import * as Sentry from "@sentry/node";

export function initSentry() {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: import.meta.env.MODE || "production",
  });
}

export { Sentry };
