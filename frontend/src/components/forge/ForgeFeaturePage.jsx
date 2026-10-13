import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FEATURES_BY_SLUG } from '../../data/featuresConfig';
import Seo from '../../components/Seo';
import '../../styles/forge.css';
import StatusBadge from './StatusBadge';
import MetricChip from './MetricChip';
import ForgeButton from './ForgeButton';
import BentoCard from './BentoCard';

const ICONS = {
  FileText: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6',
  Type: 'M4 7V4h16v3 M9 20h6 M12 4v16',
  Github: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22',
  Sparkles: 'M12 3v3 M12 18v3 M3 12h3 M18 12h3 M5.6 5.6l2.1 2.1 M16.3 16.3l2.1 2.1 M18.4 5.6l-2.1 2.1 M7.7 16.3l-2.1 2.1',
  BarChart: 'M3 3v18h18 M8 17V9 M13 17V5 M18 17v-6',
  Layout: 'M3 3h18v18H3z M3 9h18 M9 21V9',
  Linkedin: 'M4 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z M4 9h4v11H4z M10 9h4v3a4 4 0 0 1 8 0v8h-4v-7a2 2 0 0 0-4 0v7h-4z',
  Download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  Mic: 'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4 M8 23h8',
  Briefcase: 'M2 7h20v13H2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16',
  Flame: 'M12 2s4 4 4 8a4 4 0 0 1-8 0c0-1 .5-2 1-3-2 1-4 3-4 6a7 7 0 0 0 14 0c0-5-7-11-7-11z',
  Network: 'M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M5 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M19 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M7 18l3-7 M17 18l-3-7 M8 19h8',
  Users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  Palette: 'M12 2a9 9 0 0 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8z M7.5 11.5A1 1 0 1 0 7 13a1 1 0 0 0 .5-1.5z M12 7.5A1 1 0 1 0 12.5 9 1 1 0 0 0 12 7.5z',
  Zap: 'M13 2L3 14h9l-1 8 10-12h-9z',
  Smartphone: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M12 18h.01',
  Globe: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15 15 0 0 1 0 20 M12 2a15 15 0 0 0 0 20',
};

function Icon({ name, size = 22, strokeWidth = 1.8 }) {
  const d = ICONS[name];
  if (!d) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d.split(' M').map((seg, i) => (
        <path key={i} d={(i === 0 ? seg : 'M' + seg)} />
      ))}
    </svg>
  );
}

/**
 * ForgeFeaturePage — data-driven landing for a single feature route.
 * Reads the existing FEATURES_BY_SLUG[slug] config and renders a cohesive,
 * forge-ai-inspired page (status chips, monospace metrics, bento showcase, steps).
 * Each route landing imports this with its slug.
 */
export default function ForgeFeaturePage({ slug }) {
  const { user } = useAuth();
  const config = FEATURES_BY_SLUG[slug];
  if (!config) return <div className="forge-page">Unknown feature: {slug}</div>;

  const heroCtaText = user ? config.primaryAction.label : config.hero.primaryCta.text;
  const heroCtaLink = user ? config.primaryAction.to : config.hero.primaryCta.to;
  const ctaText = user ? config.primaryAction.label : config.cta.ctaText;
  const ctaLink = user ? config.primaryAction.to : config.cta.ctaTo;

  return (
    <div className="forge-page">
      <Seo {...config.seo} />

      <nav className="forge-nav">
        <Link to="/" className="forge-brand">CareerPilot<span className="dot">.</span></Link>
        <div className="forge-nav-links">
          <Link to="/resume-builder" className="forge-nav-link">Resume Builder</Link>
          <Link to="/portfolio-builder" className="forge-nav-link">Portfolio</Link>
          <Link to="/job-finder" className="forge-nav-link">Job Finder</Link>
          <Link to="/mock-interview" className="forge-nav-link">Mock Interview</Link>
        </div>
        <div className="forge-nav-actions">
          {!user && <ForgeButton href="/login" variant="ghost">Sign in</ForgeButton>}
          <ForgeButton to={heroCtaLink} variant="primary">{user ? 'Dashboard' : 'Get started for free'}</ForgeButton>
        </div>
      </nav>

      {/* HERO */}
      <section className="forge-section forge-container forge-hero">
        <StatusBadge label="OPERATIONAL" />
        <h1>
          {config.hero.title} <span className="accent">{config.hero.accentText}</span>
        </h1>
        <p>{config.hero.description}</p>
        <div className="forge-hero-actions">
          <ForgeButton to={heroCtaLink} variant="primary">{heroCtaText}</ForgeButton>
          {config.hero.secondaryCta && (
            <ForgeButton href={config.hero.secondaryCta.href} variant="ghost">{config.hero.secondaryCta.text}</ForgeButton>
          )}
        </div>
        <div className="forge-metrics">
          {config.hero.stats.map((s, i) => (
            <MetricChip key={i} value={s.value} label={s.label} accent={i === 0} />
          ))}
        </div>
      </section>

      {/* SHOWCASE */}
      {config.showcase && (
        <section className="forge-section forge-container" id="demo">
          <div style={{ textAlign: 'center' }}>
            <span className="forge-label">Capabilities</span>
            <h2 className="forge-h2">{config.showcase.heading}</h2>
          </div>
          <div className="forge-bento">
            {config.showcase.features.map((f, i) => (
              <BentoCard key={i} icon={(p) => <Icon name={f.icon} {...p} />} title={f.title} description={f.description} />
            ))}
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      {config.howItWorks && (
        <section className="forge-section forge-container">
          <div style={{ textAlign: 'center' }}>
            <span className="forge-label">Workflow</span>
            <h2 className="forge-h2">{config.howItWorks.title}</h2>
          </div>
          <div className="forge-steps">
            {config.howItWorks.steps.map((s, i) => (
              <div key={i} className="forge-step">
                <span className="n">STEP {s.number}</span>
                <h4>{s.title}</h4>
                <p>{s.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {config.testimonials && config.testimonials.items?.length > 0 && (
        <section className="forge-section forge-container">
          <div style={{ textAlign: 'center' }}>
            <span className="forge-label">Signal</span>
            <h2 className="forge-h2">{config.testimonials.heading}</h2>
          </div>
          {config.testimonials.items.map((t, i) => (
            <div key={i} className="forge-quote">
              <p className="q">“{t.quote}”</p>
              <div className="who">
                {t.avatar && <img src={t.avatar} alt="" width="36" height="36" style={{ borderRadius: '50%' }} />}
                <span><strong style={{ color: 'var(--forge-text)' }}>{t.name}</strong> · {t.role}{t.company ? ` @ ${t.company}` : ''}</span>
                <span className="metric" style={{ marginLeft: 'auto' }}>{t.metric}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* CTA */}
      <section className="forge-container">
        <div className="forge-cta">
          <h2>{config.cta.headline}</h2>
          <p>{config.cta.subtext}</p>
          <ForgeButton to={ctaLink} variant="primary">{ctaText}</ForgeButton>
        </div>
      </section>

      <footer className="forge-foot">
        CareerPilot · {config.name} · built with the Forge design system
      </footer>
    </div>
  );
}
