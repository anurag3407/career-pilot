# CDN Configuration for Static Assets

## What is a CDN?
A Content Delivery Network (CDN) is a geographically distributed group of servers that works together to provide fast delivery of Internet content. A CDN allows for the quick transfer of assets needed for loading Internet content including HTML pages, javascript files, stylesheets, images, and videos. By serving static assets from a CDN, you reduce the load on your primary server, decrease latency for users (as assets are served from a location closer to them), and improve overall application performance.

## How to Configure `VITE_CDN_URL`
In this project, Vite is configured to use a CDN base URL for static assets during the build process if an environment variable is provided.

To configure the CDN URL, set the `VITE_CDN_URL` environment variable before running the production build.

Example using a `.env` file or command line:
```bash
VITE_CDN_URL=https://cdn.example.com/ npm run build
```
Or in your `.env.production` file:
```env
VITE_CDN_URL=https://cdn.example.com/
```

When this variable is set, Vite will automatically prefix all static asset paths (like JavaScript, CSS, and images) with the provided CDN URL in the generated HTML and CSS files. If not set, it defaults to `/`, serving assets from the same origin.

## Asset Fingerprinting
Vite automatically enables asset fingerprinting (also known as cache busting) by default. When building for production, Vite appends a unique hash to the filenames of your static assets based on their contents (e.g., `main-a4b3c2d1.js`). 

This mechanism is crucial when using a CDN because it allows you to safely cache assets for a very long time. When the content of a file changes, its hash changes, resulting in a new filename. This guarantees that users will always receive the latest version of the file without dealing with stale cached versions, while unmodified files remain cached.

## Recommended Cache Headers
Because of Vite's robust asset fingerprinting, you should configure your CDN or origin server to cache static assets aggressively.

For assets in the `assets/` directory (which contain hashes in their filenames), use the following recommended HTTP header:
```http
Cache-Control: public, max-age=31536000, immutable
```
* `public`: Indicates that the response may be cached by any cache.
* `max-age=31536000`: Caches the asset for 1 year (in seconds).
* `immutable`: Indicates that the response body will not change over time, preventing the browser from revalidating it.

For non-hashed assets (like `index.html` or files in the `public/` directory), you should use a much shorter cache duration or require revalidation (e.g., `Cache-Control: no-cache`).

## Example CDN Providers
Here are some popular CDN providers you can use to host your static assets:

1. **Cloudflare**: Acts as a reverse proxy, automatically caching static assets when proxying traffic to your origin server. It's one of the easiest to set up since it doesn't always require a separate storage bucket.
2. **AWS CloudFront**: A highly customizable CDN by Amazon Web Services. Often used in combination with an S3 bucket where your Vite build output (`dist/`) is uploaded.
3. **BunnyCDN**: A fast, reliable, and cost-effective CDN provider that is very easy to configure for static asset delivery.
