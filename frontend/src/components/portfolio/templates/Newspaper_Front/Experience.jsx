import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';

export default function Experience({ data }) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-2xl md:text-3xl font-black text-yellow-600 mb-4 tracking-wider border-l-4 border-yellow-600 pl-4" style={{ fontFamily: 'Georgia, serif' }}>
        CAREER TIMELINE
      </h3>
      <div className="space-y-4">
        {data.experience.map((job, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-stone-800 border-l-4 border-yellow-600 p-4 md:p-6 hover:shadow-lg transition"
          >
            <div className="flex items-start gap-4">
              <Briefcase className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
              <div className="flex-1">
                <h4 className="font-black text-yellow-500 text-base md:text-lg">{job.role}</h4>
                <p className="text-yellow-600 font-bold text-sm">{job.company}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 my-2">
                  <Calendar size={14} />
                  {job.period}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{job.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
