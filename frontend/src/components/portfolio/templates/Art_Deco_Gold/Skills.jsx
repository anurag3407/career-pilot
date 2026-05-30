import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Skills({ data }) {
  const skills = data.skills || [];

  return (
    <section className="relative px-6 py-20 md:py-24 bg-slate-950/90">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 flex items-center justify-center gap-3"
        >
          <div className="h-1.5 w-20 rounded-full bg-amber-200/90" />
          <span className="text-[10px] tracking-[0.35em] uppercase text-amber-200/70 font-semibold">
            Skills
          </span>
          <div className="h-1.5 w-20 rounded-full bg-amber-200/90" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {skills.map((skill, index) => {
            const rawLevel = Number(skill.level);
            const level = Number.isFinite(rawLevel) ? Math.min(100, Math.max(0, rawLevel)) : null;

            return (
              <div
                key={`${skill.name}-${index}`}
                className="rounded-[2rem] border border-amber-200/20 bg-slate-900/70 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.3)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm uppercase tracking-[0.3em] text-amber-200/70 font-semibold">
                    {skill.category || 'Skill'}
                  </span>
                  {level !== null && (
                    <span className="text-xs uppercase tracking-[0.3em] text-amber-100/70">
                      {level}%
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-2xl font-serif font-black text-amber-100">
                  {skill.name}
                </h3>
                {level !== null && (
                  <div className="mt-5 rounded-full bg-white/5 h-2.5 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-r from-amber-300 to-amber-100"
                      style={{ width: `${level}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
