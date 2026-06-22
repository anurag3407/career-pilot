import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../Navbar';
import Footer from '../ui/Footer';
import Seo from '../Seo';

import FeatureLandingHero from './FeatureLandingHero';
import FeatureShowcase from './FeatureShowcase';
import FeatureVideoSection from './FeatureVideoSection';
import FeatureHowItWorks from './FeatureHowItWorks';
import FeatureTestimonials from './FeatureTestimonials';
import FeatureCTA from './FeatureCTA';

export default function FeatureLandingPage({ config }) {
  const { user } = useAuth();

  // Determine CTA based on auth state
  const primaryCtaText = user ? config.primaryAction.label : config.hero.primaryCta.text;
  const primaryCtaLink = user ? config.primaryAction.to : config.hero.primaryCta.to;

  const ctaSectionText = user ? config.primaryAction.label : config.cta.ctaText;
  const ctaSectionLink = user ? config.primaryAction.to : config.cta.ctaTo;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Seo {...config.seo} />
      <Navbar />

      <main className="flex-1">
        {/* Background Mesh/Blobs are handled by index.css or inside Hero, but we can ensure a base mesh */}
        <div className="bg-mesh" />

        <FeatureLandingHero 
          badgeText={config.hero.badgeText}
          title={config.hero.title}
          accentText={config.hero.accentText}
          description={config.hero.description}
          primaryCtaText={primaryCtaText}
          primaryCtaLink={primaryCtaLink}
          secondaryCtaText={config.hero.secondaryCta.text}
          secondaryCtaLink={config.hero.secondaryCta.href}
          tertiaryCta={config.hero.tertiaryCta}
          stats={config.hero.stats}
          illustration={config.Illustration ? <config.Illustration /> : null}
        />

        <FeatureShowcase 
          heading={config.showcase.heading}
          features={config.showcase.features}
        />

        <div id="demo">
          <FeatureVideoSection 
            heading={config.video.heading}
            subheading={config.video.subheading}
            videoUrl={config.video.videoUrl}
            caption={config.video.caption}
          />
        </div>

        <FeatureHowItWorks 
          heading={config.howItWorks.title}
          subheading="A simpler way to reach your goals."
          steps={config.howItWorks.steps}
        />

        <FeatureTestimonials 
          heading={config.testimonials.heading}
          testimonials={config.testimonials.items}
        />

        <FeatureCTA 
          heading={config.cta.headline}
          subheading={config.cta.subtext}
          primaryCtaText={ctaSectionText}
          primaryCtaLink={ctaSectionLink}
        />
      </main>

      <Footer />
    </div>
  );
}
