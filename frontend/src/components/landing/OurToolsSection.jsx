import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FEATURES } from '../../data/featuresConfig';

export default function OurToolsSection() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="relative overflow-hidden bg-background py-32">
      {/* Subtle diagonal texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(-45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)',
          backgroundSize: '12px 12px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header - left aligned editorial style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <span className="text-[11px] font-black uppercase tracking-[0.35em] text-primary/70">
            001 — Toolkit
          </span>
          <h2 className="mt-4 text-5xl font-black leading-[0.95] tracking-tighter text-foreground md:text-7xl lg:text-8xl">
            Every tool.
            <br />
            <span className="text-muted-foreground/40">One platform.</span>
          </h2>
          <p className="mt-6 max-w-md text-base font-medium leading-relaxed text-muted-foreground">
            From first draft to final handshake — everything you need to own your career trajectory.
          </p>
        </motion.div>

        {/* Tool Index List */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[22px] top-0 bottom-0 w-px bg-border md:left-[30px]" />

          <div className="space-y-0">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.slug}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
              >
                <Link
                  to={`/${feature.slug}`}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  className="group relative flex items-stretch gap-6 border-b border-border/60 py-7 md:gap-10 md:py-9"
                >
                  {/* Node dot on the line */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-400 md:h-[60px] md:w-[60px] ${
                      hovered === index
                        ? 'border-primary bg-primary text-primary-foreground scale-110'
                        : 'border-border bg-background text-muted-foreground'
                    }`}>
                      <feature.icon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black tabular-nums text-muted-foreground/40">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className={`text-xl font-black tracking-tight transition-colors duration-300 md:text-3xl ${
                          hovered === index ? 'text-primary' : 'text-foreground'
                        }`}>
                          {feature.name}
                        </h3>
                        {feature.badge && (
                          <span className="hidden rounded-sm bg-primary/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-primary sm:inline-block">
                            {feature.badge}
                          </span>
                        )}
                      </div>

                      {/* Description reveals on hover */}
                      <AnimatePresence>
                        {hovered === index && (
                          <motion.p
                            initial={{ opacity: 0, height: 0, y: -4 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -4 }}
                            transition={{ duration: 0.25 }}
                            className="mt-2 max-w-lg text-sm font-medium leading-relaxed text-muted-foreground"
                          >
                            {feature.tagline}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Arrow */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      hovered === index
                        ? 'bg-foreground text-background rotate-0 scale-100'
                        : 'bg-transparent text-muted-foreground/30 -rotate-45 scale-75'
                    }`}>
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
