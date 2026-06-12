import React from 'react';
import { Terminal } from 'lucide-react';

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <section id="skills" className="bg-[#0A192F] py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#CCD6F6] flex items-center">
            <span className="text-[#64FFDA] font-mono text-xl md:text-2xl mr-2">03.</span>
            Technical Arsenal
          </h2>
          <div className="flex-grow h-px bg-[#233554] max-w-[300px]"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="group relative bg-[#112240] p-6 rounded-xl border border-[#233554] hover:border-[#64FFDA] transition-all duration-300 hover:-translate-y-2 flex flex-col items-center justify-center text-center overflow-hidden"
            >
              {/* Hover effect glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#64FFDA]/0 to-[#64FFDA]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-[#0A192F] border border-[#233554] group-hover:border-[#64FFDA] transition-colors">
                <span className="text-[#64FFDA] font-mono font-bold text-xl">{skill.name.charAt(0).toUpperCase()}</span>
              </div>
              <h3 className="text-[#CCD6F6] font-semibold tracking-wide group-hover:text-[#64FFDA] transition-colors">
                {skill.name}
              </h3>
              {skill.level && (
                <div className="mt-4 w-full bg-[#0A192F] rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-[#64FFDA] h-1.5 rounded-full transition-all duration-1000 ease-out group-hover:bg-[#64FFDA]/80" 
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}