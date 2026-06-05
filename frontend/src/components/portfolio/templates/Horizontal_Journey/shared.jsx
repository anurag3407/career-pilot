import React from 'react';

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export const textReveal = {
  hidden: { y: '100%', opacity: 0 },
  show: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export const fadeUp = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const SectionWrapper = ({ children, title, scrollable = false, isMobile = false }) => (
  <section className="h-[100dvh] w-screen min-w-[100vw] basis-[100vw] flex-shrink-0 snap-start relative border-r border-zinc-900 bg-zinc-950 overflow-hidden">
    <div className="absolute top-0 left-0 z-20 w-full px-5 pt-4 lg:px-16 lg:pt-12 pointer-events-none">
      <div className="inline-flex rounded border border-zinc-800 bg-zinc-950/95 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.35em] text-zinc-400">
        {title}
      </div>
    </div>

    <div
      className={`h-full w-full px-5 pb-12 pt-16 lg:px-16 lg:pb-16 lg:pt-24 ${scrollable && !isMobile ? 'overflow-y-auto [-webkit-overflow-scrolling:touch] scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden' : ''}`}>
      <div className={`mx-auto flex w-full max-w-7xl flex-col pointer-events-auto ${scrollable && !isMobile ? 'min-h-full justify-start gap-6 lg:gap-8' : 'h-full justify-center'}`}>
        {children}
      </div>
    </div>
  </section>
);
