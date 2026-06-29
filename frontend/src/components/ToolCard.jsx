import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function ToolCard({ to, icon: Icon, title, description, color = 'primary', badge, onClick }) {
  const content = (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="group relative p-6 rounded-2xl bg-card border border-border overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 cursor-pointer h-full"
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Badge */}
      {badge && (
        <div className="absolute top-4 right-4 px-2 py-0.5 bg-primary/15 rounded-full text-[10px] text-primary font-black uppercase tracking-wider border border-primary/20">
          {badge}
        </div>
      )}

      {/* Icon */}
      <div className={`relative w-14 h-14 rounded-xl bg-${color}/10 border border-${color}/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-${color}/15 transition-all duration-300`}>
        <Icon className={`w-7 h-7 text-${color} transition-colors`} />
      </div>

      {/* Text */}
      <h3 className="relative text-lg font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="relative text-sm text-muted-foreground font-medium leading-relaxed">
        {description}
      </p>

      {/* Arrow indicator */}
      <div className="relative flex items-center gap-1.5 mt-4 text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
        <span>Open</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  )

  if (onClick) {
    return <div onClick={onClick}>{content}</div>
  }

  return (
    <Link to={to} className="block">
      {content}
    </Link>
  )
}
