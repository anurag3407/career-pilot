import React from 'react';
import { motion } from 'framer-motion';
import { User, Award, Heart } from 'lucide-react';

const About = ({ data }) => {
  const { personal, stats } = data;

  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <div className="inline-block px-6 py-2 bg-purple-500/20 rounded-full mb-4">
          <span className="text-purple-300 font-semibold">♠️ ABOUT ME ♠️</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">The Story Behind the Cards</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ rotateY: -90 }} whileInView={{ rotateY: 0 }} transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl p-8 relative">
          <div className="absolute top-4 left-4 text-4xl opacity-10 text-purple-600">♠️</div>
          <div className="flex items-center gap-3 mb-6"><User className="w-8 h-8 text-purple-600" /><h3 className="text-2xl font-bold text-gray-900">Who Am I?</h3></div>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">{personal.bio}</p>
          <div className="flex items-center gap-2 text-purple-600"><Heart className="w-5 h-5 fill-red-500 text-red-500" /><span>Passionate about creating amazing digital experiences</span></div>
        </motion.div>

        <motion.div initial={{ rotateY: 90 }} whileInView={{ rotateY: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl p-8 relative">
          <div className="absolute top-4 left-4 text-4xl opacity-10 text-purple-600">♥️</div>
          <div className="flex items-center gap-3 mb-6"><Award className="w-8 h-8 text-purple-600" /><h3 className="text-2xl font-bold text-gray-900">Deck Stats</h3></div>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-200 pb-2"><span className="text-gray-500">Location</span><span className="text-gray-900 font-semibold">{personal.location}</span></div>
            {stats && (<><div className="flex justify-between border-b border-gray-200 pb-2"><span className="text-gray-500">Experience</span><span className="text-gray-900 font-semibold">{stats.yearsExperience}+ years</span></div>
            <div className="flex justify-between border-b border-gray-200 pb-2"><span className="text-gray-500">Projects</span><span className="text-gray-900 font-semibold">{stats.projectsCompleted}+</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Clients</span><span className="text-gray-900 font-semibold">{stats.happyClients}+</span></div></>)}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;