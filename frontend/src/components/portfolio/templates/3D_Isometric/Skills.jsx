import React from 'react';
import { motion } from 'framer-motion';

export default function Skills({ data }) {
  const skills = data?.skills || [
    { name: "React" }, { name: "JavaScript" }, { name: "CSS3" },
    { name: "HTML5" }, { name: "Node.js" }, { name: "Three.js" }
  ];

  return (
    <section className="py-24 bg-[#f4f4f5] overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 tracking-widest uppercase" style={{ textShadow: '4px 4px 0px #d4d4d8' }}>
            Skills Cube
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-12 gap-y-24 justify-items-center pt-10 pb-16">
          {skills.map((skill, index) => {
            const skillName = typeof skill === 'string' ? skill : skill.name;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative w-24 h-24 group cursor-pointer"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateX(55deg) rotateZ(-45deg)",
                }}
              >
                {/* Top face */}
                <div className="absolute inset-0 bg-[#3b82f6] border-[3px] border-black flex items-center justify-center transition-all duration-300 group-hover:bg-[#60a5fa] group-hover:-translate-x-1 group-hover:-translate-y-1 z-30 shadow-[10px_10px_0px_rgba(0,0,0,0.1)]">
                  {/* Text floating un-rotated */}
                  <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto" 
                         style={{ transform: "rotateZ(45deg) rotateX(-55deg) translateZ(50px)" }}>
                      <span className="font-black text-black text-sm bg-white px-2 py-1 border-[2px] border-black shadow-[3px_3px_0px_#000] whitespace-nowrap group-hover:scale-110 transition-transform">
                        {skillName}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Right face */}
                <div className="absolute top-0 right-[-24px] w-[24px] h-full bg-[#1d4ed8] border-[3px] border-black border-l-0 origin-left skew-y-[45deg] z-20 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                {/* Bottom face */}
                <div className="absolute bottom-[-24px] left-0 w-full h-[24px] bg-[#2563eb] border-[3px] border-black border-t-0 origin-top skew-x-[45deg] z-20 transition-all duration-300 group-hover:-translate-x-1 group-hover:translate-y-1" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
