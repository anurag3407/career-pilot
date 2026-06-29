import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronRight } from 'lucide-react'

export default function HubLayout({ icon: Icon, title, description, color = 'primary', breadcrumb, children, stats }) {
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

        {/* Hub Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 p-8 glass rounded-3xl glow border-border/50 relative overflow-hidden"
        >
          {/* Decorative gradient blob */}
          <div className={`absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-${color}/10 rounded-full blur-3xl animate-pulse pointer-events-none`} />
          <div className={`absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-${color}/5 rounded-full blur-2xl pointer-events-none`} />

          <div className="relative flex items-start gap-5">
            <div className={`w-16 h-16 rounded-2xl bg-${color}/15 border border-${color}/20 flex items-center justify-center shrink-0`}>
              <Icon className={`w-8 h-8 text-${color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-2">
                {title}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground font-medium max-w-2xl">
                {description}
              </p>
            </div>
          </div>

          {/* Stats Row */}
          {stats && stats.length > 0 && (
            <div className="relative flex flex-wrap gap-6 mt-6 pt-6 border-t border-border/50">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-lg ${stat.bg || 'bg-muted'} flex items-center justify-center`}>
                    <stat.icon className={`w-4.5 h-4.5 ${stat.color || 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="text-lg font-black text-foreground leading-none">{stat.value}</p>
                    <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Tool Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-primary" />
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
