import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/ui/Footer';
import Seo from '../../components/Seo';

import PortfolioBuilderHero, {
  InteractiveDotCanvas,
} from '../../components/landing/PortfolioBuilderHero';
import FeatureShowcase from '../../components/landing/FeatureShowcase';
import FeatureVideoSection from '../../components/landing/FeatureVideoSection';
import FeatureHowItWorks from '../../components/landing/FeatureHowItWorks';
import FeatureTestimonials from '../../components/landing/FeatureTestimonials';
import FeatureCTA from '../../components/landing/FeatureCTA';
import { FEATURES_BY_SLUG } from '../../data/featuresConfig';

export default function PortfolioBuilderLanding() {
  const { user } = useAuth();
  const config = FEATURES_BY_SLUG['portfolio-builder'];

  const primaryCtaText = user ? config.primaryAction.label : config.hero.primaryCta.text;
  const primaryCtaLink = user ? config.primaryAction.to : config.hero.primaryCta.to;
  const ctaSectionText = user ? config.primaryAction.label : config.cta.ctaText;
  const ctaSectionLink = user ? config.primaryAction.to : config.cta.ctaTo;
  const previewName = [
    user?.firstName,
    user?.lastName,
  ].filter(Boolean).join(' ') ||
    user?.displayName ||
    user?.name ||
    user?.fullName ||
    user?.username ||
    user?.profile?.name ||
    user?.email?.split('@')[0] ||
    'Your Name';


  return (
    <div className="relative flex flex-col min-h-screen bg-[#0a0a0a] text-foreground">
      <Seo {...config.seo} />
      <Navbar />

      {/* Full-page interactive dot canvas (fixed, behind everything) */}
      <InteractiveDotCanvas accent="#0CF2A0" />

      {/* Soft vignette to keep text readable over the dots */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(10,10,10,0.85) 90%)',
        }}
      />

      <main className="relative z-10 flex-1">
        <PortfolioBuilderHero
          badgeText="Portfolio Builder"
          headlineBefore="Build portfolios that get noticed,"
          rotatingWords={['not ignored.', 'not forgotten.', 'not skipped.']}
          description="Launch a polished personal website with templates, GitHub projects, custom sections, and one-click deployment — built for students, developers, and job seekers."
          previewName={previewName}
          primaryCta={{ text: primaryCtaText, to: primaryCtaLink }}
          secondaryCta={{
            text: config.hero.secondaryCta.text,
            href: config.hero.secondaryCta.href,
          }}
        />

        <div className="bg-[#0a0a0a]/60 backdrop-blur-[2px]">
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
        </div>
      </main>

      <Footer />
    </div>
  );
}