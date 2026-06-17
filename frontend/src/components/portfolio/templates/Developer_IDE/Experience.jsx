import React from 'react';
import { Terminal as TerminalIcon, Circle } from 'lucide-react';

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;

  return (
    <section id="experience" className="w-full flex items-center justify-center px-4 py-16" style={{ backgroundColor: "#0d1117", fontFamily: "'Fira Code', 'JetBrains Mono', monospace" }}>
      <div className="w-full max-w-5xl rounded-xl overflow-hidden" style={{ background: "#0d1117", border: "1px solid #30363d", boxShadow: "0 0 0 1px #21262d, 0 8px 64px rgba(0,0,0,0.6)" }}>
        {/* Window Chrome */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#161b22", borderBottom: "1px solid #30363d" }}>
          <Circle size={12} fill="#ff5f57" stroke="none" />
          <Circle size={12} fill="#febc2e" stroke="none" />
          <Circle size={12} fill="#28c840" stroke="none" />
          <span className="ml-2 text-xs text-[#6e7681]">bash - git log</span>
        </div>
        {/* Content */}
        <div className="p-6 text-sm text-[#e6edf3] overflow-auto max-h-[600px]" style={{ scrollbarWidth: "thin", scrollbarColor: "#30363d transparent" }}>
          <div className="mb-6">
            <span className="text-[#4ade80]">user@macbook</span>
            <span className="text-[#e6edf3]">:</span>
            <span className="text-[#3b82f6]">~/portfolio</span>
            <span className="text-[#e6edf3]">$ git log --experience</span>
          </div>
          
          <div className="space-y-2 border-l-2 border-[#30363d] ml-2">
            {experience.map((exp, i) => {
              const commitHash = Math.random().toString(16).substring(2, 10);
              return (
                <div key={i} className="mb-8 relative pl-6">
                  {/* Timeline dot */}
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#d2a8ff] shadow-[0_0_8px_#d2a8ff]" />
                  
                  <div className="font-mono">
                    <div className="text-[#d2a8ff] mb-1">commit {commitHash}</div>
                    <div className="text-[#79c0ff]">Author: {exp.company} &lt;jobs@{exp.company?.toLowerCase().replace(/\s+/g, '') || 'company'}.com&gt;</div>
                    <div className="text-[#6e7681] mb-4">Date:   {exp.startDate} - {exp.endDate || 'Present'}</div>
                    
                    <div className="bg-[#161b22] border border-[#30363d] rounded-md p-4 text-[#e6edf3]">
                      <div className="font-bold text-base mb-2 text-[#4ade80]">{exp.title}</div>
                      <div className="text-[#8b949e] whitespace-pre-line leading-relaxed">
                        {exp.description}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-2 text-[#4ade80]">
            <TerminalIcon size={14} />
            <span className="animate-pulse">_</span>
          </div>
        </div>
      </div>
    </section>
  );
}