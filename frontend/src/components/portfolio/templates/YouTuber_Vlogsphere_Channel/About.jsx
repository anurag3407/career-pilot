import React from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const About = ({ data }) => {
  const safeBio = typeof data.personal.bio === 'string' ? data.personal.bio : 'Welcome to my channel!';
  const safeYearsExperience = typeof data.stats.yearsExperience === 'number' ? data.stats.yearsExperience : 5;

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">About</h2>
      <div className="bg-[#212121] rounded-xl p-6 md:p-8">
        <p className="text-gray-300 leading-relaxed text-lg">{safeBio}</p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0f0f0f] p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Content Niche</p>
            <p className="text-white font-semibold">Tech & Lifestyle</p>
          </div>
          <div className="bg-[#0f0f0f] p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Experience</p>
            <p className="text-white font-semibold">{safeYearsExperience}+ Years</p>
          </div>
          <div className="bg-[#0f0f0f] p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Channel Status</p>
            <p className="text-white font-semibold">Active</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
