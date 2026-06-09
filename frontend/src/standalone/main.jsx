import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';

/**
 * Standalone Portfolio Renderer
 * 
 * This entry point is built separately from the main app.
 * At deploy time, the backend injects portfolio data and templateId
 * into the HTML shell via window.__PORTFOLIO_DATA__ and window.__TEMPLATE_ID__.
 * 
 * The app then renders the exact same React template component
 * that the user previewed in the gallery — with all animations,
 * icons, and styling preserved.
 */

// Explicitly import all complete templates for code-splitting
const templateMap = {
  Cherry_Blossom: lazy(() => import('../components/portfolio/templates/Cherry_Blossom/index.jsx')),
  Swiss_Typography: lazy(() => import('../components/portfolio/templates/Swiss_Typography/index.jsx')),
  Liquid_Glass: lazy(() => import('../components/portfolio/templates/Liquid_Glass/index.jsx')),
  Midnight_Gradient: lazy(() => import('../components/portfolio/templates/Midnight_Gradient/index.jsx')),
  Playing_Cards: lazy(() => import('../components/portfolio/templates/Playing_Cards/index.jsx')),
};

function mapContactToSocials(portfolioData) {
  if (!portfolioData) return portfolioData;
  
  // Map the contact object (from AI extractor) to socials (expected by templates)
  const contact = portfolioData.contact || {};
  const socials = {
    ...portfolioData.socials,
    ...(contact.github && { github: contact.github }),
    ...(contact.linkedin && { linkedin: contact.linkedin }),
    ...(contact.email && { email: contact.email }),
    ...(contact.portfolio && { website: contact.portfolio }),
    ...(contact.twitter && { twitter: contact.twitter }),
  };

  // Map project links
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

function FallbackPortfolio({ data }) {
  // Simple fallback for unknown template IDs
  const hero = data?.hero || {};
  const name = hero.subtitle || 'Portfolio';
  const title = hero.title || '';
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0f',
      color: '#e4e4e7',
      fontFamily: "'Inter', system-ui, sans-serif",
      textAlign: 'center',
      padding: '2rem',
    }}>
      <div>
        <h1 style={{ fontSize: '3rem', fontWeight: 900 }}>{name}</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.7, marginTop: '0.5rem' }}>{title}</p>
      </div>
    </div>
  );
}

function App() {
  const templateId = window.__TEMPLATE_ID__ || 'default';
  const rawData = window.__PORTFOLIO_DATA__;
  const portfolioData = mapContactToSocials(rawData);
  
  const TemplateComponent = templateMap[templateId];
  
  if (!TemplateComponent) {
    return <FallbackPortfolio data={portfolioData} />;
  }

  // Update page title from portfolio data
  if (portfolioData?.hero) {
    const name = portfolioData.hero.subtitle || 'Portfolio';
    const title = portfolioData.hero.title || '';
    document.title = `${name} — ${title}`;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <TemplateComponent portfolioData={portfolioData} />
    </Suspense>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
