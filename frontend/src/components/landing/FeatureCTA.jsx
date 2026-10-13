import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FeatureCTA({
  heading = 'Ready to get started?',
  subheading = 'Use CareerPilot as one connected, free career workspace.',
  primaryCtaText = 'Get started',
  primaryCtaLink = '/register',
  guaranteeText = 'No credit card required.',
}) {
  return (
    <section className="relative overflow-hidden border-t border-border bg-background py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto h-72 max-w-4xl -translate-y-1/2 rounded-[100px] bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-7 inline-flex items-center rounded-full border border-border bg-card/70 px-4 py-1.5 text-sm font-medium text-foreground backdrop-blur-md">
            <Sparkles className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
            One connected workspace
          </div>
          <h2 className="mb-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {heading}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {subheading}
          </p>
          <Link
            to={primaryCtaLink}
            className="group inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-primary/30"
          >
            {primaryCtaText}
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">{guaranteeText}</p>
        </div>
      </div>
    </section>
  );
}
