import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const FeaturedVideos = ({ data }) => {
  const safeImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=450&fit=crop';
    const normalized = String(url);
    if (!/^https?:\/\//i.test(normalized)) {
      return 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=450&fit=crop';
    }
    return normalized;
  };

  const safeTitle = (title) => {
    return typeof title === 'string' ? title : 'Video Title';
  };

  const safeProjects = Array.isArray(data.projects) && data.projects.length > 0 ? data.projects : [];

  const formatDuration = (minutes) => {
    const mins = Math.floor(minutes || 10);
    const secs = Math.floor(Math.random() * 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const formatViews = (idx) => {
    const views = [1.2, 2.5, 800, 500, 3.1, 1.8];
    const units = ['M', 'M', 'K', 'K', 'M', 'M'];
    return `${views[idx % views.length]}${units[idx % units.length]} views`;
  };

  const formatDate = (idx) => {
    const dates = ['2 weeks ago', '1 month ago', '3 days ago', '5 days ago', '1 week ago', '4 days ago'];
    return dates[idx % dates.length];
  };

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp} className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Featured Videos</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeProjects.slice(0, 6).map((project, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5 }}
            className="bg-[#212121] rounded-xl overflow-hidden cursor-pointer"
          >
            <div className="relative aspect-video">
              <img
                src={safeImageUrl(project.image)}
                alt={safeTitle(project.title)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                <PlayCircle size={64} className="text-white" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {typeof project.duration === 'number' ? formatDuration(project.duration) : formatDuration()}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-white font-semibold line-clamp-2">{safeTitle(project.title)}</h3>
              <p className="text-gray-400 text-sm mt-2">
                {project.views ? `${project.views} views` : formatViews(idx)} • {project.publishedAt || formatDate(idx)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FeaturedVideos;
