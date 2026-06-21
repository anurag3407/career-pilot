import React from 'react';
import { motion } from 'framer-motion';

export default function Testimonials({ data }) {
  const testimonials = data?.testimonials || [
    { name: "Jane Doe", role: "CEO", text: "Amazing 3D work! Highly recommend." },
    { name: "John Smith", role: "CTO", text: "Delivered a perfectly isometric portfolio." },
    { name: "Alice Brown", role: "Designer", text: "The aesthetic is completely unmatched." }
  ];

  return (
    <section className="py-24 bg-[#cbd5e1] overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-black text-gray-800 tracking-widest uppercase mb-32 text-center" style={{ textShadow: '4px 4px 0px #94a3b8' }}>
          Testimonials
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-32 pt-10 pb-20 justify-items-center">
          {testimonials.map((test, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative w-[220px] h-[160px]"
              style={{ transformStyle: "preserve-3d", transform: "rotateX(55deg) rotateZ(-45deg)" }}
            >
              {/* Box Top */}
              <div className="absolute inset-0 bg-pink-400 border-[3px] border-black z-30 group cursor-pointer hover:-translate-x-2 hover:-translate-y-2 transition-transform">
                <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="absolute top-1/2 left-1/2 w-[280px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center p-4 text-center pointer-events-auto" 
                       style={{ transform: 'rotateZ(45deg) rotateX(-55deg) translateZ(80px)' }}>
                     <div className="bg-white p-5 border-[3px] border-black shadow-[6px_6px_0px_#000] relative group-hover:-translate-y-2 group-hover:shadow-[8px_8px_0px_#000] transition-all">
                       <p className="text-md font-bold text-gray-800 mb-4 italic">"{test.text}"</p>
                       <h4 className="text-sm font-black text-pink-600 bg-pink-100 inline-block px-2 py-1 border-[2px] border-black">- {test.name}, {test.role}</h4>
                       
                       {/* Speech bubble tail styling */}
                       <div className="absolute -bottom-[15px] left-[30px] w-0 h-0 border-l-[15px] border-l-transparent border-t-[15px] border-t-black border-r-[15px] border-r-transparent" />
                       <div className="absolute -bottom-[10px] left-[30px] w-0 h-0 border-l-[15px] border-l-transparent border-t-[15px] border-t-white border-r-[15px] border-r-transparent z-10" />
                     </div>
                  </div>
                </div>
              </div>
              {/* Right face */}
              <div className="absolute top-0 right-[-20px] w-[20px] h-full bg-pink-600 border-[3px] border-black border-l-0 origin-left skew-y-[45deg] z-20" />
              {/* Bottom face */}
              <div className="absolute bottom-[-20px] left-0 w-full h-[20px] bg-pink-500 border-[3px] border-black border-t-0 origin-top skew-x-[45deg] z-20" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
