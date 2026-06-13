import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Users, Video, MapPin } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Hero = ({ data }) => {
  const safeName = typeof data.personal.name === 'string' ? data.personal.name : 'Content Creator';
  const handle = safeName.toLowerCase().replace(/\s+/g, '');
  const subscriberCount = data.stats?.subscribers ?? '1.2M';
  const videoCount = data.stats?.videos ?? '500';

  const safeAvatarUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces';
    const normalized = String(url);
    if (!/^https?:\/\//i.test(normalized)) {
      return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces';
    }
    return normalized;
  };

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
              src={safeAvatarUrl(data.personal.avatar)}
              alt={safeName}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#0f0f0f] object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-bold text-white">{safeName}</h1>
            <p className="text-gray-400 mt-1">@{handle}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4 text-gray-400">
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span>{subscriberCount} subscribers</span>
              </div>
              <div className="flex items-center gap-2">
                <Video size={18} />
                <span>{videoCount} videos</span>
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
