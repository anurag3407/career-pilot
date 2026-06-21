import React from 'react';
import { motion } from 'framer-motion';
import { Crystal } from './Crystal';
import { AnimatedHeading } from './AnimatedHeading';

export default function Testimonials({ testimonials = [] }) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const safeTestimonials = Array.isArray(testimonials) ? testimonials : [];
  if (safeTestimonials.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-24 px-6">
      <Crystal className="-top-20 left-1/3" size="w-72 h-72" duration={12} delay={0} color="from-indigo-500/10 via-purple-500/5 to-slate-500/10" />

      <motion.div className="max-w-6xl mx-auto relative z-10" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
        <AnimatedHeading title="Testimonials" gradientClass="from-indigo-300 to-indigo-500" lineClass="bg-indigo-400" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safeTestimonials.map((test, index) => (
            <motion.div 
              key={test.id || test.name || index} 
              whileHover={{ y: -5 }}
              className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl relative backdrop-blur-md"
            >
              <span className="text-6xl text-indigo-500/20 absolute top-4 right-6 font-serif">"</span>
              <p className="text-slate-300 italic mb-8 relative z-10 leading-relaxed">"{test.text}"</p>
              <div className="flex items-center gap-4">
                <img 
                  src={test.avatar} 
                  alt={test.name || "Profile Avatar"}
                  onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(test.name || 'U'); e.currentTarget.onerror = null; }}
                  className="w-12 h-12 rounded-full object-cover border border-indigo-500/30" 
                />
                <div>
                  <h4 className="font-bold text-slate-200">{test.name}</h4>
                  <p className="text-sm text-slate-500">{test.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}