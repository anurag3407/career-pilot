import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { LiquidHeading } from './Shared';

const Testimonials = ({ data }) => (
  <section id="testimonials" className="scroll-mt-32 relative z-10 mt-24 md:mt-32">
    <LiquidHeading title="Testimonials" colorCode="bg-[#ff5e57]" />

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 pt-6 md:pt-10">
      {data.testimonials.map((test, idx) => (
        <motion.div 
          key={idx}
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 4 + (idx % 3), repeat: Infinity, ease: "easeInOut" }}
          whileHover="hover"
          className="relative w-full will-change-transform"
        >
          <motion.div 
            variants={{
              hover: { 
                borderRadius: "16px",
                scale: 1.02,
                transition: { duration: 0.2 }
              }
            }}
            initial={{ borderRadius: "50% 40% 60% 40% / 40% 50% 40% 60%" }}
            className="bg-[#fdf3e7] p-8 md:p-10 border-4 border-[#2b1318] shadow-[10px_10px_0px_0px_#2b1318] md:shadow-[12px_12px_0px_0px_#2b1318] h-full flex flex-col w-full overflow-hidden will-change-transform"
          >
            <Quote className="text-[#f28e2b] mb-6 shrink-0" size={40} fill="currentColor" />
            <p className="font-sans font-bold text-lg md:text-xl italic flex-grow mb-8 leading-relaxed break-words hyphens-auto">
              "{test.text}"
            </p>
            <div className="flex items-center gap-4 mt-auto">
              <img 
                src={test.avatar || `https://ui-avatars.com/api/?name=${test.name}&background=f28e2b&color=fff`} 
                alt={test.name || "Profile Avatar"} 
                className="w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-[#2b1318] shrink-0 object-cover"
              />
              <div className="min-w-0">
                <h4 className="font-black text-lg md:text-xl truncate">{test.name}</h4>
                <p className="font-sans font-bold text-[#e15f41] text-sm md:text-base truncate">{test.role}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Testimonials;