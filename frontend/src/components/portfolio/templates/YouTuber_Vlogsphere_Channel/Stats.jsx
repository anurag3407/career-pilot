import React from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, Video, Clock } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Stats = ({ data }) => {
  const stats = [
    { icon: Users, value: data.stats?.subscribers || '1.2M', label: 'Subscribers' },
    { icon: Eye, value: data.stats?.totalViews || '500M', label: 'Total Views' },
    { icon: Video, value: data.stats?.videos || '500', label: 'Videos' },
    { icon: Clock, value: data.stats?.watchHours || '10K', label: 'Watch Hours' },
  ];

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Channel Stats</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#212121] rounded-xl p-6 text-center">
            <stat.icon size={32} className="mx-auto text-red-500 mb-3" />
            <p className="text-3xl md:text-4xl font-bold text-white">{stat.value}</p>
            <p className="text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Stats;
