import React from 'react';
import { Eye, Fingerprint, KeyRound, MapPin, ScrollText, ShieldQuestion } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const initialsFor = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'AR';

export default function About({
  personal = data.personal,
  stats = data.stats,
  skills = data.skills,
}) {
  const evidence = [
    { label: 'Years in the field', value: `${stats.yearsExperience}+`, icon: Fingerprint },
    { label: 'Cases completed', value: stats.projectsCompleted, icon: ScrollText },
    { label: 'Trusted clients', value: stats.happyClients, icon: KeyRound },
  ];

  const featuredSkills = skills.slice(0, 6);

  return (
    <section
      id="about"
      className="relative isolate overflow-hidden bg-[#030406] px-4 py-20 text-stone-100 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_22%_18%,rgba(112,24,54,0.38),transparent_32%),radial-gradient(circle_at_82%_28%,rgba(19,83,75,0.24),transparent_30%),linear-gradient(135deg,#030406_0%,#0b0a0d_48%,#050607_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(rgba(245,230,190,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(245,230,190,0.6)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="absolute left-1/2 top-0 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-[#7f1d1d]/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black via-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/70 to-transparent" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[520px] overflow-hidden border border-stone-500/20 bg-black/45 p-5 shadow-2xl shadow-black/60 backdrop-blur-md sm:p-8">
          <div className="absolute inset-4 border border-stone-600/15" />
          <div className="absolute -left-20 top-16 h-52 w-52 rounded-full border border-dashed border-amber-200/20" />
          <div className="absolute bottom-8 right-8 h-28 w-28 rounded-full border border-dashed border-emerald-200/20" />
          <div className="absolute left-12 top-28 h-px w-56 rotate-[24deg] bg-amber-100/15" />
          <div className="absolute bottom-24 right-16 h-px w-48 -rotate-[31deg] bg-emerald-100/15" />

          <div className="relative z-10 flex h-full flex-col justify-between gap-10">
            <div>
              <div className="mb-8 inline-flex items-center gap-2 border border-red-300/20 bg-red-950/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-red-100/80">
                <Eye className="h-4 w-4" />
                Classified Profile
              </div>

              <div className="relative mx-auto flex aspect-square w-52 items-center justify-center rounded-full border border-stone-500/20 bg-[radial-gradient(circle,#1d1718_0%,#080809_58%,#020202_100%)] shadow-[0_0_70px_rgba(127,29,29,0.28)] sm:w-64">
                <div className="absolute inset-4 rounded-full border border-dashed border-amber-100/20" />
                <div className="absolute inset-9 rounded-full border border-emerald-100/10" />
                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-stone-200/20 to-transparent" />
                <div className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-stone-200/20 to-transparent" />
                <span className="font-serif text-5xl text-amber-50 drop-shadow-[0_0_18px_rgba(245,158,11,0.25)] sm:text-6xl">
                  {initialsFor(personal.name)}
                </span>
              </div>
            </div>

            <div className="relative border-l border-amber-200/25 pl-5">
              <p className="font-serif text-2xl text-stone-100 sm:text-3xl">{personal.name}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.24em] text-stone-400">{personal.title}</p>
              <div className="mt-5 flex items-center gap-2 text-sm text-emerald-100/75">
                <MapPin className="h-4 w-4 text-emerald-200/80" />
                {personal.location}
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="mb-8">
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.34em] text-amber-100/70">
              <ShieldQuestion className="h-4 w-4" />
              About the investigator
            </p>
            <h2 className="max-w-3xl font-serif text-4xl leading-tight text-stone-50 sm:text-5xl lg:text-6xl">
              Solving quiet problems in the dark corners of complex products.
            </h2>
          </div>

          <div className="border border-stone-500/20 bg-stone-950/55 p-6 shadow-2xl shadow-black/50 backdrop-blur-md sm:p-8">
            <p className="text-base leading-8 text-stone-300 sm:text-lg">{personal.bio}</p>
            <p className="mt-6 border-t border-stone-700/50 pt-6 text-sm leading-7 text-stone-400">
              {personal.tagline}
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {evidence.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="group border border-stone-500/20 bg-black/40 p-5 transition duration-300 hover:-translate-y-1 hover:border-amber-200/35 hover:bg-stone-950/80"
                >
                  <Icon className="mb-5 h-5 w-5 text-red-200/80 transition duration-300 group-hover:text-amber-100" />
                  <p className="font-serif text-3xl text-stone-50">{item.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone-500">{item.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {featuredSkills.map((skill) => (
              <span
                key={skill.name}
                className="border border-emerald-200/15 bg-emerald-950/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100/75"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
