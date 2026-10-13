/**
 * Static route-auth scanner.
 *
 * Walks the Express route files, extracts every route registration by
 * balancing parentheses in the source text, and reports routes that mutate
 * state (POST/PUT/PATCH/DELETE) or spend an AI call without an
 * authentication middleware in front of them.
 *
 * This is deliberately a static source scan rather than a runtime import:
 * several route modules start queues/intervals on import, which never lets
 * the event loop settle under `node --test`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROUTES_DIR = path.join(__dirname, '..', 'src', 'routes');

// verifyToken is composed of attachUserToReq + enforceAuth, so all of these
// count as "this route is behind authentication".
const AUTH_MIDDLEWARE = [
  'attachUserToReq',
  'enforceAuth',
  'verifyToken',
  'verifyAdmin',
  'adminOnly',
  'requireAllowlistedUID',
  'clerkMiddleware',
];

// Source-level signals that a file spends AI (server-side quota).
const AI_SIGNALS = [
  'getDefaultProvider',
  'extractAIProvider',
  'aiRateLimiter',
  'generateContent',
  'aiProviders',
  'langchain',
];

/**
 * Routes that are intentionally public. Each entry must state why it is safe,
 * so a new unguarded route cannot be silently allowlisted.
 */
export const PUBLIC_ROUTE_ALLOWLIST = {
  'portfolio.js': {
    'GET /': 'Lists template directory names only; no user data.',
    'GET /public/:slug/sitemap.xml': 'Public sitemap for an already-public portfolio.',
    'GET /public/:slug/robots.txt': 'Public robots.txt for an already-public portfolio.',
    'GET /public/:slug/accessibility': 'Public audit of an already-public portfolio.',
    'GET /:slug/bandwidth': 'Public stats for an already-public portfolio.',
  },
  'readmeGenerator.js': {
    'GET /templates': 'Static list of README templates.',
  },
  'roast.js': {
    'GET /share/:shareToken': 'Opt-in public share; query also requires isPublic:true.',
  },
  'collaboration.js': {
    'GET /shared/:shareToken': 'Opt-in public share link.',
    'POST /shared/:shareToken/comments': 'Comment on a public share link.',
    'GET /shared/:shareToken/comments': 'Read comments on a public share link.',
  },
  'emailTracking.js': {
    'GET /open/:token': 'Email open pixel; unauthenticated by design.',
    'GET /click/:token': 'Email link tracking; unauthenticated by design.',
  },
  'auth.js': {
    'GET /github/callback': 'OAuth callback; the provider is the authenticator.',
  },
  'bullBoard.js': {
    'GET /health': 'Queue health probe.',
  },
  'webhook.js': {
    'POST /clerk':
      'Authenticates via Svix signature verification (Webhook.verify), not session auth. Throws if CLERK_WEBHOOK_SECRET is unset.',
  },
  'bugs.js': {},
};

const MUTATING = new Set(['post', 'put', 'patch', 'delete']);

/**
 * Given the index of an opening paren, return the index of its matching close,
 * ignoring parens inside quotes and template literals.
 */
function findMatchingParen(src, openIndex) {
  let depth = 0;
  let quote = null;

  for (let i = openIndex; i < src.length; i++) {
    const ch = src[i];

    if (quote) {
      if (ch === '\\') {
        i++;
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }

    if (ch === '(') depth++;
    else if (ch === ')') {
      depth--;
      if (depth === 0) return i;
    }
  }

  return -1;
}

/**
 * Walk the source once, skipping comments and string/template literals, and
 * collect the index of every `router.<method>(` that appears in real code.
 * @returns {{index: number, method: string, openIndex: number}[]}
 */
function findRouteCalls(src) {
  const calls = [];
  const methods = 'get|post|put|patch|delete';

  let i = 0;

  while (i < src.length) {
    const ch = src[i];

    // Comments
    if (ch === '/' && src[i + 1] === '/') {
      const nl = src.indexOf('\n', i);
      i = nl === -1 ? src.length : nl + 1;
      continue;
    }
    if (ch === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      i = end === -1 ? src.length : end + 2;
      continue;
    }

    // Quoted strings (route paths live here, but we still skip their contents)
    if (ch === '"' || ch === "'") {
      const quote = ch;
      i++;
      while (i < src.length) {
        if (src[i] === '\\') {
          i += 2;
          continue;
        }
        if (src[i] === quote) {
          i++;
          break;
        }
        i++;
      }
      continue;
    }

    // Template literals, including ${ } interpolation
    if (ch === '`') {
      i++;
      let depth = 0;
      while (i < src.length) {
        if (src[i] === '\\') {
          i += 2;
          continue;
        }
        if (src[i] === '$' && src[i + 1] === '{') {
          depth++;
          i += 2;
          continue;
        }
        if (depth > 0 && src[i] === '}') {
          depth--;
          i++;
          continue;
        }
        if (depth === 0 && src[i] === '`') {
          i++;
          break;
        }
        i++;
      }
      continue;
    }

    // Real code: look for a router call starting here.
    if (src.startsWith('router.', i)) {
      const boundaryOk = i === 0 || !/[\w$]/.test(src[i - 1]);
      if (boundaryOk) {
        const m = /^router\.(get|post|put|patch|delete)\s*\(/.exec(src.slice(i, i + 40));
        if (m) {
          calls.push({
            index: i,
            method: m[1],
            openIndex: i + m[0].length - 1,
          });
          i += m[0].length;
          continue;
        }
      }
    }

    i++;
  }

  return calls;
}

/**
 * Extract every route registration from one route file's source.
 * @returns {{method: string, path: string, args: string}[]}
 */
export function extractRoutes(src) {
  const routes = [];

  for (const call of findRouteCalls(src)) {
    const closeIndex = findMatchingParen(src, call.openIndex);
    if (closeIndex === -1) continue;

    const args = src.slice(call.openIndex + 1, closeIndex);
    const pathMatch = args.match(/['"`]([^'"`]*)['"`]/);
    routes.push({
      method: call.method.toUpperCase(),
      path: pathMatch ? pathMatch[1] : '(unparsed)',
      args,
    });
  }

  return routes;
}

function isGuarded(args, routerHasAuth) {
  if (routerHasAuth) return true;
  return AUTH_MIDDLEWARE.some((name) => new RegExp(`\\b${name}\\b`).test(args));
}

/**
 * Blank out comments and string contents, preserving length so indices from the
 * masked source still line up with the original.
 */
function maskNonCode(src) {
  const out = src.split('');
  let i = 0;

  const blank = (from, to) => {
    for (let k = from; k < to && k < out.length; k++) {
      if (out[k] !== '\n') out[k] = ' ';
    }
  };

  while (i < src.length) {
    const ch = src[i];

    if (ch === '/' && src[i + 1] === '/') {
      const nl = src.indexOf('\n', i);
      const end = nl === -1 ? src.length : nl;
      blank(i, end);
      i = end;
      continue;
    }
    if (ch === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      const stop = end === -1 ? src.length : end + 2;
      blank(i, stop);
      i = stop;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch;
      const start = i;
      i++;
      while (i < src.length) {
        if (src[i] === '\\') {
          i += 2;
          continue;
        }
        if (src[i] === quote) {
          i++;
          break;
        }
        i++;
      }
      // Keep the quotes so path extraction still works; blank the inside.
      blank(start + 1, i - 1);
      continue;
    }

    i++;
  }

  return out.join('');
}

function routerAppliesAuthGlobally(src) {
  // Use the masked source rather than a bare regex so a `router.use(` inside a
  // comment or string cannot fake global auth.
  const masked = maskNonCode(src);
  const pattern = /\brouter\.use\s*\(/g;
  let match;
  while ((match = pattern.exec(masked)) !== null) {
    const openIndex = match.index + match[0].length - 1;
    const closeIndex = findMatchingParen(src, openIndex);
    if (closeIndex === -1) continue;
    const args = src.slice(openIndex + 1, closeIndex);
    if (AUTH_MIDDLEWARE.some((name) => new RegExp(`\\b${name}\\b`).test(args))) return true;
  }
  return false;
}

/**
 * Full audit across the routes directory.
 * @returns {{violations: object[], checked: number, files: string[]}}
 */
export function auditRouteAuth() {
  const violations = [];
  const files = fs
    .readdirSync(ROUTES_DIR)
    .filter((f) => f.endsWith('.js') && !f.includes('__tests__'));

  let checked = 0;

  for (const file of files) {
    const src = fs.readFileSync(path.join(ROUTES_DIR, file), 'utf8');
    const fileSpendsAi = AI_SIGNALS.some((signal) => src.includes(signal));
    const routerHasAuth = routerAppliesAuthGlobally(src);
    const allowlist = PUBLIC_ROUTE_ALLOWLIST[file] ?? {};

    for (const route of extractRoutes(src)) {
      const isMutating = MUTATING.has(route.method.toLowerCase());
      if (!isMutating && !fileSpendsAi) continue;

      checked++;
      if (isGuarded(route.args, routerHasAuth)) continue;

      const key = `${route.method} ${route.path}`;
      if (allowlist[key]) continue;

      violations.push({
        file,
        route: key,
        reason: isMutating ? 'mutating route without auth' : 'AI-spending file, route without auth',
      });
    }
  }

  return { violations, checked, files };
}

export function getRoutesDir() {
  return ROUTES_DIR;
}