import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';

const Experience = ({ data }) => {
  const { experience } = data;

  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <div className="inline-block px-6 py-2 bg-purple-500/20 rounded-full mb-4">
          <span className="text-purple-300 font-semibold">♦️ EXPERIENCE DECK ♦️</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">My Journey Cards</h2>
      </div>

      <div className="relative">
        <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-purple-500 rounded-full"></div>
        {experience.map((exp, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
            className={`relative flex flex-col md:flex-row gap-6 mb-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full border-4 border-purple-300 z-10"></div>
            <div className={`w-full md:w-[calc(50%-3rem)] ml-12 md:ml-0 ${idx % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div><h3 className="text-xl font-bold text-gray-900">{exp.role}</h3><p className="text-purple-600 font-medium">{exp.company}</p></div>
                  <Briefcase className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-3"><Calendar className="w-4 h-4" /><span>{exp.period}</span></div>
                <p className="text-gray-600">{exp.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Experience;