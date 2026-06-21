import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import SectionHeading from './SectionHeading';

const SEC = "relative z-10 py-24 px-4";

export default function Testimonials() {
  const { testimonials } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="testimonials" className={SEC}>
      <div className="max-w-4xl mx-auto">
        <SectionHeading>Testimonials</SectionHeading>
        <div ref={ref} className="grid md:grid-cols-2 gap-8">
          {(testimonials || []).map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              whileHover={{
                scale: 1.02,
                borderColor: "rgba(236,72,153,0.22)",
                boxShadow: "0 15px 30px -15px rgba(236,72,153,0.18)",
              }}
              className="p-6 rounded-3xl bg-slate-900/40 backdrop-blur-sm border border-white/5 relative flex flex-col justify-between group"
            >
              <MessageSquare className="absolute right-6 top-6 text-slate-800 group-hover:text-pink-500/15 transition-colors duration-300" size={32} />
              <p className="text-slate-300 text-sm italic leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <img
                  src={t.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${t.name}`}
                  alt={t.name || "Profile Avatar"}
                  className="w-10 h-10 rounded-xl object-cover border border-white/10"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">{t.name}</h4>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}