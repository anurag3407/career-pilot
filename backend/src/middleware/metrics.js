import client from "prom-client";

const register = new client.Registry();

// Collect default Node.js metrics
client.collectDefaultMetrics({
  register,
  prefix: "careerpilot_",
});

/**
 * HTTP Metrics
 */

// Request counter
export const httpRequestCounter = new client.Counter({
  name: "careerpilot_http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

// Request latency
export const httpRequestDuration = new client.Histogram({
  name: "careerpilot_http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
});

// Error counter
export const httpErrorCounter = new client.Counter({
  name: "careerpilot_http_errors_total",
  help: "Total HTTP errors",
  labelNames: ["method", "route", "status"],
});

/**
 * Custom Metrics
 */

// AI API calls
export const aiCallsCounter = new client.Counter({
  name: "careerpilot_ai_calls_total",
  help: "Total AI API calls",
  labelNames: ["provider"],
});

// Jobs scraped
export const jobsScrapedCounter = new client.Counter({
  name: "careerpilot_jobs_scraped_total",
  help: "Total jobs scraped",
  labelNames: ["source"],
});

/**
 * Register metrics
 */

register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestDuration);
register.registerMetric(httpErrorCounter);
register.registerMetric(aiCallsCounter);
register.registerMetric(jobsScrapedCounter);

/**
 * Metrics middleware
 */

export const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const diff = process.hrtime(start);

    const duration =
      diff[0] + diff[1] / 1e9;

    const route =
      req.route?.path || req.path || req.originalUrl;

    const labels = {
      method: req.method,
      route,
      status: res.statusCode,
    };

    httpRequestCounter.inc(labels);

    httpRequestDuration.observe(
      labels,
      duration
    );

    if (res.statusCode >= 400) {
      httpErrorCounter.inc(labels);
    }
  });

  next();
};

/**
 * Metrics endpoint handler
 */

export const metricsHandler = async (req, res) => {
  res.set("Content-Type", register.contentType);

  const metrics = await register.metrics();

  res.end(metrics);
};

export default register;