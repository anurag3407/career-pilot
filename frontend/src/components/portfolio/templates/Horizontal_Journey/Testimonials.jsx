import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import { SectionWrapper, staggerContainer, textReveal, fadeUp } from './shared';

function TestimonialCard({ test, isMobile }) {
  const Card = isMobile ? 'article' : motion.article;

  return (
    <Card {...(isMobile ? {} : { variants: fadeUp, whileHover: { y: -6 } })} className="group flex h-full cursor-pointer flex-col gap-4 border border-zinc-800 bg-zinc-900/60 p-5 transition-all duration-300 hover:border-zinc-100/20 hover:bg-zinc-900/90 hover:shadow-2xl hover:shadow-zinc-950/40 lg:p-7">
      <Star className="h-5 w-5 text-zinc-600 transition-colors duration-300 group-hover:text-zinc-100 lg:h-8 lg:w-8" />
      <p className="text-sm font-light italic leading-relaxed text-zinc-300 lg:text-2xl">
        "{test.text}"
      </p>
      <div className="mt-auto flex items-center gap-3 border-t border-zinc-800 pt-4">
        <img src={test.avatar} alt={test.name || "Profile Avatar"} loading="lazy" className="h-10 w-10 rounded-full grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:saturate-125 lg:h-14 lg:w-14" />
        <div>
          <div className="text-xs font-bold text-zinc-100 lg:text-lg">{test.name}</div>
          <div className="mt-0.5 font-mono text-[9px] text-zinc-500 lg:text-sm">{test.role}</div>
        </div>
      </div>
    </Card>
  );
}

export default function TestimonialsSection({ isMobile = false }) {
  const Container = isMobile ? 'div' : motion.div;
  const Heading = isMobile ? 'h3' : motion.h3;
  const Paragraph = isMobile ? 'p' : motion.p;

  return (
    <SectionWrapper title="Testimonial" scrollable>
      <Container {...(isMobile ? {} : { variants: staggerContainer, initial: 'hidden', whileInView: 'show', viewport: { once: true } })} className="w-full">
        <div className="mx-auto mb-6 max-w-3xl text-center lg:mb-10">
          <Heading {...(isMobile ? {} : { variants: textReveal })} className="text-3xl font-black leading-none tracking-tight text-zinc-100 md:text-6xl">
            Testimonials 
          </Heading>
          <Paragraph {...(isMobile ? {} : { variants: fadeUp })} className="mt-3 text-xs leading-relaxed text-zinc-400 lg:text-lg">
            All feedback stays grouped together so the section can be read without jumping between individual cards.
          </Paragraph>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 lg:gap-6">
          {data.testimonials.map((test, index) => (
            <TestimonialCard key={`test-${index}`} test={test} isMobile={isMobile} />
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
