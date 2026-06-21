import React from 'react';
import { Circle, MessageSquare, CheckCircle } from 'lucide-react';

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="w-full flex items-center justify-center px-4 py-16" style={{ backgroundColor: "#0d1117", fontFamily: "'Fira Code', 'JetBrains Mono', monospace" }}>
      <div className="w-full max-w-5xl rounded-xl overflow-hidden" style={{ background: "#0d1117", border: "1px solid #30363d", boxShadow: "0 0 0 1px #21262d, 0 8px 64px rgba(0,0,0,0.6)" }}>
        {/* Window Chrome */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#161b22", borderBottom: "1px solid #30363d" }}>
          <Circle size={12} fill="#ff5f57" stroke="none" />
          <Circle size={12} fill="#febc2e" stroke="none" />
          <Circle size={12} fill="#28c840" stroke="none" />
          <span className="ml-2 text-xs text-[#6e7681]">GitHub - Issues</span>
        </div>
        
        <div className="bg-[#161b22] border-b border-[#30363d] px-6 py-4 flex gap-4 text-sm font-sans">
          <div className="flex items-center gap-2 text-[#e6edf3] font-medium">
            <CheckCircle size={16} className="text-[#4ade80]" />
            {testimonials.length} Closed
          </div>
        </div>

        <div className="divide-y divide-[#30363d] font-sans">
          {testimonials.map((t, i) => (
            <div key={i} className="p-5 hover:bg-[#161b22] transition-colors flex gap-4">
              <MessageSquare size={18} className="text-[#8b949e] mt-1 shrink-0" />
              <div className="flex-1">
                <div className="text-[#e6edf3] font-bold text-base mb-1 hover:text-[#4ade80] cursor-pointer inline-block">
                  {t.content.length > 60 ? `${t.content.substring(0, 60)}...` : t.content}
                </div>
                <div className="text-sm text-[#8b949e] mb-4">
                  #{1000 + i} closed by <span className="font-semibold text-[#a5d6ff] cursor-pointer hover:underline">{t.author}</span> ({t.role})
                </div>
                <div className="p-4 rounded-md border border-[#30363d] bg-[#0d1117] text-[#e6edf3] text-sm relative">
                  <div className="absolute -top-[7px] left-6 w-3 h-3 bg-[#0d1117] border-l border-t border-[#30363d] rotate-45"></div>
                  <p className="leading-relaxed whitespace-pre-wrap font-mono text-xs">
                    {t.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}