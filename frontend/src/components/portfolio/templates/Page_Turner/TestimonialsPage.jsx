import React, { useState, useEffect } from 'react'
import { PageFrame, safeTestimonials, Quote } from './shared'

const TestimonialsPage = React.forwardRef(function TestimonialsPage(_, ref) {
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    const handleResize = () => setItemsPerPage(window.innerWidth < 768 ? 2 : 3)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Ensure currentPage stays in-range when itemsPerPage or data change
  useEffect(() => {
    const newTotalPages = Math.max(1, Math.ceil((safeTestimonials?.length || 0) / itemsPerPage))
    setCurrentPage((prev) => Math.min(prev, Math.max(0, newTotalPages - 1)))
  }, [itemsPerPage, safeTestimonials])

  const paginatedData = (safeTestimonials || []).slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
  const totalPages = Math.ceil((safeTestimonials?.length || 0) / itemsPerPage)

  return (
    <div ref={ref} className="h-full w-full bg-[#020617] overflow-hidden">
      <PageFrame pageNumber={5} totalPages={7} accent="#22c55e">
        <div className="flex flex-col h-full px-4 md:px-8 py-4 max-w-6xl mx-auto">
          
          <div className="shrink-0 mb-4">
            <div className="text-[10px] font-mono text-cyan-400 mb-1">// Chapter V</div>
            <h2 className="text-2xl font-black text-white">Testimonials</h2>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 content-start">
            {paginatedData.map((item, idx) => (
              <div key={idx} className="flex flex-col p-3 rounded-lg border border-slate-800 bg-[#080c14] hover:border-cyan-500/30 transition-colors">
                <Quote size={12} className="text-cyan-500/50 mb-2" />
                <p className="text-[10px] text-slate-300 italic mb-3 flex-1">{item.text}</p>
                <div className="mt-auto pt-2 border-t border-slate-800 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-slate-800" />
                  <div>
                    <div className="text-[10px] font-bold text-white">{item.name}</div>
                    <div className="text-[8px] text-cyan-400 font-mono">{item.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="shrink-0 pt-3 border-t border-slate-800 flex justify-between items-center">
            <span className="text-[9px] text-slate-600 font-mono">PAGE {currentPage + 1} / {totalPages || 1}</span>
            <div className="flex gap-2">
              <button disabled={currentPage === 0} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 text-[9px] border border-cyan-500/30 text-cyan-400 disabled:opacity-20 uppercase font-mono">Prev</button>
              <button disabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 text-[9px] border border-cyan-500/30 text-cyan-400 disabled:opacity-20 uppercase font-mono">Next</button>
            </div>
          </div>
        </div>
      </PageFrame>
    </div>
  )
})

export default TestimonialsPage