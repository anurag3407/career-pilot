import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import PremiumFeatureCard from './PremiumFeatureCard';

import { FEATURES } from '../../data/featuresConfig';

const header = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function OurToolsSection() {
  return (
    <section className="relative overflow-hidden bg-background py-28">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
        <div className="premium-grid absolute inset-0 opacity-40" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={header}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <motion.div variants={item} className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                The Toolkit
              </span>
            </div>
          </motion.div>

          <motion.h2
            variants={item}
            className="mt-7 text-4xl font-black tracking-tight text-foreground md:text-6xl"
          >
            Powerful AI tools for{' '}
            <span className="gradient-text-animated">every step</span>
          </motion.h2>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-2xl text-lg font-medium text-muted-foreground md:text-xl"
          >
            From your first resume draft to your final interview, CareerPilot
            gives you the unfair advantage you need.
          </motion.p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid auto-rows-fr grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.slug}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.6,
                delay: (index % 3) * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={feature.size === 'large' ? 'lg:col-span-2' : 'lg:col-span-1'}
            >
              <PremiumFeatureCard
                to={`/${feature.slug}`}
                icon={feature.icon}
                title={feature.name}
                description={feature.tagline}
                badge={feature.badge}
                illustration={
                  feature.Illustration ? <feature.Illustration /> : null
                }
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
