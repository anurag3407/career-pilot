import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  Briefcase,
  Code2,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Palette,
  Quote,
  Send,
  Sparkles,
  Star,
} from 'lucide-react'
import data from '../../../../data/dummy_data.json'

export const safePersonal = data.personal || {}
export const safeSocials = data.socials || {}
export const safeStats = data.stats || {}
export const safeSkills = data.skills || []
export const safeProjects = data.projects || []
export const safeExperience = data.experience || []
export const safeTestimonials = data.testimonials || []
   
export function useBookScale() {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const updateScale = () => {
      const widthScale = (window.innerWidth - 40) / 380
      const heightScale = (window.innerHeight - 180) / 620
      const nextScale = Math.min(1, Math.max(0.7, Math.min(widthScale, heightScale)))
      setScale(nextScale)
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  return scale
}

export function useBookSize() {
  const [size, setSize] = useState({ width: 1280, height: 720 })

  useEffect(() => {
    const updateSize = () => {
      const width = Math.max(360, window.innerWidth)
      const height = Math.max(560, window.innerHeight)
      setSize({ width, height })
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return size
}

// UPDATED SCROLL LOGIC HERE
export function useWheelFlip(bookRef) {
  const lockRef = useRef(false)
  const timerRef = useRef(null)

  useEffect(() => {
    const handleWheel = (event) => {
      const pageFlip = bookRef.current?.pageFlip?.()
      if (!pageFlip) return

      // 1. Intelligent Scroll Detection
      const target = event.target
      const scrollableParent = target.closest('.custom-scrollbar, .overflow-y-auto')
      
      if (scrollableParent) {
        const isAtTop = scrollableParent.scrollTop === 0
        const isAtBottom = scrollableParent.scrollHeight - scrollableParent.scrollTop <= scrollableParent.clientHeight + 1

        // If scrolling UP and not at the top of the div, let the div scroll (do not flip)
        if (event.deltaY < 0 && !isAtTop) return
        
        // If scrolling DOWN and not at the bottom of the div, let the div scroll (do not flip)
        if (event.deltaY > 0 && !isAtBottom) return
      }

      // 2. Ignore micro-scrolls (trackpads)
      if (Math.abs(event.deltaY) < 15) return

      // 3. Debounce lock to prevent double-flipping
      if (lockRef.current) return

      // Only prevent the default window scroll if we are definitely flipping a page
      event.preventDefault()

      // 4. Trigger the native flip animations
      if (event.deltaY > 0) {
        pageFlip.flipNext() // Triggers forward animation
      } else if (event.deltaY < 0) {
        pageFlip.flipPrev() // Triggers valid backward animation
      }

      // Lock the flip for the duration of the animation (match this to flippingTime in index.jsx)
      lockRef.current = true
      // store timer id so it can be cleared on unmount
      timerRef.current = window.setTimeout(() => {
        lockRef.current = false
        timerRef.current = null
      }, 750)
    }

    // Must be passive: false to allow event.preventDefault()
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [bookRef])
}

const subAccent = 'text-slate-400'

export function SectionHeader({ chapter, title, subtitle, tone = 'dark' }) {
  const titleClass = tone === 'light' ? 'text-slate-900' : 'text-white'
  const subtitleClass = tone === 'light' ? 'text-slate-600' : 'text-slate-300'
  const ruleClass = tone === 'light' ? 'bg-slate-900/15' : 'bg-white/15'

  return (
    <div className="mb-5 sm:mb-6">
      <div className={`mb-2 text-[10px] uppercase tracking-[0.34em] ${subAccent}`}>
        Chapter {chapter}
      </div>
      <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${titleClass}`}>
        {title}
      </h2>
      {subtitle ? (
        <p className={`mt-2 max-w-2xl text-sm sm:text-[15px] leading-7 ${subtitleClass}`}>
          {subtitle}
        </p>
      ) : null}
      <div className={`mt-4 h-px w-24 ${ruleClass}`} />
    </div>
  )
}

export function Badge({ label, tone = 'light' }) {
  const bgClass = tone === 'light' ? 'bg-slate-900/5 text-slate-700' : 'bg-white/10 text-white/80'
  const borderClass = tone === 'light' ? 'border-slate-900/10' : 'border-white/15'

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${bgClass} ${borderClass}`}>
      {label}
    </span>
  )
}

export function MetricCard({ value, label, tone = 'light' }) {
  const titleClass = tone === 'light' ? 'text-slate-900' : 'text-white'
  const labelClass = tone === 'light' ? 'text-slate-500' : 'text-slate-400'
  const borderClass = tone === 'light' ? 'border-slate-900/10' : 'border-white/10'

  return (
    <div className={`rounded-2xl border ${borderClass} px-4 py-4 backdrop-blur-sm`}>
      <div className={`text-2xl font-black tracking-tight ${titleClass}`}>{value}</div>
      <div className={`mt-1 text-[10px] uppercase tracking-[0.22em] ${labelClass}`}>{label}</div>
    </div>
  )
}

export function PageFrame({ pageNumber, totalPages, children, accent = '#2563eb' }) {
  return (
    <div className="h-full w-full overflow-hidden">
      <div className="relative flex h-full w-full flex-col bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.08),_transparent_40%),linear-gradient(180deg,#050816_0%,#0b1120_100%)]">
        <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: accent }} />
        <div className="flex items-center justify-between px-5 pt-3 text-[10px] uppercase tracking-[0.3em]">
          <span className="text-slate-400">Page Turner</span>
          <span className="text-slate-500">{String(pageNumber).padStart(2, '0')} / {totalPages}</span>
        </div>
        <div className="mx-5 mt-3 h-px border-white/10 bg-white/10" />
        <div className="flex-1 px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">{children}</div>
      </div>
    </div>
  )
}

export function PageShell({ children, refProp }) {
  return (
    <div ref={refProp} className="h-full w-full overflow-hidden">
      {children}
    </div>
  )
}

export function DarkCover({ children, refProp }) {
  return (
    <div ref={refProp} className="relative flex h-full w-full flex-col overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_38%),radial-gradient(circle_at_80%_20%,_rgba(124,58,237,0.16),_transparent_30%),linear-gradient(160deg,#03050c_0%,#070b16_50%,#03050c_100%)] text-white">
      <div className="absolute inset-0 opacity-[0.18] bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-cyan-500/10 blur-[110px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-12%] right-[-8%] w-[45vw] h-[45vw] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute -right-16 top-8 h-40 w-40 rounded-full border border-cyan-400/10" />
      <div className="absolute -left-10 bottom-10 h-28 w-28 rounded-full border border-violet-400/10" />
      <div className="relative z-10 flex h-full flex-col px-6 py-6 sm:px-8 sm:py-8">{children}</div>
    </div>
  )
}

export function CoverStats() {
  const years = safeStats.yearsExperience ?? 0
  const projects = safeStats.projectsCompleted ?? 0
  const clients = safeStats.happyClients ?? 0
  return (
    <div className="grid grid-cols-3 gap-3 pt-2 sm:gap-4">
      <MetricCard value={`${years}+`} label="Years" tone="dark" />
      <MetricCard value={`${projects}+`} label="Projects" tone="dark" />
      <MetricCard value={`${clients}+`} label="Clients" tone="dark" />
    </div>
  )
}

export {
  ArrowUpRight,
  Briefcase,
  Code2,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Palette,
  Quote,
  Send,
  Sparkles,
  Star,
  motion,
}