import React from "react";
import { Download, Eye, Terminal } from "lucide-react";

export default function ResumeCTA() {
  return (
    <section className="bg-black px-6 py-20 md:px-12 font-mono border-t border-green-500/10 relative overflow-hidden">
      {/* Retro CRT Scanline Accent Layer */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none z-20 opacity-60"></div>

      {/* Injecting True Terminal Caret Blinking Steps Keyframes via inline style tag */}
      <style>{`
        @keyframes terminal-snap-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .animate-terminal-cursor {
          animation: terminal-snap-blink 1s steps(2) infinite;
        }
      `}</style>

      {/* Terminal Window Container - Reinstated max-w-5xl & bg-zinc-950 high glow specs */}
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-green-500/30 bg-zinc-950 shadow-[0_0_40px_rgba(34,197,94,0.15)] relative z-10">
        
        {/* Terminal Window Header with terminal-cli shifted cleanly to the corner right */}
        <div className="flex items-center justify-between border-b border-green-500/20 px-4 py-3 select-none">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500"></span>
            <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
            <span className="h-3 w-3 rounded-full bg-green-500"></span>
          </div>

          <div className="flex items-center gap-2 text-sm text-green-400 font-mono ml-auto">
            <Terminal size={16} />
            <span>terminal-CLI</span>
          </div>
        </div>

        {/* Terminal Workspace Viewport - Size increased to text-base / md:text-lg */}
        <div className="p-6 md:p-10 font-mono text-green-400 text-base md:text-lg space-y-6">
          
          {/* Main User Prompt path converted to Console Gray */}
          <p className="mb-4 text-zinc-500 font-bold">
            career-pilot@portfolio:~$
          </p>

          <div className="space-y-4">
            {/* Command Box: ls */}
            <div>
              <p className="text-zinc-400 font-medium"><span className="text-zinc-600 font-bold select-none">$</span> ls</p>
              <p className="ml-4 text-green-300">resume.pdf</p>
            </div>

            
            <div>
              <p className="text-zinc-400 font-medium"><span className="text-zinc-600 font-bold select-none">$</span> My resume.pdf</p>
              
              <div className="ml-4 mt-2 space-y-1 text-green-300">
                <p>Resume loaded successfully.</p>
                <p>Skills...............<span className="text-green-400 font-semibold">[ SUCCESS ]</span></p>
                <p>Projects.............<span className="text-green-400 font-semibold">[ SUCCESS ]</span></p>
                <p>Experience...........<span className="text-green-400 font-semibold">[ SUCCESS ]</span></p>
                <p>Education............<span className="text-green-400 font-semibold">[ SUCCESS ]</span></p>
              </div>
            </div>

            {/* Command Box: download --resume */}
            <div>
              <p className="text-zinc-400 font-medium"><span className="text-zinc-600 font-bold select-none">$</span> download --resume</p>
            </div>
          </div>

          {/* Premium Clean-Glow Call To Action Buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row text-sm md:text-base">
            <a
              href="/resume.pdf"
              download
              className="group flex items-center justify-center gap-3 rounded-lg border border-green-500 bg-green-500/10 px-6 py-3 text-green-300 transition-all duration-300 hover:bg-green-500 hover:text-black"
            >
              <Download
                size={20}
                className="transition-transform duration-300 group-hover:-translate-y-1"
              />
              <span>Download Resume</span>
            </a>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 rounded-lg border border-green-500/40 bg-transparent text-green-400 transition-all duration-300 hover:bg-green-500/10"
            >
              <Eye
                size={20}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <span>Preview Resume</span>
            </a>
          </div>

          {/* Accurate, Smaller, Crisp Snap-Blinking CLI Caret Cursor */}
          <div className="mt-8 flex items-center select-none">
            <span className="w-2.5 h-4.5 bg-green-400 animate-terminal-cursor inline-block"></span>
          </div>

        </div>
      </div>
    </section>
  );
}