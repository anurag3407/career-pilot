import React, { useState, useEffect } from 'react'
import { PageFrame, safeProjects, ArrowUpRight, Github } from './shared'

const ProjectsPage = React.forwardRef(function ProjectsPage(_, ref) {
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    const handleResize = () => setItemsPerPage(window.innerWidth < 768 ? 3 : 6)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Clamp currentPage when itemsPerPage or safeProjects change
  useEffect(() => {
    const newTotalPages = Math.max(1, Math.ceil((safeProjects?.length || 0) / itemsPerPage))
    setCurrentPage((prev) => Math.min(prev, Math.max(0, newTotalPages - 1)))
  }, [itemsPerPage, safeProjects])

  const totalPages = Math.ceil((safeProjects?.length || 0) / itemsPerPage)
  const currentProjects = (safeProjects || []).slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  return (
    <div ref={ref} className="h-full w-full bg-[#020617] overflow-hidden">
      <PageFrame pageNumber={3} totalPages={7} accent="#22d3ee">
        <div className="flex flex-col h-full px-4 md:px-8 py-4 max-w-[1400px] mx-auto">
          
          {/* Header */}
          <div className="shrink-0 mb-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-cyan-400 mb-1">// Chapter III</div>
            <h2 className="text-2xl md:text-3xl font-black text-white bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">Featured Work</h2>
            <div className="mt-1 h-0.5 w-12 bg-gradient-to-r from-cyan-500 to-violet-500" />
          </div>

          {/* Grid Area */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 content-start pb-4">
            {currentProjects.map((project, index) => (
              <div key={index} className="group flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-[#080c14] hover:border-cyan-500/50 transition-all duration-300">
                <div className="h-20 md:h-28 bg-slate-950 flex items-center justify-center text-[9px] text-cyan-900 font-mono">
                   {project.image ? <img src={project.image} alt={project.title || project.name || 'Project preview'} className="w-full h-full object-cover" /> : "PREVIEW"}
                </div>
                <div className="p-3 flex flex-col justify-between flex-1">
                  <h3 className="text-xs font-bold text-white truncate">{project.title}</h3>
                  <p className="text-[10px] text-slate-400 mt-1 mb-2 line-clamp-2">{project.description}</p>
                  <div className="flex gap-3 mt-auto">
                    {project.liveUrl && <a href={project.liveUrl} className="text-[9px] text-cyan-400 hover:underline">LIVE</a>}
                    {project.githubUrl && <a href={project.githubUrl} className="text-[9px] text-slate-400 hover:text-white">SOURCE</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          <div className="shrink-0 pt-3 border-t border-slate-800 flex justify-between items-center">
            <span className="text-[9px] font-mono text-slate-600">PAGE {currentPage + 1} / {totalPages || 1}</span>
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

export default ProjectsPage