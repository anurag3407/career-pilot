import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const Testimonials = ({ testimonials = [] }) => (
  <section className="relative max-w-5xl mx-auto py-8 sm:py-10 md:py-20 px-5 md:px-6 overflow-hidden">
    <motion.h2
      initial={{ opacity: 0, y: 24, rotateX: 18 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.75 }}
      className="text-3xl md:text-4xl font-bold mb-5 md:mb-12 text-center"
      style={{ transformPerspective: 900 }}
    >
      Testimonials
    </motion.h2>

    <motion.p
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.6, delay: 0.07 }}
      className="text-center text-slate-400 max-w-2xl mx-auto mb-6 md:mb-10"
    >
      Feedback from collaborators and stakeholders across product delivery and technical execution.
    </motion.p>

    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.06 } } }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8"
    >
      {testimonials.map((t) => (
        <motion.div
          key={`${t.name}-${t.role}`}
          variants={{ hidden: { opacity: 0, y: 44, scale: 0.88, rotateX: 14 }, show: { opacity: 1, y: 0, scale: 1, rotateX: 0 } }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="bg-slate-900/60 p-4 md:p-8 rounded-2xl border border-slate-800 shadow-[0_12px_40px_rgba(0,0,0,0.16)]"
          style={{ transformPerspective: 900 }}
        >
          <Quote size={20} className="text-cyan-300 mb-4" />
          <p className="text-slate-300 italic mb-6">"{t.text}"</p>
          <div className="flex items-center gap-4">
            <img src={t.avatar} alt={t.name || "Profile Avatar"} className="w-12 h-12 rounded-full object-cover border border-cyan-500/40" />
            <div>
              <p className="font-bold text-sm">{t.name}</p>
              <p className="text-xs text-cyan-300">{t.role}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  </section>
);

export default Testimonials;
