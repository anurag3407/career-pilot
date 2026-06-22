import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function PremiumFeatureCard({
  to,
  icon: Icon,
  title,
  description,
  badge,
  illustration,
  className,
  delay = 0
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className={cn("h-full", className)}
    >
      <Link
        to={to}
        className="group relative flex flex-col h-full rounded-3xl bg-card/50 border border-border p-6 md:p-8 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 backdrop-blur-sm"
      >
        {/* Animated Gradient Border on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
        <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-br from-primary/50 to-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl [mask-image:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [-webkit-mask-composite:xor] [mask-composite:exclude]" />

        {/* Top Header */}
        <div className="flex items-start justify-between mb-6 relative z-10">
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-primary group-hover:scale-110 group-hover:bg-primary/20 group-hover:text-primary transition-all duration-300">
                <Icon className="h-6 w-6" />
              </div>
            )}
            {badge && (
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 px-2.5 py-0.5 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20">
                {badge}
              </span>
            )}
          </div>
          
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1">
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            {description}
          </p>
        </div>

        {/* Illustration Area */}
        {illustration && (
          <div className="relative mt-8 -mx-6 -mb-6 md:-mx-8 md:-mb-8 pt-8 overflow-hidden z-0">
            {/* Soft fade at the top of illustration */}
            <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-background/50 to-transparent z-10" />
            <div className="opacity-70 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:scale-105">
              {illustration}
            </div>
          </div>
        )}
      </Link>
    </motion.div>
  );
}
