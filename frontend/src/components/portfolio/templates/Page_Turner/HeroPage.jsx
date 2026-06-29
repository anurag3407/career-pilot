import React from 'react'
import { Github, Linkedin, Mail, motion, safePersonal, safeSocials } from './shared'
import { Twitter } from 'lucide-react'

const HeroPage = React.forwardRef(function HeroPage(_, ref) {
  const { name = 'Your Name', title = 'Creative Professional' } = safePersonal

  const socials = [
    { href: safeSocials.github, icon: Github, label: 'GitHub' },
    { href: safeSocials.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { href: safeSocials.twitter, icon: Twitter, label: 'Twitter' },
    { href: safeSocials.email ? `mailto:${safeSocials.email}` : null, icon: Mail, label: 'Email' },
  ].filter((item) => item.href)

  return (
    <div ref={ref} className="h-full w-full overflow-hidden">
      {/* Root dark background */}
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#03050c] text-white">

        {/* Ambient glow blobs */}
        <div className="pointer-events-none absolute top-[-10%] left-[-10%] h-[50vw] w-[50vw] rounded-full bg-cyan-500/10 blur-[120px] mix-blend-screen" />
        <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[50vw] w-[50vw] rounded-full bg-violet-500/10 blur-[120px] mix-blend-screen" />

        {/* Architectural grid overlay */}
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Content */}
        <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-6 text-center">

          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/80 px-3 py-1 backdrop-blur-md"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
              System Active // Portfolio v1.0
            </span>
          </motion.div>

          {/* Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="mb-4 w-full"
          >
            <h1 className="text-5xl font-black tracking-tighter leading-none sm:text-6xl md:text-7xl">
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                {name}
              </span>
            </h1>
          </motion.div>

          {/* Title / subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.28 }}
            className="mb-8 w-full"
          >
            <p className="text-lg font-medium tracking-tight sm:text-xl md:text-2xl">
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                {title}
              </span>
            </p>
          </motion.div>

          {/* Social links (PULLED UPWARDS) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex w-full max-w-md flex-wrap items-center justify-center gap-4"
          >
            {socials.map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.6 + idx * 0.08 }}
                  // COOL & UNIQUE HOVER ANIMATION (include color change here)
                  whileHover={{ 
                    scale: 1.15, 
                    rotate: -10, 
                    boxShadow: "0px 0px 20px rgba(34, 211, 238, 0.4)",
                    borderColor: "#22d3ee",
                    color: "#22d3ee"
                  }}
                  className="rounded-lg border border-slate-800 bg-[#080c14] p-4 text-slate-400 shadow-inner transition-all duration-300"
                >
                  <Icon size={20} />
                </motion.a>
              )
            })}
          </motion.div>

        </div>
      </div>
    </div>
  )
})

export default HeroPage