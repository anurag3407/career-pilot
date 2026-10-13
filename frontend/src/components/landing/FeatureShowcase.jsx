import React from 'react';
import * as Icons from 'lucide-react';

function FeatureIcon({ name }) {
  const Icon = Icons[name];

  if (!Icon) {
    return <Icons.Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />;
  }

  return <Icon className="h-6 w-6 text-primary" aria-hidden="true" />;
}

export default function FeatureShowcase({
  heading = 'Everything you need to succeed',
  subheading = 'Focused capabilities designed to help you stand out.',
  features = [],
}) {
  return (
    <section className="bg-background py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 top-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/15 via-background/0 to-background/0 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {heading}
          </h2>
          {subheading && <p className="mt-5 text-lg leading-8 text-muted-foreground">{subheading}</p>}
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group relative rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-xl"
            >
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15 transition-transform duration-300 group-hover:scale-110">
                <FeatureIcon name={feature.icon} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
