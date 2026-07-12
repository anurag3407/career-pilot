import React, { useState, useEffect } from 'react'
import { Briefcase, PageFrame, safeExperience } from './shared'

const ExperiencePage = React.forwardRef(function ExperiencePage(_, ref) {
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    const handleResize = () => setItemsPerPage(window.innerWidth < 768 ? 2 : 3)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Clamp currentPage when itemsPerPage or data change
  useEffect(() => {
    const newTotalPages = Math.max(1, Math.ceil((safeExperience?.length || 0) / itemsPerPage))
    setCurrentPage((prev) => Math.min(prev, Math.max(0, newTotalPages - 1)))
  }, [itemsPerPage, safeExperience])

  const paginatedData = (safeExperience || []).slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
  const totalPages = Math.ceil((safeExperience?.length || 0) / itemsPerPage)

  return (
    <div ref={ref} className="h-full w-full bg-[#020617] overflow-hidden">
      <PageFrame pageNumber={4} totalPages={7} accent="#8b5cf6">
        <div className="flex flex-col h-full px-4 md:px-12 py-4 max-w-5xl mx-auto md:-mt-8">
          
          <div className="shrink-0 mb-4 text-center md:text-left">
             <div className="text-[10px] font-mono text-cyan-400 mb-1 uppercase tracking-[0.4em]">// Chapter IV</div>
             <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Experience</h2>
             <div className="mt-1 h-0.5 w-12 bg-gradient-to-r from-cyan-500 to-violet-500 md:mx-0 mx-auto" />
          </div>

          <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
             {paginatedData.map((item, idx) => (
               <div key={idx} className="flex gap-4 p-4 rounded-xl border border-slate-800 bg-[#080c14] hover:border-violet-500/40 transition-all group">
                 <div className="mt-1 shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 group-hover:bg-violet-500/20">
                        <Briefcase size={14} />
                    </div>
                 </div>
                 <div className="min-w-0">
                   <h3 className="text-xs md:text-sm font-bold text-white truncate">{item.role}</h3>
                   <div className="text-[9px] md:text-[10px] text-cyan-400/80 font-mono mb-1.5 uppercase tracking-wider">{item.company} | {item.period}</div>
                   <p className="text-[10px] md:text-[11px] text-slate-400 leading-relaxed line-clamp-3 font-light">{item.description}</p>
                 </div>
               </div>
             ))}
          </div>

          {/* Buttons: Fixed to Career Pilot Cyan Theme */}
          <div className="shrink-0 pt-4 border-t border-slate-800 flex justify-between items-center mt-auto">
            <span className="text-[9px] text-slate-600 font-mono">PAGE {currentPage + 1} / {totalPages || 1}</span>
            <div className="flex gap-2">
              <button type="button" 
                disabled={currentPage === 0} 
                onClick={() => setCurrentPage(p => p - 1)} 
                className="px-4 py-1.5 text-[9px] border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-20 uppercase font-mono tracking-widest transition-colors"
              >
                Prev
              </button>
              <button type="button" 
                disabled={currentPage >= totalPages - 1} 
                onClick={() => setCurrentPage(p => p + 1)} 
                className="px-4 py-1.5 text-[9px] border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-20 uppercase font-mono tracking-widest transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </PageFrame>
    </div>
  )
})

export default ExperiencePage