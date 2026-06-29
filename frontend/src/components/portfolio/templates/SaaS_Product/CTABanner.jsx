import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

export default function CTABanner({ data }) {
  return (
    <section className="px-5 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, ease }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] px-6 py-16 text-center shadow-2xl shadow-indigo-950/40 md:px-12 md:py-24"
      >
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-black/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">Available for New Projects</p>
          <h2 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
            Let&apos;s Build Something
            <span className="block">Remarkable Together</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            Open to full-time roles, freelance projects, and consulting.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={`mailto:${data.socials?.email || ''}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-sm font-semibold text-[#4F46E5] transition hover:scale-[1.02]"
            >
              Get In Touch
              <ArrowRight size={18} strokeWidth={1.8} />
            </a>
            <a
              href="#experience"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View Resume
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
