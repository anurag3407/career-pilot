import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, ArrowRight } from 'lucide-react';

export default function Hero({ data }) {
  const personal = data?.personal || {};
  const stats = data?.stats || {};
  const socials = data?.socials || {};

  const email =
    typeof socials.email === 'string'
      ? socials.email.trim()
      : '';

  const hasEmail = email.length > 0;

  const toCount = (value) => {
    const n = Number(value);

    return Number.isFinite(n) ? n : 0;
  };

  const statItems = [
    {
      value: `${toCount(stats.yearsExperience)}+`,
      label: 'Years',
    },
    {
      value: `${toCount(stats.projectsCompleted)}+`,
      label: 'Projects',
    },
    {
      value: `${toCount(stats.happyClients)}+`,
      label: 'Clients',
    },
  ];

  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-amber-400/20 to-transparent" />
      <div className="absolute -left-16 top-10 h-52 w-52 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="absolute right-4 top-24 h-36 w-36 rounded-full border border-amber-200/30" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-8 inline-flex items-center justify-center gap-3">
            <div className="h-1 w-16 rounded-full bg-amber-200/90" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-amber-200/70">
              Art Deco Gold
            </span>

            <div className="h-1 w-16 rounded-full bg-amber-200/90" />
          </div>

          <h1 className="font-serif text-4xl font-black uppercase leading-tight tracking-[0.12em] text-amber-100 sm:text-5xl md:text-6xl">
            {personal.name || 'Portfolio'}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-amber-100/80 sm:text-lg md:text-xl">
            {personal.tagline ||
              personal.title ||
              'A luxury portfolio crafted with timeless elegance.'}
          </p>

          {personal.title && (
            <p className="mt-4 text-sm uppercase tracking-[0.35em] text-amber-200/60">
              {personal.title}
            </p>
          )}

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {hasEmail && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-200 px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-[0_18px_50px_rgba(245,158,11,0.18)] transition hover:bg-amber-300"
              >
                <Mail size={16} />
                <span>Email Me</span>
              </a>
            )}

            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-200/40 px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-200 transition hover:border-amber-100/60"
            >
              Contact
              <ArrowRight size={16} />
            </a>
          </div>
        </motion.div>

        <div className="mt-16 grid gap-5 sm:grid-cols-3">
          {statItems.map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-[2rem] border border-amber-200/20 bg-slate-900/70 px-6 py-8 text-center shadow-[0_20px_80px_rgba(15,23,42,0.35)]"
            >
              <div className="text-4xl font-black text-amber-100">
                {item.value}
              </div>

              <div className="mt-3 text-xs uppercase tracking-[0.35em] text-amber-200/70">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 rounded-[2rem] border border-amber-200/20 bg-slate-900/60 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-200/60">
                Location
              </p>

              <div className="mt-3 flex items-center gap-2 text-sm text-amber-100">
                <MapPin size={16} />
                <span>{personal.location || 'Not specified'}</span>
              </div>
            </div>

            <div className="rounded-full bg-amber-200/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-amber-100/80">
              Art Deco Inspired Portfolio
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}