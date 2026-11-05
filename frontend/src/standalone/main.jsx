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

// Curated deployable templates across artistic, minimalist, developer, and interactive themes
const templateMap = {
  // Flagship Core
  Cherry_Blossom: lazy(() => import('../components/portfolio/templates/Cherry_Blossom/index.jsx')),
  Swiss_Typography: lazy(() => import('../components/portfolio/templates/Swiss_Typography/index.jsx')),
  Liquid_Glass: lazy(() => import('../components/portfolio/templates/Liquid_Glass/index.jsx')),
  Midnight_Gradient: lazy(() => import('../components/portfolio/templates/Midnight_Gradient/index.jsx')),
  Playing_Cards: lazy(() => import('../components/portfolio/templates/Playing_Cards/index.jsx')),

  // Featured Complete Creative Designs
  MySpace_2005: lazy(() => import('../components/portfolio/templates/MySpace_2005/index.jsx')),
  Macintosh_1984_Classic: lazy(() => import('../components/portfolio/templates/Macintosh_1984_Classic/index.jsx')),
  Hot_Air_Balloon_Drifting: lazy(() => import('../components/portfolio/templates/Hot_Air_Balloon_Drifting/index.jsx')),
  Stand_up_Comedy_Brick_Wall_Mic: lazy(() => import('../components/portfolio/templates/Stand_up_Comedy_Brick_Wall_Mic/index.jsx')),
  Swipe_Right_Dating_App: lazy(() => import('../components/portfolio/templates/Swipe_Right_Dating_App/index.jsx')),
  Rubik_s_Cube_3D_Rotate: lazy(() => import('../components/portfolio/templates/Rubik_s_Cube_3D_Rotate/index.jsx')),
  Jigsaw_Puzzle_Assembly: lazy(() => import('../components/portfolio/templates/Jigsaw_Puzzle_Assembly/index.jsx')),

  // High-Demand Developer & Tech Themes
  Terminal_Skills: lazy(() => import('../components/portfolio/templates/Terminal_Skills/index.jsx')),
  Developer_IDE: lazy(() => import('../components/portfolio/templates/Developer_IDE/index.jsx')),
  Cyberpunk: lazy(() => import('../components/portfolio/templates/Cyberpunk/index.jsx')),
  Minimalist_White: lazy(() => import('../components/portfolio/templates/Minimalist_White/index.jsx')),
  Tech_Startup: lazy(() => import('../components/portfolio/templates/Tech_Startup/index.jsx')),
  Bento_Box: lazy(() => import('../components/portfolio/templates/Bento_Box/index.jsx')),
  One_Pixel_Master: lazy(() => import('../components/portfolio/templates/One_Pixel_Master/index.jsx')),
  MacOS_Desktop: lazy(() => import('../components/portfolio/templates/MacOS_Desktop/index.jsx')),
  DOS_Terminal: lazy(() => import('../components/portfolio/templates/DOS_Terminal/index.jsx')),
  Anime_Manga: lazy(() => import('../components/portfolio/templates/Anime_Manga/index.jsx')),
  Neumorphism: lazy(() => import('../components/portfolio/templates/Neumorphism/index.jsx')),
  Glassmorphism: lazy(() => import('../components/portfolio/templates/Glassmorphism/index.jsx')),
  Twitter_Profile: lazy(() => import('../components/portfolio/templates/Twitter_Profile/index.jsx')),
  GitHub_Profile: lazy(() => import('../components/portfolio/templates/GitHub_Profile/index.jsx')),
  VS_Code_Theme: lazy(() => import('../components/portfolio/templates/VS_Code_Theme/index.jsx')),
  Terminal_CLI: lazy(() => import('../components/portfolio/templates/Terminal_CLI/index.jsx')),
  Retro_Futurism: lazy(() => import('../components/portfolio/templates/Retro_Futurism/index.jsx')),
};

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
    <PortfolioProvider portfolioData={portfolioData} isDeploy={true}>
      <Suspense fallback={<LoadingScreen />}>
        <TemplateComponent portfolioData={portfolioData} />
      </Suspense>
    </PortfolioProvider>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
