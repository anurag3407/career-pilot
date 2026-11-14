import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronRight } from 'lucide-react'

/* Flight Deck editorial chips — literal class strings so Tailwind can see
   them (the old runtime-built bg-${color} classes never compiled). */
const CHIP = {
  primary: 'bg-primary/10 border-primary/20 text-primary',
  secondary: 'bg-secondary/10 border-secondary/20 text-secondary',
  amber: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
  emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
  foreground: 'bg-muted border-border text-foreground',
}

export default function HubLayout({ icon: Icon, title, description, color = 'primary', breadcrumb, children, stats }) {
  const chip = CHIP[color] || CHIP.primary

  return (
    <div className="min-h-screen bg-background">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
        >
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-semibold">{breadcrumb || title}</span>
        </motion.div>

        {/* Hub Header — Flight Deck editorial: quiet surface, blueprint grid,
           mono eyebrow, one primary accent */}
        <motion.header
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="relative mb-10 rounded-2xl border border-border bg-card overflow-hidden"
        >
          <div className="fd-grid-bg pointer-events-none absolute inset-0" />
          <div className="relative p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-4">
              {breadcrumb || title}
            </p>
            <div className="flex items-start gap-5">
              <div className={`w-14 h-14 rounded-xl border flex items-center justify-center shrink-0 ${chip}`}>
                <Icon className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2">
                  {title}
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
                  {description}
                </p>
              </div>
            </div>

            {/* Stats Row */}
            {stats && stats.length > 0 && (
              <div className="relative flex flex-wrap gap-6 mt-6 pt-6 border-t border-border">
                {stats.map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-lg ${stat.bg || 'bg-muted'} flex items-center justify-center`}>
                      <stat.icon className={`w-4.5 h-4.5 ${stat.color || 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground leading-none tabular-nums">{stat.value}</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.header>

        {/* Tool Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/50 mb-6 flex items-center gap-3">
            <span className="w-1.5 h-4 rounded-full bg-primary" />
            Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
