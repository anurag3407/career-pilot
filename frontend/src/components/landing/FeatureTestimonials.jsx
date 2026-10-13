import React from 'react';
import { Star, BadgeCheck } from 'lucide-react';

export default function FeatureTestimonials({
  heading = 'Built for real career workflows',
  testimonials = [],
}) {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {heading}
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="flex h-full flex-col rounded-2xl border border-border bg-card/50 p-7 backdrop-blur-sm"
            >
              <div className="mb-4 flex items-center gap-1">
                <div className="flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                ))}
                </div>
                <span className="ml-2 rounded-full border border-border bg-background/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {testimonial.verified ? 'Verified' : testimonial.label || 'Preview'}
                </span>
              </div>
              <blockquote className="flex-1 text-base leading-relaxed text-foreground">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt=""
                  className="h-11 w-11 rounded-full border border-border bg-muted"
                />
                <div>
                  <div className="text-sm font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  {testimonial.verified && (
                    <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <BadgeCheck className="h-3 w-3" aria-hidden="true" /> Verified
                    </div>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
