import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Users, Video, MapPin } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Hero = ({ data }) => {
  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="bg-[#0f0f0f]">
      {/* Banner */}
      <div className="h-48 md:h-64 lg:h-72 bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Channel Info */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end gap-6 -mt-20 md:-mt-28 relative z-10">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <img
              src={data.personal.avatar}
              alt={data.personal.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#0f0f0f] object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-bold text-white">{data.personal.name}</h1>
            <p className="text-gray-400 mt-1">@{data.personal.name.toLowerCase().replace(/\s+/g, '')}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4 text-gray-400">
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span>1.2M subscribers</span>
              </div>
              <div className="flex items-center gap-2">
                <Video size={18} />
                <span>500 videos</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>{data.personal.location}</span>
              </div>
            </div>
          </div>

          {/* Subscribe Button */}
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition flex items-center gap-2">
            <PlayCircle size={20} />
            Subscribe
          </button>
        </div>

        {/* Tagline */}
        <div className="py-8 text-center md:text-left">
          <p className="text-white text-lg md:text-xl">{data.personal.tagline}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Hero;
