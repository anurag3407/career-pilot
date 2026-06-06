import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

const GlowingCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut", delay }}
    whileHover={{ y: -6, transition: { duration: 0.2 } }}
    className={`relative group rounded-2xl border border-indigo-500/10 hover:border-cyan-400/40 bg-[#0a0d24]/60 backdrop-blur-md hover:shadow-[0_0_35px_rgba(34,211,238,0.12)] transition-all duration-300 ${className}`}
  >
    <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-cyan-500/5 group-hover:to-purple-500/5 blur-xl transition-all duration-500" />
    {children}
  </motion.div>
);

export default function Testimonials({ data }) {
  return (
    <section className="relative px-6 py-24 bg-[#030514]/40 border-y border-indigo-950/20 text-left">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-14">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-cyan-400">
            <MessageSquare size={20} />
          </div>
          <div>
            <span className="text-cyan-400 text-xs font-bold tracking-wider uppercase">Endorsements</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Recommendations</h2>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data.testimonials || []).map((t, idx) => (
            <GlowingCard key={t.name} className="p-6 flex flex-col justify-between h-full" delay={idx * 0.08}>
              <div>
                <span className="text-cyan-500/30 text-5xl font-serif leading-none select-none">“</span>
                <p className="text-gray-300 text-sm leading-relaxed italic mb-6">
                  {t.text}
                </p>
              </div>
              
              <div className="flex items-center gap-3.5 pt-4 border-t border-indigo-500/10">
                {t.avatar && (
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border border-cyan-500/25"
                  />
                )}
                <div>
                  <h4 className="text-white font-bold text-sm">{t.name}</h4>
                  <p className="text-gray-400 text-2xs mt-0.5 font-semibold uppercase tracking-wider">
                    {t.role}
                  </p>
                </div>
              </div>
            </GlowingCard>
          ))}
        </div>
      </div>
    </section>
  );
}
