/**
 * Structured logger for Career Pilot frontend.
 *
 * Replaces raw console.log with production-safe logging:
 * - Logs are silenced in production (NODE_ENV=production)
 * - Sentry breadcrumbs for error context tracking
 * - Console.warn/error still allowed for debugging
 */

const isProduction = () =>
  typeof process !== 'undefined' && process.env?.NODE_ENV === 'production';

const logger = {
  /**
   * Log informational messages. No-ops in production.
   * Usage: logger.log('User signed in', { userId: '123' })
   */
  log(message, data = null) {
    if (isProduction()) return;

    if (data) {
      console.log(`[CareerPilot] ${message}`, data);
    } else {
      console.log(`[CareerPilot] ${message}`);
    }
  },

  /**
   * Log warnings. Always shown.
   * Usage: logger.warn('API slow', { endpoint: '/jobs' })
   */
  warn(message, data = null) {
    if (data) {
      console.warn(`[CareerPilot] ${message}`, data);
    } else {
      console.warn(`[CareerPilot] ${message}`);
    }
  },

  /**
   * Log errors. Always shown, also sent to Sentry if configured.
   * Usage: logger.error('Fetch failed', error)
   */
  error(message, error = null) {
    console.error(`[CareerPilot] ${message}`, error || '');

    // Sentry integration — if Sentry is initialized, capture as breadcrumb
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error || new Error(message), {
        tags: { source: 'career-pilot-frontend' },
      });
    }

  },

  /**
   * Track user action for analytics / audit.
   * Usage: logger.track('job_search', { query: 'react dev', filters: ['remote'] })
   */
  track(event, properties = null) {
    if (!isProduction()) {
      console.log(`[CareerPilot] 📊 Track: ${event}`, properties || '');
    }
    // In production, this goes to analytics (e.g. PostHog, Amplitude)
    // — plug in your analytics SDK here
  },
};

export default logger;
