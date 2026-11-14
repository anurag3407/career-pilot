import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import { PortfolioProvider, normalizePortfolioData } from '../context/PortfolioContext';

/**
 * Standalone Portfolio Renderer
 * 
 * Built separately from the main CareerPilot app.
 * At deploy time, the backend injects user portfolio data and chosen templateId
 * into the HTML shell via window.__PORTFOLIO_DATA__ and window.__TEMPLATE_ID__.
 * 
 * Wraps all templates with PortfolioProvider so both prop-based and context-based
 * templates receive the user's authentic data, with zero stranger dummy fallback.
 */

/**
 * Every template in `components/portfolio/templates` is deployable.
 *
 * The map is derived with `import.meta.glob` so a template added to the gallery
 * can never silently fall back to the generic layout at deploy time. Each entry
 * is its own lazy chunk: only the chosen template is ever downloaded.
 */
const templateMap = {
  // Composable Studio layout — the Portfolio Builder's own template
  Studio: lazy(() => import('../components/portfolio/studio/StudioSite')),
};

for (const [path, loader] of Object.entries(
  import.meta.glob('../components/portfolio/templates/*/index.jsx'),
)) {
  const id = path.replace('../components/portfolio/templates/', '').replace('/index.jsx', '');
  templateMap[id] = lazy(loader);
}

for (const [path, loader] of Object.entries(import.meta.glob('../components/portfolio/templates/*.jsx'))) {
  const id = path.replace('../components/portfolio/templates/', '').replace('.jsx', '');
  if (!templateMap[id]) templateMap[id] = lazy(loader);
}

function mapContactToSocials(portfolioData) {
  if (!portfolioData) return {};
  
  const contact = portfolioData.contact || {};
  const socials = {
    ...portfolioData.socials,
    ...(contact.github && { github: contact.github }),
    ...(contact.linkedin && { linkedin: contact.linkedin }),
    ...(contact.email && { email: contact.email }),
    ...(contact.portfolio && { website: contact.portfolio }),
    ...(contact.twitter && { twitter: contact.twitter }),
  };

  let projects = portfolioData.projects;
  if (Array.isArray(projects)) {
    projects = projects.map(p => ({
      ...p,
      ...(p.link && !p.liveUrl && { liveUrl: p.link }),
    }));
  }

  return {
    ...portfolioData,
    socials,
    projects,
  };
}

function LoadingScreen() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#0a0a0f',
      color: '#e4e4e7',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: '#818cf8',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px',
        }} />
        <p style={{ opacity: 0.7, fontSize: 14 }}>Loading portfolio...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

function FallbackPortfolio({ portfolioData }) {
  const hero = portfolioData?.hero || {};
  const personal = portfolioData?.personal || {};
  const name = personal.name || hero.subtitle || 'Portfolio';
  const title = personal.title || hero.title || '';
  const bio = personal.bio || portfolioData?.about?.bio || '';
  const email = portfolioData?.socials?.email || personal.email;
  const github = portfolioData?.socials?.github;
  const linkedin = portfolioData?.socials?.linkedin;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#090d16',
      color: '#f1f5f9',
      fontFamily: "'Inter', system-ui, sans-serif",
      textAlign: 'center',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 0.5rem' }}>{name}</h1>
        {title && <p style={{ fontSize: '1.25rem', color: '#818cf8', margin: '0 0 1.25rem', fontWeight: 500 }}>{title}</p>}
        {bio && <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 2rem' }}>{bio}</p>}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {email && (
            <a href={`mailto:${email}`} style={{ padding: '0.6rem 1.25rem', background: '#4f46e5', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
              Email Me
            </a>
          )}
          {github && (
            <a href={github} target="_blank" rel="noreferrer" style={{ padding: '0.6rem 1.25rem', background: '#1e293b', color: '#f8fafc', borderRadius: '10px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, border: '1px solid #334155' }}>
              GitHub
            </a>
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noreferrer" style={{ padding: '0.6rem 1.25rem', background: '#0284c7', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const templateId = window.__TEMPLATE_ID__ || 'default';
  const rawData = window.__PORTFOLIO_DATA__ || {};
  const mapped = mapContactToSocials(rawData);
  const portfolioData = normalizePortfolioData(mapped, { isDeploy: true });
  
  const TemplateComponent = templateMap[templateId] || FallbackPortfolio;

  // Update page title from user portfolio data
  const name = portfolioData?.personal?.name || portfolioData?.hero?.subtitle || 'Portfolio';
  const title = portfolioData?.personal?.title || portfolioData?.hero?.title || '';
  document.title = title ? `${name} — ${title}` : name;

  return (
    // .cp-raw-palette keeps the app-shell palette remap out of exported
    // portfolios — they must render with Tailwind's stock palette.
    <div className="cp-raw-palette">
      <PortfolioProvider portfolioData={portfolioData} isDeploy={true}>
        <Suspense fallback={<LoadingScreen />}>
          <TemplateComponent portfolioData={portfolioData} />
        </Suspense>
      </PortfolioProvider>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
