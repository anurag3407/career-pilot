import React from 'react';
import { motion } from 'framer-motion';

export default function Skills({ data }) {
  const skills = data?.skills || [];

  return (
    <section className="relative bg-slate-950/90 px-6 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 flex items-center justify-center gap-3"
        >
          <div className="h-1.5 w-20 rounded-full bg-amber-200/90" />

          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-200/70">
            Skills
          </span>

          <div className="h-1.5 w-20 rounded-full bg-amber-200/90" />
        </motion.div>

        {skills.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {skills.map((skill, index) => {
              const level =
                typeof skill?.level === 'number'
                  ? Math.max(0, Math.min(100, skill.level))
                  : null;

              return (
                <div
                  key={`${skill?.name || 'skill'}-${index}`}
                  className="rounded-[2rem] border border-amber-200/20 bg-slate-900/70 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.3)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-200/70">
                      {skill?.category || 'Skill'}
                    </span>

                    {level !== null && (
                      <span className="text-xs uppercase tracking-[0.3em] text-amber-100/70">
                        {level}%
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-2xl font-serif font-black text-amber-100">
                    {skill?.name || 'Unnamed Skill'}
                  </h3>

                  {level !== null && (
                    <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/5">
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
        ) : (
          <div className="rounded-[2rem] border border-amber-200/20 bg-slate-900/70 p-8 text-center shadow-[0_30px_80px_rgba(15,23,42,0.3)]">
            <p className="text-amber-100/80">
              No skills available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}