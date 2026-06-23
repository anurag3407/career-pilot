import React from 'react';
import { motion } from 'framer-motion';

export default function Contact({ data }) {
  const email = data?.contact?.email || "hello@example.com";

  return (
    <section className="py-32 bg-[#1e293b] overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-widest uppercase mb-32" style={{ textShadow: '4px 4px 0px #0f172a' }}>
          Contact Me
        </h2>
        
        <motion.a
          href={`mailto:${email}`}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative block w-[160px] h-[160px] md:w-[200px] md:h-[200px] group cursor-pointer"
          style={{ transformStyle: "preserve-3d", transform: "rotateX(55deg) rotateZ(-45deg)" }}
        >
          {/* Top face */}
          <div className="absolute inset-0 bg-cyan-400 border-[4px] border-black z-30 transition-transform duration-200 group-hover:-translate-x-2 group-hover:-translate-y-2">
            <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
                   style={{ transform: 'rotateZ(45deg) rotateX(-55deg) translateZ(80px)' }}>
                 <div className="bg-black text-cyan-400 font-black text-xl md:text-2xl px-6 py-4 border-[3px] border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)] whitespace-nowrap group-hover:scale-110 transition-transform">
                   SEND MESSAGE
                 </div>
              </div>
            </div>
          </div>
          {/* Right face */}
          <div className="absolute top-0 right-[-30px] w-[30px] md:right-[-40px] md:w-[40px] h-full bg-cyan-600 border-[4px] border-black border-l-0 origin-left skew-y-[45deg] z-20" />
          {/* Bottom face */}
          <div className="absolute bottom-[-30px] left-0 w-full h-[30px] md:bottom-[-40px] md:h-[40px] bg-cyan-500 border-[4px] border-black border-t-0 origin-top skew-x-[45deg] z-20" />
        </motion.a>
      </div>
    </section>
  );
}
