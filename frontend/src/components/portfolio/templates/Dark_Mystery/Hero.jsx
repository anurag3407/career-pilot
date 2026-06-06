import React from 'react';
import {
  ChevronDown,
  Eye,
  FileSearch,
  Fingerprint,
  MapPin,
  Search,
  ShieldAlert,
} from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const caseRef = (name = '') => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  return `CASE-${initials || 'XX'}-2026`;
};

export default function Hero({ personal = data.personal }) {
  const ref = caseRef(personal.name);

  return (
    <>
      <style>
        {`
          @keyframes mystery-fade-up {
            0% { opacity: 0; transform: translateY(28px); filter: blur(6px); }
            100% { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          @keyframes mystery-pulse {
            0%, 100% { opacity: 0.35; }
            50% { opacity: 0.7; }
          }
          @keyframes mystery-scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
          }
          @keyframes mystery-flicker {
            0%, 100% { opacity: 1; }
            92% { opacity: 1; }
            93% { opacity: 0.4; }
            94% { opacity: 1; }
            96% { opacity: 0.6; }
            97% { opacity: 1; }
          }
          .animate-mystery {
            animation: mystery-fade-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
          .animate-mystery-pulse {
            animation: mystery-pulse 4s ease-in-out infinite;
          }
          .animate-mystery-flicker {
            animation: mystery-flicker 6s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-mystery,
            .animate-mystery-pulse,
            .animate-mystery-flicker {
              animation: none;
              opacity: 1;
              transform: none;
              filter: none;
            }
          }
        `}
      </style>

      <section
        id="hero"
        className="relative isolate flex min-h-screen items-center overflow-hidden bg-[#030406] px-4 py-24 text-stone-100 sm:px-6 lg:px-8"
      >
        {/* Atmospheric backdrop */}
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_22%,rgba(112,24,54,0.42),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(19,83,75,0.28),transparent_32%),radial-gradient(ellipse_at_50%_100%,rgba(127,29,29,0.18),transparent_55%),linear-gradient(160deg,#030406_0%,#0b0a0d_45%,#050607_100%)]" />
        <div className="absolute inset-0 -z-10 opacity-[0.09] [background-image:linear-gradient(rgba(245,230,190,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(245,230,190,0.6)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="absolute left-1/2 top-0 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#7f1d1d]/22 blur-3xl" />
        <div className="absolute bottom-0 right-0 -z-10 h-80 w-80 translate-x-1/4 translate-y-1/4 rounded-full bg-emerald-900/20 blur-3xl" />

        {/* Spotlight cone */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-full w-[min(90vw,700px)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(245,230,190,0.07)_0%,transparent_65%)]" />

        {/* Scan line */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-amber-100/5 to-transparent"
          style={{ animation: 'mystery-scan 8s linear infinite' }}
          aria-hidden="true"
        />

        {/* Evidence string connections */}
        <div className="pointer-events-none absolute inset-0 -z-10 hidden lg:block">
          <div className="absolute left-[12%] top-[28%] h-px w-56 rotate-[18deg] bg-amber-100/12" />
          <div className="absolute right-[14%] top-[36%] h-px w-48 -rotate-[24deg] bg-emerald-100/12" />
          <div className="absolute bottom-[32%] left-[22%] h-px w-64 rotate-[-12deg] bg-red-100/10" />
          <div className="absolute -left-16 top-32 h-52 w-52 rounded-full border border-dashed border-amber-200/15" />
          <div className="absolute -right-10 bottom-40 h-40 w-40 rounded-full border border-dashed border-emerald-200/15" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black via-black/80 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black via-black/80 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            {/* Left: primary identity */}
            <div>
              <div className="animate-mystery mb-8 flex flex-wrap items-center gap-3" style={{ animationDelay: '0.1s' }}>
                <span className="inline-flex items-center gap-2 border border-red-300/25 bg-red-950/30 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-red-100/85 sm:text-xs">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Active investigation
                </span>
                <span className="inline-flex items-center gap-2 border border-stone-500/25 bg-black/40 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-400">
                  <Fingerprint className="h-3.5 w-3.5 text-amber-200/70" />
                  {ref}
                </span>
              </div>

              <div className="animate-mystery" style={{ animationDelay: '0.35s' }}>
                <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.34em] text-amber-100/70">
                  <Eye className="h-4 w-4" />
                  Subject identified
                </p>
                <h1 className="font-serif text-5xl leading-[0.95] text-stone-50 sm:text-6xl md:text-7xl lg:text-8xl">
                  {personal.name}
                </h1>
              </div>

              <div className="animate-mystery mt-6 border-l border-amber-200/25 pl-5" style={{ animationDelay: '0.6s' }}>
                <p className="text-sm uppercase tracking-[0.26em] text-stone-400 sm:text-base">
                  {personal.title}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm text-emerald-100/75">
                  <MapPin className="h-4 w-4 shrink-0 text-emerald-200/80" />
                  {personal.location}
                </div>
              </div>

              <div className="animate-mystery mt-8 max-w-2xl" style={{ animationDelay: '0.85s' }}>
                <p className="text-base leading-8 text-stone-300 sm:text-lg">
                  {personal.tagline}
                </p>
              </div>

              <div
                className="animate-mystery mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
                style={{ animationDelay: '1.1s' }}
              >
                <a
                  href="#projects"
                  className="group relative flex items-center justify-center gap-2 overflow-hidden border border-red-300/25 bg-red-950/35 px-8 py-4 text-xs font-bold uppercase tracking-[0.28em] text-red-50 transition duration-300 hover:border-amber-200/35 hover:bg-red-950/55"
                >
                  <Search className="h-4 w-4 transition duration-300 group-hover:rotate-12" />
                  Examine evidence
                  <span className="pointer-events-none absolute inset-0 translate-y-full bg-gradient-to-r from-amber-900/20 via-red-900/30 to-emerald-900/20 transition duration-500 group-hover:translate-y-0" />
                </a>
                <a
                  href="#about"
                  className="group flex items-center justify-center gap-2 border border-stone-500/25 bg-stone-950/50 px-8 py-4 text-xs font-bold uppercase tracking-[0.28em] text-stone-200 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-200/30 hover:bg-stone-950/80 hover:text-emerald-50"
                >
                  <FileSearch className="h-4 w-4 transition duration-300 group-hover:scale-110" />
                  Open dossier
                </a>
              </div>
            </div>

            {/* Right: classified case card */}
            <div className="animate-mystery relative" style={{ animationDelay: '0.5s' }}>
              <div className="relative border border-stone-500/20 bg-black/45 p-6 shadow-2xl shadow-black/60 backdrop-blur-md sm:p-8">
                <div className="absolute inset-4 border border-stone-600/15" />
                <div className="absolute -right-6 -top-4 rotate-[-12deg] border-2 border-red-400/40 bg-red-950/30 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.38em] text-red-300/80 animate-mystery-flicker">
                  Confidential
                </div>

                <div className="relative z-10">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                        Case summary
                      </p>
                      <p className="mt-1 font-serif text-2xl text-stone-50 sm:text-3xl">
                        Primary suspect profile
                      </p>
                    </div>
                    <div className="shrink-0 border border-amber-200/20 bg-amber-950/20 px-3 py-2 text-right">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                        Status
                      </p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-100/80">
                        Under review
                      </p>
                    </div>
                  </div>

                  <div className="relative mx-auto mb-8 flex aspect-square max-w-[220px] items-center justify-center rounded-full border border-stone-500/20 bg-[radial-gradient(circle,#1d1718_0%,#080809_58%,#020202_100%)] shadow-[0_0_70px_rgba(127,29,29,0.28)] sm:max-w-[260px]">
                    <div className="absolute inset-4 rounded-full border border-dashed border-amber-100/20 animate-mystery-pulse" />
                    <div className="absolute inset-9 rounded-full border border-emerald-100/10" />
                    <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-stone-200/20 to-transparent" />
                    <div className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-stone-200/20 to-transparent" />
                    <span className="font-serif text-5xl text-amber-50 drop-shadow-[0_0_18px_rgba(245,158,11,0.25)] sm:text-6xl">
                      {personal.name
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join('')
                        .toUpperCase() || 'AR'}
                    </span>
                  </div>

                  <div className="space-y-3 border-t border-stone-700/50 pt-6">
                    {[
                      { label: 'Classification', value: 'Restricted' },
                      { label: 'Lead investigator', value: personal.name },
                      { label: 'Field of inquiry', value: personal.title.split('&')[0].trim() },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between gap-4 border border-stone-500/15 bg-stone-950/40 px-4 py-3"
                      >
                        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                          {row.label}
                        </span>
                        <span className="text-right text-sm text-stone-200">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <p className="mt-6 text-sm leading-7 text-stone-400 line-clamp-3">
                    {personal.bio}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <div
            className="animate-mystery mt-16 flex flex-col items-center gap-2 text-stone-500"
            style={{ animationDelay: '1.4s' }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em]">Continue investigation</p>
            <ChevronDown className="h-5 w-5 animate-bounce text-amber-200/50" />
          </div>
        </div>
      </section>
    </>
  );
}
