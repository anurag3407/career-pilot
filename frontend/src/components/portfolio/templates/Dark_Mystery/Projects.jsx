import React, { useState } from 'react';
import {
  ArrowUpRight,
  ExternalLink,
  FileSearch,
  FolderOpen,
  Github,
  Lock,
  ScanSearch,
  ScrollText,
} from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const STATUS_STYLES = {
  SOLVED: {
    label: 'Case closed',
    border: 'border-emerald-200/25',
    badge: 'border-emerald-200/20 bg-emerald-950/25 text-emerald-100/80',
    accent: 'text-emerald-100/75',
    glow: 'group-hover:shadow-[0_0_32px_rgba(52,211,153,0.12)]',
  },
  ACTIVE: {
    label: 'Under review',
    border: 'border-amber-200/25',
    badge: 'border-amber-200/20 bg-amber-950/25 text-amber-100/80',
    accent: 'text-amber-100/75',
    glow: 'group-hover:shadow-[0_0_32px_rgba(245,158,11,0.12)]',
  },
  COLD: {
    label: 'Cold file',
    border: 'border-red-200/20',
    badge: 'border-red-200/20 bg-red-950/25 text-red-100/80',
    accent: 'text-red-100/75',
    glow: 'group-hover:shadow-[0_0_32px_rgba(248,113,113,0.1)]',
  },
};

const CLASSIFICATIONS = ['RESTRICTED', 'CONFIDENTIAL', 'OPEN FILE'];

const EVIDENCE_BACKDROPS = [
  'bg-[radial-gradient(circle_at_30%_20%,rgba(127,29,29,0.55),transparent_52%),radial-gradient(circle_at_78%_72%,rgba(19,83,75,0.35),transparent_48%),linear-gradient(145deg,#120f12_0%,#050506_100%)]',
  'bg-[radial-gradient(circle_at_68%_24%,rgba(120,53,15,0.45),transparent_50%),radial-gradient(circle_at_18%_78%,rgba(30,64,175,0.22),transparent_46%),linear-gradient(145deg,#0d0b0f_0%,#030304_100%)]',
  'bg-[radial-gradient(circle_at_42%_62%,rgba(19,83,75,0.42),transparent_50%),radial-gradient(circle_at_82%_18%,rgba(127,29,29,0.28),transparent_44%),linear-gradient(145deg,#0a090c_0%,#020203_100%)]',
  'bg-[radial-gradient(circle_at_22%_72%,rgba(88,28,135,0.28),transparent_48%),radial-gradient(circle_at_76%_28%,rgba(127,29,29,0.34),transparent_50%),linear-gradient(145deg,#0f0d11_0%,#040405_100%)]',
  'bg-[radial-gradient(circle_at_54%_18%,rgba(120,53,15,0.38),transparent_46%),radial-gradient(circle_at_24%_58%,rgba(19,83,75,0.3),transparent_52%),linear-gradient(145deg,#0b0a0d_0%,#030304_100%)]',
  'bg-[radial-gradient(circle_at_70%_64%,rgba(127,29,29,0.4),transparent_50%),radial-gradient(circle_at_16%_22%,rgba(245,158,11,0.12),transparent_44%),linear-gradient(145deg,#110e12_0%,#050506_100%)]',
];

const caseMetaFor = (index) => {
  const statuses = Object.keys(STATUS_STYLES);
  return {
    id: `CASE-${String(index + 1).padStart(3, '0')}`,
    status: statuses[index % statuses.length],
    classification: CLASSIFICATIONS[index % CLASSIFICATIONS.length],
  };
};

function CaseFileCard({ project, index }) {
  const meta = caseMetaFor(index);
  const status = STATUS_STYLES[meta.status];
  const [revealed, setRevealed] = useState(false);

  return (
    <article
      className={`group relative flex h-full flex-col border bg-black/45 shadow-2xl shadow-black/60 backdrop-blur-md transition duration-500 hover:-translate-y-1.5 ${status.border} ${status.glow}`}
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => setRevealed(false)}
    >
      <div className="absolute inset-3 border border-stone-600/10 pointer-events-none" />
      <div className="absolute -right-8 top-10 h-28 w-28 rounded-full border border-dashed border-stone-500/10 opacity-0 transition duration-500 group-hover:opacity-100" />
      <div className="absolute bottom-16 left-6 h-px w-24 rotate-[22deg] bg-amber-100/10 opacity-0 transition duration-500 group-hover:opacity-100" />

      <div className="relative overflow-hidden border-b border-stone-700/40">
        <div
          className={`relative aspect-[16/10] overflow-hidden ${EVIDENCE_BACKDROPS[index % EVIDENCE_BACKDROPS.length]}`}
        >
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(245,230,190,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(245,230,190,0.8)_1px,transparent_1px)] [background-size:18px_18px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div
            className={`absolute inset-0 transition duration-700 ${revealed ? 'opacity-30' : 'opacity-60'}`}
            style={{
              backgroundImage:
                'repeating-linear-gradient(-12deg, transparent, transparent 11px, rgba(245,230,190,0.04) 11px, rgba(245,230,190,0.04) 12px)',
            }}
          />

          <div className="absolute left-4 top-4 flex items-center gap-2 border border-stone-500/25 bg-black/55 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-300">
            <ScanSearch className="h-3.5 w-3.5 text-amber-100/70" />
            {meta.id}
          </div>

          <div
            className={`pointer-events-none absolute right-4 top-4 rotate-[-10deg] border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] ${status.badge}`}
          >
            {meta.status}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                Exhibit preview
              </p>
              <p className="mt-1 font-serif text-xl text-stone-50 sm:text-2xl">{project.title}</p>
            </div>
            <div
              className={`hidden shrink-0 rounded-full border border-stone-500/20 bg-black/50 p-3 transition duration-500 sm:flex ${revealed ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
            >
              <FileSearch className="h-4 w-4 text-amber-100/80" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 border border-red-300/15 bg-red-950/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-100/75">
            <Lock className="h-3 w-3" />
            {meta.classification}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500">{status.label}</span>
        </div>

        <p className="mb-5 flex-1 text-sm leading-7 text-stone-400 sm:text-[15px]">{project.description}</p>

        <div className="mb-5 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="border border-stone-600/25 bg-stone-950/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-300 transition duration-300 group-hover:border-amber-200/20 group-hover:text-amber-50/85"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-stone-700/50 pt-5 sm:flex-row">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="group/link inline-flex flex-1 items-center justify-center gap-2 border border-stone-500/25 bg-stone-950/50 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-200 transition duration-300 hover:border-emerald-200/30 hover:bg-emerald-950/20 hover:text-emerald-50"
            >
              <Github className="h-4 w-4 transition duration-300 group-hover/link:scale-110" />
              Source dossier
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="group/link inline-flex flex-1 items-center justify-center gap-2 border border-red-300/20 bg-red-950/25 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-50 transition duration-300 hover:border-amber-200/30 hover:bg-red-950/45"
            >
              <ExternalLink className="h-4 w-4 transition duration-300 group-hover/link:translate-x-0.5" />
              Inspect scene
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Projects({ projects = data.projects }) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const filters = ['ALL', ...Object.keys(STATUS_STYLES)];

  const filteredProjects =
    activeFilter === 'ALL'
      ? projects
      : projects.filter((_, index) => caseMetaFor(index).status === activeFilter);

  return (
    <section
      id="projects"
      className="relative isolate overflow-hidden bg-[#030406] px-4 py-20 text-stone-100 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_14%_24%,rgba(112,24,54,0.36),transparent_34%),radial-gradient(circle_at_86%_72%,rgba(19,83,75,0.24),transparent_32%),linear-gradient(145deg,#030406_0%,#0a090c_50%,#040506_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(rgba(245,230,190,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(245,230,190,0.6)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="absolute right-0 top-1/3 -z-10 h-96 w-96 rounded-full bg-[#7f1d1d]/16 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-emerald-950/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black via-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/70 to-transparent" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-8 lg:mb-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.34em] text-amber-100/70">
              <ScrollText className="h-4 w-4" />
              Case archive
            </p>
            <h2 className="max-w-3xl font-serif text-4xl leading-tight text-stone-50 sm:text-5xl lg:text-6xl">
              Projects filed under lock and key.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-stone-400 sm:text-lg">
              Each build is documented like evidence from a closed investigation — context, tools,
              and access points preserved for review.
            </p>
          </div>

          <div className="relative border border-stone-500/20 bg-black/45 p-5 shadow-2xl shadow-black/60 backdrop-blur-md sm:p-6">
            <div className="absolute inset-3 border border-stone-600/15" />
            <div className="relative z-10">
              <div className="mb-4 inline-flex items-center gap-2 border border-red-300/20 bg-red-950/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-red-100/80 sm:text-xs">
                <FolderOpen className="h-4 w-4" />
                Archive index
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="border border-stone-500/20 bg-stone-950/50 p-4">
                  <p className="font-serif text-3xl text-stone-50">{projects.length}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">
                    Total files
                  </p>
                </div>
                <div className="border border-emerald-200/15 bg-emerald-950/10 p-4">
                  <p className="font-serif text-3xl text-emerald-100/90">
                    {projects.filter((_, index) => caseMetaFor(index).status === 'SOLVED').length}
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">
                    Closed cases
                  </p>
                </div>
                <div className="col-span-2 border border-amber-200/15 bg-amber-950/10 p-4 sm:col-span-1">
                  <p className="font-serif text-3xl text-amber-100/90">
                    {projects.filter((_, index) => caseMetaFor(index).status === 'ACTIVE').length}
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">
                    Active leads
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 flex flex-wrap gap-3">
          {filters.map((filter) => {
            const active = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`inline-flex items-center gap-2 border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition duration-300 ${
                  active
                    ? 'border-amber-200/35 bg-amber-950/30 text-amber-50'
                    : 'border-stone-500/20 bg-black/35 text-stone-400 hover:border-stone-400/30 hover:text-stone-200'
                }`}
              >
                {filter === 'ALL' ? 'All files' : filter.toLowerCase()}
                {active && <ArrowUpRight className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => {
            const originalIndex = projects.indexOf(project);
            return (
              <CaseFileCard
                key={`${project.title}-${originalIndex}`}
                project={project}
                index={originalIndex}
              />
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="border border-stone-500/20 bg-black/40 px-6 py-16 text-center backdrop-blur-md">
            <p className="font-serif text-2xl text-stone-200">No matching case files.</p>
            <p className="mt-3 text-sm text-stone-500">
              Adjust the archive filter to reveal additional dossiers.
            </p>
          </div>
        )}

        <div className="mt-12 border-t border-stone-700/40 pt-8">
          <p className="text-center text-sm leading-7 text-stone-500">
            All entries remain available for authorized review. Select a dossier to inspect source
            material or visit the live scene.
          </p>
        </div>
      </div>
    </section>
  );
}
