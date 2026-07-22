import React from "react";
import { Terminal, ArrowRight, Download } from "lucide-react";

export default function Hero() {
  return (
    <section className="w-full min-h-screen bg-black text-green-400 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl">
        <div className="bg-zinc-950 border border-green-500/30 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.15)]">
          
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-b border-green-500/20">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />

            <div className="ml-4 flex items-center gap-2 text-xs text-green-300">
              <Terminal size={14} />
              <span>terminal-cli.sh</span>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-6 md:p-10 font-mono">
            <p className="text-green-500 mb-3">
              visitor@portfolio:~$
            </p>
            <div className="mb-4 text-green-500 text-sm">
              <p>Initializing portfolio...</p>
              <p>Loading profile data...</p>
              <p>System ready.</p>
            </div>
            <p className="mb-2">
              <span className="text-green-500">$</span> whoami
            </p>

            <h1 className="text-4xl md:text-6xl font-bold text-green-300 mb-4 break-words">
              John Developer
              <span className="animate-pulse">_</span>
            </h1>

            <p className="mb-2">
              <span className="text-green-500">$</span> cat role.txt
            </p>

            <h2 className="text-lg md:text-2xl text-green-400 mb-6 break-words">
              Full Stack Developer | Open Source Contributor
            </h2>

            <div className="mb-6 text-gray-300 text-sm md:text-base">
              <p>{">"} Status: Available for opportunities</p>
              <p>{">"} Location: Remote / Worldwide</p>
              <p>{">"} Experience: 3+ Years</p>
            </div>

            <p className="mb-2">
              <span className="text-green-500">$</span> cat about.txt
            </p>

            <p className="max-w-3xl text-gray-300 leading-relaxed mb-8">
              Building scalable web applications, contributing to
              open source projects, and creating modern digital
              experiences using React, Node.js, and cloud technologies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button type="button" className="flex items-center justify-center gap-2 px-6 py-3 border border-green-500 rounded-lg hover:bg-green-500 hover:text-black transition-all duration-300">
                $ ./view-projects
                <ArrowRight size={18} />
              </button>

              <button type="button" className="flex items-center justify-center gap-2 px-6 py-3 border border-green-500/40 rounded-lg hover:border-green-500 transition-all duration-300">
                $ ./download-resume
                <Download size={18} />
              </button>
            </div>

            <div className="mt-10 flex items-center">
              <span>visitor@portfolio:~$</span>
              <span className="ml-1 h-5 w-2 bg-green-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}