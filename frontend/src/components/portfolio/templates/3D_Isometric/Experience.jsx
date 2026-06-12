import React from 'react';
import { motion } from 'framer-motion';

export default function Experience({ data }) {
  const experience = data?.experience || [
    { role: "Senior Developer", company: "Tech Space", duration: "2022 - Present", description: "Leading the 3D web revolution." },
    { role: "Frontend Engineer", company: "WebCorp", duration: "2020 - 2022", description: "Built scalable UI components." },
    { role: "Junior Developer", company: "Startup Inc", duration: "2018 - 2020", description: "Learned the ropes of React." }
  ];

  return (
    <section className="py-24 bg-[#d4d4d8] overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-black text-gray-800 tracking-widest uppercase mb-32 text-center" style={{ textShadow: '4px 4px 0px #a1a1aa' }}>
          Experience
        </h2>
        
        <div className="flex flex-col items-center gap-24 md:gap-32 pt-10">
          {experience.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`relative w-[260px] h-[130px] sm:w-[320px] sm:h-[160px] md:w-[360px] md:h-[180px] ${index % 2 === 0 ? 'md:mr-auto md:ml-32' : 'md:ml-auto md:mr-32'}`}
              style={{ transformStyle: "preserve-3d", transform: "rotateX(55deg) rotateZ(-45deg)" }}
            >
              {/* Platform Base */}
              <div className="absolute inset-0 bg-[#facc15] border-[3px] border-black z-30 transition-transform duration-300 hover:-translate-x-2 hover:-translate-y-2 group cursor-pointer">
                {/* Un-rotated Content Wrapper */}
                <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="absolute top-1/2 left-1/2 w-[300px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center p-4 text-center pointer-events-auto" 
                       style={{ transform: 'rotateZ(45deg) rotateX(-55deg) translateZ(80px)' }}>
                     <div className="bg-white px-4 py-2 border-[3px] border-black shadow-[4px_4px_0px_#000] mb-2 group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_#000] transition-all">
                       <h3 className="text-xl font-black text-gray-900">{exp.role}</h3>
                     </div>
                     <h4 className="text-lg font-bold text-gray-800 bg-[#fef08a] px-3 border-[2px] border-black shadow-[2px_2px_0px_#000]">{exp.company}</h4>
                     <span className="text-xs font-black text-white mt-3 bg-black px-3 py-1 rounded-full border-[2px] border-black shadow-[2px_2px_0px_#facc15]">{exp.duration}</span>
                  </div>
                </div>
              </div>
              {/* Right face */}
              <div className="absolute top-0 right-[-30px] w-[30px] h-full bg-[#eab308] border-[3px] border-black border-l-0 origin-left skew-y-[45deg] z-20" />
              {/* Bottom face */}
              <div className="absolute bottom-[-30px] left-0 w-full h-[30px] bg-[#ca8a04] border-[3px] border-black border-t-0 origin-top skew-x-[45deg] z-20" />
              
              {/* Optional Connector line between items, visible only on desktop */}
              {index !== experience.length - 1 && (
                <div className="hidden md:block absolute -bottom-[120px] left-[50%] w-[4px] h-[120px] bg-gray-800 z-10" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
