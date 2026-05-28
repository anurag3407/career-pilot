import React from 'react'
import { motion, Badge, PageFrame, safePersonal, safeStats } from './shared'
import data from '../../../../data/dummy_data.json'

const AboutPage = React.forwardRef(function AboutPage(_, ref) {
  const { name = 'Your Name', bio = '', avatar = '', location = 'Remote', title = 'Portfolio Creator' } = safePersonal

  // Strictly mapping to the requested schema data fields
  const summaryItems = [
    { label: 'Location', value: location },
    { label: 'Current Role', value: title },
    { label: 'Experience', value: `${safeStats?.yearsExperience ?? 0}+ Years` },
    { label: 'Completed', value: `${safeStats?.projectsCompleted ?? 0}+ Projects` },
  ]

  // Main staggered sequence orchestration
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.02,
      },
    },
  }

  // Smooth slide-up with a high-damping spring for clean entrance performance
  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 16 }
    },
  }

  return (
    <div ref={ref} className="h-full w-full overflow-hidden">
      <PageFrame pageNumber={1} totalPages={7} accent="#22d3ee">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="flex flex-col md:flex-row h-full items-center md:items-start justify-center md:justify-between gap-6 md:gap-12 px-4 sm:px-8 md:px-16 pb-8 max-w-6xl mx-auto"
        >
          
          {/* LEFT COLUMN: Large Desktop Profile Frame & Titles */}
          <div className="flex flex-col items-center md:items-start shrink-0 text-center md:text-left md:w-[40%] md:pt-8">
            
            {/* Header / Chapter Mark */}
            <motion.div variants={itemVariants} className="mb-4 md:mb-8">
              <motion.div 
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="text-[9px] md:text-xs font-mono uppercase tracking-[0.45em] text-cyan-400 mb-1.5"
              >
                // Chapter I
              </motion.div>
              <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-white tracking-tight">About Me</h2>
              <div className="mt-2 md:mt-3 h-0.5 w-16 bg-gradient-to-r from-cyan-500 to-transparent md:mx-0 mx-auto" />
            </motion.div>

            {/* Avatar Stack Container */}
            <div className="flex flex-col items-center md:items-start w-full">
              <motion.div 
                variants={itemVariants}
                whileHover={{ scale: 1.04 }}
                className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-52 md:w-52 lg:h-56 lg:w-56 overflow-hidden rounded-full border-2 border-slate-800 bg-slate-950 p-1 md:p-2 shadow-2xl transition-colors duration-500 group cursor-pointer"
              >
                {avatar ? (
                  <motion.img 
                    src={avatar} 
                    alt={name} 
                    className="h-full w-full object-cover rounded-full"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.4 }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] md:text-sm text-slate-600 font-mono">Avatar</div>
                )}
                {/* Ambient Radial Hover Glow Ring */}
                <div className="absolute inset-0 rounded-full ring-2 ring-cyan-500/0 group-hover:ring-cyan-500/40 group-hover:bg-cyan-500/5 transition-all duration-300 animate-pulse" />
              </motion.div>
              
              <motion.div variants={itemVariants} className="mt-4 md:mt-6 text-center md:text-left w-full">
                <h1 className="text-base sm:text-lg md:text-3xl lg:text-4xl font-black text-white tracking-tight break-words">
                  {name}
                </h1>
                <h3 className="text-xs md:text-sm lg:text-base text-cyan-400 font-bold mt-1 md:mt-2 tracking-widest uppercase font-mono bg-cyan-950/20 md:inline-block md:px-3 md:py-1 rounded-md border border-cyan-950/40">
                  {title}
                </h3>
              </motion.div>
            </div>
          </div>

          {/* RIGHT COLUMN: Big Text Frame & Springy Info Grid */}
          <div className="flex-1 min-h-0 w-full md:w-[60%] flex flex-col justify-start md:pt-8 gap-4 md:gap-6">
            
            {/* Expanded Bio Box with Ambient Glow */}
              <motion.div 
                variants={itemVariants}
                whileHover={{ borderColor: 'rgba(51,65,85,0.6)' }}
                className="w-full shrink-0 md:shrink overflow-y-auto max-h-[150px] md:max-h-[260px] custom-scrollbar rounded-xl md:rounded-2xl border border-slate-900 bg-gradient-to-br from-[#080c14] to-[#04070d] p-4 md:p-6 shadow-inner border-t-slate-800/40 transition-colors duration-300"
              >
              <p className="text-slate-300 text-xs sm:text-sm md:text-[15px] lg:text-base leading-relaxed md:leading-loose italic font-normal text-center md:text-left">
                {bio || 'Biography configuration log asset missing.'}
              </p>
            </motion.div>

            {/* Metrics Info Boxes Matrix */}
            <div className="grid grid-cols-2 gap-2 md:gap-4 w-full shrink-0">
              {summaryItems.map((item) => (
                <motion.div 
                  key={item.label}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -4, 
                    borderColor: 'rgba(34,211,238,0.35)', 
                    backgroundColor: 'rgba(11,15,25,0.6)',
                    boxShadow: '0 10px 25px -15px rgba(6,182,212,0.15)'
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  className="rounded-lg md:rounded-xl border border-slate-900 bg-[#0b0f19]/30 p-2.5 md:p-5 text-center md:text-left shadow-sm cursor-default transition-colors duration-300 relative overflow-hidden group"
                >
                  {/* Micro Border-top Shine Slide Effect on Hover */}
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                  
                  <div className="text-[8px] md:text-[10px] font-mono uppercase tracking-wider text-slate-500 group-hover:text-cyan-500/70 transition-colors duration-300">{item.label}</div>
                  <div className="mt-0.5 md:mt-1.5 text-xs md:text-base font-bold text-white truncate">{item.value}</div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Tag Badges Row (Shifted rightward on PC screens using md:pl-6) */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 md:gap-2 shrink-0 pt-4 md:pt-5 border-t border-slate-900/40 w-full md:pl-6"
            >
              {(data.portfolioTraits || ['Curious', 'Detail-driven', 'Reliable', 'Creative']).map((item) => (
                <motion.div
                  key={item}
                  whileHover={{ scale: 1.05, y: -1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <Badge label={item} tone="dark" />
                </motion.div>
              ))}
            </motion.div>

          </div>

        </motion.div>
      </PageFrame>
    </div>
  )
})

export default AboutPage