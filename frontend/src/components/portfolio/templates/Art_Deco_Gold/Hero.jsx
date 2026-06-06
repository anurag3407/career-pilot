import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, ArrowRight } from 'lucide-react';

export default function Hero({ data }) {
  const { personal, stats, socials } = data;
  const emailLink = socials.email ? `mailto:${socials.email}` : '#contact';

  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-28">
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-amber-400/20 to-transparent pointer-events-none" />
      <div className="absolute -left-16 top-10 w-52 h-52 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="absolute right-4 top-24 w-36 h-36 border border-amber-200/30 rounded-full" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center gap-3 mb-8">
            <div className="h-1 w-16 rounded-full bg-amber-200/90" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-amber-200/70 font-semibold">
              Art Deco Gold
            </span>
            <div className="h-1 w-16 rounded-full bg-amber-200/90" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black uppercase tracking-[0.12em] leading-tight text-amber-100">
            {personal.name}
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-amber-100/80 max-w-2xl mx-auto leading-relaxed">
            {personal.tagline || personal.title || 'A luxury portfolio for modern storytellers.'}
          </p>

          <p className="mt-4 text-sm uppercase tracking-[0.35em] text-amber-200/60">
            {personal.title}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={emailLink}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-200 px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-[0_18px_50px_rgba(245,158,11,0.18)] transition hover:bg-amber-300"
            >
              <Mail size={16} />
              <span>Email Me</span>
            </a>
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
          {[
            { value: `${stats.yearsExperience || 0}+`, label: 'Years' },
            { value: `${stats.projectsCompleted || 0}+`, label: 'Projects' },
            { value: `${stats.happyClients || 0}+`, label: 'Clients' },
          ].map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-[2rem] border border-amber-200/20 bg-slate-900/70 px-6 py-8 text-center shadow-[0_20px_80px_rgba(15,23,42,0.35)]"
            >
              <div className="text-4xl font-black text-amber-100">{item.value}</div>
              <div className="mt-3 text-xs tracking-[0.35em] uppercase text-amber-200/70">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 rounded-[2rem] border border-amber-200/20 bg-slate-900/60 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-amber-200/60 font-semibold">
                Location
              </p>
              <div className="mt-3 flex items-center gap-2 text-amber-100 text-sm">
                <MapPin size={16} />
                <span>{personal.location}</span>
              </div>
            </div>
            <div className="rounded-full bg-amber-200/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-amber-100/80">
              Gatsby-inspired luxury portfolio
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
