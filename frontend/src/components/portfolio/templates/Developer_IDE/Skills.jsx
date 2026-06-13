import React from 'react';
import { Circle } from 'lucide-react';

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <section id="skills" className="w-full flex items-center justify-center px-4 py-16" style={{ backgroundColor: "#0d1117", fontFamily: "'Fira Code', 'JetBrains Mono', monospace" }}>
      <div className="w-full max-w-5xl rounded-xl overflow-hidden" style={{ background: "#0d1117", border: "1px solid #30363d", boxShadow: "0 0 0 1px #21262d, 0 8px 64px rgba(0,0,0,0.6)" }}>
        {/* Window Chrome */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#161b22", borderBottom: "1px solid #30363d" }}>
          <Circle size={12} fill="#ff5f57" stroke="none" />
          <Circle size={12} fill="#febc2e" stroke="none" />
          <Circle size={12} fill="#28c840" stroke="none" />
          <span className="ml-2 text-xs text-[#6e7681]">package.json</span>
        </div>
        
        {/* Code */}
        <div className="p-6 text-sm text-[#e6edf3] overflow-auto max-h-[600px] flex">
          <div className="select-none pr-4 text-right text-xs font-mono" style={{ color: "#4b5563", minWidth: "2.5rem" }}>
            {Array.from({ length: skills.length + 4 }, (_, i) => (
              <div key={i} className="leading-6">{i + 1}</div>
            ))}
          </div>
          <div className="flex-1 font-mono">
            <div className="text-[#6e7681]">{"{"}</div>
            <div className="pl-4">
              <span className="text-[#79c0ff]">"name"</span>
              <span className="text-[#6e7681]">: </span>
              <span className="text-[#a5d6ff]">"developer-skills"</span>
              <span className="text-[#6e7681]">,</span>
            </div>
            <div className="pl-4">
              <span className="text-[#79c0ff]">"dependencies"</span>
              <span className="text-[#6e7681]">: {"{"}</span>
            </div>
            {skills.map((skill, i) => {
              const skillName = typeof skill === 'string' ? skill : (skill.name || 'unknown');
              const skillLevel = typeof skill === 'string' ? 'latest' : (skill.level || 'latest');
              const propName = skillName.toLowerCase().replace(/\s+/g, '-');
              
              return (
                <div key={i} className="pl-8 group hover:bg-[#161b22] inline-block w-full rounded py-0.5 transition-colors">
                  <span className="text-[#79c0ff]">"{propName}"</span>
                  <span className="text-[#6e7681]">: </span>
                  <span className="text-[#a5d6ff]">"^{skillLevel}"</span>
                  {i < skills.length - 1 && <span className="text-[#6e7681]">,</span>}
                  <span className="ml-4 text-[#8b949e] opacity-0 group-hover:opacity-100 transition-opacity italic">// {skillName}</span>
                </div>
              );
            })}
            <div className="pl-4 text-[#6e7681]">{"}"}</div>
            <div className="text-[#6e7681]">{"}"}</div>
          </div>
        </div>
      </div>
    </section>
  );
}