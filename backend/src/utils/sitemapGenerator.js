/**
 * Utility to generate XML sitemaps for portfolio pages.
 * Filters out draft/unpublished project and blog entries when supplied.
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
    return new Date().toISOString().split('T')[0];
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

const isPublishedContent = (item) => {
  if (!item || typeof item !== 'object') {
    return false;
  }

  if (item.isPublished === false || item.isDraft === true) {
    return false;
  }

  if (typeof item.status === 'string') {
    const status = item.status.trim().toLowerCase();

    if (['draft', 'unpublished', 'private', 'hidden'].includes(status)) {
      return false;
    }
  }

  return true;
};

const buildUrlEntry = ({
  loc,
  lastmod,
  changefreq = 'monthly',
  priority = '0.5',
}) => {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${formatDate(lastmod)}</lastmod>
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

  projects.filter(isPublishedContent).forEach((project) => {
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

  blogs.filter(isPublishedContent).forEach((blog) => {
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