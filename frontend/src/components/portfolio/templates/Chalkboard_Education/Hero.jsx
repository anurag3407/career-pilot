import React from 'react';

const badges = ['AI Lesson Design', 'Frontend Systems', 'Learning Analytics', 'Creative Coding'];

const metrics = [
  { label: 'Courses Built', value: '18', accent: 'from-cyan-400 to-sky-500' },
  { label: 'Student Impact', value: '4.9k', accent: 'from-teal-300 to-cyan-400' },
  { label: 'Automation Wins', value: '92%', accent: 'from-sky-300 to-indigo-400' },
];

const progressCards = [
  { label: 'AI Tutor Sync', value: '94%', width: '94%' },
  { label: 'Portfolio Labs', value: '88%', width: '88%' },
  { label: 'Research Sprints', value: '76%', width: '76%' },
];

const chartHeights = [34, 52, 44, 70, 60, 80, 68];

const analyticsStats = [
  { label: 'Retention Score', value: '96%' },
  { label: 'Project Completions', value: '27' },
  { label: 'Mentor Feedback', value: 'A+' },
];

const buildStats = [
  { label: 'Adaptive Paths', value: '12' },
  { label: 'Live Mentors', value: '08' },
  { label: 'Portfolio Labs', value: '24' },
];

const momentumStats = [
  { label: 'Session Depth', value: '8.4 / 10' },
  { label: 'Reflection Rate', value: '91%' },
  { label: 'Prototype Readiness', value: 'Q3 Launch' },
];

function GlassCard({ className = '', children }) {
  return (
    <div
      className={`rounded-3xl border border-cyan-100/12 bg-white/[0.08] shadow-[0_28px_90px_rgba(6,17,40,0.48),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl ${className}`}
    >
      {children}
    </div>
  );
}

function MetricPill({ label, value, accent }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/40 px-4 py-4 backdrop-blur-md">
      <div className={`mb-3 h-1.5 w-14 rounded-full bg-gradient-to-r ${accent}`} />
      <p className="overflow-hidden text-ellipsis whitespace-normal break-normal text-[11px] uppercase tracking-[0.22em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold text-white sm:text-2xl">{value}</p>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="whitespace-normal break-normal text-[11px] uppercase tracking-[0.3em] text-slate-400">
      {children}
    </p>
  );
}

function DashboardCard({ className = '', children }) {
  return (
    <div className={`min-w-0 rounded-3xl border border-white/10 bg-slate-950/45 p-6 ${className}`}>{children}</div>
  );
}

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#061121] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.22),_transparent_30%),radial-gradient(circle_at_85%_18%,_rgba(56,189,248,0.18),_transparent_26%),linear-gradient(135deg,_#081326_0%,_#0a1930_36%,_#071021_100%)]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(125,211,252,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.14)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute left-[10%] top-16 h-40 w-40 rounded-full bg-cyan-400/12 blur-3xl" />
      <div className="absolute right-[8%] top-20 h-56 w-56 rounded-full bg-teal-300/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-60 w-60 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute left-[8%] top-[18%] text-xl text-cyan-100/12">E=mc2</span>
        <span className="absolute left-[16%] top-[66%] text-sm text-cyan-100/10">/\\</span>
        <span className="absolute right-[20%] top-[22%] text-sm text-cyan-100/10">x+y</span>
        <span className="absolute right-[10%] top-[62%] text-lg text-cyan-100/10">pi</span>
        <span className="absolute left-[48%] top-[14%] h-2 w-2 rounded-full bg-cyan-200/50 shadow-[0_0_18px_rgba(125,211,252,0.7)]" />
        <span className="absolute left-[72%] top-[48%] h-1.5 w-1.5 rounded-full bg-teal-200/60 shadow-[0_0_18px_rgba(94,234,212,0.7)]" />
        <span className="absolute left-[25%] top-[78%] h-1.5 w-1.5 rounded-full bg-sky-200/60 shadow-[0_0_18px_rgba(125,211,252,0.7)]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1720px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16 xl:px-10">
        <div className="grid items-center gap-10 xl:grid-cols-[35%_65%] xl:gap-10">
          <div className="relative z-10 max-w-3xl xl:max-w-none">
            <span className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.34em] text-cyan-100/90 shadow-[0_0_24px_rgba(34,211,238,0.16)]">
              Chalkboard Education Portfolio
            </span>

            <div className="mt-5 max-w-3xl">
              <p className="whitespace-normal break-normal text-xs uppercase tracking-[0.34em] text-cyan-200/75 sm:text-sm">
                Student Builder | AI Classroom Designer
              </p>
              <h1 className="mt-4 max-w-[12ch] whitespace-normal break-normal text-[2.9rem] font-semibold leading-[0.98] tracking-[-0.03em] text-white sm:text-[3.4rem] lg:text-[4rem] 2xl:text-[4.35rem]">
                <span className="block font-serif italic text-cyan-50 [text-shadow:0_0_18px_rgba(165,243,252,0.18)]">
                  Future-ready learning
                </span>
                <span className="mt-2 block">experiences for the</span>
                <span className="mt-2 block text-sky-200/95">AI-powered classroom.</span>
              </h1>
              <p className="mt-5 max-w-2xl whitespace-normal break-normal text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                I design premium educational products that blend AI tutoring, visual storytelling, and measurable learner
                outcomes into polished digital experiences for modern classrooms and standout student portfolios.
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_44px_rgba(34,211,238,0.28)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_22px_56px_rgba(34,211,238,0.34)] focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-[#061121]"
              >
                Explore Portfolio
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full border border-cyan-200/20 bg-white/6 px-6 py-3 text-sm font-medium text-cyan-50 backdrop-blur-md transition duration-300 hover:border-cyan-200/35 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-[#061121]"
              >
                Book a Collaboration
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/10 bg-slate-900/45 px-4 py-2 text-sm text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:max-w-2xl">
              {metrics.map((metric) => (
                <MetricPill key={metric.label} {...metric} />
              ))}
            </div>
          </div>

          <div className="relative mx-auto min-w-0 w-full max-w-full">
            <div className="absolute -left-4 top-8 hidden h-24 w-24 rounded-full border border-cyan-200/15 bg-cyan-300/8 blur-xl md:block" />
            <div className="absolute -right-3 bottom-8 hidden h-32 w-32 rounded-full border border-sky-200/10 bg-sky-400/10 blur-2xl md:block" />

            <GlassCard className="relative overflow-hidden p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_36%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/35 to-transparent" />

              <div className="relative grid gap-6">
                <div className="grid gap-6 xl:grid-cols-2">
                  <DashboardCard>
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-sky-500 text-lg font-semibold text-slate-950">
                        TS
                      </div>
                      <div className="min-w-0">
                        <SectionLabel>Profile Card</SectionLabel>
                        <h2 className="mt-1 whitespace-normal break-normal text-lg font-semibold text-white">Tarun Sharma</h2>
                        <p className="mt-1 whitespace-normal break-normal text-sm leading-6 text-slate-300">
                          EdTech creator building AI-powered student portfolios and accessible learning interfaces.
                        </p>
                      </div>
                    </div>
                  </DashboardCard>

                  <DashboardCard>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <SectionLabel>Sprint Progress</SectionLabel>
                        <p className="mt-1 whitespace-normal break-normal text-lg font-semibold text-white">Week 08 delivery cycle</p>
                      </div>
                      <span className="shrink-0 rounded-full border border-cyan-300/15 bg-cyan-300/8 px-3 py-1 text-xs text-cyan-100">
                        82%
                      </span>
                    </div>
                    <div className="mt-4 h-2.5 rounded-full bg-white/10">
                      <div className="h-2.5 w-[82%] rounded-full bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-400 shadow-[0_0_18px_rgba(34,211,238,0.24)]" />
                    </div>
                    <p className="mt-4 whitespace-normal break-normal text-sm leading-6 text-slate-300">
                      Shipping classroom analytics, portfolio storytelling, and mentorship-ready UI systems.
                    </p>
                  </DashboardCard>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,1fr)_minmax(280px,1fr)]">
                  <DashboardCard className="xl:row-span-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <SectionLabel>Analytics Card</SectionLabel>
                        <p className="mt-1 whitespace-normal break-normal text-xl font-semibold text-white">Performance signal map</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
                          Live
                        </span>
                        <span className="rounded-full border border-cyan-300/15 bg-cyan-300/8 px-3 py-1 text-xs text-cyan-100">
                          Updated 4 min ago
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 rounded-3xl border border-white/8 bg-[linear-gradient(180deg,rgba(15,23,42,0.2)_0%,rgba(15,23,42,0.72)_100%)] p-5">
                      <div className="flex h-36 items-end gap-3">
                        {chartHeights.map((height, index) => (
                          <div key={`${height}-${index}`} className="flex min-w-0 flex-1 flex-col items-center gap-2.5">
                            <div
                              className="w-full rounded-t-[18px] bg-gradient-to-t from-cyan-500 via-sky-400 to-teal-200 shadow-[0_0_22px_rgba(34,211,238,0.22)]"
                              style={{ height: `${height}%` }}
                            />
                            <span className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{`0${index + 1}`.slice(-2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {analyticsStats.map((item) => (
                        <div
                          key={item.label}
                          className="rounded-3xl border border-white/8 bg-white/5 p-4 last:sm:col-span-2"
                        >
                          <p className="whitespace-normal break-normal text-[11px] uppercase tracking-[0.2em] text-slate-400">
                            {item.label}
                          </p>
                          <p className="mt-2 whitespace-normal break-normal text-lg font-semibold text-white sm:text-xl">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </DashboardCard>

                  <DashboardCard>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <SectionLabel>Guidance Card</SectionLabel>
                        <p className="mt-1 whitespace-normal break-normal text-lg font-semibold text-white">AI tutor recommendations</p>
                      </div>
                      <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(125,211,252,0.9)]" />
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="rounded-3xl border border-cyan-200/12 bg-cyan-300/8 p-4 text-sm leading-6 text-cyan-50">
                        Next best action: publish the inclusive classroom case study with prototype walkthroughs.
                      </div>
                      <div className="rounded-3xl border border-white/8 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                        Skill confidence rose after shipping analytics widgets, reflective journals, and accessible UI audits.
                      </div>
                    </div>
                  </DashboardCard>

                  <DashboardCard>
                    <SectionLabel>Progress Metrics Card</SectionLabel>
                    <p className="mt-1 whitespace-normal break-normal text-lg font-semibold text-white">Project momentum</p>

                    <div className="mt-5 space-y-4">
                      {progressCards.map((item) => (
                        <div key={item.label}>
                          <div className="mb-2 flex items-center justify-between gap-4 text-sm text-slate-200">
                            <span className="whitespace-normal break-normal">{item.label}</span>
                            <span className="shrink-0 text-cyan-200">{item.value}</span>
                          </div>
                          <div className="h-2.5 rounded-full bg-white/10">
                            <div
                              className="h-2.5 rounded-full bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-400 shadow-[0_0_14px_rgba(34,211,238,0.24)]"
                              style={{ width: item.width }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </DashboardCard>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(280px,1fr)_minmax(320px,1.15fr)_minmax(280px,1fr)]">
                  <DashboardCard className="min-h-[280px]">
                    <SectionLabel>Skill Orbit Card</SectionLabel>
                    <div className="relative mt-5 flex min-h-[220px] items-center justify-center overflow-hidden rounded-3xl border border-white/8 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.12),_transparent_55%)]">
                      <div className="absolute h-44 w-44 rounded-full border border-cyan-200/12" />
                      <div className="absolute h-32 w-32 rounded-full border border-teal-200/12" />
                      <div className="absolute h-18 w-18 rounded-full border border-sky-200/20 bg-sky-300/10 backdrop-blur-sm" />
                      <span className="absolute left-5 top-8 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] text-cyan-100">
                        UI Systems
                      </span>
                      <span className="absolute right-5 top-14 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] text-teal-100">
                        AI Labs
                      </span>
                      <span className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] text-sky-100">
                        EdTech Research
                      </span>
                      <span className="text-sm font-semibold uppercase tracking-[0.28em] text-white">Focus Grid</span>
                    </div>
                  </DashboardCard>

                  <DashboardCard className="bg-gradient-to-br from-cyan-300/12 to-sky-400/10">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <SectionLabel>Featured Build Card</SectionLabel>
                        <p className="mt-1 whitespace-normal break-normal text-xl font-semibold text-white">Smart classroom portfolio kit</p>
                        <p className="mt-3 whitespace-normal break-normal text-sm leading-6 text-slate-200">
                          A premium student showcase system combining assessment dashboards, project archives, and AI coaching
                          prompts with calm, high-contrast design patterns built for modern learning journeys.
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs text-cyan-100">
                        Prototype
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {buildStats.map((item) => (
                        <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
                          <p className="whitespace-normal break-normal text-[10px] uppercase tracking-[0.22em] text-slate-400">
                            {item.label}
                          </p>
                          <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </DashboardCard>

                  <DashboardCard>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <SectionLabel>Weekly Momentum Card</SectionLabel>
                        <p className="mt-1 whitespace-normal break-normal text-lg font-semibold text-white">Classroom pulse</p>
                      </div>
                      <span className="rounded-full border border-cyan-300/15 bg-cyan-300/8 px-3 py-1 text-xs text-cyan-100">
                        Stable
                      </span>
                    </div>

                    <div className="mt-5 space-y-3">
                      {momentumStats.map((item) => (
                        <div key={item.label} className="rounded-3xl border border-white/8 bg-white/5 p-4">
                          <p className="whitespace-normal break-normal text-[11px] uppercase tracking-[0.2em] text-slate-400">
                            {item.label}
                          </p>
                          <p className="mt-2 whitespace-normal break-normal text-lg font-semibold text-white">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </DashboardCard>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
