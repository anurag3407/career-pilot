import crypto from 'crypto';

const DEFAULT_VARY_HEADERS = ['Accept-Encoding'];

const normalizeIfNoneMatch = (headerValue) => {
  if (!headerValue) return [];
  if (Array.isArray(headerValue)) {
    return headerValue.flatMap(value => String(value).split(',').map(item => item.trim()).filter(Boolean));
  }

  return String(headerValue)
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
};

const computeWeakETag = (body) => {
  const serialized =
    typeof body === 'string' || Buffer.isBuffer(body)
      ? body
      : JSON.stringify(body);

  const bytes = Buffer.isBuffer(serialized)
    ? serialized
    : Buffer.from(serialized, 'utf8');

  const hash = crypto.createHash('sha1').update(bytes).digest('base64');
  return `W/"${hash}"`;
};

const setVaryHeader = (res, headers = DEFAULT_VARY_HEADERS) => {
  const current = res.getHeader('Vary');
  const currentValues = Array.isArray(current)
    ? current
    : typeof current === 'string'
      ? current.split(',').map((value) => value.trim()).filter(Boolean)
      : [];

  const newValues = new Set([...currentValues, ...headers]);
  res.set('Vary', Array.from(newValues).join(', '));
};

const buildCacheControl = ({ maxAge, isPublic = true } = {}) => {
  const tokens = [];

  tokens.push(isPublic ? 'public' : 'private');
  if (typeof maxAge === 'number') {
    tokens.push(`max-age=${maxAge}`);
  }

  return tokens.join(', ');
};

const normalizeETagForWeakComparison = (etag) => String(etag).trim().replace(/^W\//i, '');

const matchesETag = (incomingETags, etag) => {
  const normalizedETag = normalizeETagForWeakComparison(etag);
  const tags = normalizeIfNoneMatch(incomingETags);
  return tags.some((tag) => tag === '*' || normalizeETagForWeakComparison(tag) === normalizedETag);
};

const cacheHeaders = ({ maxAge, isPublic = true } = {}) => (req, res, next) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    return next();
  }

  setVaryHeader(res);

  if (req.headers.authorization) {
    res.set(
      'Cache-Control',
      'private, no-store, no-cache, must-revalidate'
    );

    setVaryHeader(res, ['Authorization']);

    return next();
  }

  const cacheControlValue = buildCacheControl({ maxAge, isPublic });
  res.set('Cache-Control', cacheControlValue);

  const originalSend = res.send.bind(res);

  res.send = function sendWithCaching(body) {
    if (res.headersSent) {
      return originalSend(body);
    }

    const etag = computeWeakETag(body ?? '');
    res.set('ETag', etag);

    const ifNoneMatch = req.headers['if-none-match'];
    if (ifNoneMatch && matchesETag(ifNoneMatch, etag)) {
      res.status(304);
      res.removeHeader('Content-Type');
      res.removeHeader('Content-Length');
      return originalSend.call(this);
    }

    return originalSend(body);
  };

  next();
};

export default cacheHeaders;
