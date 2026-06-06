import React from 'react';
import {
  Download,
  Eye,
  FileSearch,
  Fingerprint,
  Lock,
  ScrollText,
  ShieldAlert,
} from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const sanitizeUrl = (url) => {
  if (!url || url === '#') return '#';
  if (/^https?:\/\//i.test(url)) return url;
  return '#';
};

const dossierHighlights = (experience = []) =>
  experience.slice(0, 3).map((entry, index) => ({
    ...entry,
    ref: `STATEMENT-${String(index + 1).padStart(2, '0')}`,
  }));

export default function ResumeCTA({
  personal = data.personal,
  stats = data.stats,
  experience = data.experience,
  resumeUrl = personal.resumeUrl || '#',
  previewUrl = '#resume-preview',
}) {
  const highlights = dossierHighlights(experience);
  const downloadHref = sanitizeUrl(resumeUrl);
  const previewHref = sanitizeUrl(previewUrl);

  return (
    <section
      id="resume"
      className="relative isolate overflow-hidden bg-[#030406] px-4 py-20 text-stone-100 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_24%_72%,rgba(112,24,54,0.36),transparent_34%),radial-gradient(circle_at_78%_22%,rgba(19,83,75,0.24),transparent_32%),linear-gradient(145deg,#030406_0%,#0a090c_50%,#040506_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(rgba(245,230,190,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(245,230,190,0.6)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="absolute right-0 top-1/2 -z-10 h-96 w-96 -translate-y-1/2 translate-x-1/3 rounded-full bg-[#7f1d1d]/18 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black via-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/70 to-transparent" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl lg:mb-16">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.34em] text-amber-100/70">
            <ShieldAlert className="h-4 w-4" />
            Personnel dossier
          </p>
          <h2 className="font-serif text-4xl leading-tight text-stone-50 sm:text-5xl lg:text-6xl">
            Request the full case file.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-stone-400 sm:text-lg">
            Every career has a paper trail. Download the complete dossier or inspect the
            classified summary before granting clearance.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="relative border border-stone-500/20 bg-black/45 p-6 shadow-2xl shadow-black/60 backdrop-blur-md sm:p-8 lg:p-10">
            <div className="absolute inset-4 border border-stone-600/15" />
            <div className="absolute -left-16 top-20 h-44 w-44 rounded-full border border-dashed border-amber-200/15" />
            <div className="absolute bottom-16 right-10 h-px w-48 -rotate-[24deg] bg-emerald-100/15" />

            <div className="pointer-events-none absolute right-6 top-6 hidden rotate-[-14deg] border-2 border-red-400/40 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.38em] text-red-300/75 sm:block">
              Eyes only
            </div>

            <div className="relative z-10">
              <div className="mb-8 inline-flex items-center gap-2 border border-red-300/20 bg-red-950/25 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-red-100/80 sm:text-xs">
                <Lock className="h-4 w-4" />
                Restricted access
              </div>

              <div className="mb-8 border-l border-amber-200/25 pl-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                  Subject
                </p>
                <h3 className="mt-2 font-serif text-3xl text-stone-50 sm:text-4xl">{personal.name}</h3>
                <p className="mt-2 text-sm uppercase tracking-[0.24em] text-stone-400">
                  {personal.title}
                </p>
              </div>

              <div className="mb-8 border border-stone-500/20 bg-stone-950/55 p-5 sm:p-6">
                <p className="text-base leading-8 text-stone-300 sm:text-lg">{personal.bio}</p>
                <p className="mt-5 border-t border-stone-700/50 pt-5 text-sm italic leading-7 text-stone-500">
                  &ldquo;{personal.tagline}&rdquo;
                </p>
              </div>

              <div className="mb-10 grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Years on record', value: `${stats.yearsExperience}+`, tone: 'amber' },
                  { label: 'Cases closed', value: stats.projectsCompleted, tone: 'emerald' },
                  { label: 'Trusted witnesses', value: stats.happyClients, tone: 'red' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`border p-4 transition duration-300 hover:-translate-y-0.5 ${
                      item.tone === 'emerald'
                        ? 'border-emerald-200/15 bg-emerald-950/10 hover:border-emerald-200/30'
                        : item.tone === 'red'
                          ? 'border-red-200/15 bg-red-950/10 hover:border-red-200/30'
                          : 'border-amber-200/15 bg-amber-950/10 hover:border-amber-200/30'
                    }`}
                  >
                    <p className="font-serif text-3xl text-stone-50">{item.value}</p>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href={downloadHref}
                  target={downloadHref !== '#' ? '_blank' : undefined}
                  rel={downloadHref !== '#' ? 'noreferrer' : undefined}
                  className="group relative flex flex-1 items-center justify-center gap-2 overflow-hidden border border-red-300/25 bg-red-950/35 px-6 py-4 text-xs font-bold uppercase tracking-[0.28em] text-red-50 transition duration-300 hover:border-amber-200/35 hover:bg-red-950/55"
                >
                  <Download className="h-4 w-4 transition duration-300 group-hover:-translate-y-0.5" />
                  Download dossier
                  <span className="pointer-events-none absolute inset-0 translate-y-full bg-gradient-to-r from-amber-900/20 via-red-900/30 to-emerald-900/20 transition duration-500 group-hover:translate-y-0" />
                </a>

                <a
                  href={previewHref}
                  target={previewHref !== '#' ? '_blank' : undefined}
                  rel={previewHref !== '#' ? 'noreferrer' : undefined}
                  className="group flex flex-1 items-center justify-center gap-2 border border-stone-500/25 bg-stone-950/50 px-6 py-4 text-xs font-bold uppercase tracking-[0.28em] text-stone-200 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-200/30 hover:bg-stone-950/80 hover:text-emerald-50"
                >
                  <Eye className="h-4 w-4 transition duration-300 group-hover:scale-110" />
                  Inspect records
                </a>
              </div>
            </div>
          </div>

          <div className="relative border border-stone-500/20 bg-stone-950/55 p-6 shadow-2xl shadow-black/50 backdrop-blur-md sm:p-8">
            <div className="absolute inset-3 border border-stone-600/15" />
            <div className="absolute -right-10 bottom-24 h-32 w-32 rounded-full border border-dashed border-emerald-200/15" />

            <div className="relative z-10">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                    <Fingerprint className="h-4 w-4 text-amber-200/70" />
                    File metadata
                  </p>
                  <h3 className="font-serif text-2xl text-stone-50 sm:text-3xl">Verified statements</h3>
                </div>
                <div className="shrink-0 border border-amber-200/20 bg-amber-950/20 px-3 py-2 text-right">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                    Ref no.
                  </p>
                  <p className="mt-1 font-serif text-sm text-amber-100/90">DOSSIER-004</p>
                </div>
              </div>

              <div className="mb-8 grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'Classification', value: 'Confidential' },
                  { label: 'Clearance', value: 'Level III' },
                  { label: 'Compiled', value: '2026 Archive' },
                  { label: 'Status', value: 'Active file' },
                ].map((meta) => (
                  <div
                    key={meta.label}
                    className="border border-stone-500/20 bg-black/35 px-4 py-3"
                  >
                    <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                      {meta.label}
                    </p>
                    <p className="mt-1 text-sm text-stone-200">{meta.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {highlights.map((entry) => (
                  <article
                    key={`${entry.company}-${entry.ref}`}
                    className="group border border-stone-500/20 bg-black/40 p-4 transition duration-300 hover:border-amber-200/25 hover:bg-stone-950/70"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-100/70">
                        <ScrollText className="h-3.5 w-3.5" />
                        {entry.ref}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-stone-500">
                        {entry.period}
                      </span>
                    </div>
                    <h4 className="font-serif text-lg text-stone-100">{entry.role}</h4>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-amber-100/70">
                      {entry.company}
                    </p>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-400 transition duration-300 group-hover:text-stone-300">
                      {entry.description}
                    </p>
                  </article>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-3 border-t border-stone-700/50 pt-6">
                <FileSearch className="h-4 w-4 shrink-0 text-red-200/70" />
                <p className="text-sm leading-7 text-stone-500">
                  Full employment history, skill matrix, and references available in the
                  complete dossier download.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
