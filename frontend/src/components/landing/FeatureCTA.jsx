import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function FeatureCTA({
  heading = "Ready to transform your career?",
  subheading = "Join thousands of professionals who have already accelerated their job search with our AI tools.",
  primaryCtaText = "Get Started for Free",
  primaryCtaLink = "/register",
  guaranteeText = "No credit card required. Free forever plan available."
}) {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-background border-t border-border">
      {/* Decorative Background */}
      <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-7xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-[100px] blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center justify-center rounded-full bg-card/50 px-3 py-1 text-sm font-medium text-foreground ring-1 ring-inset ring-border mb-8 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-amber-400 mr-2" />
            Start your journey today
          </div>
          
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
            {heading}
          </h2>
          
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
            {subheading}
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <Link
              to={primaryCtaLink}
              className="group relative inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-[0_0_40px_-10px_var(--color-primary)] transition-all hover:bg-primary/90 hover:shadow-[0_0_60px_-10px_var(--color-primary)] hover:-translate-y-1 overflow-hidden"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
                <div className="relative h-full w-8 bg-white/20" />
              </div>
              <span className="relative z-10 flex items-center">
                {primaryCtaText}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              {guaranteeText}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
