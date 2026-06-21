import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase } from 'lucide-react';
import { LiquidHeading } from './Shared';

const About = ({ data }) => (
  <section id="about" className="scroll-mt-32 relative z-10">
    <LiquidHeading title="About" colorCode="bg-[#f28e2b]" />
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <div className="flex justify-center">
        <motion.div 
          animate={{ 
            borderRadius: [
              "60% 40% 30% 70% / 60% 30% 70% 40%",
              "30% 70% 70% 30% / 30% 30% 70% 70%",
              "60% 40% 30% 70% / 60% 30% 70% 40%"
            ] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="w-64 h-64 sm:w-72 sm:h-72 md:w-96 md:h-96 border-8 border-[#f28e2b] p-2 bg-[#ff5e57] shadow-[12px_12px_0px_0px_#2b1318] md:shadow-[20px_20px_0px_0px_#2b1318] overflow-hidden will-change-transform"
        >
          <img 
            src={data.personal.avatar} 
            alt={data.personal.name || "Profile Avatar"} 
            className="w-full h-full object-cover mix-blend-luminosity opacity-80"
          />
        </motion.div>
      </div>

      <div className="bg-[#fdf3e7] p-6 sm:p-10 md:p-14 rounded-[2rem] md:rounded-[3rem] border-4 border-[#2b1318] shadow-[12px_12px_0px_0px_#2b1318] md:shadow-[16px_16px_0px_0px_#2b1318] relative">
        <div className="space-y-6 font-sans text-lg md:text-xl font-medium leading-relaxed text-[#2b1318]">
          <p>{data.personal.bio}</p>
          <div className="pt-6 border-t-4 border-[#2b1318] border-dashed flex flex-col sm:flex-row gap-6 font-bold">
            <div className="flex items-center gap-3">
              <MapPin className="text-[#ff5e57] shrink-0" size={28} /> 
              <span className="break-words">{data.personal.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="text-[#f28e2b] shrink-0" size={28} /> 
              <span className="break-words">{data.stats.yearsExperience} Years Exp.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;