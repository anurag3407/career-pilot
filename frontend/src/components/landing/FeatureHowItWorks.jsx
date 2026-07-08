import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function FeatureHowItWorks({
  heading = "How it works",
  subheading = "A simple, streamlined process to get you from zero to hired.",
  steps = [
    {
      title: "Upload or Import",
      description: "Start by uploading your existing resume, importing your LinkedIn profile, or starting from scratch with our intuitive editor.",
      illustration: null
    },
    {
      title: "AI Analysis & Enhancement",
      description: "Our AI scans your content against millions of successful applications, rewriting bullets and suggesting keywords.",
      illustration: null
    },
    {
      title: "Review & Customize",
      description: "Pick from dozens of premium, ATS-friendly templates. Adjust colors, typography, and spacing with one click.",
      illustration: null
    },
    {
      title: "Export & Apply",
      description: "Download a pixel-perfect PDF and start applying with confidence. Your data is always saved for future updates.",
      illustration: null
    }
  ]
}) {
  return (
    <section className="bg-background py-24 sm:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            {heading}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto"
          >
            {subheading}
          </motion.p>
        </div>

        <div className="relative">
          {/* Vertical Connecting Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/0 via-primary/50 to-secondary/0 md:-translate-x-1/2 hidden sm:block" />

          <div className="space-y-16 md:space-y-24">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={cn(
                    "relative flex flex-col md:flex-row items-center gap-8 md:gap-16",
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  )}
                >
                  {/* Number Indicator */}
                  <div className="absolute left-6 md:left-1/2 top-0 md:top-1/2 w-12 h-12 rounded-full bg-card border-2 border-primary flex items-center justify-center -translate-x-1/2 md:-translate-y-1/2 z-10 text-xl font-bold text-primary shadow-[0_0_15px_var(--color-primary)]">
                    {idx + 1}
                  </div>

                  {/* Text Content */}
                  <div className={cn("flex-1 pl-20 md:pl-0", isEven ? "md:text-right md:pr-12" : "md:text-left md:pl-12")}>
                    <h3 className="text-2xl font-semibold text-foreground mb-4">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">{step.description}</p>
                  </div>

                  {/* Illustration/Image Content */}
                  <div className={cn("flex-1 w-full pl-20 md:pl-0", isEven ? "md:pl-12" : "md:pr-12")}>
                    <div className="relative rounded-2xl overflow-hidden border border-border bg-card/50 backdrop-blur-sm aspect-[4/3] flex items-center justify-center group hover:border-primary/50 transition-colors">
                      {/* Subtle hover glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/10 group-hover:to-secondary/10 transition-colors duration-500" />
                      
                      {step.illustration ? (
                        step.illustration
                      ) : (
                        <div className="text-muted-foreground font-medium tracking-wide text-sm flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center">
                            <span className="text-2xl opacity-50">✨</span>
                          </div>
                          Step {idx + 1} UI Preview
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
