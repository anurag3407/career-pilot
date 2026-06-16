import React from "react";
import { Terminal } from "lucide-react";

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#070b14] py-20 px-6 md:px-12 border-t border-purple-500/20">
      
      {/* Abstract Cyber Elements */}
      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-30"></div>
      
      <div className="relative z-10 mx-auto max-w-5xl">
        
        <div className="mb-16 text-center md:text-left">
          <div className="inline-flex items-center gap-2 mb-3">
            <Terminal className="text-purple-400" size={20} />
            <p className="tracking-[0.3em] text-purple-400 uppercase text-sm font-mono">
              // Execution_Logs
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight">
            Work <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">History</span>
          </h2>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-purple-500/20 before:via-cyan-500/20 before:to-purple-500/20">
          
          {experience.map((exp, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              
              {/* Timeline dot */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-purple-500 bg-black shadow-[0_0_15px_rgba(168,85,247,0.4)] text-purple-400 group-hover:text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(0,255,255,0.6)] transition-all duration-300 absolute left-0 md:left-1/2 -translate-x-1/2 z-10">
                <div className="w-3 h-3 bg-current rounded-full"></div>
              </div>

              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg transition-all duration-300 hover:border-purple-500/50 hover:bg-white/10 ml-auto md:ml-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                  <h3 className="font-bold text-xl text-white group-hover:text-cyan-300 transition-colors">
                    {exp.title}
                  </h3>
                  <span className="px-3 py-1 text-xs font-mono text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-full w-fit">
                    {exp.startDate} — {exp.endDate}
                  </span>
                </div>
                
                <h4 className="text-pink-400 font-semibold mb-4 text-sm tracking-wide uppercase">
                  @ {exp.company}
                </h4>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  {exp.description}
                </p>
                
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {exp.technologies.map((tech, i) => (
                      <span key={i} className="text-xs text-cyan-400 font-mono before:content-['>'] before:mr-1">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
        </div>
      </div>
    </section>
  );
}