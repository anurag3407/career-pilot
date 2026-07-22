import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, MapPin } from 'lucide-react';

// Hex bolt corner detail — industrial fastener aesthetic
function HexBolt({ className = '' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" className={`text-slate-500/60 ${className}`} fill="none">
      <polygon points="9,1 16,4.5 16,13.5 9,17 2,13.5 2,4.5" stroke="currentColor" strokeWidth="1" fill="rgba(148,163,184,0.06)" />
      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}

export default function Hero({ data }) {
  const { personal = {}, socials = {}, stats = {} } = data || {};
  const isSafeUrl = (url = '') =>
    /^(https?:|mailto:)/i.test(url);
  const socialLinks = [
    { name: 'github', href: socials.github, icon: Github },
    { name: 'linkedin', href: socials.linkedin, icon: Linkedin },
    { name: 'twitter', href: socials.twitter, icon: Twitter },
  ].filter((item) => item.href && isSafeUrl(item.href));

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-xl border border-slate-600/50 bg-[#0e0e0e]/98 p-6 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.07)] sm:p-10"
    >
      {/* Carbon fiber weave inside panel */}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.018),rgba(255,255,255,0.018)_1px,transparent_1px,transparent_8px),repeating-linear-gradient(135deg,rgba(255,255,255,0.018),rgba(255,255,255,0.018)_1px,transparent_1px,transparent_8px)]" />
      {/* Chrome pinstripe top edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-slate-200/70 to-transparent" />
      {/* Machined bottom edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-slate-500/40 to-transparent" />
      {/* Hex bolt corners */}
      <HexBolt className="absolute left-4 top-4" />
      <HexBolt className="absolute right-4 top-4" />
      <HexBolt className="absolute bottom-4 left-4" />
      <HexBolt className="absolute bottom-4 right-4" />

      <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="space-y-6">
          {/* Dashboard badge */}
          <div className="inline-flex items-center gap-3 rounded-sm border border-slate-500/50 bg-slate-900/90 px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300 shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
            Carbon Fiber Dashboard
          </div>

          <div>
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-gray-100 via-slate-200 to-gray-100 bg-clip-text text-transparent sm:text-5xl lg:text-6xl" style={{ textShadow: '0 2px 20px rgba(192,192,192,0.3)' }}>
              {personal.name}
            </h1>
            <p className="mt-4 max-w-2xl text-xl leading-9 text-slate-400 sm:text-2xl">
              {personal.title}
            </p>
          </div>

          {/* Gauge-style stat cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-sm border border-slate-600/50 bg-[#111]/90 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_0_1px_rgba(148,163,184,0.04)]">
              <p className="text-[10px] uppercase tracking-[0.36em] text-slate-500">Mode</p>
              <p className="mt-2 text-base font-bold bg-gradient-to-r from-gray-200 to-slate-100 bg-clip-text text-transparent tracking-wide">Performance</p>
            </div>
            <div className="rounded-sm border border-slate-600/50 bg-[#111]/90 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_0_1px_rgba(148,163,184,0.04)]">
              <p className="text-[10px] uppercase tracking-[0.36em] text-slate-500">Focus</p>
              <p className="mt-2 text-base font-bold bg-gradient-to-r from-gray-200 to-slate-100 bg-clip-text text-transparent tracking-wide">Speed & polish</p>
            </div>
          </div>

          <div className="space-y-4 text-slate-400">
            <p className="text-sm leading-7">{personal.tagline || personal.bio}</p>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {personal.location && (
                <span className="inline-flex items-center gap-2 rounded-sm border border-slate-700/60 bg-[#111] px-3 py-2 text-slate-300">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {personal.location}
                </span>
              )}
              <span className="inline-flex items-center gap-2 rounded-sm border border-slate-700/60 bg-[#111] px-3 py-2 text-slate-300">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                {socials.email}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {socialLinks.map(({ name, href, icon: Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-slate-500/80 bg-gradient-to-b from-slate-300/80 to-slate-400/80 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:from-slate-200 hover:to-slate-300 hover:shadow-[0_4px_12px_rgba(192,192,192,0.3)]"
              >
                <Icon className="h-4 w-4 text-slate-400" />
                {name}
              </a>
            ))}
          </div>
        </div>

        {/* Avatar panel — brushed metal frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative isolate overflow-hidden rounded-lg border border-slate-500/60 bg-[#0a0a0a] p-1 shadow-[0_20px_80px_-30px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.1)] max-w-[380px] ml-auto"
        >
          {/* Brushed metal top sheen */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-slate-300/10 to-transparent" />
          <div className="relative overflow-hidden rounded-md bg-slate-950">
            <img
              src={personal.avatar}
              alt={`${personal.name} avatar`}
              className="h-full w-full max-h-[260px] object-cover object-top"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_50%)]" />
            {/* Engine mode badge */}
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-sm border border-slate-400/40 bg-[#0a0a0a]/90 px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              Engine Mode
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stat bar — like an instrument cluster */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { value: `${stats.yearsExperience || 0}+`, label: 'Years Experience' },
          { value: `${stats.projectsCompleted || 0}+`, label: 'Projects Completed' },
          { value: `${stats.happyClients || 0}+`, label: 'Happy Clients' },
        ].map((item, i) => (
          <div key={item.label} className="relative rounded-sm border border-slate-600/50 bg-[#0d0d0d]/95 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            {/* Left chrome edge accent */}
            <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-slate-400/50 to-transparent" />
            <p className="text-3xl font-black bg-gradient-to-r from-gray-200 via-slate-100 to-gray-200 bg-clip-text text-transparent tracking-tight">{item.value}</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.32em] text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}