import React, { useRef } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
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
}) {
  const cardRef = useRef(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(var(--primary-rgb), 0.10), transparent 65%)`;

  const handleMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  return (
    <Link
      ref={cardRef}
      to={to}
      onMouseMove={handleMove}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card/40 p-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 md:p-8',
        className
      )}
    >
      {/* Cursor spotlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: spotlight }}
      />

      {/* Gradient border on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          padding: '1px',
          background:
            'linear-gradient(130deg, rgba(var(--primary-rgb),0.6), transparent 40%, rgba(var(--primary-rgb),0.25))',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Header row */}
      <div className="relative z-10 mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted text-primary transition-all duration-500 group-hover:scale-110 group-hover:border-primary/40 group-hover:bg-primary/15">
              <Icon className="h-6 w-6" strokeWidth={1.8} />
              <span className="absolute inset-0 rounded-2xl bg-primary/20 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          )}
          {badge && (
            <span className="inline-flex items-center rounded-full bg-linear-to-r from-primary/15 to-secondary/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary ring-1 ring-inset ring-primary/25">
              {badge}
            </span>
          )}
        </div>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted/50 text-muted-foreground transition-all duration-500 group-hover:rotate-12 group-hover:border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1">
        <h3 className="mb-2.5 text-xl font-black tracking-tight text-foreground md:text-2xl">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          {description}
        </p>
      </div>

      {/* Illustration */}
      {illustration && (
        <div className="relative z-0 -mx-7 -mb-7 mt-8 overflow-hidden pt-8 md:-mx-8 md:-mb-8">
          <div className="absolute inset-x-0 top-0 z-10 h-12 bg-linear-to-b from-card/60 to-transparent" />
          <div className="opacity-70 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100">
            {illustration}
          </div>
        </div>
      )}

      {/* Bottom accent line */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-10 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
    </Link>
  );
}
