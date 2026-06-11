import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const FeaturedVideos = ({ data }) => {
  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Featured Videos</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.projects.slice(0, 6).map((project, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5 }}
            className="bg-[#212121] rounded-xl overflow-hidden cursor-pointer"
          >
            <div className="relative aspect-video">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                <PlayCircle size={64} className="text-white" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                10:24
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-white font-semibold line-clamp-2">{project.title}</h3>
              <p className="text-gray-400 text-sm mt-2">
                1.2M views • 2 weeks ago
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FeaturedVideos;
