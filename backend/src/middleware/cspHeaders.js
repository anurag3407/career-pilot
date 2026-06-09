import helmet from 'helmet';

export const cspHeaders = helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://apis.google.com",
        "https://accounts.google.com",
        "https://www.gstatic.com",
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
      ],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https:",
      ],
      connectSrc: [
        "'self'",
        process.env.FRONTEND_URL || "http://localhost:5173",
        "https://firebaseapp.com",
        "https://*.googleapis.com",
        "https://*.firebaseio.com",
        "https://identitytoolkit.googleapis.com",
        "wss:",
        "ws:",
      ],
      frameSrc: [
        "'self'",
        "https://accounts.google.com",
      ],
      objectSrc: ["'none'"],
      ...(process.env.NODE_ENV === 'production'
        ? { upgradeInsecureRequests: [] }
        : {}),
    },
  },
});