import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { GhostButton, MonoLabel, PrimaryButton, REPO_URL } from './primitives'
import ProductMockup from './ProductMockup'

const STATS = [
  { value: '10+', label: 'Career tools' },
  { value: '264', label: 'Portfolio templates' },
  { value: '6', label: 'AI providers' },
  { value: 'MIT', label: 'Open source' },
]

export default function Hero() {
  const reduce = useReducedMotion()
  const rise = (delay) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
        }

  return (
    <section className="relative overflow-hidden px-5 pb-6 pt-14 sm:px-8 sm:pb-10 sm:pt-20 lg:px-12">
      {/* blueprint grid, faded at the edges */}
      <div
        aria-hidden="true"
        className="fd-grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,black,transparent_75%)]"
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.a
          {...rise(0)}
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-background/60 py-1 pl-1 pr-3 text-[12px] text-foreground/60 backdrop-blur transition hover:border-foreground/25 hover:text-foreground"
        >
          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
            Open source
          </span>
          Built in public, MIT licensed
          <ArrowUpRight className="h-3 w-3 opacity-50 transition group-hover:opacity-100" />
        </motion.a>

        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10">
          <div>
            <motion.h1
              {...rise(0.06)}
              className="text-[2.7rem] font-medium leading-[0.98] tracking-[-0.05em] text-balance sm:text-6xl lg:text-[5.4rem]"
            >
              <span className="block">Run your career</span>
              <span>like a </span>
              <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/55 bg-clip-text text-transparent">
                flight
              </span>{' '}
              <span className="text-primary">plan.</span>
            </motion.h1>

            <motion.p
              {...rise(0.14)}
              className="mt-7 max-w-xl text-[15px] leading-7 text-foreground/60 sm:text-base"
            >
              Resumes, ATS scoring, mock interviews, job tracking and a deployable portfolio — one calm cockpit
              instead of eleven tabs and four subscriptions.
            </motion.p>

            <motion.div {...rise(0.2)} className="mt-8 flex flex-wrap items-center gap-3">
              <PrimaryButton to="/register">Start free</PrimaryButton>
              <GhostButton href="#features">Explore the tools</GhostButton>
              <MonoLabel className="ml-1 hidden text-foreground/35 sm:inline">No card · bring your own key</MonoLabel>
            </motion.div>
          </div>

          <motion.dl
            {...rise(0.26)}
            className="grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-4 lg:grid-cols-2 lg:border-l lg:border-border lg:pb-2 lg:pl-10"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <dt>
                  <MonoLabel>{s.label}</MonoLabel>
                </dt>
                <dd className="mt-1.5 text-3xl font-medium tabular-nums tracking-[-0.04em] sm:text-[2.1rem]">
                  {s.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>

      <motion.div
        id="product"
        {...(reduce
          ? {}
          : {
              initial: { opacity: 0, y: 40 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.9, delay: 0.32, ease: [0.22, 1, 0.36, 1] },
            })}
        className="relative mt-16 sm:mt-20"
      >
        <ProductMockup />
      </motion.div>
    </section>
  )
}
