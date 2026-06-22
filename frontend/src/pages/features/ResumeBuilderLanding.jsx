import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FEATURES_BY_SLUG } from '../../data/featuresConfig';
import Seo from '../../components/Seo';
import styles from './ResumeBuilderLanding.module.css';
import { 
  FileText, Type, Github, Sparkles, BarChart, 
  Layout, Linkedin, Download, Mic, Briefcase, Play
} from 'lucide-react';

const iconMap = {
  FileText, Type, Github, Sparkles, BarChart, Layout, Linkedin, Download, Mic, Briefcase
};

export default function ResumeBuilderLanding() {
  const { user } = useAuth();
  const config = FEATURES_BY_SLUG['resume-builder'];

  const primaryCtaText = user ? config.primaryAction.label : config.hero.primaryCta.text;
  const primaryCtaLink = user ? config.primaryAction.to : config.hero.primaryCta.to;

  const ctaSectionText = user ? config.primaryAction.label : config.cta.ctaText;
  const ctaSectionLink = user ? config.primaryAction.to : config.cta.ctaTo;

  return (
    <div className={styles.framerCanvas}>
      <Seo {...config.seo} />

      {/* Top Nav Custom for Framer Style */}
      <nav className={styles.topNav}>
        <div className={styles.navLinks}>
          <Link to="/" className={`${styles.headline} ${styles.linkAccent}`} style={{ color: 'var(--framer-ink)' }}>
            CareerPilot
          </Link>
          <div className={`${styles.navLinks} hidden md:flex`} style={{ marginLeft: '24px' }}>
            <Link to="/resume-builder" className={styles.navLink}>Resume Builder</Link>
            <Link to="/portfolio-builder" className={styles.navLink}>Portfolio Builder</Link>
            <Link to="/job-finder" className={styles.navLink}>Job Finder</Link>
            <Link to="/mock-interview" className={styles.navLink}>Mock Interview</Link>
          </div>
        </div>
        <div className={styles.navActions}>
          {!user && (
            <Link to="/login" className={styles.buttonSecondary}>
              Sign in
            </Link>
          )}
          <Link to={primaryCtaLink} className={styles.buttonPrimary}>
            {user ? 'Dashboard' : 'Get started for free'}
          </Link>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className={`${styles.section} ${styles.hero} ${styles.container}`}>
          <div className={styles.buttonTranslucent} style={{ marginBottom: '32px' }}>
            {config.hero.badgeText}
          </div>
          
          <h1 className={styles.displayXl + ' ' + styles.heroTitle}>
            {config.hero.title} <span className={styles.heroAccent}>{config.hero.accentText}</span>
          </h1>
          
          <p className={styles.bodyLg + ' ' + styles.heroDescription}>
            {config.hero.description}
          </p>
          
          <div className={styles.heroActions}>
            <Link to={primaryCtaLink} className={styles.buttonPrimary}>
              {primaryCtaText}
            </Link>
            <a href="#demo" className={styles.buttonSecondary}>
              {config.hero.secondaryCta.text}
            </a>
          </div>

          <div className={styles.statsContainer}>
            {config.hero.stats.map((stat, i) => (
              <div key={i} className={styles.statItem}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Showcase (Gradient Spotlight Cards) */}
        <section className={`${styles.section} ${styles.container}`}>
          <h2 className={`${styles.displayMd} ${styles.showcaseHeader}`}>
            {config.showcase.heading}
          </h2>
          
          <div className={`${styles.grid} ${styles.grid4Up}`}>
            {config.showcase.features.map((feature, i) => {
              const Icon = iconMap[feature.icon] || FileText;
              
              // Apply gradient spotlights to a couple of cards
              let cardClass = styles.cardSurface1;
              if (i === 1) cardClass = `${styles.gradientSpotlightCard} ${styles.gradientViolet}`;
              if (i === 4) cardClass = `${styles.gradientSpotlightCard} ${styles.gradientMagenta}`;

              return (
                <div key={i} className={cardClass}>
                  <Icon className={styles.featureCardIcon} size={32} />
                  <h3 className={`${styles.headline} ${styles.featureCardTitle}`}>{feature.title}</h3>
                  <p className={i === 1 || i === 4 ? styles.body : styles.bodyMuted}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Video / Mockup Section */}
        <section id="demo" className={`${styles.section} ${styles.container}`}>
          <div className={styles.cardMockupTile} style={{ minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div className={styles.buttonIconCircular} style={{ width: '80px', height: '80px', marginBottom: '24px' }}>
              <Play fill="currentColor" size={32} style={{ marginLeft: '6px' }} />
            </div>
            <h2 className={styles.displayMd}>{config.video.heading}</h2>
            <p className={styles.bodyMuted}>{config.video.subheading}</p>
          </div>
        </section>

        {/* How It Works */}
        <section className={`${styles.section} ${styles.container}`}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 className={styles.displayLg}>{config.howItWorks.title}</h2>
          </div>

          <div className={styles.howItWorksList}>
            {config.howItWorks.steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
                <div className={styles.stepNumber}>{step.number}</div>
                <div>
                  <h3 className={styles.headline} style={{ marginBottom: '8px' }}>{step.title}</h3>
                  <p className={styles.bodyLg}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className={`${styles.section} ${styles.container}`}>
          <h2 className={`${styles.displayMd} ${styles.showcaseHeader}`}>
            {config.testimonials.heading}
          </h2>
          
          <div className={`${styles.grid} ${styles.grid2Up}`}>
            {config.testimonials.items.map((t, i) => (
              <div key={i} className={styles.cardSurface2}>
                <p className={styles.subhead} style={{ marginBottom: '32px' }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img src={t.avatar} alt={t.name} style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                  <div>
                    <div className={styles.bodySm}>{t.name}</div>
                    <div className={styles.caption}>{t.role} at {t.company || 'Tech'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className={`${styles.section} ${styles.container} ${styles.textCenter}`} style={{ paddingTop: '120px', paddingBottom: '120px' }}>
          <h2 className={styles.displayLg} style={{ marginBottom: '24px' }}>{config.cta.headline}</h2>
          <p className={styles.bodyLg} style={{ marginBottom: '40px' }}>{config.cta.subtext}</p>
          <Link to={ctaSectionLink} className={styles.buttonPrimary} style={{ padding: '16px 32px', fontSize: '18px' }}>
            {ctaSectionText}
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerGrid}`}>
          <div>
            <div className={styles.headline} style={{ marginBottom: '16px' }}>CareerPilot</div>
            <p className={styles.caption} style={{ maxWidth: '200px' }}>
              Building the future of developer portfolios and resumes.
            </p>
          </div>
          
          <div>
            <div className={styles.footerColTitle}>Features</div>
            <ul className={styles.footerLinkList}>
              <li><Link to="/resume-builder" className={styles.footerLink}>Resume Builder</Link></li>
              <li><Link to="/portfolio-builder" className={styles.footerLink}>Portfolio Builder</Link></li>
              <li><Link to="/resume-roast" className={styles.footerLink}>Resume Roast</Link></li>
            </ul>
          </div>

          <div>
            <div className={styles.footerColTitle}>Resources</div>
            <ul className={styles.footerLinkList}>
              <li><Link to="/templates" className={styles.footerLink}>Templates</Link></li>
              <li><Link to="/about" className={styles.footerLink}>About</Link></li>
            </ul>
          </div>

          <div>
            <div className={styles.footerColTitle}>Legal</div>
            <ul className={styles.footerLinkList}>
              <li><Link to="/privacy" className={styles.footerLink}>Privacy Policy</Link></li>
              <li><Link to="/terms" className={styles.footerLink}>Terms of Service</Link></li>
              <li><Link to="/cookies" className={styles.footerLink}>Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
