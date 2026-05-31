import React from 'react'
import { safePersonal } from './shared'

const BackCoverPage = React.forwardRef(function BackCoverPage(_, ref) {
  return (
    <div ref={ref} className="h-full w-full overflow-hidden">
      <div className="relative flex h-full w-full flex-col items-center justify-center bg-[#020617] text-white">
        
        {/* Subtle Cyan Glow Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.1),_transparent_70%)]" />
        
        {/* End of Book Badge */}
        <div className="z-10 mb-6 rounded-full border border-cyan-500/30 bg-cyan-950/20 px-5 py-2 text-[10px] uppercase tracking-[0.35em] text-cyan-400">
          End of Book
        </div>
        
        {/* Name */}
        <div className="z-10 text-center text-3xl font-black tracking-tight sm:text-4xl text-white">
          {safePersonal.name || 'Your Name'}
        </div>
        
        {/* Footer Text */}
        <div className="z-10 mt-3 text-[10px] uppercase tracking-[0.3em] text-cyan-400/50 font-mono">
          Thanks for turning the pages.
        </div>
      </div>
    </div>
  )
})

export default BackCoverPage