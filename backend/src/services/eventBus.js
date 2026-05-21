import { EventEmitter } from 'events';

/**
 * Central Event Bus for Career Pilot
 *
 * Decouples services using an event-driven architecture.
 * All cross-service communication should go through this bus
 * instead of direct imports, enabling loose coupling and
 * easier testing.
 *
 * Usage:
 *   import { eventBus, Events } from './eventBus.js';
 *   eventBus.emit(Events.RESUME_ENHANCED, { userId, resumeId });
 *   eventBus.on(Events.RESUME_ENHANCED, (data) => { ... });
 */

// ─── Event Name Constants ───────────────────────────────────────────────────────

export const Events = Object.freeze({
  // Resume events
  RESUME_ENHANCED:       'resume_enhanced',
  RESUME_UPLOADED:       'resume_uploaded',
  RESUME_DOWNLOADED:     'resume_downloaded',

  // Job alert events
  JOB_ALERT_TRIGGERED:   'job_alert_triggered',
  JOB_ALERT_CREATED:     'job_alert_created',
  JOB_MATCH_FOUND:       'job_match_found',

  // Interview events
  INTERVIEW_COMPLETED:   'interview_completed',
  INTERVIEW_STARTED:     'interview_started',

  // User activity events
  USER_LOGGED_IN:        'user_logged_in',
  USER_PROFILE_UPDATED:  'user_profile_updated',
});

// ─── EventBus Class ─────────────────────────────────────────────────────────────

class EventBus extends EventEmitter {
  constructor() {
    super();

    // Allow a generous number of listeners per event to avoid
    // Node.js MaxListenersExceededWarning in production.
    this.setMaxListeners(20);

    // Internal registry for debugging / introspection
    this._registry = new Map();

    console.log('🚌 EventBus initialised');
  }

  // ── Safe Emit ───────────────────────────────────────────────────────────────

  /**
   * Emit an event with error handling so a failing listener
   * never crashes the emitting service.
   *
   * @param {string}  event   – one of the Events constants
   * @param {object}  payload – data to pass to listeners
   * @returns {boolean} true if the event had listeners
   */
  safeEmit(event, payload = {}) {
    const enrichedPayload = {
      ...payload,
      _meta: {
        event,
        emittedAt: new Date().toISOString(),
        id: `${event}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      },
    };

    try {
      console.log(`📡 Event emitted: ${event}`, {
        id: enrichedPayload._meta.id,
        listeners: this.listenerCount(event),
      });
      return this.emit(event, enrichedPayload);
    } catch (error) {
      console.error(`❌ EventBus emit error [${event}]:`, error.message);
      return false;
    }
  }

  // ── Listener Registration Helpers ───────────────────────────────────────────

  /**
   * Register a listener with built-in error isolation.
   * If the handler throws, the error is logged but does not
   * propagate to the emitter or other listeners.
   *
   * @param {string}   event   – event name
   * @param {string}   name    – human-readable handler name (for logs)
   * @param {Function} handler – async or sync callback
   */
  register(event, name, handler) {
    const wrappedHandler = async (payload) => {
      try {
        await handler(payload);
      } catch (error) {
        console.error(
          `❌ EventBus handler error [${name}] for [${event}]:`,
          error.message,
        );
      }
    };

    this.on(event, wrappedHandler);

    // Track registration for debugging
    if (!this._registry.has(event)) {
      this._registry.set(event, []);
    }
    this._registry.get(event).push(name);

    console.log(`✅ Handler registered: "${name}" → ${event}`);
  }

  // ── Introspection ───────────────────────────────────────────────────────────

  /**
   * Return a snapshot of all registered handler names, grouped by event.
   * Useful for health-check endpoints or debugging.
   */
  getRegistry() {
    const snapshot = {};
    for (const [event, handlers] of this._registry) {
      snapshot[event] = [...handlers];
    }
    return snapshot;
  }

  /**
   * Remove all listeners and clear the registry.
   * Primarily useful in tests.
   */
  reset() {
    this.removeAllListeners();
    this._registry.clear();
    console.log('🔄 EventBus reset');
  }
}

// ─── Singleton Export ───────────────────────────────────────────────────────────

const eventBus = new EventBus();
export default eventBus;
export { eventBus };
