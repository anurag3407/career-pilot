
import React from 'react';

import { motion } from 'framer-motion';
import { 
  Briefcase,
} from 'lucide-react';


const Experience = ({data}) => {
  const { experience } = data;
  
  return (
    <section id="experience" className="py-20 md:py-28 bg-gradient-to-b from-amber-50 via-amber-100 to-amber-50 relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2392400e' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}
      />
      
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
            <Briefcase className="w-6 h-6 text-amber-600" />
            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-900 mb-4 font-serif tracking-tight">
            Career Journey
          </h2>
          <p className="text-lg text-amber-700 font-serif italic">Professional Path Through Time</p>
        </motion.div>
        
        {/* Mobile view - single column, no timeline, with hover effect */}
        <div className="md:hidden space-y-8">
          {experience?.map((exp, index) => (
            <motion.div
              key={`${exp.company}-${exp.period}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white border-3 border-amber-600 rounded-lg p-6 shadow-lg hover:shadow-2xl transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-5 h-5 text-amber-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-amber-600 font-bold text-sm bg-amber-100 px-3 py-1 rounded-full">{exp.period}</span>
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-1 font-serif group-hover:text-amber-700 transition-colors">{exp.role}</h3>
              <p className="text-amber-700 font-semibold mb-3 text-sm">{exp.company}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Desktop view - timeline with half-half layout, with hover effect */}
        <div className="hidden md:block relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 via-amber-600 to-amber-400 transform -translate-x-1/2 shadow-lg" />
          
          {experience?.map((exp, index) => (
            <motion.div
              key={`${exp.company}-${exp.period}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={`relative mb-16 ${
                index % 2 === 0 ? 'md:mr-auto md:pr-12 md:text-right' : 'md:ml-auto md:pl-12'
              }`}
              style={{ maxWidth: 'calc(50% - 2rem)' }}
            >
              {/* Timeline dot */}
              <div className={`absolute top-6 ${
                index % 2 === 0 ? 'right-8 md:right-1/2 md:translate-x-1/2' : 'left-8 md:left-1/2 md:-translate-x-1/2'
              } w-4 h-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full border-4 border-amber-100 shadow-lg z-10`}>
                <div className="absolute inset-1 bg-amber-200 rounded-full" />
              </div>
              
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white border-3 border-amber-600 rounded-xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all group cursor-pointer"
              >
                <div className={`flex items-center gap-2 mb-3 ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}>
                  <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-amber-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-amber-600 font-bold text-sm md:text-base bg-amber-100 px-3 py-1 rounded-full">{exp.period}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-amber-900 mb-2 font-serif group-hover:text-amber-700 transition-colors">{exp.role}</h3>
                <p className="text-amber-700 font-semibold mb-3 text-sm md:text-base">{exp.company}</p>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">{exp.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

 export default Experience;