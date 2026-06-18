import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, MapPin } from 'lucide-react';

const Hero = ({ data }) => {
  const { personal, socials, stats } = data;

  return (
    <div className="mb-20">
      <motion.div
        initial={{ rotateY: -90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 relative overflow-hidden"
      >
        {/* Card Suit Decorations */}
        <div className="absolute top-4 left-4 text-3xl opacity-10 text-purple-600">♠️</div>
        <div className="absolute top-4 right-4 text-3xl opacity-10 text-purple-600">♥️</div>
        <div className="absolute bottom-4 left-4 text-3xl opacity-10 text-purple-600">♣️</div>
        <div className="absolute bottom-4 right-4 text-3xl opacity-10 text-purple-600">♦️</div>

        <div className="text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-purple-600 shadow-xl"
          >
            <img src={personal.avatar || "https://via.placeholder.com/128"} alt={personal.name} className="w-full h-full object-cover" />
          </motion.div>

          <div className="inline-block px-6 py-2 bg-purple-100 rounded-full mb-4">
            <span className="text-purple-700 font-semibold">🃟 ACE OF DESIGN 🃟</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4">{personal.name}</h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4 font-medium">{personal.title}</p>
          <div className="flex items-center justify-center gap-2 text-gray-500 mb-6">
            <MapPin className="w-4 h-4" /><span>{personal.location}</span>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">{personal.bio}</p>

          <div className="flex flex-wrap justify-center gap-4">
            {socials.github && <motion.a whileHover={{ scale: 1.1 }} href={socials.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700"><Github className="w-5 h-5" />GitHub</motion.a>}
            {socials.linkedin && <motion.a whileHover={{ scale: 1.1 }} href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-xl hover:bg-blue-600"><Linkedin className="w-5 h-5" />LinkedIn</motion.a>}
            {socials.twitter && <motion.a whileHover={{ scale: 1.1 }} href={socials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-400"><Twitter className="w-5 h-5" />Twitter</motion.a>}
            {socials.email && <motion.a whileHover={{ scale: 1.1 }} href={`mailto:${socials.email}`} className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-500"><Mail className="w-5 h-5" />Email</motion.a>}
          </div>
        </div>
      </motion.div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
            <div className="text-4xl font-bold text-white mb-2">{stats.yearsExperience}+</div>
            <div className="text-white/70">Years Experience</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
            <div className="text-4xl font-bold text-white mb-2">{stats.projectsCompleted}+</div>
            <div className="text-white/70">Projects Completed</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
            <div className="text-4xl font-bold text-white mb-2">{stats.happyClients}+</div>
            <div className="text-white/70">Happy Clients</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;