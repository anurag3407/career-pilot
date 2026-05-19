/**
 * Utility to generate XML sitemaps for portfolio pages.
 */

const escapeXml = (value = '') => {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/'/g, '&apos;')
    .replace(/"/g, '&quot;')
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;');
};

const formatDate = (date) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toISOString().split('T')[0];
};

const normalizePath = (value = '') => {
  const trimmed = String(value).trim();

  if (!trimmed) {
    return '';
  }

  return `/${trimmed.replace(/^\/+|\/+$/g, '')}`;
};

const buildUrlEntry = ({
  loc,
  lastmod,
  changefreq = 'monthly',
  priority = '0.5',
}) => {
  const formattedLastmod = formatDate(lastmod);

  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    ${formattedLastmod ? `<lastmod>${formattedLastmod}</lastmod>` : ''}
    <changefreq>${escapeXml(changefreq)}</changefreq>
    <priority>${escapeXml(priority)}</priority>
  </url>`;
};

const generateSitemapXml = ({
  baseUrl,
  slug,
  portfolioPath = '/portfolio/public',
  portfolioUpdatedAt,
  projects = [],
  blogs = [],
}) => {
  const cleanBaseUrl = String(baseUrl || '').replace(/\/$/, '');
  const cleanPortfolioPath = normalizePath(portfolioPath);
  const encodedSlug = encodeURIComponent(slug);
  const portfolioBase = `${cleanBaseUrl}${cleanPortfolioPath}/${encodedSlug}`;

  const entries = [
    buildUrlEntry({
      loc: portfolioBase,
      lastmod: portfolioUpdatedAt,
      changefreq: 'weekly',
      priority: '1.0',
    }),
  ];

  projects.forEach((project) => {
    if (!project?.slug) {
      return;
    }

    entries.push(
      buildUrlEntry({
        loc: `${portfolioBase}/projects/${encodeURIComponent(project.slug)}`,
        lastmod: project.updatedAt || portfolioUpdatedAt,
        changefreq: 'monthly',
        priority: '0.8',
      })
    );
  });

  blogs.forEach((blog) => {
    if (!blog?.slug) {
      return;
    }

    entries.push(
      buildUrlEntry({
        loc: `${portfolioBase}/blog/${encodeURIComponent(blog.slug)}`,
        lastmod: blog.updatedAt || portfolioUpdatedAt,
        changefreq: 'monthly',
        priority: '0.7',
      })
    );
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;
};

const generateRobotsTxt = ({ sitemapUrl }) => {
  return `User-agent: *
Allow: /

Sitemap: ${String(sitemapUrl || '').trim()}`;
};

export { generateSitemapXml, generateRobotsTxt, formatDate, escapeXml };