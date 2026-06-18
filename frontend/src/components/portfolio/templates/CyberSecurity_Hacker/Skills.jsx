import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Cpu, Code2 } from 'lucide-react';

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;

  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative w-full py-20 bg-[#000401] font-mono overflow-hidden border-y border-[#00ff41]/20">
      <style>{`
        .skill-hex {
          clip-path: polygon(10% 0, 100% 0, 90% 100%, 0% 100%);
        }
        @keyframes scan {
          0% { background-position: 0 -100vh; }
          100% { background-position: 0 100vh; }
        }
        .matrix-bg {
          background: linear-gradient(180deg, rgba(0, 255, 65, 0) 0%, rgba(0, 255, 65, 0.05) 50%, rgba(0, 255, 65, 0) 100%);
          background-size: 100% 200%;
          animation: scan 8s linear infinite;
        }
      `}</style>

      <div className="absolute inset-0 matrix-bg pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="mb-12 border border-[#00ff41]/30 bg-[#00ff41]/5 p-4">
          <div className="flex items-center gap-3 border-b border-[#00ff41]/20 pb-3 mb-4">
            <Terminal size={16} className="text-[#00ff41]" />
            <span className="text-[#00ff41] text-sm tracking-widest uppercase">root@system:~# ./enumerate_skills.sh</span>
            <span className="ml-auto text-[10px] text-[#00ff41]/50">STATUS: {booting ? 'SCANNING...' : 'COMPLETED'}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {skills.map((skill, i) => (
              <div 
                key={i} 
                className="skill-hex relative group bg-black border border-[#00ff41]/30 hover:border-[#00ff41] hover:bg-[#00ff41]/10 px-4 py-3 transition-all duration-300 flex items-center justify-center cursor-crosshair overflow-hidden"
                style={{ 
                  animationDelay: `${i * 50}ms`,
                  opacity: booting ? 0 : 1,
                  transform: booting ? 'translateY(10px)' : 'translateY(0)',
                  transition: 'opacity 0.3s ease-out, transform 0.3s ease-out, background 0.2s, border 0.2s'
                }}
              >
                {/* Glitch overlay on hover */}
                <div className="absolute inset-0 bg-[#00ff41] mix-blend-overlay opacity-0 group-hover:opacity-20 pointer-events-none" />
                
                <span className="text-[#00ff41]/80 group-hover:text-white text-xs text-center font-bold tracking-wider relative z-10">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>

          {/* Footer prompt */}
          <div className="mt-6 text-[#00ff41]/60 text-xs flex items-center gap-2">
            <span>{'>'}</span>
            {booting ? (
              <span className="animate-pulse">Analyzing system capabilities...</span>
            ) : (
              <span>Found {skills.length} operational modules. Awaiting next command_<span className="animate-pulse">█</span></span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}