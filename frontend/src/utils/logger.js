/**
 * Structured logger — forwards to console in development, no-ops in production.
 * Vite tree-shakes the empty functions out of the production bundle entirely.
 */
const isDev = import.meta.env.DEV;

const logger = {
  log:   isDev ? (...args) => console.log(...args)   : () => {},
  warn:  isDev ? (...args) => console.warn(...args)  : () => {},
  error: isDev ? (...args) => console.error(...args) : () => {},
};

export default logger;