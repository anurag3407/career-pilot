import React from 'react';

export default function FeatureHowItWorks({
  heading = 'How it works',
  subheading = 'A simple workflow from first input to useful output.',
  steps = [],
}) {
  return (
    <section className="border-y border-border bg-card/30 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {heading}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{subheading}</p>
        </div>

        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-2xl border border-border bg-background/80 p-6 shadow-sm"
            >
              <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                {index + 1}
              </span>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
