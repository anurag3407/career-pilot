import React, { useMemo } from 'react'
import { motion, PageFrame, Palette, Briefcase, Code2, MetricCard, safeSkills, safeStats } from './shared'

const SkillsPage = React.forwardRef(function SkillsPage(_, ref) {
  const groupedSkills = useMemo(() => {
    const groups = {}
    const skillsList = safeSkills || []
    skillsList.forEach((skill) => {
      const group = skill.category || 'Core Stack'
      if (!groups[group]) groups[group] = []
      groups[group].push(skill)
    })
    return groups
  }, [])

  const categories = Object.keys(groupedSkills)

  return (
    <div ref={ref} className="h-full w-full bg-[#020617] overflow-hidden">
      <PageFrame pageNumber={2} totalPages={7} accent="#22d3ee">
        {/* Main Wrapper: Responsive spacing */}
        <div className="flex flex-col h-full w-full max-w-7xl mx-auto px-2 md:px-12 py-2 md:py-6">
          
          {/* Header: Shrink-0 keeps it from pushing content down */}
          <div className="shrink-0 mb-2 md:mb-6">
            <div className="text-[8px] md:text-xs font-mono uppercase tracking-[0.2em] text-cyan-400">// Chapter II</div>
            <h2 className="text-xl md:text-4xl font-black text-white tracking-tight">Technical Arsenal</h2>
          </div>

          {/* Content Area: flex-1 allows filling space, overflow-y-auto handles overflow */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col md:flex-row gap-2 md:gap-8">
            
            {/* Grid Area */}
            <div className="flex-1 grid gap-2 md:gap-6 grid-cols-1 sm:grid-cols-2">
              {categories.slice(0, 4).map((category) => (
                <div key={category} className="rounded-xl border border-slate-800 bg-[#080c14] p-2 md:p-6 flex flex-col hover:border-cyan-500/30 transition-all">
                  <div className="mb-2 md:mb-4 flex items-center gap-2">
                    <div className="flex h-6 w-6 md:h-10 md:w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {category.toLowerCase().includes('design') ? <Palette size={14} /> : 
                       category.toLowerCase().includes('backend') ? <Briefcase size={14} /> : <Code2 size={14} />}
                    </div>
                    <div className="text-[10px] md:text-lg font-black text-white uppercase tracking-wider truncate">{category}</div>
                  </div>

                  <div className="space-y-1.5 md:space-y-3">
                    {groupedSkills[category].slice(0, 3).map((skill) => (
                      <div key={skill.name}>
                        <div className="mb-0.5 flex items-center justify-between text-[8px] md:text-sm">
                          <span className="text-slate-300 font-medium truncate">{skill.name}</span>
                          <span className="text-cyan-400 font-mono font-bold">{skill.level}%</span>
                        </div>
                        <div className="h-1 md:h-2 w-full rounded-full bg-slate-900 border border-slate-800">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500" 
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar Stats: Collapsed on mobile, expanded on PC */}
            <div className="md:w-[30%] flex flex-col gap-2 md:gap-6">
              <div className="rounded-xl border border-slate-800 bg-[#080c14] p-3 md:p-6 text-white">
                <div className="text-[8px] md:text-xs font-mono uppercase tracking-[0.2em] text-cyan-400 mb-2 md:mb-4">Capabilities</div>
                <div className="flex flex-wrap gap-1 md:gap-2">
                  {safeSkills.slice(0, 10).map((skill) => (
                    <span key={skill.name} className="px-2 py-0.5 md:px-3 md:py-1 bg-slate-950 text-slate-300 text-[8px] md:text-sm font-mono rounded border border-slate-800">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 md:gap-4 shrink-0">
                <MetricCard value={safeSkills.length} label="Skills" tone="dark" />
                <MetricCard value={categories.length} label="Groups" tone="dark" />
                <MetricCard value={`${safeStats?.yearsExperience ?? 0}+`} label="Years" tone="dark" />
              </div>
            </div>
          </div>
        </div>
      </PageFrame>
    </div>
  )
})

export default SkillsPage