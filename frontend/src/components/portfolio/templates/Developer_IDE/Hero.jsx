import React from 'react';
import { Terminal, Code2, FolderOpen, FileText, Sparkles } from 'lucide-react';

export default function Hero({ data }) {
  if (!data || !data.personal) return null;
  const { name, role, bio } = data.personal;

  return (
    <section id="hero" className="w-full min-h-screen flex items-center justify-center px-4 py-16" style={{ backgroundColor: "#0d1117", fontFamily: "'Fira Code', 'JetBrains Mono', monospace" }}>
      <div className="w-full max-w-5xl">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Left Side: Welcome Art */}
          <div className="w-full md:w-1/2">
            <div className="inline-flex items-center justify-center p-4 mb-8 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-lg">
              <Code2 size={48} className="text-[#4ade80]" />
            </div>
            <h1 className="text-5xl font-bold mb-4 text-[#e6edf3] tracking-tight font-sans">
              {name || "Developer"}
            </h1>
            <h2 className="text-2xl text-[#79c0ff] mb-6 font-mono">
              {role || "Software Engineer"}
            </h2>
            <p className="text-[#8b949e] text-lg leading-relaxed mb-8 max-w-lg font-sans">
              {bio || "Welcome to my integrated development environment portfolio."}
            </p>
            <div className="flex gap-4 font-sans">
              <a href="#projects" className="px-6 py-3 rounded-md bg-[#238636] hover:bg-[#2ea043] transition-colors text-white font-medium flex items-center gap-2 border border-[#2ea043]">
                <Sparkles size={18} />
                Run Projects
              </a>
              <a href="#contact" className="px-6 py-3 rounded-md bg-[#21262d] border border-[#30363d] hover:border-[#8b949e] transition-colors text-[#e6edf3] font-medium flex items-center gap-2">
                <Terminal size={18} />
                Init Contact
              </a>
            </div>
          </div>
          
          {/* Right Side: Quick Links / Start */}
          <div className="w-full md:w-1/2 font-sans">
            <div className="rounded-xl overflow-hidden" style={{ background: "#0d1117", border: "1px solid #30363d", boxShadow: "0 0 0 1px #21262d, 0 8px 64px rgba(0,0,0,0.6)" }}>
              <div className="px-6 py-4 border-b border-[#30363d] bg-[#161b22]">
                <h3 className="text-[#e6edf3] font-semibold text-sm uppercase tracking-wider">Start</h3>
              </div>
              <div className="p-4 space-y-1">
                <a href="#about" className="flex items-center gap-3 p-3 rounded-md hover:bg-[#161b22] text-[#79c0ff] transition-colors group cursor-pointer">
                  <FileText size={18} className="text-[#8b949e] group-hover:text-[#4ade80] transition-colors" />
                  <span className="font-medium">New File...</span>
                  <span className="ml-auto text-xs text-[#6e7681] font-mono">⌘N</span>
                </a>
                <a href="#projects" className="flex items-center gap-3 p-3 rounded-md hover:bg-[#161b22] text-[#79c0ff] transition-colors group cursor-pointer">
                  <FolderOpen size={18} className="text-[#8b949e] group-hover:text-[#4ade80] transition-colors" />
                  <span className="font-medium">Open Portfolio Workspace...</span>
                  <span className="ml-auto text-xs text-[#6e7681] font-mono">⌘O</span>
                </a>
                <a href="#experience" className="flex items-center gap-3 p-3 rounded-md hover:bg-[#161b22] text-[#79c0ff] transition-colors group cursor-pointer">
                  <Terminal size={18} className="text-[#8b949e] group-hover:text-[#4ade80] transition-colors" />
                  <span className="font-medium">Clone Repository...</span>
                </a>
              </div>
              <div className="px-6 py-4 border-y border-[#30363d] bg-[#161b22]">
                <h3 className="text-[#e6edf3] font-semibold text-sm uppercase tracking-wider">Recent</h3>
              </div>
              <div className="p-4 space-y-1">
                <div className="flex items-center gap-3 p-3 text-[#8b949e] hover:bg-[#161b22] rounded-md transition-colors cursor-pointer group">
                  <FileText size={16} className="group-hover:text-[#e6edf3]" />
                  <span className="text-[#e6edf3] truncate font-medium group-hover:text-[#79c0ff] transition-colors">learning-new-tech.js</span>
                  <span className="ml-auto text-xs opacity-50 truncate hidden sm:block">~/Documents/continuous-learning</span>
                </div>
                <div className="flex items-center gap-3 p-3 text-[#8b949e] hover:bg-[#161b22] rounded-md transition-colors cursor-pointer group">
                  <FileText size={16} className="group-hover:text-[#e6edf3]" />
                  <span className="text-[#e6edf3] truncate font-medium group-hover:text-[#79c0ff] transition-colors">bug-fixes.rs</span>
                  <span className="ml-auto text-xs opacity-50 truncate hidden sm:block">~/Projects/open-source</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
